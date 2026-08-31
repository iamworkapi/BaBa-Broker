import ExcelJS from 'exceljs';
import mongoose from 'mongoose';
import FlatListing from '../models/FlatListing.js';
import { uploadBase64ToImageKit, uploadUrlToImageKit } from '../utils/imagekit.js';

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

    let coverImageUrl = '';
    let imageUrls = [];
    try {
      const coverRaw = String(row[colMap['coverImage']] || '').trim();
      if (coverRaw) {
        coverImageUrl = coverRaw.startsWith('http')
          ? (await uploadUrlToImageKit(coverRaw, `cover-${i + 2}-${Date.now()}`)) || coverRaw
          : (await uploadBase64ToImageKit(coverRaw, `cover-${i + 2}-${Date.now()}`)) || '';
      }
      const imagesRaw = String(row[colMap['images']] || '').trim();
      if (imagesRaw) {
        const candidates = imagesRaw.split(/[|,]/).map((s) => s.trim()).filter(Boolean);
        for (let j = 0; j < candidates.length; j++) {
          const img = candidates[j];
          const url = img.startsWith('http')
            ? (await uploadUrlToImageKit(img, `img-${i + 2}-${j}-${Date.now()}`)) || img
            : (await uploadBase64ToImageKit(img, `img-${i + 2}-${j}-${Date.now()}`)) || '';
          if (url) imageUrls.push(url);
        }
      }
    } catch (err) {
      console.error(`ImageKit error row ${i + 2}:`, err.message);
    }

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
      coverImage: coverImageUrl,
      images: imageUrls,
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

const ALLOWED_CATEGORIES = ['RK', 'HK', 'Office', 'Shop', 'Plot'];
const ALLOWED_FURNISHING = ['Furnished', 'Unfurnished', 'Semi-Furnished'];
const ALLOWED_DEAL_STATUS = ['available', 'rented', 'sold'];

export const pushFlatListingData = async (req, res) => {
  const { data, model } = req.body || {};
  if (model !== 'flat-listing') {
    return res.status(400).json({ error: `Unsupported model: ${model}` });
  }
  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ error: 'No data rows provided.' });
  }

  const results = { success: [], failed: [], total: data.length };

  for (let i = 0; i < data.length; i++) {
    const row = data[i] || {};
    const listingType = String(row.listingType || '').trim().toLowerCase();
    const location = String(row.location || '').trim();
    const configuration = String(row.configuration || '').trim();
    const description = String(row.description || '').trim();

    if (!['rent', 'buy'].includes(listingType)) { results.failed.push({ row: i + 1, error: 'listingType must be rent or buy' }); continue; }
    if (!location) { results.failed.push({ row: i + 1, error: 'Missing location' }); continue; }
    if (!configuration) { results.failed.push({ row: i + 1, error: 'Missing configuration' }); continue; }
    if (!description) { results.failed.push({ row: i + 1, error: 'Missing description' }); continue; }

    const salePrice = Number(row.salePrice) || 0;
    const monthlyRent = Number(row.monthlyRent) || 0;
    if (listingType === 'rent' && monthlyRent <= 0) { results.failed.push({ row: i + 1, error: 'monthlyRent must be > 0' }); continue; }
    if (listingType === 'buy' && salePrice <= 0) { results.failed.push({ row: i + 1, error: 'salePrice must be > 0' }); continue; }

    const propertyCategory = ALLOWED_CATEGORIES.includes(String(row.propertyCategory || '').trim()) ? String(row.propertyCategory).trim() : 'HK';
    const furnishingStatus = ALLOWED_FURNISHING.includes(String(row.furnishingStatus || '').trim()) ? String(row.furnishingStatus).trim() : 'Unfurnished';
    const dealStatus = ALLOWED_DEAL_STATUS.includes(String(row.dealStatus || '').trim()) ? String(row.dealStatus).trim() : 'available';
    const lift = String(row.lift || 'YES').trim().toUpperCase() === 'NO' ? 'NO' : 'YES';

    let coverImageUrl = '';
    let imageUrls = [];
    try {
      const coverRaw = String(row.coverImage || '').trim();
      if (coverRaw) {
        coverImageUrl = coverRaw.startsWith('http')
          ? (await uploadUrlToImageKit(coverRaw, `cover-${i + 1}-${Date.now()}`)) || coverRaw
          : (await uploadBase64ToImageKit(coverRaw, `cover-${i + 1}-${Date.now()}`)) || '';
      }
      const imagesRaw = String(row.images || '').trim();
      if (imagesRaw) {
        const candidates = imagesRaw.split(/[|,]/).map((s) => s.trim()).filter(Boolean);
        for (let j = 0; j < candidates.length; j++) {
          const img = candidates[j];
          const url = img.startsWith('http')
            ? (await uploadUrlToImageKit(img, `img-${i + 1}-${j}-${Date.now()}`)) || img
            : (await uploadBase64ToImageKit(img, `img-${i + 1}-${j}-${Date.now()}`)) || '';
          if (url) imageUrls.push(url);
        }
      }
    } catch (err) {
      console.error(`Image upload failed for row ${i + 1}:`, err.message);
    }

    const listingData = {
      listingType,
      title: String(row.title || '').trim(),
      location,
      configuration,
      sizeSqft: String(row.sizeSqft || '').trim(),
      floor: String(row.floor || '').trim(),
      totalFloors: String(row.totalFloors || '').trim(),
      lift,
      parking: String(row.parking || '').trim(),
      possessionStatus: String(row.possessionStatus || 'Ready to Move').trim(),
      constructionYear: String(row.constructionYear || '').trim(),
      facing: String(row.facing || '').trim(),
      reraId: String(row.reraId || 'RERA Not Applicable').trim(),
      amenities: String(row.amenities || '').trim(),
      description,
      coverImage: coverImageUrl,
      images: imageUrls,
      videoUrl: String(row.videoUrl || '').trim(),
      monthlyRent,
      securityDeposit: Number(row.securityDeposit) || 0,
      maintenanceCharge: Number(row.maintenanceCharge) || 0,
      availableFrom: String(row.availableFrom || '').trim(),
      salePrice,
      pricePerSqft: Number(row.pricePerSqft) || 0,
      priceNegotiable: Boolean(row.priceNegotiable),
      ownerName: String(row.ownerName || '').trim(),
      ownerContact: String(row.ownerContact || '').trim(),
      propertyCategory,
      furnishingStatus,
      completeAddress: String(row.completeAddress || '').trim(),
      latitude: String(row.latitude || '').trim(),
      longitude: String(row.longitude || '').trim(),
      commission: String(row.commission || '').trim(),
      specialInstructions: String(row.specialInstructions || '').trim(),
      netProfit: Number(row.netProfit) || 0,
      dealStatus,
      submittedBy: req.user.id,
      isActive: true,
    };

    try {
      const saved = await FlatListing.create(listingData);
      results.success.push({ row: i + 1, _id: saved._id, title: saved.title || saved.configuration });
    } catch (err) {
      results.failed.push({ row: i + 1, error: err.message });
    }
  }

  res.status(201).json(results);
};
