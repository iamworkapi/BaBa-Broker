import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    status: { type: String, enum: ['running', 'upcoming', 'delivered'], default: 'running', required: true },
    propertyType: { type: String, enum: ['residential', 'commercial', 'plot'], default: 'residential', required: true },
    bhk: { type: String, enum: ['2bhk', '3bhk', '4bhk', 'none'], default: '2bhk' },
    investmentModel: { type: String, enum: ['co_investment', 'renovate_flip', 'both'], default: 'co_investment' },
    title: { type: String, trim: true, required: true },
    location: { type: String, trim: true, required: true },
    price: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    image: { type: String, default: '' },
    images: [{ type: String }],
    videoUrl: { type: String, default: '' },
    pdfUrl: { type: String, default: '' },
    tag: { type: String, default: '' },
    // Scenario 1: Co-Investment / Fractional Funding
    totalValuation: { type: Number, default: 0 },
    fundedPercentage: { type: Number, default: 0 },
    investorsCount: { type: Number, default: 0 },
    minInvestment: { type: Number, default: 0 },
    expectedRoi: { type: Number, default: 0 },
    // Scenario 2: Buy, Renovate & Flip
    purchasePrice: { type: Number, default: 0 },
    renovationCost: { type: Number, default: 0 },
    expectedSalePrice: { type: Number, default: 0 },
    holdingPeriodMonths: { type: Number, default: 6 },
    // Residential / Flat specific details
    constructionYear: { type: String, default: '' },
    sizeSqft: { type: String, default: '' },
    floor: { type: String, default: '' },
    lift: { type: String, default: 'YES' },
    parking: { type: String, default: 'CAR + BIKE' },
    isFeatured: { type: Boolean, default: false },
    isPortfolio: { type: Boolean, default: false },
    // Plot & Land Specific Details
    plotAreaSqft: { type: String, default: '5381.96 sqft' },
    plotAreaSqm: { type: String, default: '500 sq.m.' },
    perSqftPrice: { type: String, default: '₹ 2,323 per sqft' },
    facing: { type: String, default: 'North-East' },
    gatedSociety: { type: String, default: 'YES' },
    boundaryWall: { type: String, default: 'YES' },
    roadWidthFeet: { type: String, default: '66.0 Feet' },
    openSides: { type: String, default: '1' },
    overlooking: { type: String, default: 'Pool / Park' },
    possession: { type: String, default: 'Immediate' },
    transactionType: { type: String, default: 'Resale' },
    ownership: { type: String, default: 'Freehold' },
    highlights: { type: String, default: 'Gated Society, On 66 ft Wide Road, Overlooking Swimming Pool, North-East Facing' },
    amenities: { type: String, default: 'Gated Society, Water Storage, Rain Water Harvesting' },
    // Commercial Specific Fields
    builtUpArea: { type: String, default: '264 sqyd (220.74 sq.m.)' },
    carpetArea: { type: String, default: '235 sqyd (196.49 sq.m.)' },
    perSqydPrice: { type: String, default: '₹ 5,30,303 per sqyd' },
    configuration: { type: String, default: 'Commercial Office/Space' },
    washrooms: { type: String, default: '5 Washrooms' },
    propertyAge: { type: String, default: '1 to 5 Year Old' },
    // Multiple Co-Investors Management
    investorsList: [
      {
        name: { type: String, trim: true, default: '' },
        sharePercentage: { type: Number, default: 0 },
        amount: { type: String, default: '' },
        date: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.models.Property || mongoose.model('Property', propertySchema);

