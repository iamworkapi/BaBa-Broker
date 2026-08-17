import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, lowercase: true, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'salesman', 'employee'], required: true },
    phone: { type: String, trim: true, default: '' },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
