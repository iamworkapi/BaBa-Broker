import mongoose from 'mongoose';

const investorSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, required: true },
    city: { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },
    occupation: { type: String, trim: true, default: '' },
    panNumber: { type: String, trim: true, default: '' },
    budgetRange: { type: String, trim: true, default: '' },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.models.Investor || mongoose.model('Investor', investorSchema);
