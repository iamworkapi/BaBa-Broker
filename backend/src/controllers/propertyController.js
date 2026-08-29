import mongoose from 'mongoose';
import Property from '../models/Property.js';

const validProperty = (property) =>
  property &&
  property.title?.trim() &&
  property.location?.trim();

const propertyData = (input) => ({
  status: ['running', 'upcoming', 'delivered'].includes(input.status) ? input.status : 'running',
  propertyType: ['residential', 'commercial', 'plot'].includes(input.propertyType) ? input.propertyType : (input.type === 'plot' ? 'plot' : 'residential'),
  bhk: ['2bhk', '3bhk', '4bhk', 'none'].includes(input.bhk) ? input.bhk : '2bhk',
  investmentModel: ['co_investment', 'renovate_flip', 'both'].includes(input.investmentModel) ? input.investmentModel : 'co_investment',
  title: input.title.trim(),
  location: input.location.trim(),
  price: input.price?.trim() || '',
  description: input.description?.trim() || `Prime ${input.title.trim()} in ${input.location.trim()}.`,
  tag: input.tag?.trim() || '',
  ...(input.image !== undefined && { image: input.image }),
  images: Array.isArray(input.images) ? input.images : (input.image ? [input.image] : []),
  videoUrl: input.videoUrl?.trim() || '',
  pdfUrl: input.pdfUrl?.trim() || '',
  // Scenario 1: Fractional Co-Investment
  totalValuation: Number(input.totalValuation) || 0,
  fundedPercentage: Number(input.fundedPercentage) || 0,
  investorsCount: Number(input.investorsCount) || 0,
  minInvestment: Number(input.minInvestment) || 0,
  expectedRoi: Number(input.expectedRoi) || 0,
  // Scenario 2: Buy, Renovate & Flip
  purchasePrice: Number(input.purchasePrice) || 0,
  renovationCost: Number(input.renovationCost) || 0,
  expectedSalePrice: Number(input.expectedSalePrice) || 0,
  holdingPeriodMonths: Number(input.holdingPeriodMonths) || 6,
  // Residential Flat specific fields
  constructionYear: input.constructionYear?.trim() || '',
  sizeSqft: input.sizeSqft?.trim() || '',
  floor: input.floor?.trim() || '',
  lift: input.lift?.trim() || 'YES',
  parking: input.parking?.trim() || 'CAR + BIKE',
  isFeatured: Boolean(input.isFeatured),
  isPortfolio: Boolean(input.isPortfolio),
  // Plot & Land Specific Fields
  plotAreaSqft: input.plotAreaSqft?.trim() || '5381.96 sqft',
  plotAreaSqm: input.plotAreaSqm?.trim() || '500 sq.m.',
  perSqftPrice: input.perSqftPrice?.trim() || '₹ 2,323 per sqft',
  facing: input.facing?.trim() || 'North-East',
  gatedSociety: input.gatedSociety?.trim() || 'YES',
  boundaryWall: input.boundaryWall?.trim() || 'YES',
  roadWidthFeet: input.roadWidthFeet?.trim() || '66.0 Feet',
  openSides: input.openSides?.trim() || '1',
  overlooking: input.overlooking?.trim() || 'Pool / Park',
  possession: input.possession?.trim() || 'Immediate',
  transactionType: input.transactionType?.trim() || 'Resale',
  ownership: input.ownership?.trim() || 'Freehold',
  highlights: input.highlights?.trim() || 'Gated Society, On 66 ft Wide Road, Overlooking Swimming Pool, North-East Facing',
  amenities: input.amenities?.trim() || 'Service / Goods Lift, Centrally Air Conditioned, Banquet Hall, Bar / Lounge, Conference room, Private Garden / Terrace, Intercom Facility, Lift(s), Water Storage, Piped-gas',
  // Commercial Specific Fields
  builtUpArea: input.builtUpArea?.trim() || '264 sqyd (220.74 sq.m.)',
  carpetArea: input.carpetArea?.trim() || '235 sqyd (196.49 sq.m.)',
  perSqydPrice: input.perSqydPrice?.trim() || '₹ 5,30,303 per sqyd',
  configuration: input.configuration?.trim() || 'Commercial Office/Space',
  washrooms: input.washrooms?.trim() || '5 Washrooms',
  propertyAge: input.propertyAge?.trim() || '1 to 5 Year Old',
  // Multiple Co-Investors Management
  investorsList: Array.isArray(input.investorsList)
    ? input.investorsList.map((inv) => ({
        name: inv.name?.trim() || '',
        sharePercentage: Number(inv.sharePercentage) || 0,
        amount: inv.amount?.trim() || '',
        date: inv.date?.trim() || '',
      }))
    : [],
});

export const getProperties = async (req, res) => {
  const properties = await Property.find().sort({ createdAt: -1 }).lean();
  res.status(200).json(properties);
};

export const getFeaturedProperties = async (req, res) => {
  const properties = await Property.find({ isFeatured: true }).sort({ createdAt: -1 }).lean();
  res.status(200).json(properties);
};

export const getPortfolios = async (req, res) => {
  const portfolios = await Property.find({ isPortfolio: true }).sort({ createdAt: -1 }).lean();
  res.status(200).json(portfolios);
};

export const createProperty = async (req, res) => {
  const input = req.body;
  if (!validProperty(input)) {
    return res.status(400).json({ error: 'Title, location and description are required.' });
  }
  const property = await Property.create(propertyData(input));
  res.status(201).json(property);
};

export const updateProperty = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ error: 'Property not found.' });
  }
  const input = req.body;
  if (!validProperty(input)) {
    return res.status(400).json({ error: 'Title, location and description are required.' });
  }
  const property = await Property.findByIdAndUpdate(id, propertyData(input), {
    new: true,
    runValidators: true,
  });
  if (!property) return res.status(404).json({ error: 'Property not found.' });
  res.status(200).json(property);
};

export const deleteProperty = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ error: 'Property not found.' });
  }
  const property = await Property.findByIdAndDelete(id);
  if (!property) return res.status(404).json({ error: 'Property not found.' });
  res.status(200).json({ success: true });
};

