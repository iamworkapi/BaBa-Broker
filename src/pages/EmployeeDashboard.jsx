import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { clearAuth, getAuth } from '../lib/auth';
import AssignedLeadsPanel from '../components/AssignedLeadsPanel';

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
  listing.listingType === 'rent' ? `${formatINR(listing.monthlyRent)} / mo` : formatINR(listing.salePrice);

const buildFlatWhatsAppMessage = (listing, clientName, note) => {
  const greeting = clientName ? `Hi ${clientName}, ` : 'Hi, ';
  const dealInfo =
    listing.listingType === 'rent'
      ? `\n🏠 For Rent | ${listing.configuration || 'Apartment'}\n💰 Monthly Rent: ${formatINR(listing.monthlyRent)}${listing.securityDeposit ? `\n🔒 Security Deposit: ${formatINR(listing.securityDeposit)}` : ''}${listing.availableFrom ? `\n📅 Available From: ${listing.availableFrom}` : ''}`
      : `\n🏠 For Sale | ${listing.configuration || 'Apartment'}\n💰 Price: ${formatINR(listing.salePrice)}${listing.priceNegotiable ? ' (Negotiable)' : ''}`;

  const specs = `\n📐 Size: ${listing.sizeSqft || 'N/A'} sqft${listing.floor ? ` | Floor: ${listing.floor}` : ''}${listing.possessionStatus ? ` | ${listing.possessionStatus}` : ''}`;
  const noteText = note ? `\n\n📌 Note: ${note}` : '';

  return encodeURIComponent(
    `${greeting}Check out this verified flat listing from Baba Broker:\n\n*${listing.title || listing.configuration || 'Verified Apartment'}*\n📍 Location: ${listing.location || 'Prime Location'}${dealInfo}${specs}${noteText}\n\nContact Baba Broker Operations for site visits.`
  );
};

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [view, setView] = useState('listings'); // 'listings' | 'leads' | 'stats'
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'rent' | 'buy'
  const [layoutMode, setLayoutMode] = useState('grid'); // 'grid' | 'table'
  const [copiedId, setCopiedId] = useState(null);

  // WhatsApp Share Drawer State
  const [shareTarget, setShareTarget] = useState(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [customNote, setCustomNote] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await api('/api/flat-listings');
      setListings(Array.isArray(data) ? data : []);
    } catch (err) {
      setStatus(err.message);
      if (/sign in|session/i.test(err.message)) navigate('/employee/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const total = listings.length;
    const rentCount = listings.filter((i) => i.listingType === 'rent').length;
    const saleCount = listings.filter((i) => i.listingType === 'buy' || i.listingType === 'sale').length;
    const readyCount = listings.filter((i) => (i.possessionStatus || '').toLowerCase().includes('ready')).length;

    return { total, rentCount, saleCount, readyCount };
  }, [listings]);

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      if (filterType === 'rent' && item.listingType !== 'rent') return false;
      if ((filterType === 'buy' || filterType === 'sale') && item.listingType !== 'buy' && item.listingType !== 'sale') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.location?.toLowerCase().includes(q) ||
          item.configuration?.toLowerCase().includes(q) ||
          item.title?.toLowerCase().includes(q) ||
          item.ownerName?.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [listings, searchQuery, filterType]);

  const openShare = (listing) => {
    setShareTarget(listing);
    setClientName('');
    setClientPhone('');
    setCustomNote('');
  };

  const sendShare = async () => {
    if (!shareTarget) return;
    const phone = clientPhone.replace(/\D/g, '');
    if (!phone || phone.length < 10) {
      setStatus('Please enter a valid 10-digit WhatsApp phone number.');
      return;
    }

    try {
      await api('/api/shares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing: shareTarget._id, phone }),
      }).catch(() => null);

      const message = buildFlatWhatsAppMessage(shareTarget, clientName, customNote);
      window.open(`https://wa.me/91${phone}?text=${message}`, '_blank', 'noopener,noreferrer');
      setShareTarget(null);
      setStatus('Listing dispatched successfully via WhatsApp.');
    } catch (err) {
      setStatus(err.message);
    }
  };

  const handleCopyPitch = (listing) => {
    const pitch = `🏠 *${listing.title || listing.configuration}*\n📍 ${listing.location}\n💰 ${priceLabel(listing)}\n📐 Size: ${listing.sizeSqft || 'N/A'} sqft | Floor: ${listing.floor || 'N/A'}\nKey Amenities: ${listing.amenities || 'Standard'}\nInquire with Baba Broker Operations!`;
    navigator.clipboard?.writeText(pitch);
    setCopiedId(listing._id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070e1c] text-slate-100 p-2 sm:p-4 font-['Inter',sans-serif] flex flex-col justify-between overflow-x-hidden">
      {/* Master Curved Container Frame */}
      <div className="w-full max-w-7xl mx-auto rounded-[28px] sm:rounded-[36px] bg-slate-950 shadow-2xl border border-slate-800/80 overflow-hidden flex flex-col min-h-[92vh]">
        
        {/* Top Header Navigation Bar */}
        <header className="px-5 sm:px-8 py-3.5 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3.5">
            <Link to="/" className="flex items-center group">
              <img
                src="/assets/img/logo.svg"
                alt="Logo"
                className="h-8 sm:h-9 w-auto object-contain brightness-0 invert transition-transform group-hover:scale-105"
              />
            </Link>
            <div className="hidden sm:flex items-center gap-2 border-l border-slate-800 pl-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Operations Desk
              </span>
              <span className="text-xs text-slate-400 font-medium">· {auth?.name || 'Employee Executive'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                clearAuth();
                navigate('/employee/login');
              }}
              className="text-xs font-bold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 border border-red-500/20 px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <i className="ri-logout-box-r-line"></i>
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          
          {/* Welcome & Overview Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-md">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <i className="ri-building-line"></i> Verified Property & Leads Hub
              </span>
              <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight mt-0.5">
                Operations & Unit Verification Portal
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Audit flat listings submitted by the sales force, conduct owner checks, and dispatch property brochures.
              </p>
            </div>

            {/* View Tab Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setView('listings')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  view === 'listings' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <i className="ri-building-line"></i>
                <span>Flat Listings</span>
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-slate-900/40 text-slate-900">
                  {stats.total}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setView('leads')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  view === 'leads' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <i className="ri-hand-coin-line"></i>
                <span>Assigned Leads</span>
              </button>
            </div>
          </div>

          {/* Status Alert Banner */}
          {status && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-200 flex items-center justify-between shadow-xs animate-fadeIn">
              <span className="flex items-center gap-2">
                <i className="ri-checkbox-circle-line text-emerald-400 text-base"></i> {status}
              </span>
              <button onClick={() => setStatus('')} className="text-emerald-400 hover:text-white">
                <i className="ri-close-line text-sm"></i>
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* THE FOUR OPERATIONS KPI METRIC CARDS                                      */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* CARD 1: Total Units */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-xs hover:border-emerald-500/40 transition-all flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Inventory
                </span>
                <span className="text-xl sm:text-2xl font-black text-white">{stats.total} Units</span>
                <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <i className="ri-shield-check-line"></i> Audited & Verified
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg">
                <i className="ri-building-4-line"></i>
              </div>
            </div>

            {/* CARD 2: Rental Units */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-xs hover:border-blue-500/40 transition-all flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Rental Units
                </span>
                <span className="text-xl sm:text-2xl font-black text-white">{stats.rentCount} Flats</span>
                <p className="text-[10px] text-blue-400 font-semibold flex items-center gap-1">
                  <i className="ri-key-line"></i> High Tenant Demand
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-lg">
                <i className="ri-home-wifi-line"></i>
              </div>
            </div>

            {/* CARD 3: Sale Listings */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-xs hover:border-orange-500/40 transition-all flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Direct Sale Units
                </span>
                <span className="text-xl sm:text-2xl font-black text-white">{stats.saleCount} Deals</span>
                <p className="text-[10px] text-orange-400 font-semibold flex items-center gap-1">
                  <i className="ri-fire-line"></i> Hot Builder Floors
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center text-lg">
                <i className="ri-community-line"></i>
              </div>
            </div>

            {/* CARD 4: Ready Possession */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-xs hover:border-purple-500/40 transition-all flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Ready to Move
                </span>
                <span className="text-xl sm:text-2xl font-black text-white">{stats.readyCount} Units</span>
                <p className="text-[10px] text-purple-400 font-semibold flex items-center gap-1">
                  <i className="ri-flashlight-line"></i> Instant Possession
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center text-lg">
                <i className="ri-checkbox-circle-line"></i>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* MAIN VIEW CONTENT AREA                                                    */}
          {/* ========================================================================= */}
          {view === 'leads' ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:p-5 shadow-sm">
              <AssignedLeadsPanel />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                {/* Search input */}
                <div className="relative flex-1">
                  <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by location, configuration, title, owner..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <i className="ri-close-line text-xs"></i>
                    </button>
                  )}
                </div>

                {/* Filter Pills & Layout Switcher */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-[11px] font-bold">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'rent', label: 'For Rent' },
                      { id: 'buy', label: 'For Sale' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFilterType(f.id)}
                        className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                          filterType === f.id ? 'bg-emerald-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Grid vs Table */}
                  <div className="flex items-center gap-0.5 bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setLayoutMode('grid')}
                      className={`p-1 px-2 rounded-lg transition cursor-pointer ${
                        layoutMode === 'grid' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Card Grid"
                    >
                      <i className="ri-grid-fill"></i>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLayoutMode('table')}
                      className={`p-1 px-2 rounded-lg transition cursor-pointer ${
                        layoutMode === 'table' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Table List"
                    >
                      <i className="ri-list-check"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Listings Output */}
              {loading ? (
                <div className="py-20 text-center text-slate-400">
                  <i className="ri-loader-4-line text-3xl animate-spin text-emerald-400 mb-2 block"></i>
                  Loading verified flat directory...
                </div>
              ) : filteredListings.length === 0 ? (
                <div className="py-16 text-center text-slate-400 rounded-2xl border border-slate-800 bg-slate-900/40">
                  <i className="ri-inbox-line text-4xl mb-2 block text-slate-600"></i>
                  No verified flat listings match your search criteria.
                </div>
              ) : layoutMode === 'grid' ? (
                /* GRID VIEW */
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredListings.map((item) => {
                    const isCopied = copiedId === item._id;

                    return (
                      <div
                        key={item._id}
                        className="rounded-2xl border border-slate-800/90 bg-slate-900/80 hover:border-emerald-500/50 hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
                      >
                        <div>
                          {/* Image & Badges */}
                          <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                            {item.coverImage ? (
                              <img
                                src={item.coverImage}
                                alt={item.title || item.location}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-slate-600">
                                <i className="ri-building-line text-3xl"></i>
                              </div>
                            )}

                            <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 z-10">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                                  item.listingType === 'rent'
                                    ? 'bg-blue-500 text-white shadow-xs'
                                    : 'bg-orange-500 text-white shadow-xs'
                                }`}
                              >
                                {item.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                              </span>

                              <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-950/80 text-white border border-slate-800 backdrop-blur-xs">
                                {item.configuration || 'Apartment'}
                              </span>
                            </div>
                          </div>

                          {/* Content Details */}
                          <div className="p-4 space-y-3">
                            <div>
                              <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                                {item.title || item.configuration || 'Verified Flat Unit'}
                              </h3>
                              <p className="text-xs text-slate-400 flex items-center gap-1 font-normal mt-0.5">
                                <i className="ri-map-pin-line text-emerald-400"></i>
                                <span className="truncate">{item.location || 'Prime Location'}</span>
                              </p>
                            </div>

                            {/* 4-Cell Specs Grid */}
                            <div className="grid grid-cols-4 gap-1.5 rounded-xl border border-slate-800 bg-slate-950 p-2 text-center text-xs">
                              <div>
                                <p className="text-[9px] uppercase text-slate-500 font-bold">Config</p>
                                <p className="text-[11px] font-bold text-white truncate">{item.configuration || '2 BHK'}</p>
                              </div>
                              <div>
                                <p className="text-[9px] uppercase text-slate-500 font-bold">Status</p>
                                <p className="text-[11px] font-bold text-emerald-400 truncate">{item.possessionStatus || 'Ready'}</p>
                              </div>
                              <div>
                                <p className="text-[9px] uppercase text-slate-500 font-bold">Price</p>
                                <p className="text-[11px] font-bold text-amber-400 truncate">{priceLabel(item)}</p>
                              </div>
                              <div>
                                <p className="text-[9px] uppercase text-slate-500 font-bold">Size</p>
                                <p className="text-[11px] font-bold text-white truncate">{item.sizeSqft || '—'} sqft</p>
                              </div>
                            </div>

                            {item.submittedBy?.name && (
                              <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
                                <i className="ri-user-star-line text-emerald-400"></i> Submitted by {item.submittedBy.name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Card Bottom Dispatch Actions */}
                        <div className="p-4 pt-0 flex items-center gap-2 border-t border-slate-800/80 mt-2">
                          <button
                            type="button"
                            onClick={() => openShare(item)}
                            className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <i className="ri-whatsapp-line text-sm"></i>
                            <span>Send WhatsApp</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyPitch(item)}
                            className={`p-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                              isCopied ? 'bg-white text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            }`}
                            title="Copy Listing Copy"
                          >
                            {isCopied ? <i className="ri-check-line text-emerald-500"></i> : <i className="ri-file-copy-line"></i>}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* TABLE VIEW */
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-800">
                        <th className="p-3.5">Unit & Location</th>
                        <th className="p-3.5">Type</th>
                        <th className="p-3.5">Configuration</th>
                        <th className="p-3.5">Pricing</th>
                        <th className="p-3.5">Size</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {filteredListings.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-900/80 transition-colors">
                          <td className="p-3.5 font-bold text-white">
                            <span className="block truncate">{item.title || item.configuration || 'Verified Flat'}</span>
                            <span className="text-[10px] text-slate-400 font-normal flex items-center gap-1">
                              <i className="ri-map-pin-line text-emerald-400"></i> {item.location}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${item.listingType === 'rent' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}`}>
                              {item.listingType === 'rent' ? 'Rent' : 'Sale'}
                            </span>
                          </td>
                          <td className="p-3.5 font-semibold text-white">{item.configuration}</td>
                          <td className="p-3.5 font-bold text-amber-400">{priceLabel(item)}</td>
                          <td className="p-3.5">{item.sizeSqft ? `${item.sizeSqft} sqft` : '—'}</td>
                          <td className="p-3.5 text-emerald-400 font-medium">{item.possessionStatus || 'Ready'}</td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openShare(item)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1"
                              >
                                <i className="ri-whatsapp-line"></i> Share
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-slate-800/80 bg-slate-950 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span>Baba Broker Operations Portal v2.4</span>
          </div>
          <p>© {new Date().getFullYear()} Baba Broker. All rights reserved.</p>
        </footer>
      </div>

      {/* WhatsApp Share Drawer Modal */}
      {shareTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="ri-whatsapp-line text-emerald-400 text-lg"></i> Dispatch via WhatsApp
              </h3>
              <button onClick={() => setShareTarget(null)} className="text-slate-400 hover:text-white p-1">
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
              <p className="text-xs font-bold text-white">{shareTarget.title || shareTarget.configuration}</p>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <i className="ri-map-pin-line text-emerald-400"></i> {shareTarget.location}
              </p>
              <p className="text-xs font-black text-amber-400 pt-1">{priceLabel(shareTarget)}</p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-medium text-slate-300">
                Customer Name
                <input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-emerald-500"
                />
              </label>

              <label className="block text-xs font-medium text-slate-300">
                WhatsApp Phone Number *
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="e.g. 9876543210 (10 Digits)"
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-emerald-500"
                />
              </label>

              <label className="block text-xs font-medium text-slate-300">
                Custom Pitch Note (Optional)
                <textarea
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  rows="2"
                  placeholder="e.g. Great gated community with lift & dedicated car parking!"
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-emerald-500 resize-none"
                />
              </label>
            </div>

            <button
              onClick={sendShare}
              disabled={!clientPhone}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <i className="ri-whatsapp-line text-lg"></i>
              <span>Launch WhatsApp Chat</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

