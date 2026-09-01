import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { getAuth, clearAuth } from '../store/auth';
import { useAppDispatch } from '../store';
import { logoutAction } from '../store/authSlice';
import { Loader } from '../components/ui';
import AssignedLeadsPanel from '../components/AssignedLeadsPanel';

const formatINR = (val) => {
  const num = Number(val);
  if (!num || isNaN(num)) return '—';
  if (num >= 10000000) {
    return `₹ ${(num / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
  }
  if (num >= 100000) {
    return `₹ ${(num / 100000).toFixed(2).replace(/\.00$/, '')} L`;
  }
  return `₹ ${num.toLocaleString('en-IN')}`;
};

const priceLabel = (listing) =>
  listing.listingType === 'rent' && listing.monthlyRent
    ? `${formatINR(listing.monthlyRent)}/mo`
    : formatINR(listing.salePrice);

const emptyFlatListing = () => ({
  ownerName: '',
  ownerContact: '',
  propertyCategory: 'HK',
  furnishingStatus: 'Semi-Furnished',
  floor: '1st Floor (Front Side)',
  lift: 'YES',
  parking: 'Car + Bike Parking',
  completeAddress: '',
  listingType: 'buy',
  title: '',
  location: '',
  configuration: '2 BHK',
  sizeSqft: '50 Gaj (450 sq.ft)',
  possessionStatus: 'Ready to Move',
  reraId: 'RERA-VERIFIED-2026',
  amenities: '24x7 Water, Modular Kitchen, Wardrobes, Gated Colony',
  coverImage: '',
  images: [],
  monthlyRent: '',
  salePrice: '',
  commission: '15 Days Rent',
  netProfit: '',
  dealStatus: 'available',
  isVerified: true,
});

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [view, setView] = useState('overview'); // 'overview' | 'add' | 'list' | 'leads' | 'verification' | 'calculator'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyFlatListing());
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [viewingProperty, setViewingProperty] = useState(null);
  const [pitchingProperty, setPitchingProperty] = useState(null);
  const [pitchClientName, setPitchClientName] = useState('');
  const [pitchClientPhone, setPitchClientPhone] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [dutyStatus, setDutyStatus] = useState('online');

  // Listing Filters
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterPrice, setFilterPrice] = useState('all');
  const [priceSort, setPriceSort] = useState('none'); // 'none', 'asc' (Low to High), 'desc' (High to Low)
  const [layoutMode, setLayoutMode] = useState('table');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 15;

  // Calculator State
  const [calcPrice, setCalcPrice] = useState('2500000');
  const [calcBrokeragePct, setCalcBrokeragePct] = useState(1);
  const [calcLoanAmount, setCalcLoanAmount] = useState('2000000');
  const [calcInterestRate, setCalcInterestRate] = useState(8.5);
  const [calcTenureYears, setCalcTenureYears] = useState(20);
  const [calcGajInput, setCalcGajInput] = useState('50');

  const dispatch = useAppDispatch();
  const employeeName = auth?.name || 'Operations Executive';

  const handleLogout = async () => {
    try {
      await dispatch(logoutAction());
    } catch {
      /* ignore */
    }
    clearAuth();
    navigate('/employee/login');
  };

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api('/api/flat-listings');
      setListings(Array.isArray(res) ? res : []);
    } catch {
      // Fallback demo inventory for visual preview
      setListings([
        {
          _id: 'emp-demo-1',
          title: '3 BHK Park View Luxury Builder Floor',
          location: 'Bhagwati Garden, Dwarka Mor',
          configuration: '3 BHK',
          propertyCategory: 'HK',
          listingType: 'buy',
          salePrice: 4200000,
          netProfit: 4000000,
          sizeSqft: '75 Gaj (675 sq.ft)',
          floor: '1st Floor (Front Side)',
          lift: 'YES',
          parking: 'Car + Bike Parking',
          furnishingStatus: 'Semi-Furnished',
          ownerName: 'Dharmendra Sharma',
          ownerContact: '9560587733',
          completeAddress: 'Near Spring Medical, Bhagwati Garden, Street No. 4',
          amenities: '24x7 Water Supply, Gated Entry, Power Backup',
          dealStatus: 'available',
          isVerified: true,
          coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
          images: [],
        },
        {
          _id: 'emp-demo-2',
          title: '2 BHK Brand New Floor with Lift & Car Parking',
          location: 'Mansharam Park, Uttam Nagar',
          configuration: '2 BHK',
          propertyCategory: 'HK',
          listingType: 'buy',
          salePrice: 2400000,
          netProfit: 2250000,
          sizeSqft: '50 Gaj (450 sq.ft)',
          floor: '2nd Floor',
          lift: 'YES',
          parking: 'Car Parking',
          furnishingStatus: 'Semi-Furnished',
          ownerName: 'Tripathi Ji',
          ownerContact: '9891140379',
          completeAddress: 'Mansharam Park, Near Metro Pillar 750',
          amenities: 'Lift(s), 24x7 Security, Power Backup',
          dealStatus: 'available',
          isVerified: true,
          coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
          images: [],
        },
        {
          _id: 'emp-demo-3',
          title: '1 RK Compact Affordable Studio',
          location: 'Sulahkul Vihar',
          configuration: '1 RK',
          propertyCategory: 'RK',
          listingType: 'buy',
          salePrice: 1350000,
          netProfit: 1250000,
          sizeSqft: '30 Gaj (270 sq.ft)',
          floor: 'Ground Floor',
          lift: 'NO',
          parking: 'Bike Parking',
          furnishingStatus: 'Semi-Furnished',
          ownerName: 'Ojha Ji',
          ownerContact: '8818631377',
          completeAddress: 'Near Holy Chowk, Sulahkul Vihar',
          amenities: 'Separate Submersible, Gated Gali',
          dealStatus: 'available',
          isVerified: false,
          coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
          images: [],
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Auto-dismiss status toaster after 3 seconds
  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => {
      setStatus('');
    }, 3000);
    return () => clearTimeout(timer);
  }, [status]);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'ri-dashboard-3-line', activeIcon: 'ri-dashboard-3-fill' },
    { id: 'add', label: 'Add Property', icon: 'ri-add-circle-line', activeIcon: 'ri-add-circle-fill' },
    { id: 'list', label: 'Inventory Audit', icon: 'ri-building-line', activeIcon: 'ri-building-fill' },
    { id: 'leads', label: 'Client & Investment Inquiries', icon: 'ri-user-star-line', activeIcon: 'ri-user-star-fill' },
  ];

  const filteredListings = useMemo(() => {
    let result = listings.filter((item) => {
      if (filterCategory !== 'all' && item.propertyCategory !== filterCategory) return false;
      if (filterType !== 'all' && item.listingType !== filterType) return false;

      // Price Filter
      if (filterPrice !== 'all') {
        const p = item.listingType === 'rent' ? Number(item.monthlyRent) || 0 : Number(item.salePrice) || 0;
        if (item.listingType === 'rent') {
          if (filterPrice === 'u15' && p > 10000) return false;
          if (filterPrice === '15-25' && (p < 10000 || p > 20000)) return false;
          if (filterPrice === '25-40' && (p < 20000 || p > 35000)) return false;
          if (filterPrice === '40-60' && (p < 35000 || p > 50000)) return false;
          if (filterPrice === 'a60' && p < 50000) return false;
        } else {
          if (filterPrice === 'u15' && p >= 1500000) return false;
          if (filterPrice === '15-25' && (p < 1500000 || p > 2500000)) return false;
          if (filterPrice === '25-40' && (p < 2500000 || p > 4000000)) return false;
          if (filterPrice === '40-60' && (p < 4000000 || p > 6000000)) return false;
          if (filterPrice === 'a60' && p <= 6000000) return false;
        }
      }

      if (searchVal.trim()) {
        const q = searchVal.toLowerCase();
        const matches =
          String(item.location || '').toLowerCase().includes(q) ||
          String(item.configuration || '').toLowerCase().includes(q) ||
          String(item.title || '').toLowerCase().includes(q) ||
          String(item.ownerName || '').toLowerCase().includes(q) ||
          String(item.ownerContact || '').includes(q) ||
          String(item.floor || '').toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });

    if (priceSort === 'asc') {
      result.sort((a, b) => {
        const pa = a.listingType === 'rent' ? Number(a.monthlyRent) || 0 : Number(a.salePrice) || 0;
        const pb = b.listingType === 'rent' ? Number(b.monthlyRent) || 0 : Number(b.salePrice) || 0;
        return pa - pb;
      });
    } else if (priceSort === 'desc') {
      result.sort((a, b) => {
        const pa = a.listingType === 'rent' ? Number(a.monthlyRent) || 0 : Number(a.salePrice) || 0;
        const pb = b.listingType === 'rent' ? Number(b.monthlyRent) || 0 : Number(b.salePrice) || 0;
        return pb - pa;
      });
    }

    return result;
  }, [listings, filterCategory, filterType, filterPrice, priceSort, searchVal]);

  const paginatedListings = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredListings.slice(start, start + PAGE_SIZE);
  }, [filteredListings, currentPage]);

  const totalPages = Math.ceil(filteredListings.length / PAGE_SIZE) || 1;

  const stats = useMemo(() => {
    const total = listings.length;
    const available = listings.filter((l) => l.dealStatus === 'available' || !l.dealStatus).length;
    const verified = listings.filter((l) => l.isVerified !== false).length;
    const converted = listings.filter((l) => l.dealStatus === 'sold' || l.dealStatus === 'rented').length;
    return { total, available, verified, converted };
  }, [listings]);

  // Image Upload Handlers
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Cover image size must be under 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, coverImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.slice(0, 8).forEach((file) => {
      if (file.size > 2 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          images: [...(prev.images || []), reader.result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveGalleryImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const handleSaveListing = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        title: form.title?.trim() || `${form.configuration} in ${form.location || 'Delhi NCR'}`,
        description: form.description?.trim() || `${form.configuration} property located at ${form.location || 'Delhi NCR'}`,
        salePrice: Number(form.salePrice) || 0,
        monthlyRent: Number(form.monthlyRent) || 0,
        netProfit: Number(form.netProfit) || 0,
        isVerified: true,
      };

      if (editingId) {
        await api(`/api/flat-listings/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' },
        });
        setStatus('✓ Audited property updated successfully!');
      } else {
        await api('/api/flat-listings', {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' },
        });
        setStatus('✓ New flat audited & published successfully!');
      }
      await load();
      setForm(emptyFlatListing());
      setEditingId(null);
      setView('list');
    } catch (err) {
      setStatus(err.message || 'Failed to save listing.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (listing) => {
    setForm({ ...listing });
    setEditingId(listing._id);
    setView('add');
  };

  const deleteListing = async (id) => {
    if (!window.confirm('Delete this listing from inventory?')) return;
    try {
      await api(`/api/flat-listings/${id}`, { method: 'DELETE' });
      setListings((prev) => prev.filter((l) => l._id !== id));
      setStatus('Listing removed from inventory.');
    } catch (err) {
      setStatus(err.message || 'Failed to delete listing.');
    }
  };

  const toggleDealStatus = async (item) => {
    let nextStatus = 'available';
    if (item.listingType === 'rent') {
      nextStatus = item.dealStatus === 'rented' ? 'available' : 'rented';
    } else {
      nextStatus = item.dealStatus === 'sold' ? 'available' : 'sold';
    }

    try {
      await api(`/api/flat-listings/${item._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ dealStatus: nextStatus }),
        headers: { 'Content-Type': 'application/json' },
      });
      setListings((prev) =>
        prev.map((l) => (l._id === item._id ? { ...l, dealStatus: nextStatus } : l))
      );
      const statusLabel =
        nextStatus === 'sold'
          ? 'Marked as Sold'
          : nextStatus === 'rented'
          ? 'Marked as Rented'
          : item.listingType === 'rent'
          ? 'Marked as Available (Unrented)'
          : 'Marked as Available (Unsold)';
      setStatus(`✓ Property ${statusLabel}.`);
    } catch (err) {
      setStatus(err.message || 'Failed to update deal status.');
    }
  };

  const toggleVerification = async (id, currentVal) => {
    try {
      await api(`/api/flat-listings/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isVerified: !currentVal }),
        headers: { 'Content-Type': 'application/json' },
      });
      setListings((prev) =>
        prev.map((l) => (l._id === id ? { ...l, isVerified: !currentVal } : l))
      );
      setStatus(`✓ Verification status updated.`);
    } catch (err) {
      setStatus(err.message || 'Failed to update verification status.');
    }
  };

  const buildPitchText = (listing, client = '') => {
    const greeting = client.trim() ? `Hi ${client.trim()},\n\n` : `Hello,\n\n`;
    const priceText = priceLabel(listing);
    const liftText = listing.lift === 'YES' ? '🛗 Lift Available' : 'No Lift';
    const parkText = listing.parking && listing.parking !== 'No Parking' ? `🚗 ${listing.parking}` : 'No Dedicated Parking';

    return (
      `${greeting}🏠 *Quick Property Alert from Baba Broker*\n\n` +
      `*${listing.title || listing.configuration}* at *${listing.location}*\n` +
      `💰 *Price*: ${priceText}\n` +
      `📐 *Size*: ${listing.sizeSqft || '50 Gaj'}\n` +
      `🏢 *Floor & Lift*: ${listing.floor || 'Standard'} | ${liftText}\n` +
      `🚗 *Parking*: ${parkText}\n\n` +
      `Let me know if you would like to visit today!\n` +
      `- *${employeeName}*, Baba Broker Operations`
    );
  };

  // Calculations for Commission & EMI Tab
  const calculatedCommission = useMemo(() => {
    const p = Number(calcPrice) || 0;
    const gross = (p * calcBrokeragePct) / 100;
    const gst = gross * 0.18;
    const net = gross - gst;
    const agentPayout = net * 0.40;
    return { gross, gst, net, agentPayout };
  }, [calcPrice, calcBrokeragePct]);

  const calculatedEMI = useMemo(() => {
    const p = Number(calcLoanAmount) || 0;
    const r = (Number(calcInterestRate) || 8.5) / 12 / 100;
    const n = (Number(calcTenureYears) || 20) * 12;
    if (p <= 0 || r <= 0 || n <= 0) return { emi: 0, totalPayment: 0, totalInterest: 0 };
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;
    return { emi: Math.round(emi), totalPayment: Math.round(totalPayment), totalInterest: Math.round(totalInterest) };
  }, [calcLoanAmount, calcInterestRate, calcTenureYears]);

  const gajConversion = useMemo(() => {
    const gaj = Number(calcGajInput) || 0;
    const sqft = gaj * 9;
    const sqmeter = (sqft * 0.092903).toFixed(2);
    const sqyard = gaj;
    return { sqft, sqmeter, sqyard };
  }, [calcGajInput]);

  return (
    <div className="h-screen w-screen bg-[#070e1c] p-1.5 sm:p-2.5 md:p-3 font-['Inter',sans-serif] text-slate-800 antialiased flex flex-col justify-center overflow-hidden select-text">
      
      {/* Toast Alert */}
      {status && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-white text-emerald-800 shadow-xl px-4 py-2.5 animate-in fade-in slide-in-from-top-2">
          <i className="ri-checkbox-circle-fill text-emerald-600 text-base" />
          <span className="text-xs font-bold">{status}</span>
          <button type="button" onClick={() => setStatus('')} className="text-slate-400 hover:text-slate-600 ml-2 cursor-pointer">
            <i className="ri-close-line text-sm" />
          </button>
        </div>
      )}

      {/* Master Curved Card Container */}
      <div className="w-full h-full rounded-2xl sm:rounded-3xl shadow-2xl shadow-slate-950/70 overflow-hidden bg-white flex flex-col lg:flex-row border border-slate-800/30 relative">

        {/* Mobile Backdrop Overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 animate-fadeIn"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ─── LEFT SOLID ORANGE SIDEBAR WITH SIGNATURE NOTCH TABS ─── */}
        <aside
          className={`fixed lg:static top-0 left-0 h-full w-72 sm:w-80 lg:w-56 bg-[#ea580c] text-white flex flex-col justify-between pl-3 py-3 pr-0 select-none shrink-0 overflow-y-auto font-['Inter',sans-serif] z-50 lg:z-20 shadow-2xl transition-transform duration-300 ease-in-out ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-3.5">
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

            {/* Navigation Items */}
            <nav className="space-y-1.5 pt-1 pr-0">
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
                        ? 'bg-white text-[#ea580c] font-black pl-3 py-2 pr-3.5 rounded-l-2xl rounded-r-none shadow-[-6px_4px_20px_rgba(0,0,0,0.12)] z-10 -mr-[1px]'
                        : 'text-white/85 hover:text-white hover:bg-white/20 hover:backdrop-blur-sm px-3 py-2 rounded-xl mr-3.5 hover:translate-x-1 font-semibold'
                    }`}
                  >
                    {/* Notch tabs */}
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
                        <div className="h-6 w-6 rounded-lg bg-orange-600 text-white flex items-center justify-center text-xs shadow-xs shrink-0">
                          <i className={item.activeIcon} />
                        </div>
                      ) : (
                        <i className={`${item.icon} text-base shrink-0 text-white/90`} />
                      )}
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.id === 'list' && (
                      <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${isActive ? 'bg-orange-100 text-orange-700' : 'bg-white/20 text-white'}`}>
                        {stats.total}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Clean Sidebar Footer */}
          <div className="pt-3 pr-3.5 mt-auto border-t border-white/20 text-center select-none">
            <p className="text-[10px] text-white/85 font-semibold">Baba Broker Operations</p>
            <p className="text-[9px] text-white/70">v2.4 · Executive Desk</p>
          </div>
        </aside>

        {/* ─── RIGHT CANVAS: FULL WIDTH WORKSPACE ─── */}
        <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden bg-white">
          
          {/* Header */}
          <header className="px-3 sm:px-6 py-2 border-b border-slate-100 flex items-center justify-between gap-3 bg-white sticky top-0 z-30">
            <div className="flex items-center gap-2 flex-1">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen((prev) => !prev)}
                className="lg:hidden h-8 w-8 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center cursor-pointer shrink-0"
                title="Toggle Menu"
              >
                <i className="ri-menu-2-line text-base font-bold" />
              </button>

              <div className="relative w-full max-w-sm">
                <i className="ri-search-line absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Quick search flat, location, owner, size..."
                  className="w-full rounded-xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white pl-7 pr-6 py-1 text-xs text-slate-700 placeholder-slate-400 outline-none border border-slate-200 focus:border-orange-400 transition font-medium"
                />
                {searchVal && (
                  <button type="button" onClick={() => setSearchVal('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                    <i className="ri-close-line text-xs" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Duty Toggle Pill */}
              <button
                type="button"
                onClick={() => setDutyStatus(dutyStatus === 'online' ? 'busy' : 'online')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border transition cursor-pointer ${
                  dutyStatus === 'online'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${dutyStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span>{dutyStatus === 'online' ? 'Available' : 'Auditing Units'}</span>
              </button>

              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-bold text-slate-900 block leading-tight">{employeeName}</span>
                  <span className="text-[10px] text-slate-400">Operations Desk</span>
                </div>
                <div className="h-7 w-7 rounded-lg bg-orange-100 text-orange-700 font-black text-xs flex items-center justify-center border border-orange-200">
                  {employeeName.slice(0, 2).toUpperCase()}
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-600 p-1 cursor-pointer transition"
                title="Logout"
              >
                <i className="ri-logout-box-r-line text-base" />
              </button>
            </div>
          </header>

          {/* Main Scrollable Canvas */}
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 bg-slate-50/40 space-y-3.5">

            {/* ─── TAB 1: OVERVIEW ─── */}
            {view === 'overview' && (
              <div className="space-y-3 w-full">
                
                {/* 1. Clean Executive Header Banner */}
                <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/90 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Operations Command Center · Unit Audits & Quality
                        </span>
                      </div>
                      <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 mt-1">
                        Welcome back, <span className="text-orange-600">{employeeName}</span> 👋
                      </h1>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Audit verified inventory, inspect documents & RERA compliance, and monitor live inquiries.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      <button
                        type="button"
                        onClick={() => { setForm(emptyFlatListing()); setEditingId(null); setView('add'); }}
                        className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <i className="ri-add-line text-sm" /> Add Property
                      </button>
                      <button
                        type="button"
                        onClick={() => setView('leads')}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-200 flex items-center gap-1.5 cursor-pointer"
                      >
                        <i className="ri-user-star-line text-sm text-amber-600" /> Client & Investment Inquiries
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Key Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Active Inventory</span>
                      <div className="h-6 w-6 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center text-xs">
                        <i className="ri-building-line" />
                      </div>
                    </div>
                    <div className="text-base sm:text-lg font-black text-slate-900">{stats.available} Available</div>
                    <span className="text-[10px] text-slate-400 font-medium">Out of {stats.total} total units</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Verified Units</span>
                      <div className="h-6 w-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">
                        <i className="ri-checkbox-circle-line" />
                      </div>
                    </div>
                    <div className="text-base sm:text-lg font-black text-emerald-700">{stats.verified} Verified</div>
                    <span className="text-[10px] text-emerald-600 font-bold">100% Legit documentation</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Deals Converted</span>
                      <div className="h-6 w-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-xs">
                        <i className="ri-medal-line" />
                      </div>
                    </div>
                    <div className="text-base sm:text-lg font-black text-purple-700">{stats.converted} Deals</div>
                    <span className="text-[10px] text-purple-600 font-bold">Sold & Rented</span>
                  </div>
                </div>

                {/* 3. Recent Inventory Live Table */}
                <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/90 shadow-xs space-y-3 w-full">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Audited Property Inventory</h3>
                      <p className="text-[10px] text-slate-400">Latest flat listings verified and ready for client pitching</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setView('list')}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All ({listings.length})</span>
                      <i className="ri-arrow-right-line" />
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left text-xs border-collapse select-none">
                      <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-black tracking-wider text-slate-400">
                        <tr>
                          <th className="py-2.5 px-3">Property Unit</th>
                          <th className="py-2.5 px-3">Location & Floor</th>
                          <th className="py-2.5 px-3">Demand Price</th>
                          <th className="py-2.5 px-3">Owner / Contact</th>
                          <th className="py-2.5 px-3">Verification</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {listings.slice(0, 8).map((item) => {
                          const isSold = item.dealStatus === 'sold';
                          const isRented = item.dealStatus === 'rented';
                          const isClosed = isSold || isRented;

                          return (
                            <tr
                              key={item._id}
                              className={`transition-colors duration-150 select-none ${
                                isClosed ? 'opacity-35 bg-slate-100/70 pointer-events-none' : 'hover:bg-slate-50/80'
                              }`}
                            >
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black text-xs shrink-0 overflow-hidden">
                                    {item.coverImage ? (
                                      <img src={item.coverImage} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                      (item.configuration || '2B').slice(0, 2)
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-slate-900 block truncate text-xs">
                                        {item.title || `${item.configuration} Builder Floor`}
                                      </span>
                                      {isClosed && (
                                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-red-100 text-red-700 uppercase shrink-0">
                                          {isSold ? 'SOLD' : 'RENTED'}
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      {item.sizeSqft || '50 Gaj'} · {item.configuration}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-2.5 px-3">
                                <span className="font-medium text-slate-800 block text-xs truncate max-w-[160px]">
                                  {item.location}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {item.floor || 'Standard Floor'}
                                </span>
                              </td>

                              <td className="py-2.5 px-3 font-bold text-slate-900">
                                <span className="text-xs font-black text-slate-900 block">
                                  {priceLabel(item)}
                                </span>
                                <span className="text-[10px] text-slate-400 uppercase">
                                  {item.listingType === 'rent' ? 'Rental' : 'Sale'}
                                </span>
                              </td>

                              <td className="py-2.5 px-3">
                                <span className="font-bold text-slate-800 block text-xs">{item.ownerName || 'Direct Party'}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{item.ownerContact || '—'}</span>
                              </td>

                              <td className="py-2.5 px-3">
                                <button
                                  type="button"
                                  disabled={isClosed}
                                  onClick={() => toggleVerification(item._id, item.isVerified !== false)}
                                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border ${
                                    isClosed
                                      ? 'opacity-40 cursor-not-allowed pointer-events-none bg-slate-100 text-slate-500 border-slate-300'
                                      : item.isVerified !== false
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 cursor-pointer'
                                      : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 cursor-pointer'
                                  }`}
                                >
                                  <span className={`h-1.5 w-1.5 rounded-full ${item.isVerified !== false ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                  <span>{item.isVerified !== false ? 'Verified' : 'Pending'}</span>
                                </button>
                              </td>

                              <td className="py-2.5 px-3 text-right">
                                <div className={`flex items-center justify-end gap-1.5 ${isClosed ? 'pointer-events-none opacity-30 cursor-not-allowed' : ''}`}>
                                  <button
                                    type="button"
                                    disabled={isClosed}
                                    onClick={() => { setPitchingProperty(item); setPitchClientName(''); setPitchClientPhone(''); }}
                                    className="h-6 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                                    title="WhatsApp Pitch"
                                  >
                                    <i className="ri-whatsapp-line text-xs" />
                                    <span>Pitch</span>
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isClosed}
                                    onClick={() => startEdit(item)}
                                    className="h-6 w-6 rounded-lg bg-slate-100 hover:bg-orange-100 text-slate-600 hover:text-orange-700 flex items-center justify-center text-xs cursor-pointer disabled:cursor-not-allowed"
                                    title="Edit"
                                  >
                                    <i className="ri-edit-line" />
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

              </div>
            )}

            {/* ─── TAB 2: ADD PROPERTY (PREMIUM ONBOARDING & AUDIT STUDIO) ─── */}
            {view === 'add' && (
              <form onSubmit={handleSaveListing} className="space-y-4 w-full pb-10">
                
                {/* 1. Header Banner */}
                <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center text-lg font-black shadow-md shadow-orange-500/20">
                      <i className={editingId ? "ri-edit-2-line" : "ri-building-line"} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm sm:text-base font-black text-slate-900">
                          {editingId ? 'Edit Audited Property' : 'Onboard & Audit New Property'}
                        </h2>
                        <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 text-[10px] font-black uppercase border border-orange-200">
                          {form.listingType === 'rent' ? 'Rental' : 'Sale Deal'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">Verify property specs, pricing metrics, and photo gallery</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => { setForm(emptyFlatListing()); setEditingId(null); setView('list'); }}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4.5 py-2 rounded-xl bg-[#ea580c] hover:bg-orange-700 text-white text-xs font-black shadow-md shadow-orange-600/20 transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                    >
                      {saving ? <Loader size={14} color="#fff" /> : <i className="ri-check-line text-sm font-black" />}
                      <span>{editingId ? 'Save Changes' : 'Publish Property'}</span>
                    </button>
                  </div>
                </div>

                {/* 2. Real-Time Live Audit Preview Card */}
                <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 p-4 rounded-3xl border border-orange-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-white border border-orange-200 text-orange-600 flex items-center justify-center font-black text-sm shrink-0 overflow-hidden shadow-2xs">
                      {form.coverImage ? (
                        <img src={form.coverImage} alt="Cover Preview" className="h-full w-full object-cover" />
                      ) : (
                        <span>{form.configuration || '2B'}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-slate-900 text-sm">
                          {form.title || `${form.configuration || '2 BHK'} Builder Floor`}
                        </span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-orange-600 text-white shadow-2xs">
                          {form.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="font-bold text-orange-700">{form.location || 'Location Not Specified'}</span>
                        <span>·</span>
                        <span>{form.sizeSqft || '50 Gaj'}</span>
                        <span>·</span>
                        <span>{form.floor || '1st Floor'}</span>
                        <span>·</span>
                        <span className={form.lift === 'YES' ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                          {form.lift === 'YES' ? '🛗 Lift Available' : 'No Lift'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0 bg-white/90 sm:bg-transparent px-3 py-1.5 rounded-xl border border-orange-200 sm:border-0">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Demand Price</span>
                    <span className="text-base font-black text-orange-700 block">
                      {form.listingType === 'rent'
                        ? (form.monthlyRent ? `${formatINR(form.monthlyRent)}/mo` : '₹ —/mo')
                        : (form.salePrice ? formatINR(form.salePrice) : '₹ —')}
                    </span>
                  </div>
                </div>

                {/* Section 1: Property Identity & Category */}
                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-black text-xs">
                        1
                      </div>
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Property Identity & Category</h3>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">Step 1 of 4</span>
                  </div>

                  {/* 1. Category Fast Chips */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 block">Select Category Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {[
                        { id: 'HK', label: 'Builder Floor / Flat', icon: '🏠', desc: 'Standard residential units' },
                        { id: 'RK', label: 'Studio / 1 RK Flat', icon: '🏢', desc: 'Compact bachelor units' },
                        { id: 'Plot', label: 'Freehold Land / Plot', icon: '📐', desc: 'Plots & raw land' },
                        { id: 'Shop', label: 'Commercial Shop', icon: '🏪', desc: 'Retail & business spaces' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setForm({ ...form, propertyCategory: cat.id })}
                          className={`p-2.5 rounded-2xl text-left border transition cursor-pointer flex flex-col justify-between ${
                            form.propertyCategory === cat.id
                              ? 'bg-orange-50 border-orange-500 text-orange-950 font-black shadow-xs ring-1 ring-orange-400'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-base">{cat.icon}</span>
                            <span className="text-xs font-bold">{cat.label}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1">{cat.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Configuration & Listing Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700 block">Unit Configuration</label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                        {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '1 RK', 'Shop'].map((cfg) => (
                          <button
                            key={cfg}
                            type="button"
                            onClick={() => setForm({ ...form, configuration: cfg })}
                            className={`py-2 rounded-xl font-bold text-xs border transition cursor-pointer text-center ${
                              form.configuration === cfg
                                ? 'bg-orange-600 text-white border-orange-600 shadow-2xs font-black'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {cfg}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700 block">Deal Intent</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, listingType: 'buy' })}
                          className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer border text-center ${
                            form.listingType === 'buy'
                              ? 'bg-orange-600 text-white border-orange-600 shadow-2xs font-black'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          🏷️ For Sale
                        </button>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, listingType: 'rent' })}
                          className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer border text-center ${
                            form.listingType === 'rent'
                              ? 'bg-orange-600 text-white border-orange-600 shadow-2xs font-black'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          🔑 For Rent
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 3. Title & Location with Quick Tags */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Property Title / Marketing Heading</label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="e.g. 2 BHK Brand New Builder Floor"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Location & Landmark Area</label>
                      <input
                        type="text"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        placeholder="e.g. Bhagwati Garden, Dwarka Mor"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition"
                      />
                      {/* Fast Location Quick Chips */}
                      <div className="flex items-center gap-1 flex-wrap mt-1.5">
                        <span className="text-[10px] text-slate-400 font-bold">Fast select:</span>
                        {['Bhagwati Garden', 'Mohan Garden', 'Rama Park', 'Dwarka Mor', 'Uttam Nagar', 'Jain Road', 'Sewak Park'].map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => setForm({ ...form, location: loc })}
                            className={`text-[10px] px-2 py-0.5 rounded-md transition font-medium cursor-pointer border ${
                              form.location === loc
                                ? 'bg-orange-100 text-orange-800 border-orange-300 font-bold'
                                : 'bg-slate-100 hover:bg-orange-50 hover:text-orange-700 text-slate-600 border-slate-200'
                            }`}
                          >
                            + {loc}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Floor Position, Parking & Specs */}
                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-black text-xs">
                        2
                      </div>
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Floor Position, Parking & Specifications</h3>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">Step 2 of 4</span>
                  </div>

                  {/* Floor Position Grid */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1.5">Select Floor Position</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                      {[
                        { code: 'G-FS', label: 'Ground Floor (Front Side)' },
                        { code: 'G-BS', label: 'Ground Floor (Back Side)' },
                        { code: 'UG-FS', label: 'Upper Ground (Front Side)' },
                        { code: '1ST-FS', label: '1st Floor (Front Side)' },
                        { code: '2ND-BS', label: '2nd Floor (Back Side)' },
                        { code: '3RD-FS', label: '3rd Floor (Front Side)' },
                        { code: 'T-BS', label: 'Top Floor with Roof' },
                        { code: 'BSMT', label: 'Basement Unit' },
                      ].map((fl) => (
                        <button
                          key={fl.code}
                          type="button"
                          onClick={() => setForm({ ...form, floor: fl.label })}
                          className={`p-2 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                            form.floor === fl.label
                              ? 'bg-orange-50 border-orange-500 text-orange-950 font-black shadow-2xs ring-1 ring-orange-400'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
                          }`}
                        >
                          <span className="text-[9px] font-black text-orange-600">{fl.code}</span>
                          <span className="text-[11px] truncate leading-tight mt-0.5">{fl.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Lift, Furnishing, Size */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Lift Facility</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {['YES', 'NO'].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setForm({ ...form, lift: val })}
                            className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer border text-center ${
                              form.lift === val
                                ? 'bg-orange-600 text-white border-orange-600 shadow-2xs font-black'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {val === 'YES' ? '🛗 Lift Available' : 'No Lift'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Furnishing Status</label>
                      <select
                        value={form.furnishingStatus}
                        onChange={(e) => setForm({ ...form, furnishingStatus: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800 outline-none focus:border-orange-500 focus:bg-white transition"
                      >
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Fully-Furnished">Fully-Furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Plot Size / Area</label>
                      <input
                        type="text"
                        value={form.sizeSqft}
                        onChange={(e) => setForm({ ...form, sizeSqft: e.target.value })}
                        placeholder="e.g. 50 Gaj (450 sq.ft)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition"
                      />
                      {/* Fast Size Chips */}
                      <div className="flex items-center gap-1 flex-wrap mt-1.5">
                        {['35 Gaj', '40 Gaj', '50 Gaj', '60 Gaj', '75 Gaj', '100 Gaj'].map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setForm({ ...form, sizeSqft: `${sz} (${Number(sz.split(' ')[0]) * 9} sq.ft)` })}
                            className="text-[10px] bg-slate-100 hover:bg-orange-50 hover:text-orange-700 text-slate-600 px-1.5 py-0.5 rounded-md transition font-medium cursor-pointer"
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Parking Type */}
                  <div className="pt-1">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1.5">Select Vehicle Parking Type:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {[
                        { id: 'Car + Bike Parking', icon: '🚗+🏍️', label: 'Car + Bike Parking' },
                        { id: 'Car Parking Only', icon: '🚗', label: 'Car Parking Only' },
                        { id: 'Bike Parking Only', icon: '🏍️', label: 'Bike Parking Only' },
                        { id: 'Covered Stilt Parking', icon: '🅿️', label: 'Covered Stilt Parking' },
                      ].map((pkg) => (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => setForm({ ...form, parking: pkg.id })}
                          className={`py-2.5 px-3 rounded-2xl border transition cursor-pointer text-center font-bold text-xs ${
                            form.parking === pkg.id
                              ? 'bg-orange-600 text-white border-orange-600 shadow-2xs font-black'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="block text-sm mb-0.5">{pkg.icon}</span>
                          <span>{pkg.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 3: Pricing & Owner / Associate */}
                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-black text-xs">
                        3
                      </div>
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Pricing, Owner & Associate Info</h3>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">Step 3 of 4</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {form.listingType === 'rent' ? (
                      <>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Monthly Rent (₹)</label>
                          <input
                            type="number"
                            value={form.monthlyRent}
                            onChange={(e) => setForm({ ...form, monthlyRent: e.target.value })}
                            placeholder="e.g. 12000"
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-black text-orange-600 text-sm outline-none focus:border-orange-500 focus:bg-white transition"
                          />
                          {form.monthlyRent > 0 && (
                            <span className="text-[10px] text-orange-700 font-bold block mt-1">
                              ₹ {Number(form.monthlyRent).toLocaleString('en-IN')} / month
                            </span>
                          )}
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Rental Commission Terms</label>
                          <input
                            type="text"
                            value={form.commission}
                            onChange={(e) => setForm({ ...form, commission: e.target.value })}
                            placeholder="e.g. 15 Days Rent"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800 outline-none focus:border-orange-500 focus:bg-white transition"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Demand Sale Price (₹)</label>
                          <input
                            type="number"
                            value={form.salePrice}
                            onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                            placeholder="e.g. 2500000"
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-black text-orange-600 text-sm outline-none focus:border-orange-500 focus:bg-white transition"
                          />
                          {form.salePrice > 0 && (
                            <span className="text-[10px] text-orange-700 font-bold block mt-1">
                              {formatINR(form.salePrice)} (₹ {Number(form.salePrice).toLocaleString('en-IN')})
                            </span>
                          )}
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Net Deal (₹)</label>
                          <input
                            type="number"
                            value={form.netProfit}
                            onChange={(e) => setForm({ ...form, netProfit: e.target.value })}
                            placeholder="e.g. 2350000"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800 outline-none focus:border-orange-500 focus:bg-white transition"
                          />
                          {form.netProfit > 0 && (
                            <span className="text-[10px] text-slate-500 font-medium block mt-1">
                              Net: {formatINR(form.netProfit)}
                            </span>
                          )}
                        </div>
                      </>
                    )}

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Owner / Contact Person</label>
                      <input
                        type="text"
                        value={form.ownerName}
                        onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                        placeholder="e.g. Mr. Rajesh Gupta"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800 outline-none focus:border-orange-500 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Owner Contact Number</label>
                      <input
                        type="tel"
                        value={form.ownerContact}
                        onChange={(e) => setForm({ ...form, ownerContact: e.target.value })}
                        placeholder="e.g. 9891140379"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-slate-800 outline-none focus:border-orange-500 focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Key Amenities & USPs</label>
                      <input
                        type="text"
                        value={form.amenities}
                        onChange={(e) => setForm({ ...form, amenities: e.target.value })}
                        placeholder="e.g. 24x7 Water, Modular Kitchen, Wardrobes"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:border-orange-500 focus:bg-white font-medium transition"
                      />
                    </div>
                  </div>

                  {/* 1-Click Interactive Amenities Cloud */}
                  <div className="pt-1">
                    <span className="text-[10px] font-bold text-slate-400 block mb-1.5">Tap to quick-add key features:</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[
                        '24x7 Water Supply',
                        'Modular Kitchen',
                        'Wardrobes in all Rooms',
                        'Branded Lift',
                        'Near Metro Station',
                        'Gated Society',
                        'Private Roof Rights',
                        '25ft Wide Road',
                        'Loan Available',
                        'RERA Verified',
                      ].map((item) => {
                        const isAdded = (form.amenities || '').includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              if (isAdded) {
                                const updated = form.amenities
                                  .split(', ')
                                  .filter((x) => x !== item)
                                  .join(', ');
                                setForm({ ...form, amenities: updated });
                              } else {
                                const current = form.amenities ? form.amenities.trim() : '';
                                setForm({
                                  ...form,
                                  amenities: current ? `${current}, ${item}` : item,
                                });
                              }
                            }}
                            className={`text-[10px] px-2 py-1 rounded-lg border transition font-bold cursor-pointer flex items-center gap-1 ${
                              isAdded
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <span>{isAdded ? '✓' : '+'}</span>
                            <span>{item}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Section 4: Property Photos & Media Studio */}
                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-black text-xs">
                        4
                      </div>
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Property Photos & Media Studio</h3>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">Step 4 of 4</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Cover Dropzone */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700 block">⭐ Main Cover Photo (Hero)</label>
                      {form.coverImage ? (
                        <div className="relative rounded-2xl overflow-hidden border border-slate-200 group aspect-video shadow-2xs">
                          <img src={form.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-black">
                            ⭐ Primary Cover
                          </div>
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                            <label className="px-3.5 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-bold cursor-pointer hover:bg-slate-100 shadow-md">
                              Change Photo
                              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                            <button
                              type="button"
                              onClick={() => setForm({ ...form, coverImage: '' })}
                              className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold cursor-pointer hover:bg-red-700 shadow-md"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 hover:border-orange-500 rounded-2xl cursor-pointer bg-slate-50/60 hover:bg-orange-50/30 transition aspect-video group">
                          <div className="h-10 w-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition">
                            <i className="ri-image-add-line" />
                          </div>
                          <span className="text-xs font-bold text-slate-800">Upload High-Res Cover Image</span>
                          <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WebP supported</span>
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                      )}
                    </div>

                    {/* Gallery Dropzone */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-700 block">
                          📸 Gallery Photos ({(form.images || []).length})
                        </label>
                        {(form.images || []).length > 0 && (
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, images: [] })}
                            className="text-[10px] font-bold text-red-600 hover:underline cursor-pointer"
                          >
                            Clear All
                          </button>
                        )}
                      </div>

                      <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl cursor-pointer bg-slate-50/60 hover:bg-emerald-50/30 transition group">
                        <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg mb-1 group-hover:scale-110 transition">
                          <i className="ri-folder-image-line" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">Add Room & Balcony Photos</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Select multiple images to attach</span>
                        <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
                      </label>

                      {/* Gallery preview thumbnails */}
                      {(form.images || []).length > 0 && (
                        <div className="grid grid-cols-4 gap-1.5 pt-1.5">
                          {form.images.map((img, idx) => (
                            <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group shadow-2xs">
                              <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryImage(idx)}
                                className="absolute top-1 right-1 h-5 w-5 rounded-md bg-red-600 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition cursor-pointer shadow-xs"
                              >
                                <i className="ri-close-line" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 5. Bottom Action Bar */}
                <div className="flex items-center justify-between p-4 bg-white rounded-3xl border border-slate-200/90 shadow-xs">
                  <button
                    type="button"
                    onClick={() => { setForm(emptyFlatListing()); setEditingId(null); setView('list'); }}
                    className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                  >
                    Reset / Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-black shadow-md shadow-orange-600/20 transition disabled:opacity-50 cursor-pointer flex items-center gap-2 hover:shadow-lg hover:scale-[1.01]"
                  >
                    {saving ? <Loader size={16} color="#fff" /> : <i className="ri-check-double-line text-base font-black" />}
                    <span>{editingId ? 'Save Audited Changes' : 'Approve & Publish to Catalog'}</span>
                  </button>
                </div>

              </form>
            )}

            {/* ─── TAB 3: INVENTORY AUDIT / MY LISTINGS ─── */}
            {view === 'list' && (
              <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/90 shadow-xs space-y-3.5 w-full">
                
                {/* 1. Page Heading Header with Live Search Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-lg font-black shrink-0">
                      <i className="ri-building-line" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm sm:text-base font-black text-slate-900">Property Inventory & Audit Catalog</h2>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                          {filteredListings.length} Units
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">Manage audited properties</p>
                    </div>
                  </div>

                  {/* Prominent Live Search Bar */}
                  <div className="relative w-full sm:w-80">
                    <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input
                      type="text"
                      value={searchVal}
                      onChange={(e) => { setSearchVal(e.target.value); setCurrentPage(1); }}
                      placeholder="Search flat, location, owner, size..."
                      className="w-full rounded-2xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white pl-8 pr-7 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none border border-slate-200 focus:border-orange-500 transition font-medium shadow-2xs"
                    />
                    {searchVal && (
                      <button
                        type="button"
                        onClick={() => setSearchVal('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <i className="ri-close-line text-xs" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Filter Ribbon */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 flex-wrap text-xs">
                    {['all', 'HK', 'RK', 'Plot', 'Shop'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFilterCategory(cat)}
                        className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer ${
                          filterCategory === cat
                            ? 'bg-orange-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat === 'all' ? 'All Units' : cat}
                      </button>
                    ))}

                    <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

                    {['all', 'buy', 'rent'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => { setFilterType(t); setFilterPrice('all'); }}
                        className={`px-2.5 py-1 rounded-xl font-bold transition cursor-pointer ${
                          filterType === t
                            ? 'bg-slate-900 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {t === 'all' ? 'All Deals' : t === 'buy' ? 'Sale' : 'Rent'}
                      </button>
                    ))}

                    <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

                    {/* Price Range Filter Dropdown */}
                    <div className="flex items-center gap-1">
                      <select
                        value={filterPrice}
                        onChange={(e) => { setFilterPrice(e.target.value); setCurrentPage(1); }}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition outline-none cursor-pointer ${
                          filterPrice !== 'all'
                            ? 'bg-orange-50 text-orange-800 border-orange-400 font-black ring-1 ring-orange-300'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        <option value="all">💰 All Budgets</option>
                        <option value="u15">Under ₹15 Lakh {filterType === 'rent' ? '(< ₹10k/mo)' : ''}</option>
                        <option value="15-25">₹15 L – ₹25 Lakh {filterType === 'rent' ? '(₹10k-₹20k)' : ''}</option>
                        <option value="25-40">₹25 L – ₹40 Lakh {filterType === 'rent' ? '(₹20k-₹35k)' : ''}</option>
                        <option value="40-60">₹40 L – ₹60 Lakh {filterType === 'rent' ? '(₹35k-₹50k)' : ''}</option>
                        <option value="a60">Above ₹60 Lakh {filterType === 'rent' ? '(> ₹50k/mo)' : ''}</option>
                      </select>
                      {filterPrice !== 'all' && (
                        <button
                          type="button"
                          onClick={() => setFilterPrice('all')}
                          className="text-[10px] text-orange-600 font-bold hover:underline cursor-pointer px-1"
                        >
                          Reset
                        </button>
                      )}
                    </div>

                    <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

                    {/* Low to High & High to Low Price Sort Switch */}
                    <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200 shrink-0">
                      <button
                        type="button"
                        onClick={() => { setPriceSort(priceSort === 'asc' ? 'none' : 'asc'); setCurrentPage(1); }}
                        className={`px-2 py-0.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                          priceSort === 'asc'
                            ? 'bg-[#ea580c] text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title="Sort by Price: Low to High"
                      >
                        <i className="ri-arrow-up-line" /> Low to High
                      </button>
                      <button
                        type="button"
                        onClick={() => { setPriceSort(priceSort === 'desc' ? 'none' : 'desc'); setCurrentPage(1); }}
                        className={`px-2 py-0.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                          priceSort === 'desc'
                            ? 'bg-[#ea580c] text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title="Sort by Price: High to Low"
                      >
                        <i className="ri-arrow-down-line" /> High to Low
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Table View with Deal Status Switch at Last Position */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse select-none">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-black tracking-wider text-slate-400">
                      <tr>
                        <th className="py-2.5 px-3">Unit / Heading</th>
                        <th className="py-2.5 px-3">Location & Floor</th>
                        <th className="py-2.5 px-3">Price & Terms</th>
                        <th className="py-2.5 px-3">Owner Contact</th>
                        <th className="py-2.5 px-3">Verification</th>
                        <th className="py-2.5 px-3">Actions</th>
                        <th className="py-2.5 px-3 text-right">Deal Status Switch</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {paginatedListings.map((item) => {
                        const isSold = item.dealStatus === 'sold';
                        const isRented = item.dealStatus === 'rented';
                        const isClosed = isSold || isRented;
                        const isForRent = item.listingType === 'rent';

                        return (
                          <tr
                            key={item._id}
                            className={`transition-colors duration-150 select-none ${
                              isClosed ? 'bg-slate-100/70' : 'hover:bg-slate-50/80'
                            }`}
                          >
                            <td className={`py-2.5 px-3 ${isClosed ? 'opacity-35 pointer-events-none' : ''}`}>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black text-xs shrink-0 overflow-hidden">
                                  {item.coverImage ? (
                                    <img src={item.coverImage} alt="" className="h-full w-full object-cover" />
                                  ) : (
                                    (item.configuration || '2B').slice(0, 2)
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-slate-900 block truncate text-xs">
                                      {item.title || `${item.configuration} Builder Floor`}
                                    </span>
                                    {isClosed && (
                                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-red-100 text-red-700 uppercase shrink-0">
                                        {isSold ? 'SOLD' : 'RENTED'}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {item.sizeSqft || '50 Gaj'} · {item.configuration}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className={`py-2.5 px-3 ${isClosed ? 'opacity-35 pointer-events-none' : ''}`}>
                              <span className="font-medium text-slate-800 block text-xs truncate max-w-[160px]">
                                {item.location}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {item.floor || 'Standard'}
                              </span>
                            </td>

                            <td className={`py-2.5 px-3 font-bold text-slate-900 ${isClosed ? 'opacity-35 pointer-events-none' : ''}`}>
                              <span className="text-xs font-black text-slate-900 block">
                                {priceLabel(item)}
                              </span>
                              <span className="text-[10px] text-slate-400 uppercase">
                                {item.listingType === 'rent' ? 'Rental' : 'Sale'}
                              </span>
                            </td>

                            <td className={`py-2.5 px-3 ${isClosed ? 'opacity-35 pointer-events-none' : ''}`}>
                              <span className="font-bold text-slate-800 block text-xs">{item.ownerName || 'Direct'}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{item.ownerContact || '—'}</span>
                            </td>

                            {/* Verification Button (Frozen if Closed) */}
                            <td className={`py-2.5 px-3 ${isClosed ? 'opacity-35 pointer-events-none' : ''}`}>
                              <button
                                type="button"
                                disabled={isClosed}
                                onClick={() => toggleVerification(item._id, item.isVerified !== false)}
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border ${
                                  isClosed
                                    ? 'opacity-40 cursor-not-allowed pointer-events-none bg-slate-100 text-slate-500 border-slate-300'
                                    : item.isVerified !== false
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 cursor-pointer'
                                    : 'bg-amber-50 text-amber-700 border-amber-200 cursor-pointer'
                                }`}
                              >
                                <span className={`h-1.5 w-1.5 rounded-full ${item.isVerified !== false ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                <span>{item.isVerified !== false ? 'Verified' : 'Pending'}</span>
                              </button>
                            </td>

                            {/* Actions Buttons (Frozen if Closed) */}
                            <td className={`py-2.5 px-3 ${isClosed ? 'opacity-35 pointer-events-none' : ''}`}>
                              <div className={`flex items-center gap-1.5 ${isClosed ? 'pointer-events-none opacity-30 cursor-not-allowed' : ''}`}>
                                <button
                                  type="button"
                                  disabled={isClosed}
                                  onClick={() => { setPitchingProperty(item); setPitchClientName(''); setPitchClientPhone(''); }}
                                  className="h-6 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                                  title="WhatsApp Pitch"
                                >
                                  <i className="ri-whatsapp-line text-xs" />
                                  <span>Pitch</span>
                                </button>
                                <button
                                  type="button"
                                  disabled={isClosed}
                                  onClick={() => startEdit(item)}
                                  className="h-6 w-6 rounded-lg bg-slate-100 hover:bg-orange-100 text-slate-600 hover:text-orange-700 flex items-center justify-center text-xs cursor-pointer disabled:cursor-not-allowed"
                                  title="Edit"
                                >
                                  <i className="ri-edit-line" />
                                </button>
                                <button
                                  type="button"
                                  disabled={isClosed}
                                  onClick={() => deleteListing(item._id)}
                                  className="h-6 w-6 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-700 flex items-center justify-center text-xs cursor-pointer disabled:cursor-not-allowed"
                                  title="Delete"
                                >
                                  <i className="ri-delete-bin-line" />
                                </button>
                              </div>
                            </td>

                            {/* Deal Switch Column (Always interactive & 100% opacity so deal can be reopened) */}
                            <td className="py-2.5 px-3 text-right pointer-events-auto">
                              <div className="flex items-center justify-end gap-1.5">
                                {isForRent ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => toggleDealStatus(item)}
                                      className={`group relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-xs ${
                                        isRented ? 'bg-red-600 ring-2 ring-red-300' : 'bg-emerald-500'
                                      }`}
                                      title={isRented ? 'Deal is closed. Click to unfreeze & mark as Available (Unrented)' : 'Click to close deal & mark as Rented'}
                                    >
                                      <span
                                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                          isRented ? 'translate-x-4' : 'translate-x-0'
                                        }`}
                                      />
                                    </button>
                                    <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                                      isRented
                                        ? 'bg-red-100 text-red-800 border border-red-300'
                                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    }`}>
                                      {isRented ? 'Rented' : 'Available'}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => toggleDealStatus(item)}
                                      className={`group relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-xs ${
                                        isSold ? 'bg-red-600 ring-2 ring-red-300' : 'bg-emerald-500'
                                      }`}
                                      title={isSold ? 'Deal is closed. Click to unfreeze & mark as Available (Unsold)' : 'Click to close deal & mark as Sold'}
                                    >
                                      <span
                                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                          isSold ? 'translate-x-4' : 'translate-x-0'
                                        }`}
                                      />
                                    </button>
                                    <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                                      isSold
                                        ? 'bg-red-100 text-red-800 border border-red-300'
                                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    }`}>
                                      {isSold ? 'Sold' : 'Available'}
                                    </span>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-400">Page {currentPage} of {totalPages}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={currentPage <= 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs disabled:opacity-40 cursor-pointer"
                      >
                        Prev
                      </button>
                      <button
                        type="button"
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs disabled:opacity-40 cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── TAB 4: CLIENT INQUIRIES ─── */}
            {view === 'leads' && (
              <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs space-y-3 w-full">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Client, Buyer & Investment Inquiry Desk</h2>
                    <p className="text-[11px] text-slate-400">Manage buyer requirements, investor inquiries, site visits, and instant WhatsApp connect</p>
                  </div>
                </div>
                <AssignedLeadsPanel />
              </div>
            )}

            {/* ─── TAB 5: RERA & DOCS CHECKLIST ─── */}
            {view === 'verification' && (
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-4 w-full max-w-4xl mx-auto">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <div className="h-8 w-8 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-base font-black">
                    <i className="ri-file-shield-line" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-900">RERA & Document Compliance Checklist</h2>
                    <p className="text-[11px] text-slate-400">Mandatory verification steps before clearing flats for client visits</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-900 font-black">
                      <i className="ri-checkbox-circle-fill text-emerald-600" />
                      <span>Title Deed & Ownership Registry</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Cross-verify ownership deeds with municipal land records to ensure clear, encumbrance-free title.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-900 font-black">
                      <i className="ri-checkbox-circle-fill text-emerald-600" />
                      <span>RERA Registration Validation</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Confirm active RERA certificate and project approval on state portal (UPRERA / HRERA / MahaRERA).
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-900 font-black">
                      <i className="ri-checkbox-circle-fill text-emerald-600" />
                      <span>On-Site Physical Inspection</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Upload verified high-resolution photographs of living area, kitchen, balcony, and floor corridor.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-900 font-black">
                      <i className="ri-checkbox-circle-fill text-emerald-600" />
                      <span>RWA NOC & Parking Allocation</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Validate maintenance dues clearance, lift operating certificates, and dedicated stilt parking allotment.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 6: COMMISSION & EMI CALCULATOR ─── */}
            {view === 'calculator' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 w-full">
                
                {/* 1. Brokerage Calculator */}
                <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <div className="h-6 w-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-black text-xs">
                      <i className="ri-money-rupee-circle-line" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-slate-900">Brokerage Calculator</h3>
                      <p className="text-[10px] text-slate-400">Commission breakdown</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Deal Sale Price (₹)</label>
                      <input
                        type="number"
                        value={calcPrice}
                        onChange={(e) => setCalcPrice(e.target.value)}
                        placeholder="2500000"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 outline-none"
                      />
                      <span className="text-[10px] text-orange-600 font-bold block mt-0.5">
                        {formatINR(calcPrice)}
                      </span>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Brokerage %</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[1, 1.5, 2].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => setCalcBrokeragePct(pct)}
                            className={`py-1 rounded-lg font-bold text-xs transition ${
                              calcBrokeragePct === pct
                                ? 'bg-orange-600 text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 space-y-1 text-xs">
                      <div className="flex justify-between text-slate-600 text-[11px]">
                        <span>Gross Brokerage:</span>
                        <span className="font-bold text-slate-900">{formatINR(calculatedCommission.gross)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 text-[11px]">
                        <span>GST (18%):</span>
                        <span className="font-bold text-slate-700">{formatINR(calculatedCommission.gst)}</span>
                      </div>
                      <div className="flex justify-between text-emerald-700 font-bold pt-1 border-t border-slate-200">
                        <span>Agent Payout (40%):</span>
                        <span className="font-black text-sm">{formatINR(calculatedCommission.agentPayout)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Client EMI Estimator */}
                <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <div className="h-6 w-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-black text-xs">
                      <i className="ri-bank-line" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-slate-900">Home Loan EMI Estimator</h3>
                      <p className="text-[10px] text-slate-400">Monthly repayment preview</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Loan Amount (₹)</label>
                      <input
                        type="number"
                        value={calcLoanAmount}
                        onChange={(e) => setCalcLoanAmount(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Rate (% p.a.)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={calcInterestRate}
                          onChange={(e) => setCalcInterestRate(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-bold outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Tenure (Years)</label>
                        <input
                          type="number"
                          value={calcTenureYears}
                          onChange={(e) => setCalcTenureYears(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-bold outline-none"
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-200/70 space-y-1 text-xs text-blue-950">
                      <span className="text-[10px] font-black uppercase text-blue-700 block">Monthly Loan EMI</span>
                      <span className="text-base font-black text-blue-700 block">
                        ₹ {calculatedEMI.emi.toLocaleString('en-IN')} / month
                      </span>
                      <div className="flex justify-between text-[10px] pt-0.5 text-slate-600">
                        <span>Total Interest:</span>
                        <span className="font-bold">{formatINR(calculatedEMI.totalInterest)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Gaj / Land Unit Converter */}
                <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <div className="h-6 w-6 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-black text-xs">
                      <i className="ri-ruler-2-line" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-slate-900">Gaj & Land Unit Converter</h3>
                      <p className="text-[10px] text-slate-400">Delhi NCR land conversions</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Enter Area in Gaj (Gaz)</label>
                      <input
                        type="number"
                        value={calcGajInput}
                        onChange={(e) => setCalcGajInput(e.target.value)}
                        placeholder="50"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-black text-purple-700 text-sm outline-none"
                      />
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex justify-between items-center text-[11px]">
                        <span className="font-bold text-slate-600">Square Feet (Sq.Ft):</span>
                        <span className="font-black text-xs text-slate-900">{gajConversion.sqft} sq.ft</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex justify-between items-center text-[11px]">
                        <span className="font-bold text-slate-600">Square Meters (Sq.M):</span>
                        <span className="font-bold text-xs text-slate-900">{gajConversion.sqmeter} sq.m</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex justify-between items-center text-[11px]">
                        <span className="font-bold text-slate-600">Square Yards (Sq.Yd):</span>
                        <span className="font-bold text-xs text-slate-900">{gajConversion.sqyard} sq.yd</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </main>

          {/* Footer */}
          <footer className="px-4 py-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium bg-white">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Baba Broker Operations Desk · v2.4
            </span>
            <span>Direct Support: <a href="mailto:support@bababroker.com" className="text-[#ea580c] hover:underline">support@bababroker.com</a></span>
            <span className="hidden sm:inline">© 2026 Baba Broker. All rights reserved.</span>
          </footer>

        </div>

      </div>

      {/* ─── MODAL: WHATSAPP PITCH STUDIO ─── */}
      {pitchingProperty && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-5 shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-base">
                  <i className="ri-whatsapp-line" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900">WhatsApp Client Pitch Studio</h3>
                  <p className="text-[10px] text-slate-400">Generate personalized property flyers</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPitchingProperty(null)}
                className="h-7 w-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <i className="ri-close-line text-base" />
              </button>
            </div>

            {/* Client Name & Client Phone Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Client Name (Optional)</label>
                <input
                  type="text"
                  value={pitchClientName}
                  onChange={(e) => setPitchClientName(e.target.value)}
                  placeholder="e.g. Rahul Sharma, Amit Ji"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Client Phone Number (WhatsApp)</label>
                <div className="relative">
                  <i className="ri-phone-fill absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 text-xs" />
                  <input
                    type="text"
                    value={pitchClientPhone}
                    onChange={(e) => setPitchClientPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-xs font-mono font-bold text-emerald-800"
                  />
                </div>
              </div>
            </div>

            {/* Generated WhatsApp Message Preview */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-[11px] font-mono whitespace-pre-line text-slate-800 max-h-56 overflow-y-auto leading-relaxed">
              {buildPitchText(pitchingProperty, pitchClientName)}
            </div>

            {/* Direct Send Action Button */}
            <div className="pt-1">
              <a
                href={(() => {
                  const clean = pitchClientPhone.replace(/\D/g, '');
                  const phoneParam = clean ? (clean.length === 10 ? `91${clean}` : clean) : '';
                  const textParam = encodeURIComponent(buildPitchText(pitchingProperty, pitchClientName));
                  return phoneParam
                    ? `https://api.whatsapp.com/send?phone=${phoneParam}&text=${textParam}`
                    : `https://api.whatsapp.com/send?text=${textParam}`;
                })()}
                target="_blank"
                rel="noreferrer"
                onClick={() => { setPitchingProperty(null); setPitchClientPhone(''); }}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="ri-whatsapp-fill text-base" />
                <span>
                  {pitchClientPhone
                    ? `Send to WhatsApp (${pitchClientPhone.trim()})`
                    : 'Send on WhatsApp'}
                </span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
