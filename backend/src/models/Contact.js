import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    phone: { type: String, trim: true, required: true },
    email: { type: String, trim: true, default: '' },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.models.Contact || mongoose.model('Contact', contactSchema);
