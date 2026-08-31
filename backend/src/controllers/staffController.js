import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import FlatListing from '../models/FlatListing.js';
import Share from '../models/Share.js';
import InvestmentRequest from '../models/InvestmentRequest.js';

const creatableRoles = ['salesman', 'employee'];

export const getStaff = async (req, res) => {
  const staff = await User.find({ role: { $in: creatableRoles } })
    .select('-passwordHash')
    .sort({ createdAt: -1 })
    .lean();
  res.status(200).json(staff);
};

export const createStaff = async (req, res) => {
  const { name, email, password, role, phone } = req.body || {};
  if (!name?.trim() || !email?.trim() || !password || !creatableRoles.includes(role)) {
    return res.status(400).json({ error: 'Name, email, password and a valid role (salesman or employee) are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    displayPassword: String(password),
    role,
    phone: phone?.trim() || '',
    createdBy: req.user.id,
  });

  const { passwordHash: _omit, ...safeUser } = user.toObject();
  res.status(201).json(safeUser);
};

export const updateStaff = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ error: 'Staff member not found.' });
  }

  const updates = {};
  if (req.body?.name !== undefined) updates.name = req.body.name.trim();
  if (req.body?.phone !== undefined) updates.phone = req.body.phone.trim();
  if (req.body?.email !== undefined) updates.email = req.body.email.trim().toLowerCase();
  if (req.body?.role !== undefined && creatableRoles.includes(req.body.role)) updates.role = req.body.role;
  if (req.body?.isActive !== undefined) updates.isActive = Boolean(req.body.isActive);

  if (req.body?.password && req.body.password.length >= 6) {
    updates.passwordHash = await bcrypt.hash(req.body.password, 10);
    updates.displayPassword = String(req.body.password);
  }

  const user = await User.findOneAndUpdate(
    { _id: id, role: { $in: creatableRoles } },
    updates,
    { new: true, runValidators: true }
  ).select('-passwordHash');

  if (!user) return res.status(404).json({ error: 'Staff member not found.' });
  res.status(200).json(user);
};

export const deleteStaff = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ error: 'Staff member not found.' });
  }

  const user = await User.findOneAndDelete({ _id: id, role: { $in: creatableRoles } });
  if (!user) return res.status(404).json({ error: 'Staff member not found.' });

  // Leads assigned to this staff member fall back to unassigned rather than pointing at a deleted account.
  await InvestmentRequest.updateMany(
    { assignedTo: id },
    {
      $set: { assignedTo: null, assignedToName: '', followUpStatus: 'unassigned' },
      $push: {
        statusHistory: {
          followUpStatus: 'unassigned',
          note: `Auto-unassigned: ${user.name} was removed from staff.`,
          changedAt: new Date(),
        },
      },
    }
  );

  res.status(200).json({ success: true });
};

export const resetStaffPassword = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ error: 'Staff member not found.' });
  }

  const { newPassword } = req.body || {};
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters.' });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  const user = await User.findOneAndUpdate(
    { _id: id, role: { $in: creatableRoles } },
    { passwordHash, displayPassword: String(newPassword) },
    { new: true }
  ).select('-passwordHash');

  if (!user) return res.status(404).json({ error: 'Staff member not found.' });
  res.status(200).json({ success: true, user });
};

export const getStaffStats = async (req, res) => {
  const staff = await User.find({ role: { $in: creatableRoles } })
    .select('-passwordHash')
    .sort({ createdAt: -1 })
    .lean();
  const staffIds = staff.map((s) => s._id);

  const [listingCounts, shareCounts, requestCounts, convertedCounts] = await Promise.all([
    FlatListing.aggregate([
      { $match: { submittedBy: { $in: staffIds } } },
      { $group: { _id: '$submittedBy', count: { $sum: 1 } } },
    ]),
    Share.aggregate([
      { $match: { sharedBy: { $in: staffIds } } },
      { $group: { _id: '$sharedBy', count: { $sum: 1 } } },
    ]),
    InvestmentRequest.aggregate([
      { $match: { assignedTo: { $in: staffIds } } },
      { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
    ]),
    InvestmentRequest.aggregate([
      { $match: { assignedTo: { $in: staffIds }, followUpStatus: 'converted' } },
      { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
    ]),
  ]);

  const toMap = (rows) => new Map(rows.map((r) => [String(r._id), r.count]));
  const listingMap = toMap(listingCounts);
  const shareMap = toMap(shareCounts);
  const requestMap = toMap(requestCounts);
  const convertedMap = toMap(convertedCounts);

  const stats = staff.map((s) => ({
    ...s,
    flatListingsCount: listingMap.get(String(s._id)) || 0,
    sharesCount: shareMap.get(String(s._id)) || 0,
    assignedRequestsCount: requestMap.get(String(s._id)) || 0,
    convertedRequestsCount: convertedMap.get(String(s._id)) || 0,
  }));

  res.status(200).json(stats);
};
