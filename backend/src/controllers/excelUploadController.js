import XLSX from 'xlsx';
import FlatListing from '../models/FlatListing.js';

// Clean string and normalize keys for fuzzy header mapping
function normalizeKey(str) {
  return String(str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Clean number parser (handles "20L", "15.5L", "1.5 Cr", "₹ 45,00,000", "45 Lakhs", "35k", etc.)
function parseCleanNumber(val) {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const str = String(val).trim().toLowerCase();
  if (!str) return 0;

  // Handle Cr / Crore
  const crMatch = str.match(/([\d.]+)\s*(cr|crore|crores)/);
  if (crMatch) return Math.round(parseFloat(crMatch[1]) * 10000000);

  // Handle Lakh / Lac / L (e.g. "20L", "15.5L", "18.5 L", "22L", "20 lac")
  const lakhMatch = str.match(/([\d.]+)\s*(lakh|lakhs|lac|lacs|l\b)/);
  if (lakhMatch) return Math.round(parseFloat(lakhMatch[1]) * 100000);

  // Handle K / Thousand
  const kMatch = str.match(/([\d.]+)\s*(k|thousand)/);
  if (kMatch) return Math.round(parseFloat(kMatch[1]) * 1000);

  // Clean pure digits with decimal points
  const cleanStr = str.replace(/[^\d.]/g, '');
  const num = parseFloat(cleanStr);
  return isNaN(num) ? 0 : num;
}

// Common header alias mappings
const HEADER_ALIASES = {
  listingType: ['listingtype', 'type', 'propertytype', 'listing', 'for', 'purpose', 'category', 'status', 'adtype', 'dealtype'],
  title: ['title', 'propertytitle', 'propertyname', 'projectname', 'project', 'name', 'heading', 'property', 'flatname'],
  location: ['location', 'address', 'area', 'locality', 'city', 'place', 'landmark', 'sector', 'society', 'completeaddress', 'colony'],
  configuration: ['configuration', 'bhk', 'config', 'bedrooms', 'bedroom', 'room', 'rooms', 'flatsize', 'units', 'unittype'],
  sizeSqft: ['size', 'gaj', 'sqgaj', 'sizesqft', 'area', 'sqft', 'squarefeet', 'superarea', 'carpetarea', 'builtuparea', 'areasqft', 'sqfeet'],
  floor: ['floor', 'floorno', 'propertyfloor', 'flatfloor', 'floornumber'],
  totalFloors: ['totalfloors', 'totalfloor', 'floors', 'buildingfloors', 'maxfloors', 'numberoffloors'],
  lift: ['lift', 'elevator', 'liftavailable'],
  parking: ['parking', 'carparking', 'bikeparking', 'parkingtype', 'parkingspace'],
  possessionStatus: ['possessionstatus', 'possession', 'readytomove', 'availability', 'possessiondate'],
  constructionYear: ['constructionyear', 'yearbuilt', 'built', 'age', 'ageofproperty', 'constructionage'],
  facing: ['facing', 'direction', 'entryfacing', 'unitfacing'],
  reraId: ['reraid', 'rera', 'reranumber', 'rerano'],
  amenities: ['amenities', 'features', 'facilities', 'highlights', 'societyamenities'],
  description: ['description', 'desc', 'details', 'about', 'overview', 'remarks', 'notes', 'propertydescription', 'summary'],
  coverImage: ['coverimage', 'image', 'photo', 'picture', 'coverphoto', 'mainimage', 'thumbnail', 'imgurl', 'imageurl'],
  images: ['images', 'gallery', 'photos', 'pictures', 'moreimages', 'galleryimages'],
  videoUrl: ['videourl', 'video', 'youtube', 'tourvideo'],
  monthlyRent: ['monthlyrent', 'rent', 'rentprice', 'rentamount', 'permonthrent', 'lease', 'expectedrent'],
  securityDeposit: ['securitydeposit', 'deposit', 'advance', 'securityamount'],
  maintenanceCharge: ['maintenancecharge', 'maintenance', 'maintenancecharges', 'maint'],
  availableFrom: ['availablefrom', 'availabledate', 'moveindate', 'fromdate'],
  salePrice: ['price', 'saleprice', 'amount', 'cost', 'expectedprice', 'totalprice', 'rate', 'value', 'demandprice'],
  pricePerSqft: ['pricepersqft', 'persqft', 'ratepersqft', 'sqftrate'],
  priceNegotiable: ['pricenegotiable', 'negotiable', 'isnegotiable', 'neg'],
  ownerName: ['by', 'agent', 'submittedby', 'listedby', 'staff', 'owner', 'ownername', 'contactperson', 'clientname', 'seller', 'landlord', 'agentname'],
  ownerContact: ['contact', 'contactno', 'phone', 'mobile', 'cell', 'ownermobile', 'contactnumber', 'ownerphone', 'phone_number', 'ownercontact', 'mob'],
  propertyCategory: ['propertycategory', 'category', 'proptype'],
  furnishingStatus: ['furnishingstatus', 'furnishing', 'furnished'],
  completeAddress: ['address', 'completeaddress', 'fulladdress', 'full_address', 'addressdetails', 'landmark'],
  dealStatus: ['dealstatus', 'deal_status', 'availability_status'],
  commission: ['commission', 'brokerage'],
  specialInstructions: ['additionalcontactnotes', 'additionalcontact', 'notes', 'remarks', 'specialinstructions', 'instructions'],
  netProfit: ['netprice', 'net_price', 'finalprice', 'lastprice', 'minimumprice', 'netprofit', 'profit'],
};

function getRowValue(rowObj, canonicalField) {
  const aliases = HEADER_ALIASES[canonicalField] || [canonicalField.toLowerCase()];
  for (const key of Object.keys(rowObj)) {
    const norm = normalizeKey(key);
    if (aliases.includes(norm)) {
      const val = rowObj[key];
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        return val;
      }
    }
  }
  return '';
}

function expandFloorName(rawFloor) {
  const f = String(rawFloor || '').trim().toUpperCase();
  if (!f) return '';
  if (f === 'G-FS') return 'Ground Floor (Front Side)';
  if (f === 'UG FS' || f === 'UG-FS' || f === 'UGFS') return 'Upper Ground (Front Side)';
  if (f === 'T-BS' || f === 'TBS') return 'Top Floor (Back Side)';
  if (f === '2ND-BS' || f === '2NDBS') return '2nd Floor (Back Side)';
  if (f === 'ND&3RD B' || f === '2ND&3RD B') return '2nd & 3rd Floor (Back Side)';
  return String(rawFloor).trim();
}

function processRowToFlatListing(rowObj, rowIndex, userId) {
  // Check if row is completely empty (or only S.NO)
  const nonEmpties = Object.keys(rowObj).filter((k) => {
    const norm = normalizeKey(k);
    if (norm === 'sno' || norm === 'srno' || norm === 'id') return false;
    const v = rowObj[k];
    return v !== undefined && v !== null && String(v).trim() !== '';
  });
  if (nonEmpties.length === 0) return null; // Skip empty row

  const rawType = String(getRowValue(rowObj, 'listingType') || '').trim().toLowerCase();
  const rawSalePrice = parseCleanNumber(getRowValue(rowObj, 'salePrice'));
  const rawRent = parseCleanNumber(getRowValue(rowObj, 'monthlyRent'));
  const rawNetPrice = parseCleanNumber(getRowValue(rowObj, 'netProfit'));

  // Detect listing type
  let listingType = 'buy';
  if (rawType.includes('rent') || rawType.includes('lease')) {
    listingType = 'rent';
  } else if (rawType.includes('buy') || rawType.includes('sale') || rawType.includes('sell')) {
    listingType = 'buy';
  } else if (rawRent > 0 && rawSalePrice <= 0) {
    listingType = 'rent';
  }

  // Location resolution
  let location = String(getRowValue(rowObj, 'location') || getRowValue(rowObj, 'completeAddress') || '').trim();
  if (!location) {
    location = 'Dwarka Mor / Uttam Nagar, Delhi';
  }

  // Size & Configuration resolution
  const rawSize = String(getRowValue(rowObj, 'sizeSqft') || '').trim();
  let sizeSqft = rawSize;
  let configuration = String(getRowValue(rowObj, 'configuration') || '').trim();
  const rawTitle = String(getRowValue(rowObj, 'title') || '').trim();
  const rawDesc = String(getRowValue(rowObj, 'description') || '').trim();

  // If size contains GAJ (e.g. 50GAJ, 40GAJ, 1RK 30GAJ)
  if (rawSize) {
    const rkMatch = rawSize.match(/\b([1-9]\s*rk)\b/i);
    const bhkMatch = rawSize.match(/\b([1-9]\s*bhk)\b/i);
    const gajMatch = rawSize.match(/(\d+)\s*(gaj|sqgaj|sqyd)/i);

    if (rkMatch && !configuration) {
      configuration = rkMatch[1].toUpperCase();
    } else if (bhkMatch && !configuration) {
      configuration = bhkMatch[1].toUpperCase();
    }

    if (gajMatch) {
      const gajNum = parseInt(gajMatch[1], 10);
      const sqftCalc = gajNum * 9;
      sizeSqft = `${gajNum} Gaj (${sqftCalc} sq.ft)`;
      if (!configuration) {
        if (gajNum <= 35) configuration = '1 RK';
        else if (gajNum <= 45) configuration = '1 BHK';
        else if (gajNum <= 65) configuration = '2 BHK';
        else if (gajNum <= 90) configuration = '3 BHK';
        else configuration = '4 BHK';
      }
    }
  }

  if (!configuration) {
    const combined = `${rawTitle} ${rawDesc} ${rawSize}`;
    const match = combined.match(/\b([1-9]\s*bhk|[1-9]\s*rk|studio|commercial|office|shop|plot)\b/i);
    configuration = match ? match[1].toUpperCase() : '2 BHK';
  }

  // Floor resolution
  const floor = expandFloorName(getRowValue(rowObj, 'floor'));

  // Title resolution
  const title = rawTitle || `${configuration} ${sizeSqft ? `(${sizeSqft})` : ''} at ${location}`.replace(/\s+/g, ' ').trim();

  // Agent / Owner details
  const ownerName = String(getRowValue(rowObj, 'ownerName') || 'Property Associate').trim();
  const ownerContact = String(getRowValue(rowObj, 'ownerContact') || '').replace(/[^\d+]/g, '');
  const completeAddress = String(getRowValue(rowObj, 'completeAddress') || location).trim();
  const notes = String(getRowValue(rowObj, 'specialInstructions') || '').trim();

  // Description resolution
  const description =
    rawDesc ||
    `${configuration} property ${sizeSqft ? `measuring ${sizeSqft}` : ''} ${floor ? `on ${floor}` : ''} situated at ${location}. Excellent residential location with convenient road connectivity. Listed by: ${ownerName}. ${notes ? `Notes: ${notes}` : ''}`.trim();

  // Price resolution
  let salePrice = rawSalePrice || rawNetPrice || 0;
  let monthlyRent = rawRent;
  if (listingType === 'rent' && monthlyRent <= 0 && salePrice > 0) {
    monthlyRent = salePrice;
  }
  if (listingType === 'buy' && salePrice <= 0 && monthlyRent > 0) {
    salePrice = monthlyRent;
  }

  const liftVal = String(getRowValue(rowObj, 'lift') || 'NO').trim().toUpperCase();
  const lift = liftVal === 'YES' || liftVal === 'TRUE' ? 'YES' : 'NO';

  const parkingRaw = String(getRowValue(rowObj, 'parking') || 'Bike Parking').trim().toUpperCase();
  const parking = parkingRaw.includes('CAR') ? 'Car + Bike Parking' : parkingRaw.includes('BIKE') ? 'Bike Parking' : 'Bike Parking';

  const rawCategory = String(getRowValue(rowObj, 'propertyCategory') || '').trim();
  const propertyCategory = ['RK', 'HK', 'Office', 'Shop', 'Plot'].includes(rawCategory) ? rawCategory : configuration.includes('RK') ? 'RK' : 'HK';

  const rawDeal = String(getRowValue(rowObj, 'dealStatus') || '').trim().toLowerCase();
  const dealStatus = ['available', 'rented', 'sold'].includes(rawDeal) ? rawDeal : 'available';

  return {
    listingType,
    title,
    location,
    configuration,
    sizeSqft: sizeSqft || '450 sq.ft',
    floor: floor || '2nd Floor',
    totalFloors: String(getRowValue(rowObj, 'totalFloors') || '4').trim(),
    lift,
    parking,
    possessionStatus: String(getRowValue(rowObj, 'possessionStatus') || 'Ready to Move').trim(),
    constructionYear: String(getRowValue(rowObj, 'constructionYear') || '2023').trim(),
    facing: String(getRowValue(rowObj, 'facing') || 'East').trim(),
    reraId: String(getRowValue(rowObj, 'reraId') || 'RERA Not Applicable').trim(),
    amenities: String(getRowValue(rowObj, 'amenities') || '24x7 Water Supply, Gated Entry, Power Backup').trim(),
    description,
    coverImage: String(getRowValue(rowObj, 'coverImage') || '').trim(),
    images: [],
    videoUrl: String(getRowValue(rowObj, 'videoUrl') || '').trim(),
    monthlyRent,
    securityDeposit: parseCleanNumber(getRowValue(rowObj, 'securityDeposit')),
    maintenanceCharge: parseCleanNumber(getRowValue(rowObj, 'maintenanceCharge')),
    availableFrom: String(getRowValue(rowObj, 'availableFrom') || 'Immediate').trim(),
    salePrice,
    pricePerSqft: parseCleanNumber(getRowValue(rowObj, 'pricePerSqft')),
    priceNegotiable: rawNetPrice > 0 ? true : Boolean(getRowValue(rowObj, 'priceNegotiable')),
    ownerName,
    ownerContact,
    propertyCategory,
    furnishingStatus: 'Semi-Furnished',
    completeAddress,
    latitude: String(getRowValue(rowObj, 'latitude') || '').trim(),
    longitude: String(getRowValue(rowObj, 'longitude') || '').trim(),
    commission: String(getRowValue(rowObj, 'commission') || '').trim(),
    specialInstructions: notes,
    netProfit: rawNetPrice || 0,
    dealStatus,
    submittedBy: userId,
    isActive: true,
  };
}

export const uploadExcelFlatListings = async (req, res) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ error: 'No Excel or CSV file uploaded.' });
  }

  let rows = [];
  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer', cellDates: true });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) return res.status(400).json({ error: 'Uploaded file has no sheets.' });
    const worksheet = workbook.Sheets[sheetName];
    rows = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });
  } catch (err) {
    return res.status(400).json({ error: `Failed to parse file: ${err.message}` });
  }

  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: 'File contains no data rows.' });
  }

  const results = { success: [], failed: [], total: rows.length, importedCount: 0 };

  for (let i = 0; i < rows.length; i++) {
    const rowObj = rows[i];
    const listingData = processRowToFlatListing(rowObj, i + 2, req.user?.id || req.user?._id);

    if (!listingData) {
      // Empty row skipped
      continue;
    }

    try {
      const saved = await FlatListing.create(listingData);
      results.success.push({
        row: i + 2,
        _id: saved._id,
        title: saved.title || saved.configuration,
        location: saved.location,
        price: saved.listingType === 'rent' ? `₹ ${saved.monthlyRent}/mo` : `₹ ${saved.salePrice.toLocaleString('en-IN')}`,
      });
      results.importedCount += 1;
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

export const pushFlatListingData = async (req, res) => {
  const { data, model } = req.body || {};
  if (model !== 'flat-listing') {
    return res.status(400).json({ error: `Unsupported model: ${model}` });
  }
  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ error: 'No data rows provided.' });
  }

  const results = { success: [], failed: [], total: data.length, importedCount: 0 };

  for (let i = 0; i < data.length; i++) {
    const rowObj = data[i] || {};
    const listingData = processRowToFlatListing(rowObj, i + 1, req.user?.id || req.user?._id);

    if (!listingData) continue;

    try {
      const saved = await FlatListing.create(listingData);
      results.success.push({ row: i + 1, _id: saved._id, title: saved.title || saved.configuration });
      results.importedCount += 1;
    } catch (err) {
      results.failed.push({ row: i + 1, error: err.message });
    }
  }

  res.status(201).json(results);
};
