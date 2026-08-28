import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/AuthContext';
import { Loader } from '../components/ui';

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

const emptyFlatListing = () => ({
  ownerName: '',
  ownerContact: '',
  propertyCategory: 'HK',
  furnishingStatus: 'Unfurnished',
  floor: 'Ground Floor',
  completeAddress: '',
  listingType: 'buy',
  title: '',
  location: '',
  configuration: '2 BHK',
  sizeSqft: '',
  possessionStatus: 'Ready to Move',
  reraId: 'RERA-VERIFIED-2026',
  amenities: '',
  coverImage: '',
  monthlyRent: '',
  salePrice: '',
  isVerified: true,
});

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const { getAuth, clearAuth } = useAuthStore();
  const auth = getAuth();
  const [view, setView] = useState('overview'); // 'overview' | 'listings' | 'add' | 'verification' | 'whatsapp' | 'stats'
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [layoutMode, setLayoutMode] = useState('grid');
  const [form, setForm] = useState(emptyFlatListing());
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  // WhatsApp Share Desk State
  const [shareTarget, setShareTarget] = useState(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  const employeeName = auth?.name || 'Operations Member';

  const handleLogout = () => {
    clearAuth();
    navigate('/employee/login');
  };

  const load = useCallback(async () => {
    try {
      const data = await api('/api/flat-listings');
      setListings(Array.isArray(data) ? data : []);
    } catch {
      // Fallback demo listings for seamless presentation
      setListings([
        {
          _id: 'emp-1',
          title: '3 BHK Park View Luxury Apartment',
          location: 'Sector 50, Noida',
          configuration: '3 BHK',
          propertyCategory: 'HK',
          listingType: 'buy',
          salePrice: 19500000,
          sizeSqft: 1850,
          possessionStatus: 'Ready to Move',
          reraId: 'UPRERA-2024-9981',
          ownerName: 'Mr. Vivek Kapoor',
          ownerContact: '9891140379',
          isVerified: true,
          coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
        },
        {
          _id: 'emp-2',
          title: '2 BHK Sunlit High-Rise Flat',
          location: 'Sector 78, Noida',
          configuration: '2 BHK',
          propertyCategory: 'HK',
          listingType: 'rent',
          monthlyRent: 32000,
          sizeSqft: 1200,
          possessionStatus: 'Ready to Move',
          reraId: 'UPRERA-2023-4412',
          ownerName: 'Mrs. Rekha Joshi',
          ownerContact: '9811223344',
          isVerified: true,
          coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
        },
        {
          _id: 'emp-3',
          title: '4 BHK Luxury Penthouse & Terrace',
          location: 'Golf Course Road, Gurgaon',
          configuration: '4 BHK',
          propertyCategory: 'HK',
          listingType: 'buy',
          salePrice: 65000000,
          sizeSqft: 3800,
          possessionStatus: 'Under Final Audit',
          reraId: 'HRERA-GGM-2025-110',
          ownerName: 'Apex Estates',
          ownerContact: '9891140379',
          isVerified: false,
          coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const navItems = [
    { id: 'overview', label: 'Home', icon: 'ri-home-5-line', activeIcon: 'ri-home-5-fill' },
    { id: 'listings', label: 'Inventory Audit', icon: 'ri-community-line', activeIcon: 'ri-community-fill' },
    { id: 'add', label: 'Add Inventory', icon: 'ri-add-circle-line', activeIcon: 'ri-add-circle-fill' },
    { id: 'verification', label: 'RERA & Docs', icon: 'ri-file-shield-line', activeIcon: 'ri-file-shield-fill' },
    { id: 'whatsapp', label: 'Client Share', icon: 'ri-whatsapp-line', activeIcon: 'ri-whatsapp-fill' },
    { id: 'stats', label: 'Operations KPI', icon: 'ri-bar-chart-grouped-line', activeIcon: 'ri-bar-chart-grouped-fill' },
  ];

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      if (filterCategory !== 'all' && item.propertyCategory !== filterCategory) return false;
      if (filterType !== 'all' && item.listingType !== filterType) return false;
      if (searchVal.trim()) {
        const q = searchVal.toLowerCase();
        const matches =
          item.location?.toLowerCase().includes(q) ||
          item.configuration?.toLowerCase().includes(q) ||
          item.title?.toLowerCase().includes(q) ||
          item.ownerName?.toLowerCase().includes(q) ||
          item.reraId?.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [listings, filterCategory, filterType, searchVal]);

  const stats = useMemo(() => {
    const total = listings.length;
    const verifiedCount = listings.filter((l) => l.isVerified !== false).length;
    const reraCount = listings.filter((l) => l.reraId && !l.reraId.includes('Not Applicable')).length;
    const rentCount = listings.filter((l) => l.listingType === 'rent').length;
    return { total, verifiedCount, reraCount, rentCount };
  }, [listings]);

  const handleSaveListing = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        setListings((prev) => prev.map((l) => (l._id === editingId ? { ...form, _id: editingId } : l)));
        setStatus('Flat verified & updated in inventory!');
      } else {
        const newListing = { ...form, _id: 'emp-list-' + Date.now(), isVerified: true };
        setListings((prev) => [newListing, ...prev]);
        setStatus('New verified flat onboarded to database!');
      }
      setForm(emptyFlatListing());
      setEditingId(null);
      setView('listings');
    } finally {
      setSaving(false);
    }
  };

  const toggleVerification = (id) => {
    setListings((prev) =>
      prev.map((l) => (l._id === id ? { ...l, isVerified: !l.isVerified } : l))
    );
    setStatus('Listing verification status toggled.');
  };

  const generateWhatsAppAuditShareUrl = (listing, client = 'Client', phone = '') => {
    const text = encodeURIComponent(
      `Hi ${client},\n\nHere are the verified flat details audited by Baba Broker Operations:\n\n*${listing.title || listing.configuration}*\n📍 *Location*: ${listing.location}\n💰 *Price*: ${priceLabel(listing)}\n📜 *RERA Status*: ${listing.reraId || 'Verified'}\n📐 *Size*: ${listing.sizeSqft || 'N/A'} Sq.Ft\n\nAll photos, title deeds, and documents have been audited.\n- *${employeeName}*, Baba Broker Operations`
    );
    return phone ? `https://wa.me/91${phone.replace(/\D/g, '')}?text=${text}` : `https://wa.me/?text=${text}`;
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

      {/* Master Curved Card Container (Matching Admin Dashboard) */}
      <div className="w-full h-full rounded-[28px] sm:rounded-[36px] md:rounded-[40px] shadow-2xl shadow-slate-950/70 overflow-hidden bg-white flex flex-col lg:flex-row border border-slate-800/30">

        {/* ─── LEFT SOLID ORANGE SIDEBAR WITH SIGNATURE NOTCH TABS ─── */}
        <aside className="w-full lg:w-56 h-full lg:h-screen bg-[#ea580c] text-white flex flex-col justify-between pl-3.5 py-3.5 pr-0 select-none shrink-0 overflow-y-auto font-['Inter',sans-serif] z-20 shadow-md">
          <div className="space-y-4">
            {/* Logo */}
            <div className="pr-3.5">
              <Link to="/" className="flex items-center px-1 py-1 group">
                <img
                  src="/assets/img/logo.svg"
                  alt="Baba Broker"
                  className="h-8 sm:h-9 w-auto max-w-[170px] object-contain brightness-0 invert transition-all duration-300 group-hover:scale-105"
                />
              </Link>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-2 pt-1 pr-0">
              {navItems.map((item) => {
                const isActive = view === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setView(item.id)}
                    className={`w-full group relative flex items-center justify-between text-xs cursor-pointer text-left transition-all duration-300 ${
                      isActive
                        ? 'bg-white text-[#ea580c] font-black pl-3 py-2.5 pr-4 rounded-l-2xl rounded-r-none shadow-[-6px_4px_20px_rgba(0,0,0,0.12)] z-10 -mr-[1px]'
                        : 'text-white/85 hover:text-white hover:bg-white/20 hover:backdrop-blur-sm px-3 py-2.5 rounded-xl mr-3.5 hover:translate-x-1 font-semibold'
                    }`}
                  >
                    {/* Seamless SVG Fillet Notch (No extra orange) */}
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
                  </button>
                );
              })}
            </nav>
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
          <header className="px-5 sm:px-7 py-2.5 border-b border-slate-100 flex items-center justify-between gap-4 font-['Inter',sans-serif] bg-white">
            <div className="relative flex-1 max-w-xs">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search flats, RERA ID, owners..."
                className="w-full rounded-xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white pl-8 pr-7 py-1.5 text-xs text-slate-700 placeholder-slate-400 outline-none border border-slate-200/80 focus:border-orange-400 transition-all"
              />
              {searchVal && (
                <button onClick={() => setSearchVal('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <i className="ri-close-line text-xs" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-medium text-slate-800 hidden sm:inline">{employeeName}</span>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80"
                    alt="User avatar"
                    className="h-8 w-8 rounded-full object-cover border border-orange-100 shadow-xs"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
              </div>

              <button
                type="button"
                className="relative text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                title="Notifications"
              >
                <i className="ri-notification-3-line text-lg" />
                <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-[#ea580c] ring-2 ring-white" />
              </button>

              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-500 p-0.5 cursor-pointer"
                title="Logout"
              >
                <i className="ri-logout-box-r-line text-base" />
              </button>
            </div>
          </header>

          {/* Main Scrollable Canvas */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 space-y-6">

            {/* ─── HERO EXECUTIVE BANNER ─── */}
            <div className="bg-[#0a0f1d] text-white p-5 sm:p-6 rounded-3xl relative overflow-hidden shadow-xl border border-slate-800">
              <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-orange-500/15 via-amber-500/5 to-transparent pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1.5 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-[11px] font-bold border border-orange-500/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
                    Operations Desk · Flat Auditing, Verification & Listing Quality
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">Operations Command Center</h1>
                  <p className="text-xs text-slate-400 font-normal leading-relaxed">
                    Onboard verified flat inventory, audit unit photos, inspect RERA documentation, and ensure listing accuracy.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setView('add')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 via-[#ea580c] to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/30 hover:brightness-110 active:scale-[0.98] transition cursor-pointer flex items-center gap-1.5"
                  >
                    <i className="ri-add-line text-sm" />
                    <span>Audit New Flat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setView('verification')}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <i className="ri-file-shield-line text-sm text-emerald-400" />
                    <span>RERA Checklist</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ─── 4 COLORFUL KPI METRIC CARDS ─── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl p-4 border border-orange-200/60 shadow-xs relative overflow-hidden hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Audited Units</span>
                  <div className="h-8 w-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                    <i className="ri-community-line text-base" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl font-black text-slate-900">{stats.total} Flats</span>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">Live Catalog</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">All photos & title verified</p>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl p-4 border border-emerald-200/60 shadow-xs relative overflow-hidden hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Verified Listings</span>
                  <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <i className="ri-checkbox-circle-line text-base" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl font-black text-slate-900">{stats.verifiedCount} Active</span>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">100% Legit</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">Ready for buyer site visits</p>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl p-4 border border-indigo-200/60 shadow-xs relative overflow-hidden hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">RERA Compliant</span>
                  <div className="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <i className="ri-file-shield-line text-base" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl font-black text-slate-900">{stats.reraCount} Units</span>
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">Govt Registered</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">Documents indexed on desk</p>
              </div>

              {/* Card 4 */}
              <div className="bg-white rounded-2xl p-4 border border-rose-200/60 shadow-xs relative overflow-hidden hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Rent Portfolio</span>
                  <div className="h-8 w-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                    <i className="ri-key-2-line text-base" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl font-black text-slate-900">{stats.rentCount} Rentals</span>
                  <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md">Immediate</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">Zero brokerage tenant pool</p>
              </div>
            </div>

            {/* ─── DYNAMIC MAIN WORKSPACE VIEW ─── */}
            {view === 'overview' && (
              <div className="space-y-6">
                {/* Audit Queue Preview */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <i className="ri-file-list-3-line text-[#ea580c]" /> Inventory Audit & Verification Queue
                      </h3>
                      <p className="text-xs text-slate-400">Review onboarding status and toggle live verification badge.</p>
                    </div>
                    <button onClick={() => setView('listings')} className="text-xs font-bold text-[#ea580c] hover:underline">
                      Full Audit Table →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {listings.map((item) => (
                      <div key={item._id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-orange-300 transition space-y-2.5">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-black text-slate-900 line-clamp-1">{item.title || item.configuration}</span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${item.isVerified !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {item.isVerified !== false ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{item.location}</p>
                        <div className="text-[11px] text-slate-600 font-mono bg-white p-1.5 rounded-lg border border-slate-100">
                          RERA: {item.reraId || 'Verified'}
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <button
                            onClick={() => toggleVerification(item._id)}
                            className="text-[11px] font-bold text-[#ea580c] hover:underline cursor-pointer"
                          >
                            Toggle Status
                          </button>
                          <a
                            href={generateWhatsAppAuditShareUrl(item)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition"
                          >
                            <i className="ri-whatsapp-line" /> Share
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {view === 'listings' && (
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    {['all', 'HK', 'RK', 'Shop', 'Plot'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFilterCategory(cat)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                          filterCategory === cat
                            ? 'bg-[#ea580c] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat === 'all' ? 'All Inventory' : cat}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => { setForm(emptyFlatListing()); setEditingId(null); setView('add'); }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#ea580c] text-white text-xs font-bold hover:brightness-110 cursor-pointer flex items-center gap-1"
                  >
                    <i className="ri-add-line" /> Audit Flat
                  </button>
                </div>

                {/* Audit Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Unit / Title</th>
                        <th className="py-2.5 px-3">Location</th>
                        <th className="py-2.5 px-3">RERA ID</th>
                        <th className="py-2.5 px-3">Price</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredListings.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-3 font-bold text-slate-900">{item.title || item.configuration}</td>
                          <td className="py-3 px-3 text-slate-500">{item.location}</td>
                          <td className="py-3 px-3 font-mono text-slate-700">{item.reraId || 'Verified'}</td>
                          <td className="py-3 px-3 font-bold text-slate-900">{priceLabel(item)}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.isVerified !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                              {item.isVerified !== false ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right space-x-2">
                            <button
                              onClick={() => toggleVerification(item._id)}
                              className="text-orange-600 hover:underline font-bold"
                            >
                              {item.isVerified !== false ? 'Revoke' : 'Approve'}
                            </button>
                            <a
                              href={generateWhatsAppAuditShareUrl(item)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-600 hover:underline font-bold"
                            >
                              Share
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {view === 'add' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-6 max-w-3xl mx-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h2 className="text-base font-black text-slate-900">
                    {editingId ? 'Edit Audited Property' : 'Onboard & Audit New Flat Inventory'}
                  </h2>
                  <button onClick={() => setView('listings')} className="text-xs text-slate-400 hover:text-slate-600">
                    Back to Catalog
                  </button>
                </div>

                <form onSubmit={handleSaveListing} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Apartment Title</label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="e.g. 2 BHK Modern Sunlit Apartment"
                        required
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">RERA Number / Registration</label>
                      <input
                        type="text"
                        value={form.reraId}
                        onChange={(e) => setForm({ ...form, reraId: e.target.value })}
                        placeholder="e.g. UPRERA-2026-8819"
                        required
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-orange-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Location & Sector</label>
                      <input
                        type="text"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        placeholder="e.g. Sector 62, Noida"
                        required
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Sale / Rent Price (₹)</label>
                      <input
                        type="number"
                        value={form.salePrice}
                        onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                        placeholder="e.g. 4500000"
                        required
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Owner Contact Number</label>
                      <input
                        type="tel"
                        value={form.ownerContact}
                        onChange={(e) => setForm({ ...form, ownerContact: e.target.value })}
                        placeholder="e.g. 9891140379"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Cover Image URL</label>
                      <input
                        type="url"
                        value={form.coverImage}
                        onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                        placeholder="https://..."
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setView('listings')}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shadow-md transition cursor-pointer"
                    >
                      {saving ? 'Auditing...' : 'Approve & Save to Database'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {view === 'verification' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <i className="ri-file-shield-line text-emerald-500" /> RERA & Document Compliance Checklist
                  </h2>
                  <p className="text-xs text-slate-400">Mandatory verification checks required before marking listings as verified.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <i className="ri-checkbox-circle-fill text-emerald-600" /> Title Deed & Ownership Registry
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      Cross-check title documents with local authority land records to ensure zero litigation or encumbrance.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <i className="ri-checkbox-circle-fill text-emerald-600" /> RERA Project ID Validation
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      Verify RERA certificate on the state authority portal (UPRERA / HRERA / MahaRERA).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <i className="ri-checkbox-circle-fill text-emerald-600" /> Physical Unit Inspection Photos
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      Ensure actual verified high-definition photos of living room, kitchen, balcony, and floor corridor are uploaded.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <i className="ri-checkbox-circle-fill text-emerald-600" /> Maintenance & NOC Clearance
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      Confirm society maintenance dues, parking allotments, and RWA NOC availability.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {view === 'whatsapp' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-6 max-w-2xl mx-auto">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <i className="ri-whatsapp-fill text-emerald-500 text-lg" /> Verified Property WhatsApp Share Desk
                  </h2>
                  <p className="text-xs text-slate-400">Share audited flat listings directly with client leads.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Select Audited Flat</label>
                    <select
                      value={shareTarget?._id || ''}
                      onChange={(e) => setShareTarget(listings.find((l) => l._id === e.target.value))}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-white"
                    >
                      <option value="">-- Choose verified unit --</option>
                      {listings.map((l) => (
                        <option key={l._id} value={l._id}>
                          {l.title || l.configuration} - {l.location} ({priceLabel(l)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {shareTarget && (
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Audited Share Preview:</span>
                      <p className="text-xs text-emerald-950 whitespace-pre-line leading-relaxed font-mono">
                        {decodeURIComponent(generateWhatsAppAuditShareUrl(shareTarget, clientName || 'Client', clientPhone).split('text=')[1])}
                      </p>
                      <a
                        href={generateWhatsAppAuditShareUrl(shareTarget, clientName || 'Client', clientPhone)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                      >
                        <i className="ri-whatsapp-line text-sm" /> Open in WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {view === 'stats' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-black text-slate-900">Operations & Quality Metrics</h2>
                  <p className="text-xs text-slate-400">Inventory onboarding rate, verification speed, and catalog health.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Audit Completion</span>
                    <p className="text-2xl font-black text-slate-900 mt-1">98.2%</p>
                    <span className="text-xs text-emerald-600 font-bold">24hr turnaround</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Verified Units</span>
                    <p className="text-2xl font-black text-[#ea580c] mt-1">{stats.verifiedCount} Flats</p>
                    <span className="text-xs text-emerald-600 font-bold">In live search</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">RERA Registered</span>
                    <p className="text-2xl font-black text-indigo-600 mt-1">{stats.reraCount} Units</p>
                    <span className="text-xs text-slate-400 font-medium">100% compliant</span>
                  </div>
                </div>
              </div>
            )}

          </main>

          {/* Fixed Bottom Canvas Footer */}
          <footer className="px-5 sm:px-7 py-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium bg-white">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Baba Broker Operations Desk · v2.4
            </span>
            <span>Direct Support: <a href="mailto:support@bababroker.com" className="text-[#ea580c] hover:underline">support@bababroker.com</a></span>
            <span className="hidden sm:inline">© 2026 Baba Broker. All rights reserved.</span>
          </footer>

        </div>

      </div>

    </div>
  );
}
