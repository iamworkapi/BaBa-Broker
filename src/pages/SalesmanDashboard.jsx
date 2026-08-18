import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { clearAuth, getAuth } from '../lib/auth';
import AssignedLeadsPanel from '../components/AssignedLeadsPanel';

const QUICK_AMENITIES = [
  "Lift(s)",
  "24x7 Security",
  "Gated Community",
  "Car & Bike Parking",
  "Power Backup",
  "24hr Water Supply",
  "Modular Kitchen",
  "Private Balcony",
  "Park / Garden",
  "Gymnasium",
  "Near Metro Station",
  "CCTV Surveillance"
];

const emptyFlatListing = () => ({
  // Primary Owner & Property Details (Top Section)
  ownerName: '',
  ownerContact: '',
  propertyCategory: 'HK', // 'RK' | 'HK' | 'Office' | 'Shop' | 'Plot'
  furnishingStatus: 'Unfurnished', // 'Furnished' | 'Unfurnished' | 'Semi-Furnished'
  floor: 'Ground Floor',
  completeAddress: '',
  latitude: '',
  longitude: '',
  commission: 'YES',
  specialInstructions: '',
  netProfit: '',

  // General Listing Fields
  listingType: 'buy',
  title: '',
  location: '',
  configuration: '2 BHK',
  sizeSqft: '',
  totalFloors: '',
  lift: 'YES',
  parking: 'Car + Bike Parking',
  possessionStatus: 'Ready to Move',
  constructionYear: '',
  facing: 'North-East',
  reraId: 'RERA Not Applicable',
  amenities: '',
  description: '',
  coverImage: '',
  images: [],
  videoUrl: '',
  monthlyRent: '',
  securityDeposit: '',
  maintenanceCharge: '',
  availableFrom: '',
  salePrice: '',
  pricePerSqft: '',
  priceNegotiable: false,
});

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

const formatINR = (val) => {
  const num = Number(val);
  if (!num) return '₹ 0';
  return '₹ ' + num.toLocaleString('en-IN');
};

