import mongoose from 'mongoose';
import FlatListing from '../models/FlatListing.js';

const validListing = (input) =>
  input &&
  ['rent', 'buy'].includes(input.listingType) &&
  input.location?.trim() &&
  input.configuration?.trim() &&
  input.description?.trim() &&
  (input.listingType === 'rent' ? Number(input.monthlyRent) > 0 : Number(input.salePrice) > 0);

const listingData = (input) => ({
  listingType: input.listingType,
  title: input.title?.trim() || '',
  location: input.location.trim(),
  configuration: input.configuration.trim(),
  sizeSqft: input.sizeSqft?.trim() || '',
  floor: input.floor?.trim() || '',
  totalFloors: input.totalFloors?.trim() || '',
  lift: input.lift === 'NO' ? 'NO' : 'YES',
  parking: input.parking?.trim() || '',
  possessionStatus: input.possessionStatus?.trim() || 'Ready to Move',
  constructionYear: input.constructionYear?.trim() || '',
  facing: input.facing?.trim() || '',
  reraId: input.reraId?.trim() || 'RERA Not Applicable',
  amenities: input.amenities?.trim() || '',
  description: input.description.trim(),
  coverImage: input.coverImage || '',
  images: Array.isArray(input.images) ? input.images : [],
  videoUrl: input.videoUrl?.trim() || '',
  monthlyRent: Number(input.monthlyRent) || 0,
  securityDeposit: Number(input.securityDeposit) || 0,
  maintenanceCharge: Number(input.maintenanceCharge) || 0,
  availableFrom: input.availableFrom?.trim() || '',
  salePrice: Number(input.salePrice) || 0,
  pricePerSqft: Number(input.pricePerSqft) || 0,
  priceNegotiable: Boolean(input.priceNegotiable),

  ownerName: input.ownerName?.trim() || '',
  ownerContact: input.ownerContact?.trim() || '',
  propertyCategory: ['RK', 'HK', 'Office', 'Shop', 'Plot'].includes(input.propertyCategory) ? input.propertyCategory : 'HK',
  furnishingStatus: ['Furnished', 'Unfurnished', 'Semi-Furnished'].includes(input.furnishingStatus) ? input.furnishingStatus : 'Unfurnished',
  completeAddress: input.completeAddress?.trim() || '',
  latitude: input.latitude?.trim() || '',
  longitude: input.longitude?.trim() || '',
  commission: input.commission?.trim() || '',
  specialInstructions: input.specialInstructions?.trim() || '',
  netProfit: Number(input.netProfit) || 0,

  dealStatus: ['available', 'rented', 'sold'].includes(input.dealStatus) ? input.dealStatus : 'available',
});

// Salesman -> only their own listings (any status, so they can manage them).
// Employee -> active listings only (what's actually shareable with customers).
// Admin -> everything, for a full audit trail.
export const getFlatListings = async (req, res) => {
  const filter =
    req.user.role === 'salesman'
      ? { submittedBy: req.user.id }
      : req.user.role === 'employee'
      ? { isActive: true }
      : {};
  const listings = await FlatListing.find(filter)
    .populate('submittedBy', 'name email phone')
    .sort({ createdAt: -1 })
    .lean();
  res.status(200).json(listings);
};

export const createFlatListing = async (req, res) => {
  const input = req.body;
  if (!validListing(input)) {
    return res.status(400).json({ error: 'Listing type, location, configuration, description and pricing are required.' });
  }
  const listing = await FlatListing.create({ ...listingData(input), submittedBy: req.user.id });
  res.status(201).json(listing);
};

export const updateFlatListing = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ error: 'Listing not found.' });
  }

  const existing = await FlatListing.findById(id);
  if (!existing) return res.status(404).json({ error: 'Listing not found.' });
  if (!existing.submittedBy.equals(req.user.id)) {
    return res.status(403).json({ error: 'You can only edit your own listings.' });
  }

  const input = req.body;
  if (!validListing(input)) {
    return res.status(400).json({ error: 'Listing type, location, configuration, description and pricing are required.' });
  }

  const listing = await FlatListing.findByIdAndUpdate(id, listingData(input), { new: true, runValidators: true });
  res.status(200).json(listing);
};

export const deactivateFlatListing = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ error: 'Listing not found.' });
  }

  const existing = await FlatListing.findById(id);
  if (!existing) return res.status(404).json({ error: 'Listing not found.' });
  if (!existing.submittedBy.equals(req.user.id)) {
    return res.status(403).json({ error: 'You can only update your own listings.' });
  }

  const updates = {};
  if (req.body?.isActive !== undefined) updates.isActive = Boolean(req.body.isActive);
  if (req.body?.dealStatus !== undefined && ['available', 'rented', 'sold'].includes(req.body.dealStatus)) {
    updates.dealStatus = req.body.dealStatus;
  }

  const listing = await FlatListing.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  res.status(200).json(listing);
};

export const deleteFlatListing = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ error: 'Listing not found.' });
  }

  const existing = await FlatListing.findById(id);
  if (!existing) return res.status(404).json({ error: 'Listing not found.' });
  if (req.user.role === 'salesman' && !existing.submittedBy.equals(req.user.id)) {
    return res.status(403).json({ error: 'You can only delete your own listings.' });
  }

  await FlatListing.findByIdAndDelete(id);
  res.status(200).json({ message: 'Listing deleted successfully.' });
};
