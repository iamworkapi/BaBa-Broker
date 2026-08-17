import mongoose from 'mongoose';
import Share from '../models/Share.js';

export const getShareCount = async (req, res) => {
  const count = await Share.countDocuments();
  res.status(200).json(count);
};

// Populated list for the Admin audit view: who (sharedBy) shared what (property/listing)
// with whom (phone/contact) and when.
export const getShares = async (req, res) => {
  const shares = await Share.find()
    .populate('sharedBy', 'name email role')
    .populate('contact', 'name phone')
    .populate('property', 'title location')
    .populate('listing', 'title location listingType configuration')
    .sort({ createdAt: -1 })
    .lean();
  res.status(200).json(shares);
};

export const createShare = async (req, res) => {
  const input = req.body;
  const hasProperty = mongoose.isValidObjectId(input.property);
  const hasListing = mongoose.isValidObjectId(input.listing);

  if (hasProperty === hasListing) {
    return res.status(400).json({ error: 'Exactly one of property or listing is required.' });
  }
  if (!input.phone?.replace(/\D/g, '')) {
    return res.status(400).json({ error: 'A WhatsApp number is required.' });
  }

  const share = await Share.create({
    property: hasProperty ? input.property : undefined,
    listing: hasListing ? input.listing : undefined,
    contact: mongoose.isValidObjectId(input.contact) ? input.contact : undefined,
    sharedBy: req.user?.id,
    phone: input.phone.replace(/\D/g, ''),
  });
  res.status(201).json(share);
};