{/* Sleek Executive Slide-Over Drawer View */}
function PropertyDetailDrawer({ listing, onClose, onEdit }) {
  if (!listing) return null;

  const isCommercialOrPlot = ['Office', 'Plot', 'Shop'].includes(listing.propertyCategory);
  const priceLabel = listing.listingType === 'rent' && listing.monthlyRent
    ? `${formatINR(listing.monthlyRent)} / mo`
    : formatINR(listing.salePrice);

  const hasOwnerInfo = Boolean(listing.ownerName?.trim() || listing.ownerContact?.trim());

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex justify-end">
      
      {/* Click Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-Over Panel */}
      <div className="relative w-full max-w-xl bg-slate-900 border-l border-slate-800 shadow-2xl h-full flex flex-col justify-between overflow-y-auto text-slate-100 z-10 animate-in slide-in-from-right duration-300">
        
        <div>
          {/* Cover Photo Header */}
          <div className="relative h-56 w-full bg-slate-950 overflow-hidden">
            {listing.coverImage ? (
              <img src={listing.coverImage} alt={listing.title} loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-800 bg-slate-950">
                <i className="fa-solid fa-building text-6xl opacity-30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-black/50" />

            {/* Top Buttons */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <button
                onClick={() => { onClose(); onEdit(listing); }}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-xs font-black hover:brightness-110 shadow-lg cursor-pointer flex items-center gap-2"
              >
                <i className="fa-solid fa-pen text-xs" /> Edit Listing
              </button>

              <button
                onClick={onClose}
                className="h-9 w-9 rounded-full bg-slate-950/80 hover:bg-slate-950 text-white flex items-center justify-center border border-slate-700 cursor-pointer shadow-lg transition"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>

            {/* Title & Price Banner */}
            <div className="absolute bottom-4 left-5 right-5 space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded-xl px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-500/30 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                  {listing.propertyCategory}
                </span>
                <span className={`rounded-xl px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ${listing.listingType === 'rent' ? 'bg-blue-600/30 text-blue-200 border-blue-500/50' : 'bg-orange-500/30 text-orange-200 border-orange-500/50'}`}>
                  {listing.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                </span>
                <span className="text-xs font-black text-amber-300 bg-slate-950/90 px-3 py-1 rounded-xl border border-slate-800 ml-auto">
                  {priceLabel}
                </span>
              </div>

              <h2 className="text-lg font-black text-white line-clamp-1">
                {listing.title || listing.configuration || `${listing.propertyCategory} Property`}
              </h2>
            </div>
          </div>

          {/* Quick Actions Bar */}
          {listing.ownerContact && (
            <div className="p-5 border-b border-slate-800 flex items-center gap-3 bg-slate-950">
              <a
                href={`tel:${listing.ownerContact}`}
                className="w-full py-3 px-3 rounded-2xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/40 text-xs font-black transition flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-phone" /> Call Owner
              </a>
            </div>
          )}

          {/* Drawer Content */}
          <div className="p-5 space-y-5 text-xs">
            
            {/* Location & Address */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
              <h4 className="text-[11px] font-black uppercase text-amber-400 flex items-center gap-2">
                <i className="fa-solid fa-map-location-dot" /> Location & Address
              </h4>
              <p className="font-semibold text-slate-200 leading-relaxed">
                {listing.completeAddress || listing.location}
              </p>
              {(listing.latitude || listing.longitude) && (
                <div className="pt-2 border-t border-slate-800/60 font-mono text-amber-300 text-[11px] flex items-center gap-2">
                  <i className="fa-solid fa-crosshairs text-orange-400" />
                  <span>GPS Coordinates: {listing.latitude || 'N/A'}, {listing.longitude || 'N/A'}</span>
                </div>
              )}
            </div>

            {/* Owner Info Card (ONLY SHOWN IF OWNER DETAILS EXIST!) */}
            {hasOwnerInfo && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
                <h4 className="text-[11px] font-black uppercase text-amber-400 flex items-center gap-2">
                  <i className="fa-solid fa-user-shield" /> Owner Contact Information
                </h4>
                <div className="space-y-1.5 pt-1">
                  {listing.ownerName && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Owner Name:</span>
                      <span className="font-bold text-white">{listing.ownerName}</span>
                    </div>
                  )}
                  {listing.ownerContact && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Contact Number:</span>
                      <a href={`tel:${listing.ownerContact}`} className="font-mono font-bold text-emerald-400 hover:underline">
                        {listing.ownerContact}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Commercial Profit Highlight if present */}
            {isCommercialOrPlot && Number(listing.netProfit) > 0 && (
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 space-y-2">
                <h4 className="text-[11px] font-black uppercase text-emerald-400 flex items-center gap-2">
                  <i className="fa-solid fa-coins" /> Commercial Financial Highlight
                </h4>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Property Price:</span>
                    <span className="text-sm font-black text-white">{formatINR(listing.salePrice)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Net Profit Margin:</span>
                    <span className="text-sm font-black text-emerald-400">{formatINR(listing.netProfit)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Property Specifications Grid */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <h4 className="text-[11px] font-black uppercase text-amber-400 flex items-center gap-2">
                <i className="fa-solid fa-sliders" /> Property Specifications
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block font-bold uppercase">Configuration</span>
                  <span className="font-bold text-white">{listing.configuration || listing.propertyCategory}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block font-bold uppercase">Furnishing</span>
                  <span className="font-semibold text-slate-200">{listing.furnishingStatus || 'Unfurnished'}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block font-bold uppercase">Floor Level</span>
                  <span className="font-semibold text-slate-200">{listing.floor || 'N/A'}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block font-bold uppercase">Commission Terms</span>
                  <span className="font-bold text-amber-400">{listing.commission || 'YES'}</span>
                </div>
                {listing.sizeSqft && (
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500 text-[10px] block font-bold uppercase">Property Size</span>
                    <span className="font-semibold text-slate-200">{listing.sizeSqft}</span>
                  </div>
                )}
                {listing.parking && (
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500 text-[10px] block font-bold uppercase">Parking</span>
                    <span className="font-semibold text-slate-200">{listing.parking}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description & Special Instructions */}
            {listing.description && (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-1.5">
                <span className="text-slate-400 font-bold block text-[11px]">Description & Highlights:</span>
                <p className="text-slate-300 leading-relaxed">{listing.description}</p>
              </div>
            )}

            {listing.specialInstructions && (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 space-y-1.5">
                <span className="text-amber-400 font-bold block text-[11px]">Internal Broker Notes:</span>
                <p className="text-slate-300 leading-relaxed font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">{listing.specialInstructions}</p>
              </div>
            )}

          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={() => { onClose(); onEdit(listing); }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg hover:brightness-110 cursor-pointer flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-pen" /> Edit This Property Listing
          </button>
        </div>

      </div>
    </div>
  );
}

function ListingCard({ listing, onView, onEdit, onDelete }) {
  const isCommercialOrPlot = ['Office', 'Plot', 'Shop'].includes(listing.propertyCategory);

  const priceLabel =
    listing.listingType === 'rent' && listing.monthlyRent
      ? `${formatINR(listing.monthlyRent)} / mo`
      : formatINR(listing.salePrice);

  const categoryIcons = {
    RK: 'fa-bed',
    HK: 'fa-house',
    Office: 'fa-building',
    Shop: 'fa-store',
    Plot: 'fa-vector-square'
  };

  const hasOwnerInfo = Boolean(listing.ownerName?.trim() || listing.ownerContact?.trim());

  return (
    <div className="group rounded-3xl border border-slate-800/90 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/95 shadow-xl hover:shadow-2xl hover:border-amber-500/50 hover:shadow-[0_20px_50px_-15px_rgba(245,158,11,0.18)] transition-all duration-300 flex flex-col justify-between backdrop-blur-xl relative overflow-hidden">
      
      {/* Top Ambient Glow Effect */}
      <div className="absolute -top-10 -right-10 h-36 w-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/25 transition-all duration-500" />

      <div>
        {/* Card Image Banner (Clickable to View Details) */}
        <div
          onClick={() => onView(listing)}
          className="relative h-52 w-full bg-slate-950 overflow-hidden cursor-pointer"
        >
          {listing.coverImage ? (
            <img
              src={listing.coverImage}
              alt={listing.title || listing.location}
              className="h-full w-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-800">
              <i className={`fa-solid ${categoryIcons[listing.propertyCategory] || 'fa-building'} text-6xl opacity-30 group-hover:scale-110 transition-transform duration-500`} />
            </div>
          )}

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-black/50" />

          {/* Top Floating Badges Bar */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="rounded-2xl px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-slate-950/85 text-amber-300 border border-amber-500/40 backdrop-blur-md flex items-center gap-1 shadow-lg">
                <i className={`fa-solid ${categoryIcons[listing.propertyCategory] || 'fa-building'} text-[10px] text-amber-400`} />
                <span>{listing.propertyCategory || 'Listing'}</span>
              </span>

              <span
                className={`rounded-2xl px-2.5 py-1 text-[10px] font-black uppercase tracking-wider backdrop-blur-md border shadow-lg ${
                  listing.listingType === 'rent'
                    ? 'bg-blue-600/30 text-blue-200 border-blue-500/50'
                    : 'bg-orange-500/30 text-orange-200 border-orange-500/50'
                }`}
              >
                {listing.listingType === 'rent' ? 'For Rent' : 'For Sale'}
              </span>
            </div>

            {/* Deal Status Pill */}
            <span
              className={`rounded-2xl px-2.5 py-1 text-[10px] font-black uppercase tracking-wider backdrop-blur-md border flex items-center gap-1.5 shadow-lg ${
                listing.dealStatus === 'available'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : listing.dealStatus === 'rented'
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  : 'bg-red-500/20 text-red-300 border-red-500/40'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${listing.dealStatus === 'available' ? 'bg-emerald-400 animate-pulse' : 'bg-current'}`} />
              <span className="capitalize">{listing.dealStatus}</span>
            </span>
          </div>

          {/* Price Overlay Badge Banner */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
            <div className="bg-slate-950/90 border border-amber-500/40 px-3.5 py-1.5 rounded-2xl backdrop-blur-md shadow-xl flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price:</span>
              <span className="text-sm font-black text-amber-300">{priceLabel}</span>
            </div>

            {isCommercialOrPlot && Number(listing.netProfit) > 0 && (
              <span className="text-xs font-black text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 rounded-2xl backdrop-blur-md shadow-lg flex items-center gap-1">
                <i className="fa-solid fa-arrow-trend-up text-emerald-400 text-[10px]" />
                <span>Profit: {formatINR(listing.netProfit)}</span>
              </span>
            )}
          </div>
        </div>

        {/* Card Details Section */}
        <div className="p-5 space-y-3.5">
          <div onClick={() => onView(listing)} className="cursor-pointer">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                {listing.title || listing.configuration || `${listing.propertyCategory} Property`}
              </h3>
              {listing.configuration && (
                <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full shrink-0">
                  {listing.configuration}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1.5">
              <i className="fa-solid fa-location-dot text-orange-400 text-xs shrink-0" />
              <span className="truncate" title={listing.completeAddress || listing.location}>
                {listing.completeAddress || listing.location}
              </span>
            </p>
          </div>

          {/* Owner Info Executive Bar (ONLY RENDERED IF DETAILS EXIST!) */}
          {hasOwnerInfo && (
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-2.5 text-xs text-slate-300 flex items-center justify-between gap-2 shadow-inner">
              <div className="flex items-center gap-2 truncate">
                <div className="h-7 w-7 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <i className="fa-solid fa-user-tie text-xs" />
                </div>
                <span className="font-bold text-slate-200 truncate">{listing.ownerName || 'Owner Info'}</span>
              </div>
              {listing.ownerContact && (
                <a
                  href={`tel:${listing.ownerContact}`}
                  className="font-mono text-emerald-400 text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/30 px-2.5 py-1 rounded-xl transition flex items-center gap-1.5 shrink-0"
                >
                  <i className="fa-solid fa-phone text-[10px]" />
                  <span>{listing.ownerContact}</span>
                </a>
              )}
            </div>
          )}

          {/* Key Attribute Micro-Pills with Icons */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-950/70 border border-slate-800/80 p-2 rounded-2xl">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1">
                <i className="fa-solid fa-couch text-[9px] text-slate-400" />
                <span>Furnishing</span>
              </p>
              <p className="font-bold text-slate-200 truncate mt-0.5">{listing.furnishingStatus || 'Unfurnished'}</p>
            </div>
            <div className="bg-slate-950/70 border border-slate-800/80 p-2 rounded-2xl">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1">
                <i className="fa-solid fa-layer-group text-[9px] text-slate-400" />
                <span>Floor</span>
              </p>
              <p className="font-bold text-slate-200 truncate mt-0.5">{listing.floor || 'N/A'}</p>
            </div>
            <div className="bg-slate-950/70 border border-slate-800/80 p-2 rounded-2xl">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1">
                <i className="fa-solid fa-handshake text-[9px] text-amber-500/80" />
                <span>Commission</span>
              </p>
              <p className="font-bold text-amber-400 truncate mt-0.5">{listing.commission || 'YES'}</p>
            </div>
          </div>

        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-0 flex items-center gap-2">
        <button
          onClick={() => onView(listing)}
          className="rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500 hover:text-slate-950 px-3.5 py-2.5 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 shadow-md"
          title="View Full Property Details"
        >
          <i className="fa-solid fa-eye text-xs" />
          <span>View</span>
        </button>

        <button
          onClick={() => onEdit(listing)}
          className="flex-1 rounded-2xl border border-slate-800 bg-slate-950 hover:border-slate-700 py-2.5 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
        >
          <i className="fa-solid fa-pen text-[10px]" />
          <span>Edit</span>
        </button>

        <button
          onClick={() => onDelete(listing._id)}
          className="rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3.5 py-2.5 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 shadow-md"
          title="Delete Property Listing"
        >
          <i className="fa-solid fa-trash-can text-xs" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}

export default function SalesmanDashboard() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [view, setView] = useState('add');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyFlatListing());
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [viewingProperty, setViewingProperty] = useState(null); // Property Detail Drawer state

  // High-Volume Listing Filters & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [layoutMode, setLayoutMode] = useState('grid'); // 'grid' | 'table'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const load = useCallback(async () => {
    try {
      const data = await api('/api/flat-listings');
      setListings(Array.isArray(data) ? data : []);
    } catch (err) {
      setStatus(err.message);
      if (/sign in|session/i.test(err.message)) navigate('/salesman/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    load();
  }, [load]);

  // Auto-dismiss status notification after 5 seconds
  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => {
      setStatus('');
    }, 5000);
    return () => clearTimeout(timer);
  }, [status]);

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleQuickAmenity = (amenity) => {
    setForm((prev) => {
      const currentList = prev.amenities
        ? prev.amenities.split(',').map((a) => a.trim()).filter(Boolean)
        : [];
      if (currentList.includes(amenity)) {
        const updated = currentList.filter((a) => a !== amenity);
        return { ...prev, amenities: updated.join(', ') };
      } else {
        const updated = [...currentList, amenity];
        return { ...prev, amenities: updated.join(', ') };
      }
    });
  };

  const handleCoverImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, coverImage: '' }));
    const b64 = await fileToBase64(file);
    setForm((prev) => ({ ...prev, coverImage: b64 }));
  };

  const handleGalleryImages = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const list = await Promise.all(files.map(fileToBase64));
    setForm((prev) => ({ ...prev, images: [...(prev.images || []), ...list] }));
  };

  const removeGalleryImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setForm(emptyFlatListing());
    setEditingId(null);
  };

  const startEdit = (listing) => {
    setForm({ ...emptyFlatListing(), ...listing });
    setEditingId(listing._id);
    setView('add');
  };

  const submit = async (e) => {
    e.preventDefault();
    
    const finalLocation = form.completeAddress.trim() || form.location.trim();
    const finalConfig = form.configuration.trim() || form.propertyCategory;
    const finalDescription = form.description.trim() || `${form.propertyCategory} property by ${form.ownerName || 'owner'}.`;

    if (!finalLocation || !finalConfig) {
      setStatus('Complete Address or Location and Property Category are required.');
      return;
    }

    if (form.listingType === 'rent' && !Number(form.monthlyRent)) {
      setStatus('Monthly rent is required for a Rent listing.');
      return;
    }
    if (form.listingType === 'buy' && !Number(form.salePrice)) {
      setStatus('Sale price is required for a Buy/Sale listing.');
      return;
    }

    const payload = {
      ...form,
      location: finalLocation,
      configuration: finalConfig,
      description: finalDescription,
    };

    setSaving(true);
    try {
      if (editingId) {
        await api(`/api/flat-listings/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        setStatus('Listing updated successfully.');
      } else {
        await api('/api/flat-listings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        setStatus('Property listing submitted successfully.');
      }
      resetForm();
      await load();
      setView('list');
    } catch (err) {
      setStatus(err.message);
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (id, dealStatus) => {
    try {
      const updated = await api(`/api/flat-listings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealStatus }),
      });
      setListings((list) => list.map((item) => (item._id === id ? updated : item)));
    } catch (err) {
      setStatus(err.message);
    }
  };

  const deleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property listing?')) return;
    try {
      await api(`/api/flat-listings/${id}`, {
        method: 'DELETE',
      });
      setListings((list) => list.filter((item) => item._id !== id));
      if (viewingProperty?._id === id) {
        setViewingProperty(null);
      }
      setStatus('Property listing deleted successfully.');
    } catch (err) {
      setStatus(err.message);
    }
  };

  // Metrics overview
  const stats = useMemo(
    () => ({
      total: listings.length,
      available: listings.filter((l) => l.dealStatus === 'available').length,
      rent: listings.filter((l) => l.listingType === 'rent').length,
      buy: listings.filter((l) => l.listingType === 'buy').length,
      plots: listings.filter((l) => l.propertyCategory === 'Plot').length,
      commercial: listings.filter((l) => ['Office', 'Shop'].includes(l.propertyCategory)).length,
    }),
    [listings]
  );

  // High-Volume Filter & Search Logic
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = (item.title || '').toLowerCase().includes(q);
        const matchLocation = (item.completeAddress || item.location || '').toLowerCase().includes(q);
        const matchOwner = (item.ownerName || '').toLowerCase().includes(q);
        const matchPhone = (item.ownerContact || '').toLowerCase().includes(q);
        const matchConfig = (item.configuration || '').toLowerCase().includes(q);
        if (!matchTitle && !matchLocation && !matchOwner && !matchPhone && !matchConfig) return false;
      }

      if (filterCategory !== 'all' && item.propertyCategory !== filterCategory) return false;
      if (filterType !== 'all' && item.listingType !== filterType) return false;
      if (filterStatus !== 'all' && item.dealStatus !== filterStatus) return false;

      return true;
    });
  }, [listings, searchQuery, filterCategory, filterType, filterStatus]);

  // Pagination Logic
  const effectivePageSize = pageSize === 'all' ? (filteredListings.length || 1) : Number(pageSize);
  const totalPages = Math.ceil(filteredListings.length / effectivePageSize) || 1;
  
  const paginatedListings = useMemo(() => {
    if (pageSize === 'all') return filteredListings;
    const start = (currentPage - 1) * effectivePageSize;
    return filteredListings.slice(start, start + effectivePageSize);
  }, [filteredListings, currentPage, effectivePageSize, pageSize]);

  const selectedAmenitiesList = useMemo(() => {
    return form.amenities
      ? form.amenities.split(',').map((a) => a.trim()).filter(Boolean)
      : [];
  }, [form.amenities]);

  const isCommercialOrPlot = ['Office', 'Plot', 'Shop'].includes(form.propertyCategory);

  // Pure Pill Segment Group Component
  const renderRadioGroup = (label, name, options, currentValue) => (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
        <i className="fa-solid fa-list text-amber-400 text-[10px]" />
        <span>{label}</span>
      </label>
      <div className="flex flex-wrap gap-2.5">
        {options.map((opt) => {
          const val = typeof opt === 'string' ? opt : opt.value;
          const displayLabel = typeof opt === 'string' ? opt : opt.label;
          const icon = typeof opt === 'object' ? opt.icon : null;
          const isSelected = currentValue === val;
          return (
            <button
              key={val}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, [name]: val }))}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer border flex items-center gap-2 select-none ${
                isSelected
                  ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-slate-950 border-amber-300 shadow-lg shadow-orange-500/25 scale-[1.02]'
                  : 'bg-slate-950/80 text-slate-300 border-slate-800/90 hover:border-slate-700 hover:text-white hover:bg-slate-900/70'
              }`}
            >
              {icon && <i className={`fa-solid ${icon} text-xs ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />}
              <span>{displayLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060912] text-slate-100 text-xs leading-relaxed font-sans">
      
      {/* Property Slide-Over Detail Drawer */}
      {viewingProperty && (
        <PropertyDetailDrawer
          listing={viewingProperty}
          onClose={() => setViewingProperty(null)}
          onEdit={startEdit}
        />
      )}

      {/* Executive Dark Glass Header */}
      <header className="sticky top-0 z-30 border-b border-slate-800/90 bg-slate-950/95 backdrop-blur-xl px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center group">
            <img
              src="/assets/img/logo.svg"
              alt="Logo"
              className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <div className="hidden sm:flex items-center gap-2 border-l border-slate-800 pl-3">
            <span className="rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-inner">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <i className="fa-solid fa-user-tie text-[10px]" /> Salesman Workspace — {auth?.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { clearAuth(); navigate('/salesman/login'); }}
            className="text-xs font-bold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <i className="fa-solid fa-right-from-bracket text-xs" /> Logout
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-65px)]">
        
        {/* Left Navigation Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800/80 bg-slate-950 p-4 space-y-5">
          
          <div className="space-y-2">
            <button
              onClick={() => { resetForm(); setView('add'); }}
              className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-xs font-bold transition-all cursor-pointer ${
                view === 'add'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-xl shadow-orange-500/20 scale-[1.01]'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white border border-transparent'
              }`}
            >
              <i className="fa-solid fa-square-plus text-sm w-5 text-center" />
              <span>{editingId ? 'Edit Property' : 'Add Property'}</span>
            </button>

            <button
              onClick={() => setView('list')}
              className={`w-full flex items-center justify-between rounded-2xl px-4 py-3.5 text-xs font-bold transition-all cursor-pointer ${
                view === 'list'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-xl shadow-orange-500/20 scale-[1.01]'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white border border-transparent'
              }`}
            >
              <span className="flex items-center gap-3">
                <i className="fa-solid fa-building text-sm w-5 text-center" />
                <span>My Listings</span>
              </span>
              <span className="text-[11px] font-black bg-slate-950/80 px-2.5 py-0.5 rounded-full border border-slate-800">
                {stats.total}
              </span>
            </button>

            <button
              onClick={() => setView('leads')}
              className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-xs font-bold transition-all cursor-pointer ${
                view === 'leads'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-xl shadow-orange-500/20 scale-[1.01]'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white border border-transparent'
              }`}
            >
              <i className="fa-solid fa-users text-sm w-5 text-center" />
              <span>Investment Leads</span>
            </button>
          </div>

          {/* Inventory Analytics Box */}
          <div className="rounded-3xl border border-slate-800/90 bg-slate-900/60 p-4 space-y-3 shadow-xl backdrop-blur-lg">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <i className="fa-solid fa-chart-line text-amber-400 text-xs" /> Inventory Metrics
            </h4>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between items-center bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800/60">
                <span className="text-slate-400 font-medium">Available</span>
                <span className="text-emerald-400 font-black">{stats.available}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800/60">
                <span className="text-slate-400 font-medium">For Rent</span>
                <span className="text-blue-400 font-black">{stats.rent}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800/60">
                <span className="text-slate-400 font-medium">Plots</span>
                <span className="text-amber-400 font-black">{stats.plots}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800/60">
                <span className="text-slate-400 font-medium">Commercial</span>
                <span className="text-purple-400 font-black">{stats.commercial}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Workspace Pane */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Status Message Banner */}
          {status && (
            <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-4 text-xs font-semibold text-orange-200 flex items-center justify-between shadow-xl backdrop-blur-md">
              <span className="flex items-center gap-2.5">
                <i className="fa-solid fa-circle-info text-orange-400 text-sm" />
                <span>{status}</span>
              </span>
              <button
                onClick={() => setStatus('')}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-xs" />
              </button>
            </div>
          )}

          {/* VIEW: Leads Panel */}
          {view === 'leads' ? (
            <AssignedLeadsPanel />
          ) : view === 'add' ? (

            /* VIEW: Add / Edit Property Form (Ultra Compact Edition - 50% Less Space) */
            <form onSubmit={submit} className="space-y-4 max-w-5xl">
              
              {/* TOP SECTION: Primary Owner & Property Specifications Card */}
              <div className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-4 sm:p-5 space-y-4 shadow-xl backdrop-blur-2xl relative overflow-hidden">
                
                {/* Section Header */}
                <div className="border-b border-slate-800/80 pb-2.5 flex items-center justify-between">
                  <h2 className="text-sm font-black text-white flex items-center gap-2">
                    <i className="fa-solid fa-user-shield text-amber-400 text-sm" />
                    <span>Owner & Primary Property Details</span>
                  </h2>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                    PRIMARY SPECS
                  </span>
                </div>

                {/* Sub-Header Selection Controls (Left: For Rent/Sale | Right: RK/HK/Office/Shop/Plot) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-dashed border-slate-800/90">
                  {/* Left Side: For Rent / For Sale */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800/90 shadow-inner w-fit">
                    {[
                      { id: 'rent', label: 'For Rent', icon: 'fa-key' },
                      { id: 'buy', label: 'For Sale', icon: 'fa-tag' },
                    ].map((t) => {
                      const isSelected = form.listingType === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, listingType: t.id }))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? t.id === 'rent'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                                : 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <i className={`fa-solid ${t.icon} text-[10px]`} />
                          <span>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Side: Property Category (RK, HK, Office, Shop, Plot) */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800/90 shadow-inner shrink-0 w-fit">
                    {[
                      { id: "RK", label: "RK", icon: "fa-bed", defaultConfig: "1 RK" },
                      { id: "HK", label: "HK", icon: "fa-house", defaultConfig: "2 BHK" },
                      { id: "Office", label: "Office", icon: "fa-building", defaultConfig: "Commercial Office" },
                      { id: "Shop", label: "Shop", icon: "fa-store", defaultConfig: "Retail Shop" },
                      { id: "Plot", label: "Plot", icon: "fa-vector-square", defaultConfig: "Plot" },
                    ].map((cat) => {
                      const isSelected = form.propertyCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              propertyCategory: cat.id,
                              configuration: cat.id === 'HK'
                                ? (prev.configuration?.includes('BHK') ? prev.configuration : '2 BHK')
                                : cat.defaultConfig,
                            }));
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-sm"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <i className={`fa-solid ${cat.icon} text-[10px]`} />
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* BHK Configuration Sub-Selection (Shown when HK is selected) */}
                {form.propertyCategory === 'HK' && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 space-y-2 pb-3 border-b border-dashed border-slate-800/90">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <i className="fa-solid fa-house-user text-amber-400" />
                        <span>Select HK / BHK Configuration *</span>
                      </label>
                      <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                        {form.configuration || '2 BHK'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK'].map((bhk) => {
                        const isSelected = form.configuration === bhk || (!form.configuration && bhk === '2 BHK');
                        return (
                          <button
                            key={bhk}
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, configuration: bhk }))}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer border flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-slate-950 border-amber-300 shadow-sm'
                                : 'bg-slate-950 text-slate-300 border-slate-800/90 hover:border-slate-700 hover:text-white'
                            }`}
                          >
                            <i className="fa-solid fa-bed text-[10px]" />
                            <span>{bhk}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Form Fields Stack */}
                <div className="space-y-3.5">
                  
                  {/* Row 1: Owner Name & Owner Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pb-3 border-b border-dashed border-slate-800/90">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                        Owner Name *
                      </label>
                      <div className="relative rounded-xl bg-slate-950/80 border border-slate-800/90 focus-within:border-amber-500/80">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-amber-400">
                          <i className="fa-solid fa-user text-[11px]" />
                        </div>
                        <input
                          name="ownerName"
                          value={form.ownerName}
                          onChange={change}
                          placeholder="e.g. Ramesh Verma"
                          className="w-full bg-transparent pl-8 pr-3 py-2 text-xs text-white placeholder:text-slate-600 outline-none font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                        Owner Contact Number *
                      </label>
                      <div className="relative rounded-xl bg-slate-950/80 border border-slate-800/90 focus-within:border-amber-500/80">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-emerald-400">
                          <i className="fa-solid fa-phone text-[11px]" />
                        </div>
                        <input
                          type="tel"
                          name="ownerContact"
                          value={form.ownerContact}
                          onChange={change}
                          placeholder="e.g. 9876543210"
                          className="w-full bg-transparent pl-8 pr-3 py-2 text-xs text-white placeholder:text-slate-600 outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Furnishing Status & Floor Level (Hidden for Plot selection) */}
                  {form.propertyCategory !== 'Plot' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 pb-3 border-b border-dashed border-slate-800/90">
                      <div>
                        {renderRadioGroup(
                          "Furnishing Status",
                          "furnishingStatus",
                          [
                            { value: "Unfurnished", label: "Unfurnished", icon: "fa-couch" },
                            { value: "Semi-Furnished", label: "Semi-Furnished", icon: "fa-box-open" },
                            { value: "Furnished", label: "Furnished", icon: "fa-chair" }
                          ],
                          form.furnishingStatus
                        )}
                      </div>

                      <div>
                        {renderRadioGroup(
                          "Floor Level",
                          "floor",
                          [
                            { value: "Ground Floor", label: "Ground", icon: "fa-layer-group" },
                            { value: "1st Floor", label: "1st", icon: "fa-stairs" },
                            { value: "2nd Floor", label: "2nd", icon: "fa-stairs" },
                            { value: "3rd Floor", label: "3rd", icon: "fa-stairs" },
                            { value: "4th+ Floor", label: "4th+", icon: "fa-building" }
                          ],
                          form.floor
                        )}
                      </div>
                    </div>
                  )}

                  {/* Row 3: Complete Address */}
                  <div className="pb-3 border-b border-dashed border-slate-800/90">
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                      Complete Address *
                    </label>
                    <div className="relative rounded-xl bg-slate-950/80 border border-slate-800/90 focus-within:border-amber-500/80">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-orange-400">
                        <i className="fa-solid fa-map-location-dot text-[11px]" />
                      </div>
                      <input
                        required
                        name="completeAddress"
                        value={form.completeAddress}
                        onChange={(e) => {
                          change(e);
                          if (!form.location) setForm((prev) => ({ ...prev, location: e.target.value }));
                        }}
                        placeholder="e.g. Plot No. 42, Main Road, Sector 12, Dwarka, New Delhi - 110075"
                        className="w-full bg-transparent pl-8 pr-3 py-2 text-xs text-white placeholder:text-slate-600 outline-none font-medium"
                      />
                    </div>
                  </div>

                  {/* Row 4: Google Map Coordinates & Commission (Side by Side!) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pb-3 border-b border-dashed border-slate-800/90">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                        Latitude
                      </label>
                      <input
                        name="latitude"
                        value={form.latitude}
                        onChange={change}
                        placeholder="e.g. 28.6139"
                        className="w-full rounded-xl bg-slate-950/80 border border-slate-800/90 px-3 py-2 text-xs text-white placeholder:text-slate-600 outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                        Longitude
                      </label>
                      <input
                        name="longitude"
                        value={form.longitude}
                        onChange={change}
                        placeholder="e.g. 77.2090"
                        className="w-full rounded-xl bg-slate-950/80 border border-slate-800/90 px-3 py-2 text-xs text-white placeholder:text-slate-600 outline-none font-mono"
                      />
                    </div>

                    <div>
                      {renderRadioGroup(
                        "Commission Terms",
                        "commission",
                        [
                          { value: "YES", label: "Yes", icon: "fa-circle-check" },
                          { value: "NO", label: "No", icon: "fa-circle-xmark" }
                        ],
                        form.commission
                      )}
                    </div>
                  </div>

                  {/* Row 5: Special Instructions */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                      Special Instructions (Internal Broker Notes)
                    </label>
                    <input
                      name="specialInstructions"
                      value={form.specialInstructions}
                      onChange={change}
                      placeholder="e.g. Keys are available at the site office. Direct owner deal."
                      className="w-full rounded-xl border border-slate-800/90 bg-slate-950/80 px-3 py-2 text-xs text-white placeholder:text-slate-600 outline-none font-medium"
                    />
                  </div>

                </div>

                {/* CONDITIONAL PRICE & NET PROFIT VIEW (ONLY for Office, Plot, and Shop selection!) */}
                {isCommercialOrPlot && (
                  <div className="rounded-xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-slate-950/90 to-teal-500/5 p-3.5 space-y-2 mt-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                        <i className="fa-solid fa-coins text-xs" />
                        <span>Commercial & Plot Financial Metrics</span>
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-200 mb-1 uppercase tracking-wider">
                          Total Property Price (₹) *
                        </label>
                        <div className="relative rounded-xl bg-slate-950 border border-emerald-500/40">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-400 font-black text-xs">
                            ₹
                          </div>
                          <input
                            required
                            type="number"
                            name="salePrice"
                            value={form.salePrice}
                            onChange={change}
                            placeholder="e.g. 5000000"
                            className="w-full bg-transparent pl-7 pr-3 py-2 text-xs font-black text-white outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-200 mb-1 uppercase tracking-wider">
                          Net Profit (₹) *
                        </label>
                        <div className="relative rounded-xl bg-slate-950 border border-emerald-500/40">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-400 font-black text-xs">
                            ₹
                          </div>
                          <input
                            type="number"
                            name="netProfit"
                            value={form.netProfit}
                            onChange={change}
                            placeholder="e.g. 250000"
                            className="w-full bg-transparent pl-7 pr-3 py-2 text-xs font-black text-amber-300 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Form Section 2: Secondary Specifications Card */}
              <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-4 sm:p-5 space-y-4 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <h2 className="text-xs font-black uppercase text-white flex items-center gap-2">
                    <i className="fa-solid fa-sliders text-orange-400 text-xs" />
                    <span>Additional Specifications & Media</span>
                  </h2>
                </div>

                <div className="space-y-3.5">
                  
                  {/* Title Banner & Size Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pb-3 border-b border-dashed border-slate-800/90">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                        Title Banner (Optional)
                      </label>
                      <input
                        name="title"
                        value={form.title}
                        onChange={change}
                        placeholder="e.g. Commercial Plot near Highway / 2BHK Floor"
                        className="w-full rounded-xl border border-slate-800/90 bg-slate-950/80 px-3 py-2 text-xs text-white placeholder:text-slate-600 outline-none font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                        Size (sqft / sq yards)
                      </label>
                      <input
                        name="sizeSqft"
                        value={form.sizeSqft}
                        onChange={change}
                        placeholder="e.g. 1200 sqft"
                        className="w-full rounded-xl border border-slate-800/90 bg-slate-950/80 px-3 py-2 text-xs text-white placeholder:text-slate-600 outline-none font-medium"
                      />
                    </div>
                  </div>

                  {/* Lift, Possession & Parking (3 Column Grid!) */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 pb-3 border-b border-dashed border-slate-800/90">
                    <div>
                      {renderRadioGroup(
                        "Lift Availability",
                        "lift",
                        [
                          { value: "YES", label: "Lift", icon: "fa-elevator" },
                          { value: "NO", label: "No Lift", icon: "fa-ban" }
                        ],
                        form.lift
                      )}
                    </div>

                    <div>
                      {renderRadioGroup(
                        "Possession Status",
                        "possessionStatus",
                        [
                          { value: "Ready to Move", label: "Ready", icon: "fa-truck-ramp-box" },
                          { value: "Under Construction", label: "Under Const.", icon: "fa-helmet-safety" },
                          { value: "Immediate Plot Transfer", label: "Plot Transfer", icon: "fa-file-signature" }
                        ],
                        form.possessionStatus
                      )}
                    </div>

                    <div>
                      {renderRadioGroup(
                        "Parking Availability",
                        "parking",
                        [
                          { value: "Car + Bike Parking", label: "Car+Bike", icon: "fa-square-parking" },
                          { value: "Bike Only", label: "Bike", icon: "fa-motorcycle" },
                          { value: "Car Only", label: "Car", icon: "fa-car" },
                          { value: "No Parking", label: "None", icon: "fa-circle-xmark" }
                        ],
                        form.parking
                      )}
                    </div>
                  </div>

                  {/* Facing Direction, Construction Year & RERA (3 Column Grid!) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pb-3 border-b border-dashed border-slate-800/90">
                    <div>
                      {renderRadioGroup(
                        "Facing Direction",
                        "facing",
                        [
                          { value: "North-East", label: "NE", icon: "fa-compass" },
                          { value: "North", label: "N", icon: "fa-compass" },
                          { value: "East", label: "E", icon: "fa-compass" },
                          { value: "South-East", label: "SE", icon: "fa-compass" },
                          { value: "South", label: "S", icon: "fa-compass" },
                          { value: "West", label: "W", icon: "fa-compass" }
                        ],
                        form.facing
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                        Construction Year
                      </label>
                      <input
                        name="constructionYear"
                        value={form.constructionYear}
                        onChange={change}
                        placeholder="e.g. 2023"
                        className="w-full rounded-xl border border-slate-800/90 bg-slate-950/80 px-3 py-2 text-xs text-white placeholder:text-slate-600 outline-none font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                        RERA Registration ID
                      </label>
                      <input
                        name="reraId"
                        value={form.reraId}
                        onChange={change}
                        placeholder="e.g. RERA Not Applicable"
                        className="w-full rounded-xl border border-slate-800/90 bg-slate-950/80 px-3 py-2 text-xs text-white placeholder:text-slate-600 outline-none font-medium"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Form Section 3: Standard Rent vs Sale Pricing Terms (if not in Office/Plot/Shop mode) */}
              {!isCommercialOrPlot && (
                form.listingType === 'rent' ? (
                  <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-slate-950/90 to-indigo-500/5 p-4 space-y-3 shadow-xl backdrop-blur-xl">
                    <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                      <i className="fa-solid fa-key text-xs" /> Rent Financial Terms
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          Monthly Rent (₹) *
                        </label>
                        <input
                          required
                          type="number"
                          name="monthlyRent"
                          value={form.monthlyRent}
                          onChange={change}
                          placeholder="e.g. 18000"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white outline-none font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          Security Deposit (₹)
                        </label>
                        <input
                          type="number"
                          name="securityDeposit"
                          value={form.securityDeposit}
                          onChange={change}
                          placeholder="e.g. 36000"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white outline-none font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          Maintenance (₹/month)
                        </label>
                        <input
                          type="number"
                          name="maintenanceCharge"
                          value={form.maintenanceCharge}
                          onChange={change}
                          placeholder="e.g. 1500"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white outline-none font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          Available From
                        </label>
                        <input
                          name="availableFrom"
                          value={form.availableFrom}
                          onChange={change}
                          placeholder="e.g. Immediate"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white outline-none font-bold"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-slate-950/90 to-amber-500/5 p-4 space-y-3 shadow-xl backdrop-blur-xl">
                    <h3 className="text-xs font-black uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                      <i className="fa-solid fa-tag text-xs" /> Sale Financial Terms
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          Sale Price (₹) *
                        </label>
                        <input
                          required
                          type="number"
                          name="salePrice"
                          value={form.salePrice}
                          onChange={change}
                          placeholder="e.g. 8500000"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white outline-none font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          Price per Sqft (₹)
                        </label>
                        <input
                          type="number"
                          name="pricePerSqft"
                          value={form.pricePerSqft}
                          onChange={change}
                          placeholder="e.g. 9444"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white outline-none font-bold"
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer pt-0.5">
                      <input
                        type="checkbox"
                        name="priceNegotiable"
                        checked={form.priceNegotiable}
                        onChange={change}
                        className="h-3.5 w-3.5 rounded border-slate-800 accent-[#f68122]"
                      />
                      <span>Price is negotiable</span>
                    </label>
                  </div>
                )
              )}

              {/* Form Section 4: Amenities Chips & Media Uploads */}
              <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-4 sm:p-5 space-y-4 shadow-xl backdrop-blur-xl">
                
                {/* Amenities Chip Picker */}
                <div className="pb-3 border-b border-dashed border-slate-800/90 space-y-2">
                  <label className="block text-[11px] font-bold text-slate-300">
                    Amenities (Click to toggle)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_AMENITIES.map((am) => {
                      const isSelected = selectedAmenitiesList.includes(am);
                      return (
                        <button
                          key={am}
                          type="button"
                          onClick={() => toggleQuickAmenity(am)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                              : 'bg-slate-950 text-slate-400 border-slate-800/80 hover:text-white'
                          }`}
                        >
                          {isSelected && <i className="fa-solid fa-check text-emerald-400 text-[10px]" />}
                          <span>{am}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Description & Media Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={change}
                      rows="2"
                      placeholder="Provide details about condition, nearby landmarks, and key highlights..."
                      className="w-full rounded-xl border border-slate-800/90 bg-slate-950/80 p-2.5 text-xs text-white outline-none leading-relaxed font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Cover Photo & Gallery
                      </label>
                      <span className="text-[10px] text-slate-400">
                        {form.images?.length || 0} gallery images attached
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverImage}
                          className="w-full text-[10px] text-slate-400 file:mr-2 file:rounded-xl file:border-0 file:bg-orange-500/20 file:text-orange-400 file:px-2.5 file:py-1 file:font-bold hover:file:bg-orange-500/30 cursor-pointer"
                        />
                        {form.coverImage && (
                          <div className="relative mt-1 rounded-xl overflow-hidden border border-slate-800 h-14 w-full bg-slate-950">
                            <img src={form.coverImage} alt="Cover Preview" loading="lazy" className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setForm((prev) => ({ ...prev, coverImage: '' }))}
                              className="absolute top-1 right-1 rounded-full bg-red-600/80 hover:bg-red-600 text-white h-4 w-4 flex items-center justify-center text-[9px] cursor-pointer"
                            >
                              <i className="fa-solid fa-xmark" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleGalleryImages}
                          className="w-full text-[10px] text-slate-400 file:mr-2 file:rounded-xl file:border-0 file:bg-orange-500/20 file:text-orange-400 file:px-2.5 file:py-1 file:font-bold hover:file:bg-orange-500/30 cursor-pointer"
                        />
                        {form.images?.length > 0 && (
                          <div className="flex gap-1 mt-1 overflow-x-auto p-0.5">
                            {form.images.map((img, idx) => (
                              <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-800 h-10 w-10 shrink-0 bg-slate-950 group">
                                <img src={img} alt={`Gallery ${idx}`} loading="lazy" className="h-full w-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => removeGalleryImage(idx)}
                                  className="absolute top-0.5 right-0.5 rounded-full bg-red-600/80 hover:bg-red-600 text-white h-3.5 w-3.5 flex items-center justify-center text-[8px] cursor-pointer"
                                >
                                  <i className="fa-solid fa-xmark" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Form Action Controls */}
              <div className="flex items-center gap-4 pt-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-9 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-xs font-black uppercase tracking-wider text-slate-950 shadow-xl shadow-orange-500/25 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center gap-2.5"
                >
                  {saving ? (
                    <>
                      <i className="fa-solid fa-circle-notch fa-spin text-sm" />
                      <span>Saving Property...</span>
                    </>
                  ) : (
                    <>
                      <span>{editingId ? 'Update Property' : 'Submit Property Listing'}</span>
                      <i className="fa-solid fa-check text-xs" />
                    </>
                  )}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-4 rounded-2xl border border-slate-800 bg-slate-950 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

            </form>

          ) : loading ? (

            /* Loading State */
            <div className="py-24 text-center text-slate-400 space-y-3">
              <i className="fa-solid fa-circle-notch fa-spin text-3xl text-orange-500 block" />
              <p className="text-xs font-bold">Loading property database...</p>
            </div>

          ) : listings.length === 0 ? (

            /* Empty Listings State */
            <div className="py-20 text-center text-slate-400 space-y-4 rounded-3xl border border-slate-800/80 bg-slate-900/40 p-8 max-w-xl mx-auto backdrop-blur-xl">
              <div className="h-16 w-16 rounded-2xl border border-slate-800 bg-slate-950 flex items-center justify-center text-slate-600 mx-auto text-2xl shadow-inner">
                <i className="fa-solid fa-building-circle-xmark" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">No Property Listings Submitted Yet</h3>
                <p className="text-xs text-slate-400 mt-1">Start by submitting your first property listing using the form.</p>
              </div>
              <button
                onClick={() => { resetForm(); setView('add'); }}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-xs font-bold text-slate-950 cursor-pointer shadow-lg"
              >
                + Add First Property Listing
              </button>
            </div>

          ) : (

            /* High-Volume Inventory View */
            <div className="space-y-6">
              
              {/* Header Desk */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800/90 p-5 rounded-3xl backdrop-blur-xl shadow-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <h2 className="text-base font-black text-white flex items-center gap-2">
                      <i className="fa-solid fa-building text-orange-400 text-sm" />
                      <span>My Submitted Inventory</span>
                    </h2>
                    <span className="text-xs font-black bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-0.5 rounded-full">
                      {filteredListings.length} of {listings.length} Listings
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">High-efficiency search, filter & view property details desk.</p>
                </div>

                {/* Integrated Search Input Bar (Half Width) */}
                <div className="w-full md:w-1/2 max-w-xs relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <i className="fa-solid fa-magnifying-glass text-xs" />
                  </div>
                  <input
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Search inventory..."
                    className="w-full rounded-2xl border border-slate-800/90 bg-slate-950/80 pl-9 pr-9 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-orange-500/80 focus:ring-2 focus:ring-orange-500/20 font-medium transition shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                    >
                      <i className="fa-solid fa-circle-xmark text-xs" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800">
                    <button
                      onClick={() => setLayoutMode('grid')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        layoutMode === 'grid'
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Grid Card View"
                    >
                      <i className="fa-solid fa-border-all text-xs" />
                      <span>Grid</span>
                    </button>
                    <button
                      onClick={() => setLayoutMode('table')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        layoutMode === 'table'
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Compact Table List View (100+ items scan)"
                    >
                      <i className="fa-solid fa-list text-xs" />
                      <span>Table</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Multi-Filter Desk */}
              <div className="rounded-3xl border border-slate-800/90 bg-slate-900/60 p-4 shadow-xl backdrop-blur-xl">
                
                {/* Filter Controls Row */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  
                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">Type:</span>
                    {['all', 'RK', 'HK', 'Office', 'Shop', 'Plot'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { setFilterCategory(cat); setCurrentPage(1); }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                          filterCategory === cat
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                            : 'bg-slate-950 text-slate-400 border-slate-800/80 hover:text-white'
                        }`}
                      >
                        {cat === 'all' ? 'All Types' : cat}
                      </button>
                    ))}
                  </div>

                  {/* Listing Mode Pills */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">Mode:</span>
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'rent', label: 'Rent' },
                      { id: 'buy', label: 'Sale' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => { setFilterType(m.id); setCurrentPage(1); }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                          filterType === m.id
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-sm'
                            : 'bg-slate-950 text-slate-400 border-slate-800/80 hover:text-white'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {/* Deal Status Pills */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">Status:</span>
                    {['all', 'available', 'rented', 'sold'].map((st) => (
                      <button
                        key={st}
                        onClick={() => { setFilterStatus(st); setCurrentPage(1); }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border capitalize ${
                          filterStatus === st
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                            : 'bg-slate-950 text-slate-400 border-slate-800/80 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                </div>

              </div>

              {/* Content View */}
              {filteredListings.length === 0 ? (

                <div className="py-16 text-center text-slate-400 space-y-3 rounded-3xl border border-slate-800/80 bg-slate-900/40 p-8 backdrop-blur-xl">
                  <i className="fa-solid fa-magnifying-glass text-3xl text-slate-600 block" />
                  <h3 className="text-sm font-bold text-white">No Matching Properties Found</h3>
                  <p className="text-xs text-slate-400">Try adjusting your search query or filter selections.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterCategory('all');
                      setFilterType('all');
                      setFilterStatus('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>

              ) : layoutMode === 'grid' ? (

                /* GRID CARD VIEW */
                <div className="space-y-6">
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {paginatedListings.map((listing) => (
                      <ListingCard
                        key={listing._id}
                        listing={listing}
                        onView={(item) => setViewingProperty(item)}
                        onEdit={startEdit}
                        onDelete={deleteListing}
                      />
                    ))}
                  </div>
                </div>

              ) : (

                /* COMPACT EXECUTIVE TABLE VIEW */
                <div className="rounded-3xl border border-slate-800/90 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-950/80 text-[10px] font-black uppercase tracking-wider text-slate-400">
                          <th className="py-4 px-4">Property & Address</th>
                          <th className="py-4 px-4">Category / Type</th>
                          <th className="py-4 px-4">Price & Profit</th>
                          <th className="py-4 px-4">Owner Contact</th>
                          <th className="py-4 px-4">Status</th>
                          <th className="py-4 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-xs">
                        {paginatedListings.map((item) => {
                          const priceText = item.listingType === 'rent' && item.monthlyRent
                            ? `${formatINR(item.monthlyRent)} / mo`
                            : formatINR(item.salePrice);

                          const hasOwner = Boolean(item.ownerName?.trim() || item.ownerContact?.trim());

                          return (
                            <tr key={item._id} className="hover:bg-slate-950/60 transition-colors group">
                              
                              {/* Property Title & Address */}
                              <td className="py-3.5 px-4 max-w-xs cursor-pointer" onClick={() => setViewingProperty(item)}>
                                <div className="font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 flex items-center gap-1.5">
                                  <span>{item.title || item.configuration || `${item.propertyCategory} Property`}</span>
                                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-amber-400 opacity-0 group-hover:opacity-100 transition" />
                                </div>
                                <div className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                                  <i className="fa-solid fa-location-dot text-orange-400 text-[10px] shrink-0" />
                                  <span className="truncate">{item.completeAddress || item.location}</span>
                                </div>
                              </td>

                              {/* Category & Mode */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                  <span className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    {item.propertyCategory}
                                  </span>
                                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${item.listingType === 'rent' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-orange-500/20 text-orange-300 border-orange-500/30'}`}>
                                    {item.listingType === 'rent' ? 'Rent' : 'Sale'}
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-400 mt-1">
                                  Config: {item.configuration || 'N/A'} | {item.furnishingStatus || 'Unfurnished'}
                                </div>
                              </td>

                              {/* Price & Profit */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <div className="font-black text-amber-300">{priceText}</div>
                                {Number(item.netProfit) > 0 && (
                                  <div className="text-[10px] font-bold text-emerald-400 mt-0.5">
                                    Profit: {formatINR(item.netProfit)}
                                  </div>
                                )}
                              </td>

                              {/* Owner Info (ONLY RENDERED IF DETAILS EXIST!) */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                {hasOwner ? (
                                  <>
                                    <div className="font-semibold text-slate-200">{item.ownerName || 'Owner Info'}</div>
                                    {item.ownerContact && (
                                      <a href={`tel:${item.ownerContact}`} className="font-mono text-emerald-400 text-[11px] hover:underline flex items-center gap-1 mt-0.5">
                                        <i className="fa-solid fa-phone text-emerald-400 text-[10px]" />
                                        <span>{item.ownerContact}</span>
                                      </a>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-[10px] text-slate-600 font-medium italic">Unspecified</span>
                                )}
                              </td>

                              {/* Deal Status Switcher */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <select
                                  value={item.dealStatus}
                                  onChange={(e) => changeStatus(item._id, e.target.value)}
                                  className={`rounded-xl border px-2.5 py-1.5 text-xs font-bold outline-none cursor-pointer ${
                                    item.dealStatus === 'available'
                                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                      : item.dealStatus === 'rented'
                                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                      : 'bg-red-500/20 text-red-300 border-red-500/40'
                                  }`}
                                >
                                  <option value="available" className="bg-slate-950 text-white">Available</option>
                                  <option value="rented" className="bg-slate-950 text-white">Rented</option>
                                  <option value="sold" className="bg-slate-950 text-white">Sold</option>
                                </select>
                              </td>
                              {/* Actions */}
                              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => setViewingProperty(item)}
                                    className="p-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition cursor-pointer"
                                    title="View Property Details"
                                  >
                                    <i className="fa-solid fa-eye text-xs" />
                                  </button>
                                  <button
                                    onClick={() => startEdit(item)}
                                    className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteListing(item._id)}
                                    className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer"
                                    title="Delete Property Listing"
                                  >
                                    <i className="fa-solid fa-trash-can text-xs" />
                                  </button>
                                </div>
                              </td>

                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

              )}

              {/* High-Capacity Pagination Bar */}
              {filteredListings.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800/90 p-4 rounded-3xl backdrop-blur-xl">
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span>Showing {filteredListings.length > 0 ? (currentPage - 1) * (pageSize === 'all' ? filteredListings.length : Number(pageSize)) + 1 : 0} - {Math.min(currentPage * (pageSize === 'all' ? filteredListings.length : Number(pageSize)), filteredListings.length)} of {filteredListings.length} properties</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span>Per page:</span>
                      <select
                        value={pageSize}
                        onChange={(e) => { setPageSize(e.target.value === 'all' ? 'all' : Number(e.target.value)); setCurrentPage(1); }}
                        className="rounded-xl border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-200 outline-none cursor-pointer font-bold"
                      >
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                        <option value={48}>48</option>
                        <option value="all">All (100+)</option>
                      </select>
                    </div>

                    {pageSize !== 'all' && (
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={currentPage <= 1}
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950 text-xs font-bold text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                        >
                          <i className="fa-solid fa-chevron-left text-[10px]" /> Prev
                        </button>
                        <span className="text-xs font-mono font-bold text-amber-300 px-2">
                          {currentPage} / {totalPages}
                        </span>
                        <button
                          disabled={currentPage >= totalPages}
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950 text-xs font-bold text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                        >
                          Next <i className="fa-solid fa-chevron-right text-[10px]" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

          )}

        </main>
      </div>

    </div>
  );
}
