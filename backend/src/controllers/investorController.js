import mongoose from 'mongoose';
import Investor from '../models/Investor.js';

const validInvestor = (input) =>
  input?.name?.trim() && input?.phone?.replace(/\D/g, '').length >= 10;

export const getInvestors = async (req, res) => {
  const investors = await Investor.find().sort({ createdAt: -1 }).lean();
  res.status(200).json(investors);
};

export const createInvestor = async (req, res) => {
  const input = req.body;
  if (!validInvestor(input)) {
    return res.status(400).json({ error: 'A name and valid phone number are required.' });
  }
  const investor = await Investor.create({
    name: input.name.trim(),
    email: input.email?.trim() || '',
    phone: input.phone.trim(),
    city: input.city?.trim() || '',
    address: input.address?.trim() || '',
    occupation: input.occupation?.trim() || '',
    panNumber: input.panNumber?.trim() || '',
    budgetRange: input.budgetRange?.trim() || '',
    notes: input.notes?.trim() || '',
  });
  res.status(201).json(investor);
};

export const deleteInvestor = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ error: 'Investor not found.' });
  }
  const investor = await Investor.findByIdAndDelete(id);
  if (!investor) return res.status(404).json({ error: 'Investor not found.' });
  res.status(200).json({ success: true });
};
