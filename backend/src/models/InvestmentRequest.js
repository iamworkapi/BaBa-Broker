import mongoose from 'mongoose';

const historyEntrySchema = new mongoose.Schema(
  {
    status: { type: String, default: '' },
    followUpStatus: { type: String, default: '' },
    note: { type: String, trim: true, default: '' },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    changedByName: { type: String, trim: true, default: '' },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false, versionKey: false }
);

const investmentRequestSchema = new mongoose.Schema(
  {
    investor: { type: mongoose.Schema.Types.ObjectId, ref: 'Investor', required: true },
    investorName: { type: String, trim: true, required: true },
    investorPhone: { type: String, trim: true, required: true },
    investorEmail: { type: String, trim: true, default: '' },

    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', default: null },
    propertyTitle: { type: String, trim: true, required: true },
    propertyLocation: { type: String, trim: true, default: '' },
    propertyType: { type: String, trim: true, default: 'residential' },
    planCategory: { type: String, enum: ['residential', 'plots', 'commercial', 'rental'], default: 'residential' },

    requestedAmount: { type: Number, default: 0 },
    message: { type: String, trim: true, default: '' },

    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    assignedToName: { type: String, trim: true, default: '' },
    assignedAt: { type: Date, default: null },

    followUpStatus: {
      type: String,
      enum: ['unassigned', 'contacted', 'site_visit_scheduled', 'negotiating', 'converted', 'lost'],
      default: 'unassigned',
    },

    statusHistory: { type: [historyEntrySchema], default: [] },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.models.InvestmentRequest || mongoose.model('InvestmentRequest', investmentRequestSchema);
