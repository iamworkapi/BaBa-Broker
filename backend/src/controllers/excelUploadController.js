import ExcelJS from 'exceljs';
import mongoose from 'mongoose';
import FlatListing from '../models/FlatListing.js';

const EXPECTED_HEADERS = [
  'listingType', 'title', 'location', 'configuration', 'sizeSqft',
  'floor', 'totalFloors', 'lift', 'parking', 'possessionStatus',
  'constructionYear', 'facing', 'reraId', 'amenities', 'description',
  'coverImage', 'images', 'videoUrl',
  'monthlyRent', 'securityDeposit', 'maintenanceCharge', 'availableFrom',
  'salePrice', 'pricePerSqft', 'priceNegotiable',
  'ownerName', 'ownerContact', 'propertyCategory',
  'furnishingStatus', 'completeAddress', 'latitude', 'longitude',
  'commission', 'specialInstructions', 'netProfit', 'dealStatus',
];

export const uploadExcelFlatListings = async (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const buffer = Buffer.from(req.file.buffer);
  await workbook.xlsx.load(buffer);
  const sheet = workbook.getWorksheet(1) || workbook.worksheets[0];
  if (!sheet) return res.status(400).json({ error: 'Excel file has no sheets.' });

  const rows = sheet.getSheetValues();
  const headerRow = rows[1];
  const dataRows = rows.slice(2);

  const headers = (headerRow && Array.isArray(headerRow))
    ? headerRow.map((h) => String(h || '').trim().toLowerCase())
    : [];

  const colMap = {};
  EXPECTED_HEADERS.forEach((field) => {
    const idx = headers.indexOf(field.toLowerCase());
    if (idx >= 0) colMap[field] = idx;
  });

  const results = { success: [], failed: [], total: dataRows.length, missingHeaders: [] };
  EXPECTED_HEADERS.forEach((h) => {
    if (colMap[h] === undefined && !['coverImage', 'images', 'videoUrl'].includes(h)) {
      results.missingHeaders.push(h);
    }
  });

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    if (!row || !Array.isArray(row)) { results.failed.push({ row: i + 2, error: 'Empty row' }); continue; }

    const listingType = String(row[colMap['listingType']] || '').trim().toLowerCase();
    const location = String(row[colMap['location']] || '').trim();
    const configuration = String(row[colMap['configuration']] || '').trim();
    const description = String(row[colMap['description']] || '').trim();

    if (!['rent', 'buy'].includes(listingType) || !location || !configuration || !description) {
      results.failed.push({ row: i + 2, error: 'Missing required fields' });
      continue;
    }

    const salePrice = Number(row[colMap['salePrice']]) || 0;
    const monthlyRent = Number(row[colMap['monthlyRent']]) || 0;
    if (listingType === 'rent' && monthlyRent <= 0) { results.failed.push({ row: i + 2, error: 'monthlyRent must be > 0' }); continue; }
    if (listingType === 'buy' && salePrice <= 0) { results.failed.push({ row: i + 2, error: 'salePrice must be > 0' }); continue; }

    const listingData = {
      listingType,
      title: String(row[colMap['title']] || '').trim(),
      location,
      configuration,
      sizeSqft: String(row[colMap['sizeSqft']] || '').trim(),
      floor: String(row[colMap['floor']] || '').trim(),
      totalFloors: String(row[colMap['totalFloors']] || '').trim(),
      lift: String(row[colMap['lift']] || 'YES').trim().toUpperCase() === 'NO' ? 'NO' : 'YES',
      parking: String(row[colMap['parking']] || '').trim(),
      possessionStatus: String(row[colMap['possessionStatus']] || 'Ready to Move').trim(),
      constructionYear: String(row[colMap['constructionYear']] || '').trim(),
      facing: String(row[colMap['facing']] || '').trim(),
      reraId: String(row[colMap['reraId']] || 'RERA Not Applicable').trim(),
      amenities: String(row[colMap['amenities']] || '').trim(),
      description,
      coverImage: '',
      images: [],
      videoUrl: String(row[colMap['videoUrl']] || '').trim(),
      monthlyRent,
      securityDeposit: Number(row[colMap['securityDeposit']]) || 0,
      maintenanceCharge: Number(row[colMap['maintenanceCharge']]) || 0,
      availableFrom: String(row[colMap['availableFrom']] || '').trim(),
      salePrice,
      pricePerSqft: Number(row[colMap['pricePerSqft']]) || 0,
      priceNegotiable: Boolean(row[colMap['priceNegotiable']]),
      ownerName: String(row[colMap['ownerName']] || '').trim(),
      ownerContact: String(row[colMap['ownerContact']] || '').trim(),
      propertyCategory: ['RK', 'HK', 'Office', 'Shop', 'Plot'].includes(String(row[colMap['propertyCategory']] || '').trim()) ? String(row[colMap['propertyCategory']]).trim() : 'HK',
      furnishingStatus: ['Furnished', 'Unfurnished', 'Semi-Furnished'].includes(String(row[colMap['furnishingStatus']] || '').trim()) ? String(row[colMap['furnishingStatus']]).trim() : 'Unfurnished',
      completeAddress: String(row[colMap['completeAddress']] || '').trim(),
      latitude: String(row[colMap['latitude']] || '').trim(),
      longitude: String(row[colMap['longitude']] || '').trim(),
      commission: String(row[colMap['commission']] || '').trim(),
      specialInstructions: String(row[colMap['specialInstructions']] || '').trim(),
      netProfit: Number(row[colMap['netProfit']]) || 0,
      dealStatus: ['available', 'rented', 'sold'].includes(String(row[colMap['dealStatus']] || '').trim()) ? String(row[colMap['dealStatus']]).trim() : 'available',
      submittedBy: req.user.id,
      isActive: true,
    };

    try {
      const saved = await FlatListing.create(listingData);
      results.success.push({ row: i + 2, _id: saved._id, title: saved.title || saved.configuration });
    } catch (err) {
      results.failed.push({ row: i + 2, error: err.message });
    }
  }

  res.status(201).json(results);
};

export const getExcelUploadHistory = async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const listings = await FlatListing.find({ isActive: true })
    .populate('submittedBy', 'name email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .lean();
  const total = await FlatListing.countDocuments({ isActive: true });
  res.status(200).json({ listings, total, page: Number(page), totalPages: Math.ceil(total / limit) });
};
