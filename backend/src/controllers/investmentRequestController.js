import mongoose from 'mongoose';
import InvestmentRequest from '../models/InvestmentRequest.js';
import Investor from '../models/Investor.js';
import User from '../models/User.js';

const validRequest = (input) =>
  input?.investorId &&
  mongoose.isValidObjectId(input.investorId) &&
  input?.propertyTitle?.trim();

const FOLLOW_UP_STATUSES = ['unassigned', 'contacted', 'site_visit_scheduled', 'negotiating', 'converted', 'lost'];

export const getInvestmentRequests = async (req, res) => {
  const requests = await InvestmentRequest.find().sort({ createdAt: -1 }).lean();
  res.status(200).json(requests);
};

export const getMyInvestmentRequests = async (req, res) => {
  const requests = await InvestmentRequest.find({ assignedTo: req.user.id })
    .sort({ createdAt: -1 })
    .lean();
  res.status(200).json(requests);
};

export const createInvestmentRequest = async (req, res) => {
  const input = req.body;
  if (!validRequest(input)) {
    return res.status(400).json({ error: 'A registered investor and property plan are required.' });
  }

  const investor = await Investor.findById(input.investorId).lean();
  if (!investor) {
    return res.status(404).json({ error: 'Investor profile not found. Please register as an investor first.' });
  }

  const request = await InvestmentRequest.create({
    investor: investor._id,
    investorName: investor.name,
    investorPhone: investor.phone,
    investorEmail: investor.email || '',
    property: mongoose.isValidObjectId(input.propertyId) ? input.propertyId : null,
    propertyTitle: input.propertyTitle.trim(),
    propertyLocation: input.propertyLocation?.trim() || '',
    propertyType: input.propertyType?.trim() || 'residential',
    planCategory: ['residential', 'plots', 'commercial', 'rental'].includes(input.planCategory)
      ? input.planCategory
      : 'residential',
    requestedAmount: Number(input.requestedAmount) || 0,
    message: input.message?.trim() || '',
    statusHistory: [
      { status: 'pending', followUpStatus: 'unassigned', note: 'Request submitted by investor.', changedAt: new Date() },
    ],
  });

  res.status(201).json(request);
};

export const updateInvestmentRequestStatus = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ error: 'Investment request not found.' });
  }
  if (!['pending', 'approved', 'rejected'].includes(req.body?.status)) {
    return res.status(400).json({ error: 'Status must be pending, approved, or rejected.' });
  }

  const request = await InvestmentRequest.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
      $push: {
        statusHistory: {
          status: req.body.status,
          note: req.body.note?.trim() || '',
          changedBy: req.user.id,
          changedByName: req.user.email,
          changedAt: new Date(),
        },
      },
    },
    { new: true, runValidators: true }
  );
  if (!request) return res.status(404).json({ error: 'Investment request not found.' });
  res.status(200).json(request);
};

export const assignInvestmentRequest = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ error: 'Investment request not found.' });
  }

  const { staffId } = req.body || {};
  if (!staffId || !mongoose.isValidObjectId(staffId)) {
    return res.status(400).json({ error: 'A valid staff member is required.' });
  }

  const staff = await User.findOne({ _id: staffId, role: { $in: ['salesman', 'employee'] } }).lean();
  if (!staff) {
    return res.status(404).json({ error: 'Staff member not found.' });
  }

  const request = await InvestmentRequest.findByIdAndUpdate(
    id,
    {
      assignedTo: staff._id,
      assignedToName: staff.name,
      assignedAt: new Date(),
      followUpStatus: 'unassigned',
      $push: {
        statusHistory: {
          followUpStatus: 'unassigned',
          note: `Assigned to ${staff.name} (${staff.role}).`,
          changedBy: req.user.id,
          changedByName: req.user.email,
          changedAt: new Date(),
        },
      },
    },
    { new: true, runValidators: true }
  );
  if (!request) return res.status(404).json({ error: 'Investment request not found.' });
  res.status(200).json(request);
};

export const updateFollowUpStatus = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ error: 'Investment request not found.' });
  }
  if (!FOLLOW_UP_STATUSES.includes(req.body?.followUpStatus)) {
    return res.status(400).json({ error: 'A valid follow-up status is required.' });
  }

  const existing = await InvestmentRequest.findById(id);
  if (!existing) return res.status(404).json({ error: 'Investment request not found.' });

  const isOwner = existing.assignedTo && existing.assignedTo.equals(req.user.id);
  if (req.user.role !== 'admin' && !isOwner) {
    return res.status(403).json({ error: 'You can only update leads assigned to you.' });
  }

  const request = await InvestmentRequest.findByIdAndUpdate(
    id,
    {
      followUpStatus: req.body.followUpStatus,
      $push: {
        statusHistory: {
          followUpStatus: req.body.followUpStatus,
          note: req.body.note?.trim() || '',
          changedBy: req.user.id,
          changedByName: req.user.email,
          changedAt: new Date(),
        },
      },
    },
    { new: true, runValidators: true }
  );
  res.status(200).json(request);
};
