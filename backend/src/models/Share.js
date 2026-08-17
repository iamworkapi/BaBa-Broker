import mongoose from 'mongoose';

const shareSchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'FlatListing' },
    contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
    sharedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    phone: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.models.Share || mongoose.model('Share', shareSchema);
