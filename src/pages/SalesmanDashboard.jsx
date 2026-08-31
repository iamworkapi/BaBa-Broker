import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/AuthContext';
import AssignedLeadsPanel from '../components/AssignedLeadsPanel';
import { Loader } from '../components/ui';

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
  // Primary Owner & Property Details
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
  listingType: 'buy', // 'buy' | 'rent'
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
  dealStatus: 'available', // 'available' | 'rented' | 'sold'
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
  if (num >= 10000000) {
    return `₹ ${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `₹ ${(num / 100000).toFixed(2)} Lakh`;
  }
  return '₹ ' + num.toLocaleString('en-IN');
};

const priceLabel = (listing) =>
  listing.listingType === 'rent' && listing.monthlyRent
    ? `${formatINR(listing.monthlyRent)} / mo`
    : formatINR(listing.salePrice);

// Slide-Over Property Detail Inspector Drawer
function PropertyDetailDrawer({ listing, onClose, onEdit }) {
  if (!listing) return null;

  const isCommercialOrPlot = ['Office', 'Plot', 'Shop'].includes(listing.propertyCategory);
  const hasOwnerInfo = Boolean(listing.ownerName?.trim() || listing.ownerContact?.trim());

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white shadow-2xl h-full flex flex-col justify-between overflow-y-auto text-slate-800 z-10 animate-in slide-in-from-right duration-300">
        <div>
          {/* Cover Photo */}
          <div className="relative h-60 w-full bg-slate-100 overflow-hidden">
            {listing.coverImage ? (
              <img src={listing.coverImage} alt={listing.title} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-400">
                <i className="ri-building-line text-6xl opacity-40" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <button
                onClick={() => { onClose(); onEdit(listing); }}
                className="px-3.5 py-1.5 rounded-xl bg-[#ea580c] text-white text-xs font-bold hover:brightness-110 shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <i className="ri-edit-line" /> Edit Listing
              </button>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center cursor-pointer shadow transition"
              >
                <i className="ri-close-line text-lg" />
              </button>
            </div>

            <div className="absolute bottom-4 left-5 right-5 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase bg-orange-500 text-white">
                  {listing.propertyCategory}
                </span>
                <span className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase bg-black/60 text-white backdrop-blur-md">
                  {listing.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                </span>
                <span className="text-xs font-black text-amber-300 ml-auto bg-black/70 px-2.5 py-0.5 rounded-md">
                  {priceLabel(listing)}
                </span>
              </div>
              <h2 className="text-base font-black text-white line-clamp-1">
                {listing.title || listing.configuration}
              </h2>
            </div>
          </div>

          {/* Quick Call & Owner Info */}
          {hasOwnerInfo && (
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Owner Contact Details</span>
                <span className="text-xs font-bold text-slate-900">{listing.ownerName || 'Direct Owner'} ({listing.ownerContact || 'N/A'})</span>
              </div>
              {listing.ownerContact && (
                <a
                  href={`tel:${listing.ownerContact}`}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                >
                  <i className="ri-phone-line" /> Call Owner
                </a>
              )}
            </div>
          )}

          {/* Specifications */}
          <div className="p-5 space-y-4 text-xs">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-1.5">
              <h4 className="text-[11px] font-extrabold uppercase text-slate-400">Complete Address & Location</h4>
              <p className="font-semibold text-slate-800 leading-relaxed">
                {listing.completeAddress || listing.location}
              </p>
              {(listing.latitude || listing.longitude) && (
                <div className="pt-2 border-t border-slate-200 font-mono text-orange-600 text-[11px] flex items-center gap-1">
                  <i className="ri-map-pin-2-line" /> GPS: {listing.latitude || 'N/A'}, {listing.longitude || 'N/A'}
                </div>
              )}
            </div>

            {isCommercialOrPlot && Number(listing.netProfit) > 0 && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">Commercial Net Profit</span>
                <p className="text-base font-black text-emerald-700">{formatINR(listing.netProfit)}</p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Configuration</span>
                <span className="text-xs font-bold text-slate-900">{listing.configuration || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Size (Sq.Ft)</span>
                <span className="text-xs font-bold text-slate-900">{listing.sizeSqft ? `${listing.sizeSqft} sqft` : 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Floor</span>
                <span className="text-xs font-bold text-slate-900">{listing.floor || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Furnishing</span>
                <span className="text-xs font-bold text-slate-900">{listing.furnishingStatus || 'Unfurnished'}</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Parking</span>
                <span className="text-xs font-bold text-slate-900">{listing.parking || 'Standard'}</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Commission</span>
                <span className="text-xs font-bold text-[#ea580c]">{listing.commission || 'YES'}</span>
              </div>
            </div>

            {listing.amenities && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-2">
                <h4 className="text-[11px] font-extrabold uppercase text-slate-400">Amenities & Highlights</h4>
                <div className="flex flex-wrap gap-1.5">
                  {listing.amenities.split(',').map((am, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-medium shadow-2xs">
                      ✓ {am.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {listing.description && (
              <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 space-y-1">
                <h4 className="text-[11px] font-extrabold uppercase text-slate-400">Description</h4>
                <p className="text-slate-600 leading-relaxed">{listing.description}</p>
              </div>
            )}

            {listing.specialInstructions && (
              <div className="p-4 rounded-2xl border border-orange-200 bg-orange-50/50 space-y-1">
                <h4 className="text-[11px] font-extrabold uppercase text-[#ea580c]">Internal Broker Notes</h4>
                <p className="text-slate-700 font-mono text-[11px]">{listing.specialInstructions}</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SalesmanDashboard() {
  const navigate = useNavigate();
  const { getAuth, clearAuth } = useAuthStore();
  const auth = getAuth();
  const [view, setView] = useState('add'); // 'add' | 'list' | 'leads' (Exact previous salesman navigation)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyFlatListing());
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [viewingProperty, setViewingProperty] = useState(null);
  const [searchVal, setSearchVal] = useState('');

  // High-Volume Listing Filters & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [layoutMode, setLayoutMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const salesmanName = auth?.name || 'Sales Team Member';

  const handleLogout = () => {
    clearAuth();
    navigate('/salesman/login');
  };

  const load = useCallback(async () => {
    try {
      const data = await api('/api/flat-listings');
      setListings(Array.isArray(data) ? data : []);
    } catch {
      // Fallback demo inventory for instant responsiveness
      setListings([
        {
          _id: 'demo-1',
          title: '3 BHK Luxury Sky Suite',
          location: 'DLF Phase 5, Gurgaon',
          configuration: '3 BHK',
          propertyCategory: 'HK',
          listingType: 'buy',
          salePrice: 28500000,
          sizeSqft: 2250,
          totalFloors: '22',
          floor: '14th Floor',
          furnishingStatus: 'Furnished',
          commission: 'YES',
          ownerName: 'Mr. Rajesh Mehra',
          ownerContact: '9891140379',
          completeAddress: 'Tower 4, DLF Phase 5, Golf Course Road, Gurgaon',
          amenities: 'Lift(s), 24x7 Security, Gated Community, Car & Bike Parking, Modular Kitchen',
          possessionStatus: 'Ready to Move',
          dealStatus: 'available',
          coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
        },
        {
          _id: 'demo-2',
          title: '2 BHK Modern Sunlit Apartment',
          location: 'Sector 62, Noida',
          configuration: '2 BHK',
          propertyCategory: 'HK',
          listingType: 'rent',
          monthlyRent: 38000,
          securityDeposit: 76000,
          maintenanceCharge: 2500,
          sizeSqft: 1350,
          floor: '7th Floor',
          furnishingStatus: 'Semi-Furnished',
          commission: 'YES',
          ownerName: 'Mrs. Sunita Verma',
          ownerContact: '9810022334',
          completeAddress: 'Flat 702, Express View Apartments, Sector 62, Noida',
          amenities: 'Lift(s), Power Backup, 24hr Water Supply, Private Balcony',
          possessionStatus: 'Immediate',
          dealStatus: 'available',
          coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
        },
        {
          _id: 'demo-3',
          title: 'Prime High-Street Retail Showroom',
          location: 'Golf Course Extension, Gurgaon',
          configuration: 'Commercial',
          propertyCategory: 'Shop',
          listingType: 'buy',
          salePrice: 45000000,
          netProfit: 450000,
          sizeSqft: 1800,
          floor: 'Ground Floor',
          furnishingStatus: 'Unfurnished',
          commission: 'YES',
          ownerName: 'Apex Commercials',
          ownerContact: '9891140379',
          completeAddress: 'Ground Floor, Galleria Plaza, Golf Course Ext, Gurgaon',
          amenities: '24x7 Security, Car & Bike Parking, Power Backup, CCTV Surveillance',
          possessionStatus: 'Ready to Move',
          dealStatus: 'available',
          coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Exact Previous Salesman Navigation
  const navItems = [
    { id: 'add', label: 'Add Property', icon: 'ri-add-circle-line', activeIcon: 'ri-add-circle-fill' },
    { id: 'list', label: 'My Listings', icon: 'ri-building-line', activeIcon: 'ri-building-fill' },
    { id: 'leads', label: 'Investment Leads', icon: 'ri-user-star-line', activeIcon: 'ri-user-star-fill' },
  ];

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      if (filterCategory !== 'all' && item.propertyCategory !== filterCategory) return false;
      if (filterType !== 'all' && item.listingType !== filterType) return false;
      if (searchQuery.trim() || searchVal.trim()) {
        const q = (searchQuery || searchVal).toLowerCase();
        const matches =
          item.location?.toLowerCase().includes(q) ||
          item.configuration?.toLowerCase().includes(q) ||
          item.title?.toLowerCase().includes(q) ||
          item.ownerName?.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [listings, filterCategory, filterType, searchQuery, searchVal]);

  const stats = useMemo(() => {
    const total = listings.length;
    const available = listings.filter((l) => l.dealStatus === 'available' || !l.dealStatus).length;
    const rent = listings.filter((l) => l.listingType === 'rent').length;
    const plots = listings.filter((l) => l.propertyCategory === 'Plot').length;
    const commercial = listings.filter((l) => l.propertyCategory === 'Office' || l.propertyCategory === 'Shop').length;
    return { total, available, rent, plots, commercial };
  }, [listings]);

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / (pageSize === 'all' ? filteredListings.length || 1 : Number(pageSize))));

  const paginatedListings = useMemo(() => {
    if (pageSize === 'all') return filteredListings;
    const start = (currentPage - 1) * Number(pageSize);
    return filteredListings.slice(start, start + Number(pageSize));
  }, [filteredListings, currentPage, pageSize]);

  const handleAmenityToggle = (amenity) => {
    const current = form.amenities ? form.amenities.split(',').map((a) => a.trim()).filter(Boolean) : [];
    const exists = current.includes(amenity);
    const updated = exists ? current.filter((a) => a !== amenity) : [...current, amenity];
    setForm((prev) => ({ ...prev, amenities: updated.join(', ') }));
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const b64 = await fileToBase64(file);
      setForm((prev) => ({ ...prev, coverImage: b64 }));
    } catch {
      setStatus('Failed to upload image file.');
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      const b64List = await Promise.all(files.map(fileToBase64));
      setForm((prev) => ({ ...prev, images: [...(prev.images || []), ...b64List] }));
    } catch {
      setStatus('Failed to upload gallery photos.');
    }
  };

  const handleSaveListing = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        setListings((prev) => prev.map((l) => (l._id === editingId ? { ...form, _id: editingId } : l)));
        setStatus('Property listing updated successfully!');
      } else {
        const newListing = { ...form, _id: 'list-' + Date.now(), dealStatus: 'available' };
        setListings((prev) => [newListing, ...prev]);
        setStatus('New flat listing onboarded successfully!');
      }
      setForm(emptyFlatListing());
      setEditingId(null);
      setView('list');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (listing) => {
    setForm(listing);
    setEditingId(listing._id);
    setView('add');
  };

  const deleteListing = (id) => {
    if (!window.confirm('Delete this listing from inventory?')) return;
    setListings((prev) => prev.filter((l) => l._id !== id));
    setStatus('Listing removed from inventory.');
  };

  const changeDealStatus = (id, newStatus) => {
    setListings((prev) =>
      prev.map((l) => (l._id === id ? { ...l, dealStatus: newStatus } : l))
    );
    setStatus(`Listing marked as ${newStatus}.`);
  };

  const generateWhatsAppPitchUrl = (listing, client = 'Client') => {
    const text = encodeURIComponent(
      `Hi ${client},\n\nCheck out this verified property option from Baba Broker Deal Desk:\n\n*${listing.title || listing.configuration}*\n📍 *Location*: ${listing.location}\n💰 *Price*: ${priceLabel(listing)}\n📐 *Size*: ${listing.sizeSqft || 'N/A'} Sq.Ft | ${listing.floor || 'Standard Floor'}\n✨ *Features*: ${listing.furnishingStatus || 'Unfurnished'}, ${listing.parking || 'Parking Included'}\n\nLet me know if you would like to schedule an on-site visit today!\n- *${salesmanName}*, Baba Broker`
    );
    return `https://wa.me/?text=${text}`;
  };

  return (
    <div className="h-screen w-screen bg-[#070e1c] p-2 sm:p-3.5 md:p-4 font-['Inter',sans-serif] text-slate-800 antialiased flex flex-col justify-center overflow-hidden select-text">
      
      {/* Toast Alert */}
      {status && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white text-emerald-800 shadow-xl p-4 animate-fadeIn">
          <i className="ri-checkbox-circle-fill text-emerald-600 text-xl" />
          <span className="text-xs font-bold">{status}</span>
          <button onClick={() => setStatus('')} className="text-slate-400 hover:text-slate-600 ml-2">
            <i className="ri-close-line text-base" />
          </button>
        </div>
      )}

      {/* Property Detail Drawer */}
      <PropertyDetailDrawer
        listing={viewingProperty}
        onClose={() => setViewingProperty(null)}
        onEdit={startEdit}
      />

      {/* Master Curved Card Container (Matching Admin Dashboard) */}
      <div className="w-full h-full rounded-2xl sm:rounded-[36px] md:rounded-[40px] shadow-2xl shadow-slate-950/70 overflow-hidden bg-white flex flex-col lg:flex-row border border-slate-800/30 relative">

        {/* Mobile Backdrop Overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 animate-fadeIn"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ─── LEFT SOLID ORANGE SIDEBAR WITH PREVIOUS NAV TABS & SIGNATURE NOTCH ─── */}
        <aside
          className={`fixed lg:static top-0 left-0 h-full w-72 sm:w-80 lg:w-56 bg-[#ea580c] text-white flex flex-col justify-between pl-3.5 py-3.5 pr-0 select-none shrink-0 overflow-y-auto font-['Inter',sans-serif] z-50 lg:z-20 shadow-2xl transition-transform duration-300 ease-in-out ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-4">
            {/* Logo & Mobile Close */}
            <div className="pr-3.5 flex items-center justify-between">
              <Link to="/" onClick={() => setMobileSidebarOpen(false)} className="flex items-center px-1 py-1 group">
                <img
                  src="/assets/img/logo.svg"
                  alt="Baba Broker"
                  className="h-8 sm:h-9 w-auto max-w-[170px] object-contain brightness-0 invert transition-all duration-300 group-hover:scale-105"
                />
              </Link>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="lg:hidden h-8 w-8 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer"
                title="Close Menu"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            {/* Navigation Items (Add Property, My Listings, Investment Leads) */}
            <nav className="space-y-2 pt-1 pr-0">
              {navItems.map((item) => {
                const isActive = view === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setView(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full group relative flex items-center justify-between text-xs cursor-pointer text-left transition-all duration-300 ${
                      isActive
                        ? 'bg-white text-[#ea580c] font-black pl-3 py-2.5 pr-4 rounded-l-2xl rounded-r-none shadow-[-6px_4px_20px_rgba(0,0,0,0.12)] z-10 -mr-[1px]'
                        : 'text-white/85 hover:text-white hover:bg-white/20 hover:backdrop-blur-sm px-3 py-2.5 rounded-xl mr-3.5 hover:translate-x-1 font-semibold'
                    }`}
                  >
                    {/* Seamless SVG Fillet Notch (Mathematically curves into the right white background) */}
                    {isActive && (
                      <>
                        <svg className="hidden sm:block absolute -top-3.5 right-0 w-3.5 h-3.5 pointer-events-none fill-white" viewBox="0 0 16 16">
                          <path d="M0,16 Q16,16 16,0 L16,16 Z" />
                        </svg>
                        <svg className="hidden sm:block absolute -bottom-3.5 right-0 w-3.5 h-3.5 pointer-events-none fill-white" viewBox="0 0 16 16">
                          <path d="M0,0 Q16,0 16,16 L16,0 Z" />
                        </svg>
                      </>
                    )}

                    <div className="flex items-center gap-2.5 min-w-0">
                      {isActive ? (
                        <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center text-xs shadow-xs shrink-0 ring-2 ring-orange-100/90">
                          <i className={item.activeIcon} />
                        </div>
                      ) : (
                        <i className={`${item.icon} text-base shrink-0 text-white/90 transition-transform duration-200 group-hover:scale-115`} />
                      )}
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.id === 'list' && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isActive ? 'bg-orange-100 text-orange-700' : 'bg-white/20 text-white'}`}>
                        {stats.total}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Metrics Box */}
          <div className="mr-3.5 my-3 rounded-2xl border border-white/20 bg-white/10 p-3.5 space-y-2 text-[11px] backdrop-blur-md shadow-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-white/90 block flex items-center gap-1.5">
              <i className="ri-dashboard-3-line text-white" /> Inventory Status
            </span>
            <div className="flex justify-between items-center text-white pt-1">
              <span className="opacity-80">Available:</span>
              <span className="font-bold bg-white/20 px-2 py-0.5 rounded-md">{stats.available}</span>
            </div>
            <div className="flex justify-between items-center text-white">
              <span className="opacity-80">Rentals:</span>
              <span className="font-bold bg-white/20 px-2 py-0.5 rounded-md">{stats.rent}</span>
            </div>
            <div className="flex justify-between items-center text-white">
              <span className="opacity-80">Commercial:</span>
              <span className="font-bold bg-white/20 px-2 py-0.5 rounded-md">{stats.commercial}</span>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="pt-3 pr-3.5 mt-auto border-t border-white/20 text-center select-none">
            <p className="text-[10px] text-white/85 font-normal leading-tight">
              Made with <span className="text-red-200">❤️</span> by <span className="font-semibold text-white tracking-wide">OrrishItSolutions</span>
            </p>
          </div>
        </aside>

        {/* ─── RIGHT CANVAS: HEADER, MAIN WORKSPACE, FIXED FOOTER ─── */}
        <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden bg-white">
          
          {/* Top Sticky Header */}
          <header className="px-3 sm:px-7 py-2.5 border-b border-slate-100 flex items-center justify-between gap-2.5 sm:gap-4 font-['Inter',sans-serif] bg-white sticky top-0 z-30">
            {/* Left: Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen((prev) => !prev)}
              className="lg:hidden h-9 w-9 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 border border-orange-500/20 flex items-center justify-center cursor-pointer shrink-0 transition-all"
              title="Toggle Menu"
            >
              <i className="ri-menu-2-line text-lg font-bold"></i>
            </button>

            <div className="relative flex-1 max-w-xs">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search properties, leads..."
                className="w-full rounded-xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white pl-8 pr-7 py-1.5 text-xs text-slate-700 placeholder-slate-400 outline-none border border-slate-200/80 focus:border-orange-400 transition-all"
              />
              {searchVal && (
                <button onClick={() => setSearchVal('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <i className="ri-close-line text-xs" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-5 shrink-0">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <span className="text-xs font-medium text-slate-800 hidden sm:inline">{salesmanName}</span>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
                    alt="User avatar"
                    className="h-8 w-8 rounded-full object-cover border border-orange-100 shadow-xs"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
              </div>

              <button
                type="button"
                className="relative text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer hidden sm:block"
                title="Notifications"
              >
                <i className="ri-notification-3-line text-lg" />
                <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-[#ea580c] ring-2 ring-white" />
              </button>

              <button
                onClick={handleLogout}
                className="h-8 w-8 sm:h-auto sm:w-auto rounded-lg sm:rounded-none bg-slate-50 sm:bg-transparent text-slate-400 hover:text-red-500 p-1 cursor-pointer flex items-center justify-center"
                title="Logout"
              >
                <i className="ri-logout-box-r-line text-base" />
              </button>
            </div>
          </header>

          {/* Main Scrollable Canvas */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 space-y-6">

            {/* ─── TAB 1: ADD / EDIT FLAT LISTING (NEXT-LEVEL UX & UI FORM) ─── */}
            {view === 'add' ? (
              <form onSubmit={handleSaveListing} className="space-y-6 max-w-5xl">
                
                {/* ─── CARD 1: PRIMARY OWNER & CATEGORY SPECS ─── */}
                <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 space-y-6 shadow-sm">
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-2xl bg-orange-50 text-[#ea580c] flex items-center justify-center font-black text-sm border border-orange-200/60 shadow-xs">
                        01
                      </div>
                      <div>
                        <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                          Owner & Property Classification
                        </h2>
                        <p className="text-xs text-slate-400 font-normal">Specify deal type, category, and direct owner contacts.</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#ea580c] bg-orange-50/80 border border-orange-200/80 px-3 py-1 rounded-full w-fit">
                      Primary Details
                    </span>
                  </div>

                  {/* 1.1 Deal Type & Property Category Visual Switchers */}
                  <div className="space-y-4 pt-1">
                    {/* Deal Type Switcher */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-2">Deal Intention</label>
                      <div className="grid grid-cols-2 gap-3 max-w-md">
                        {[
                          { id: 'buy', label: 'For Sale / Outright', icon: 'ri-price-tag-3-fill', desc: 'Direct property sale' },
                          { id: 'rent', label: 'For Rent / Lease', icon: 'ri-key-2-fill', desc: 'Monthly tenancy' },
                        ].map((t) => {
                          const isSelected = form.listingType === t.id;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setForm((prev) => ({ ...prev, listingType: t.id }))}
                              className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center gap-3 ${
                                isSelected
                                  ? t.id === 'buy'
                                    ? 'border-orange-500 bg-orange-50/60 text-[#ea580c] shadow-xs ring-2 ring-orange-500/20'
                                    : 'border-blue-500 bg-blue-50/60 text-blue-700 shadow-xs ring-2 ring-blue-500/20'
                                  : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100/70'
                              }`}
                            >
                              <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-sm shrink-0 ${isSelected ? (t.id === 'buy' ? 'bg-[#ea580c] text-white' : 'bg-blue-600 text-white') : 'bg-white text-slate-400 border border-slate-200'}`}>
                                <i className={t.icon} />
                              </div>
                              <div className="min-w-0">
                                <span className="text-xs font-black block truncate">{t.label}</span>
                                <span className="text-[10px] opacity-70 block">{t.desc}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Property Category 5-Card Grid */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-2">Property Category</label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        {[
                          { id: 'HK', label: 'Apartment (HK)', icon: 'ri-home-4-line', sub: 'Flats & Floors', defaultConfig: '2 BHK' },
                          { id: 'RK', label: 'Studio (RK)', icon: 'ri-hotel-bed-line', sub: '1 RK Units', defaultConfig: '1 RK' },
                          { id: 'Shop', label: 'Retail Shop', icon: 'ri-store-2-line', sub: 'Commercial Stores', defaultConfig: 'Retail Shop' },
                          { id: 'Office', label: 'Office Space', icon: 'ri-building-2-line', sub: 'Workstations', defaultConfig: 'Commercial Office' },
                          { id: 'Plot', label: 'Land / Plot', icon: 'ri-layout-grid-line', sub: 'Residential Land', defaultConfig: 'Residential Plot' },
                        ].map((cat) => {
                          const isSelected = form.propertyCategory === cat.id;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  propertyCategory: cat.id,
                                  configuration: cat.defaultConfig || prev.configuration,
                                }))
                              }
                              className={`p-3 rounded-2xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center gap-1.5 ${
                                isSelected
                                  ? 'border-[#ea580c] bg-orange-50/70 text-[#ea580c] shadow-xs ring-2 ring-orange-500/20 scale-[1.02]'
                                  : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100/70'
                              }`}
                            >
                              <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-sm ${isSelected ? 'bg-[#ea580c] text-white shadow-xs' : 'bg-white text-slate-500 border border-slate-200'}`}>
                                <i className={cat.icon} />
                              </div>
                              <div>
                                <span className="text-xs font-black block leading-tight">{cat.label}</span>
                                <span className="text-[10px] opacity-70 block">{cat.sub}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Apartment 5-BHK Quick Selection Panel (1 BHK, 2 BHK, 3 BHK, 4 BHK, 5 BHK) */}
                    {form.propertyCategory === 'HK' && (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-200/80 space-y-2.5 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                            <i className="ri-home-4-fill text-[#ea580c]" /> Select Apartment Layout:
                          </span>
                          <span className="text-[11px] font-extrabold text-[#ea580c] bg-orange-100/80 px-2.5 py-0.5 rounded-full">
                            Current: {form.configuration || '2 BHK'}
                          </span>
                        </div>
                        <div className="grid grid-cols-5 gap-2 pt-0.5">
                          {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK'].map((bhk) => {
                            const isBhkActive = form.configuration === bhk;
                            return (
                              <button
                                key={bhk}
                                type="button"
                                onClick={() => setForm((prev) => ({ ...prev, configuration: bhk }))}
                                className={`py-2.5 px-2 rounded-xl font-black text-xs transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1 ${
                                  isBhkActive
                                    ? 'bg-[#ea580c] text-white shadow-md shadow-orange-500/30 ring-2 ring-orange-400 scale-[1.03]'
                                    : 'bg-white border border-slate-200 text-slate-700 hover:border-orange-300 hover:bg-orange-50/50'
                                }`}
                              >
                                <i className={`ri-hotel-bed-fill text-xs ${isBhkActive ? 'text-white' : 'text-orange-500'}`} />
                                <span>{bhk}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 1.2 Owner Contact & Specs Form Inputs with Left Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                    {/* Owner Name */}
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1 mb-1.5">
                        <span>Owner Name</span>
                      </label>
                      <div className="relative">
                        <i className="ri-user-3-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <input
                          type="text"
                          value={form.ownerName}
                          onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                          placeholder="e.g. Rajesh Mehra"
                          className="w-full rounded-xl bg-slate-50/80 hover:bg-slate-100/60 focus:bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none border border-slate-200/90 focus:border-[#ea580c] focus:ring-2 focus:ring-orange-500/20 transition-all"
                        />
                      </div>
                    </div>

                    {/* Owner Contact */}
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1 mb-1.5">
                        <span>Owner Contact</span>
                      </label>
                      <div className="relative">
                        <i className="ri-phone-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <input
                          type="tel"
                          value={form.ownerContact}
                          onChange={(e) => setForm({ ...form, ownerContact: e.target.value })}
                          placeholder="10-digit mobile number"
                          className="w-full rounded-xl bg-slate-50/80 hover:bg-slate-100/60 focus:bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none border border-slate-200/90 focus:border-[#ea580c] focus:ring-2 focus:ring-orange-500/20 transition-all"
                        />
                      </div>
                    </div>

                    {/* Commission */}
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1 mb-1.5">
                        <span>Commission Brokerage</span>
                      </label>
                      <div className="relative">
                        <i className="ri-money-rupee-circle-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <select
                          value={form.commission}
                          onChange={(e) => setForm({ ...form, commission: e.target.value })}
                          className="w-full rounded-xl bg-slate-50/80 hover:bg-slate-100/60 focus:bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 outline-none border border-slate-200/90 focus:border-[#ea580c] focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer"
                        >
                          <option value="YES">YES - Standard Brokerage</option>
                          <option value="NO">NO Brokerage</option>
                          <option value="2%">2% Premium Deal</option>
                        </select>
                      </div>
                    </div>

                    {/* Furnishing Status */}
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1 mb-1.5">
                        <span>Furnishing</span>
                      </label>
                      <div className="relative">
                        <i className="ri-armchair-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <select
                          value={form.furnishingStatus}
                          onChange={(e) => setForm({ ...form, furnishingStatus: e.target.value })}
                          className="w-full rounded-xl bg-slate-50/80 hover:bg-slate-100/60 focus:bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 outline-none border border-slate-200/90 focus:border-[#ea580c] focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer"
                        >
                          <option value="Unfurnished">Unfurnished</option>
                          <option value="Semi-Furnished">Semi-Furnished</option>
                          <option value="Furnished">Fully Furnished</option>
                        </select>
                      </div>
                    </div>

                    {/* Floor Level */}
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1 mb-1.5">
                        <span>Floor Level</span>
                      </label>
                      <div className="relative">
                        <i className="ri-building-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <input
                          type="text"
                          value={form.floor}
                          onChange={(e) => setForm({ ...form, floor: e.target.value })}
                          placeholder="e.g. 5th Floor / Top Floor"
                          className="w-full rounded-xl bg-slate-50/80 hover:bg-slate-100/60 focus:bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none border border-slate-200/90 focus:border-[#ea580c] focus:ring-2 focus:ring-orange-500/20 transition-all"
                        />
                      </div>
                    </div>

                    {/* Net Profit (for commercial/plots) */}
                    {['Office', 'Shop', 'Plot'].includes(form.propertyCategory) && (
                      <div>
                        <label className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1 mb-1.5">
                          <span>Net Profit Margin (₹)</span>
                        </label>
                        <div className="relative">
                          <i className="ri-arrow-trend-up-line absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 text-sm" />
                          <input
                            type="number"
                            value={form.netProfit}
                            onChange={(e) => setForm({ ...form, netProfit: e.target.value })}
                            placeholder="e.g. 500000"
                            className="w-full rounded-xl bg-slate-50/80 hover:bg-slate-100/60 focus:bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none border border-slate-200/90 focus:border-[#ea580c] focus:ring-2 focus:ring-orange-500/20 transition-all"
                          />
                        </div>
                      </div>
                    )}

                    {/* Complete Address */}
                    <div className={['Office', 'Shop', 'Plot'].includes(form.propertyCategory) ? 'sm:col-span-2' : 'sm:col-span-3'}>
                      <label className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1 mb-1.5">
                        <span>Complete Physical Address</span>
                      </label>
                      <div className="relative">
                        <i className="ri-map-pin-2-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <input
                          type="text"
                          value={form.completeAddress}
                          onChange={(e) => setForm({ ...form, completeAddress: e.target.value })}
                          placeholder="Flat / unit number, tower, street, landmark, sector"
                          className="w-full rounded-xl bg-slate-50/80 hover:bg-slate-100/60 focus:bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none border border-slate-200/90 focus:border-[#ea580c] focus:ring-2 focus:ring-orange-500/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─── CARD 2: GENERAL LISTING SPECIFICATIONS ─── */}
                <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 space-y-6 shadow-sm">
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm border border-indigo-200/60 shadow-xs">
                        02
                      </div>
                      <div>
                        <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                          Property Specifications & Amenities
                        </h2>
                        <p className="text-xs text-slate-400 font-normal">Headline, location, configurations, size, and society perks.</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50/80 border border-indigo-200/80 px-3 py-1 rounded-full w-fit">
                      Specifications
                    </span>
                  </div>

                  {/* Inputs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Title */}
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1 mb-1.5">
                        <span>Property Headline / Title <span className="text-[#ea580c]">*</span></span>
                      </label>
                      <div className="relative">
                        <i className="ri-article-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <input
                          type="text"
                          value={form.title}
                          onChange={(e) => setForm({ ...form, title: e.target.value })}
                          placeholder="e.g. 3 BHK Luxury Sunlit Sky Suite"
                          required
                          className="w-full rounded-xl bg-slate-50/80 hover:bg-slate-100/60 focus:bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none border border-slate-200/90 focus:border-[#ea580c] focus:ring-2 focus:ring-orange-500/20 transition-all"
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1 mb-1.5">
                        <span>Location / Sector <span className="text-[#ea580c]">*</span></span>
                      </label>
                      <div className="relative">
                        <i className="ri-compass-3-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <input
                          type="text"
                          value={form.location}
                          onChange={(e) => setForm({ ...form, location: e.target.value })}
                          placeholder="e.g. Sector 57, Gurgaon"
                          required
                          className="w-full rounded-xl bg-slate-50/80 hover:bg-slate-100/60 focus:bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none border border-slate-200/90 focus:border-[#ea580c] focus:ring-2 focus:ring-orange-500/20 transition-all"
                        />
                      </div>
                    </div>

                    {/* Configuration */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1">
                          <span>Configuration <span className="text-[#ea580c]">*</span></span>
                        </label>
                        {form.propertyCategory === 'HK' && (
                          <span className="text-[10px] font-extrabold text-[#ea580c]">5 BHK Options</span>
                        )}
                      </div>
                      <div className="relative">
                        <i className="ri-layout-2-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <input
                          type="text"
                          value={form.configuration}
                          onChange={(e) => setForm({ ...form, configuration: e.target.value })}
                          placeholder="e.g. 2 BHK, 3 BHK, Studio"
                          required
                          className="w-full rounded-xl bg-slate-50/80 hover:bg-slate-100/60 focus:bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none border border-slate-200/90 focus:border-[#ea580c] focus:ring-2 focus:ring-orange-500/20 transition-all"
                        />
                      </div>
                      {form.propertyCategory === 'HK' && (
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK'].map((bhk) => (
                            <button
                              key={bhk}
                              type="button"
                              onClick={() => setForm((prev) => ({ ...prev, configuration: bhk }))}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                                form.configuration === bhk
                                  ? 'bg-[#ea580c] text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {bhk}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Size */}
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1 mb-1.5">
                        <span>Size (Sq.Ft)</span>
                      </label>
                      <div className="relative">
                        <i className="ri-ruler-2-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <input
                          type="number"
                          value={form.sizeSqft}
                          onChange={(e) => setForm({ ...form, sizeSqft: e.target.value })}
                          placeholder="e.g. 1650"
                          className="w-full rounded-xl bg-slate-50/80 hover:bg-slate-100/60 focus:bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none border border-slate-200/90 focus:border-[#ea580c] focus:ring-2 focus:ring-orange-500/20 transition-all"
                        />
                      </div>
                    </div>

                    {/* Possession Status */}
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1 mb-1.5">
                        <span>Possession Status</span>
                      </label>
                      <div className="relative">
                        <i className="ri-time-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <select
                          value={form.possessionStatus}
                          onChange={(e) => setForm({ ...form, possessionStatus: e.target.value })}
                          className="w-full rounded-xl bg-slate-50/80 hover:bg-slate-100/60 focus:bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 outline-none border border-slate-200/90 focus:border-[#ea580c] focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer"
                        >
                          <option value="Ready to Move">Ready to Move</option>
                          <option value="Immediate">Immediate Possession</option>
                          <option value="Under Construction">Under Construction</option>
                        </select>
                      </div>
                    </div>

                    {/* Parking */}
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1 mb-1.5">
                        <span>Parking Allotment</span>
                      </label>
                      <div className="relative">
                        <i className="ri-car-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <select
                          value={form.parking}
                          onChange={(e) => setForm({ ...form, parking: e.target.value })}
                          className="w-full rounded-xl bg-slate-50/80 hover:bg-slate-100/60 focus:bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 outline-none border border-slate-200/90 focus:border-[#ea580c] focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer"
                        >
                          <option value="Car + Bike Parking">Car + Bike Parking</option>
                          <option value="1 Covered Car Parking">1 Covered Car Parking</option>
                          <option value="2 Reserved Parking">2 Reserved Parking</option>
                          <option value="Bike Only">Bike Parking Only</option>
                          <option value="No Parking">No Parking</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 2.2 Visual Amenities Multi-Select Grid */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold text-slate-700">Society Amenities & Key Features</label>
                      <span className="text-[10px] text-slate-400">Click chips to toggle</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                      {[
                        { name: "Lift(s)", icon: "ri-arrow-up-down-line" },
                        { name: "24x7 Security", icon: "ri-shield-check-line" },
                        { name: "Gated Community", icon: "ri-community-line" },
                        { name: "Car & Bike Parking", icon: "ri-car-line" },
                        { name: "Power Backup", icon: "ri-flashlight-line" },
                        { name: "24hr Water Supply", icon: "ri-drop-line" },
                        { name: "Modular Kitchen", icon: "ri-restaurant-line" },
                        { name: "Private Balcony", icon: "ri-sun-line" },
                        { name: "Park / Garden", icon: "ri-tree-line" },
                        { name: "Gymnasium", icon: "ri-heart-pulse-line" },
                        { name: "Near Metro Station", icon: "ri-subway-line" },
                        { name: "CCTV Surveillance", icon: "ri-video-line" },
                      ].map((am) => {
                        const isSelected = form.amenities && form.amenities.includes(am.name);
                        return (
                          <button
                            key={am.name}
                            type="button"
                            onClick={() => handleAmenityToggle(am.name)}
                            className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                              isSelected
                                ? 'bg-orange-50 border-[#ea580c] text-[#ea580c] shadow-2xs'
                                : 'bg-slate-50/70 border-slate-200/80 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <i className={`${isSelected ? 'ri-checkbox-circle-fill text-[#ea580c]' : am.icon + ' text-slate-400'} text-sm shrink-0`} />
                            <span className="truncate text-[11px]">{am.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="text-[11px] font-extrabold text-slate-700 block mb-1.5">Property Description & Highlights</label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Mention ventilation, sunlight orientation, nearby schools, hospitals..."
                      className="w-full rounded-2xl bg-slate-50/80 hover:bg-slate-100/60 focus:bg-white p-3 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none border border-slate-200/90 focus:border-[#ea580c] focus:ring-2 focus:ring-orange-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* ─── CARD 3: PRICING, FINANCIALS & MEDIA UPLOADS ─── */}
                <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 space-y-6 shadow-sm">
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm border border-emerald-200/60 shadow-xs">
                        03
                      </div>
                      <div>
                        <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                          Pricing & Media Uploads
                        </h2>
                        <p className="text-xs text-slate-400 font-normal">Set pricing expectations and attach high-res listing photos.</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50/80 border border-emerald-200/80 px-3 py-1 rounded-full w-fit">
                      Pricing & Photos
                    </span>
                  </div>

                  {/* Pricing Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1 mb-1.5">
                        <span>{form.listingType === 'rent' ? 'Monthly Rent (₹)' : 'Total Sale Price (₹)'} <span className="text-[#ea580c]">*</span></span>
                      </label>
                      <div className="relative">
                        <i className="ri-money-rupee-circle-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <input
                          type="number"
                          value={form.listingType === 'rent' ? form.monthlyRent : form.salePrice}
                          onChange={(e) =>
                            setForm(
                              form.listingType === 'rent'
                                ? { ...form, monthlyRent: e.target.value }
                                : { ...form, salePrice: e.target.value }
                            )
                          }
                          placeholder="e.g. 4500000"
                          required
                          className="w-full rounded-xl bg-slate-50/80 hover:bg-slate-100/60 focus:bg-white pl-9 pr-3 py-2 text-xs font-bold text-slate-900 placeholder-slate-400 outline-none border border-slate-200/90 focus:border-[#ea580c] focus:ring-2 focus:ring-orange-500/20 transition-all"
                        />
                      </div>

                      {/* Live Price Breakdown Badge */}
                      {(form.salePrice || form.monthlyRent) && (
                        <div className="mt-2 p-2 rounded-xl bg-orange-50 border border-orange-200 text-xs font-bold text-[#ea580c] flex items-center justify-between">
                          <span>Preview: {priceLabel(form)}</span>
                          {Number(form.sizeSqft) > 0 && form.salePrice && (
                            <span className="text-[10px] text-slate-500 font-medium">
                              ₹ {Math.round(Number(form.salePrice) / Number(form.sizeSqft)).toLocaleString('en-IN')}/sqft
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {form.listingType === 'rent' && (
                      <div>
                        <label className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1 mb-1.5">
                          <span>Security Deposit (₹)</span>
                        </label>
                        <div className="relative">
                          <i className="ri-shield-keyhole-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                          <input
                            type="number"
                            value={form.securityDeposit}
                            onChange={(e) => setForm({ ...form, securityDeposit: e.target.value })}
                            placeholder="e.g. 50000"
                            className="w-full rounded-xl bg-slate-50/80 hover:bg-slate-100/60 focus:bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none border border-slate-200/90 focus:border-[#ea580c] focus:ring-2 focus:ring-orange-500/20 transition-all"
                          />
                        </div>
                      </div>
                    )}

                    {/* Cover Photo */}
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 block mb-1.5">Cover Image (Upload or URL)</label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverUpload}
                          className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-50 file:text-[#ea580c] hover:file:bg-orange-100 cursor-pointer"
                        />
                        <div className="relative">
                          <i className="ri-link absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                          <input
                            type="url"
                            value={form.coverImage}
                            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                            placeholder="Or paste direct image URL"
                            className="w-full rounded-xl bg-slate-50/80 hover:bg-slate-100/60 focus:bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none border border-slate-200/90 focus:border-[#ea580c] transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Gallery Photos */}
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 block mb-1.5">Gallery Photos (Multiple)</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleGalleryUpload}
                        className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                      />
                      {form.images?.length > 0 && (
                        <span className="text-[11px] font-bold text-emerald-600 block mt-1.5">
                          ✓ {form.images.length} gallery images attached
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ─── STICKY ACTION BAR / SUBMIT ─── */}
                  <div className="pt-5 flex items-center justify-between gap-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setForm(emptyFlatListing())}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer transition"
                    >
                      Reset Form
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="px-8 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-[#ea580c] to-amber-600 hover:brightness-110 text-white text-xs font-black shadow-lg shadow-orange-500/30 active:scale-[0.98] transition cursor-pointer flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <i className="ri-loader-4-line animate-spin text-sm" />
                          <span>Publishing...</span>
                        </>
                      ) : (
                        <>
                          <i className="ri-checkbox-circle-fill text-sm" />
                          <span>{editingId ? 'Update Listing' : 'Publish Property Listing'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </form>
            ) : view === 'list' ? (

              /* ─── TAB 2: MY LISTINGS (PREVIOUS COMPLETE TABLE / GRID WITH STATUS SELECTOR & PAGINATION) ─── */
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
                
                {/* Search & Category Filter Pills */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    {['all', 'HK', 'RK', 'Shop', 'Plot', 'Office'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => { setFilterCategory(cat); setCurrentPage(1); }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          filterCategory === cat
                            ? 'bg-[#ea580c] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat === 'all' ? 'All Inventory' : cat}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLayoutMode(layoutMode === 'grid' ? 'table' : 'grid')}
                      className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
                      title="Toggle Grid / Table View"
                    >
                      <i className={layoutMode === 'grid' ? 'ri-table-line text-sm' : 'ri-grid-fill text-sm'} />
                    </button>

                    <button
                      onClick={() => { setForm(emptyFlatListing()); setEditingId(null); setView('add'); }}
                      className="px-4 py-1.5 rounded-xl bg-[#ea580c] text-white text-xs font-bold hover:brightness-110 cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <i className="ri-add-line" /> Add Property
                    </button>
                  </div>
                </div>

                {/* Property Grid or Table */}
                {layoutMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedListings.map((item) => (
                      <div key={item._id} className="rounded-2xl border border-slate-100 overflow-hidden bg-white hover:shadow-md transition space-y-3 p-3.5">
                        <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-100">
                          {item.coverImage ? (
                            <img src={item.coverImage} alt={item.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-slate-300">
                              <i className="ri-building-line text-5xl" />
                            </div>
                          )}
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold uppercase backdrop-blur-md">
                            {item.propertyCategory}
                          </span>
                          <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-md bg-orange-600 text-white text-[10px] font-black uppercase shadow-xs">
                            {priceLabel(item)}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{item.title || item.configuration}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1 flex items-center gap-1 mt-0.5">
                            <i className="ri-map-pin-line text-[#ea580c]" /> {item.location}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                          <span>{item.sizeSqft || 'N/A'} sqft · {item.floor || 'Standard Floor'}</span>
                          <select
                            value={item.dealStatus || 'available'}
                            onChange={(e) => changeDealStatus(item._id, e.target.value)}
                            className="rounded-lg border border-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase bg-white outline-none cursor-pointer text-slate-700"
                          >
                            <option value="available">Available</option>
                            <option value="rented">Rented</option>
                            <option value="sold">Sold</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => setViewingProperty(item)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs cursor-pointer flex items-center gap-1"
                          >
                            <i className="ri-eye-line" /> View
                          </button>
                          <a
                            href={generateWhatsAppPitchUrl(item)}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1 transition"
                          >
                            <i className="ri-whatsapp-line text-emerald-600" /> Share Pitch
                          </a>
                          <button
                            onClick={() => startEdit(item)}
                            className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
                            title="Edit"
                          >
                            <i className="ri-edit-line text-sm" />
                          </button>
                          <button
                            onClick={() => deleteListing(item._id)}
                            className="p-1.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 cursor-pointer"
                            title="Delete"
                          >
                            <i className="ri-delete-bin-line text-sm" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="py-2.5 px-3">Property</th>
                          <th className="py-2.5 px-3">Location</th>
                          <th className="py-2.5 px-3">Price</th>
                          <th className="py-2.5 px-3">Owner Contact</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginatedListings.map((item) => (
                          <tr key={item._id} className="hover:bg-slate-50/80 transition">
                            <td className="py-3 px-3 font-bold text-slate-900">{item.title || item.configuration}</td>
                            <td className="py-3 px-3 text-slate-500">{item.location}</td>
                            <td className="py-3 px-3 font-bold text-slate-900">{priceLabel(item)}</td>
                            <td className="py-3 px-3 text-slate-600">{item.ownerContact || 'N/A'}</td>
                            <td className="py-3 px-3">
                              <select
                                value={item.dealStatus || 'available'}
                                onChange={(e) => changeDealStatus(item._id, e.target.value)}
                                className="rounded-lg border border-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase bg-white outline-none cursor-pointer"
                              >
                                <option value="available">Available</option>
                                <option value="rented">Rented</option>
                                <option value="sold">Sold</option>
                              </select>
                            </td>
                            <td className="py-3 px-3 text-right space-x-2">
                              <button onClick={() => setViewingProperty(item)} className="text-slate-600 hover:text-slate-900 font-bold">
                                View
                              </button>
                              <a
                                href={generateWhatsAppPitchUrl(item)}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-600 hover:underline font-bold"
                              >
                                Pitch
                              </a>
                              <button onClick={() => startEdit(item)} className="text-[#ea580c] hover:underline font-bold">
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination Controls */}
                {filteredListings.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                    <div>
                      Showing {(currentPage - 1) * (pageSize === 'all' ? filteredListings.length : Number(pageSize)) + 1} - {Math.min(currentPage * (pageSize === 'all' ? filteredListings.length : Number(pageSize)), filteredListings.length)} of {filteredListings.length} properties
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span>Per page:</span>
                        <select
                          value={pageSize}
                          onChange={(e) => { setPageSize(e.target.value === 'all' ? 'all' : Number(e.target.value)); setCurrentPage(1); }}
                          className="rounded-lg border border-slate-200 px-2 py-1 bg-white outline-none font-bold"
                        >
                          <option value={12}>12</option>
                          <option value={24}>24</option>
                          <option value={48}>48</option>
                          <option value="all">All</option>
                        </select>
                      </div>

                      {pageSize !== 'all' && (
                        <div className="flex items-center gap-1">
                          <button
                            disabled={currentPage <= 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer font-bold"
                          >
                            Prev
                          </button>
                          <span className="px-2 font-bold text-slate-800">
                            {currentPage} / {totalPages}
                          </span>
                          <button
                            disabled={currentPage >= totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer font-bold"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (

              /* ─── TAB 3: INVESTMENT LEADS PANEL ─── */
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-base font-black text-slate-900">Assigned Investment Leads</h2>
                    <p className="text-xs text-slate-400">Direct client inquiries assigned to your sales portfolio.</p>
                  </div>
                </div>
                <AssignedLeadsPanel />
              </div>
            )}

          </main>

          {/* Fixed Bottom Canvas Footer */}
          <footer className="px-5 sm:px-7 py-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium bg-white">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Baba Broker Sales Desk · v2.4
            </span>
            <span>Direct Support: <a href="mailto:support@bababroker.com" className="text-[#ea580c] hover:underline">support@bababroker.com</a></span>
            <span className="hidden sm:inline">© 2026 Baba Broker. All rights reserved.</span>
          </footer>

        </div>

      </div>

    </div>
  );
}
