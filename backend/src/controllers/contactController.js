import mongoose from 'mongoose';
import Contact from '../models/Contact.js';

const validContact = (contact) =>
  contact?.name?.trim() && contact?.phone?.replace(/\D/g, '').length >= 10;

export const getContacts = async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
  res.status(200).json(contacts);
};

export const createContact = async (req, res) => {
  const input = req.body;
  if (!validContact(input)) {
    return res.status(400).json({ error: 'A name and valid WhatsApp number are required.' });
  }
  const contact = await Contact.create({
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || '',
    notes: input.notes?.trim() || '',
  });
  res.status(201).json(contact);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ error: 'Contact not found.' });
  }
  const contact = await Contact.findByIdAndDelete(id);
  if (!contact) return res.status(404).json({ error: 'Contact not found.' });
  res.status(200).json({ success: true });
};
