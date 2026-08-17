import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../lib/api';
import AdminPageHeader from './AdminPageHeader';

const formatFlatPrice = (listing) => {
  const num = listing.listingType === 'rent' ? listing.monthlyRent : listing.salePrice;
  const label = listing.listingType === 'rent' ? '/ mo' : '';
  if (!num) return '—';
  if (num >= 10000000) {
    return `₹ ${(num / 10000000).toFixed(2)} Cr ${label}`.trim();
  }
  if (num >= 100000) {
    return `₹ ${(num / 100000).toFixed(2)} Lakh ${label}`.trim();
  }
  return `₹ ${Number(num).toLocaleString('en-IN')} ${label}`.trim();
};

const formatFullPrice = (listing) => {
  const num = listing.listingType === 'rent' ? listing.monthlyRent : listing.salePrice;
  const label = listing.listingType === 'rent' ? '/ month' : '';
  if (!num) return '—';
  return `₹ ${Number(num).toLocaleString('en-IN')} ${label}`.trim();
};

// Sub-component: Card Media Image Slider with Prev/Next
function CardImageSlider({ images, title, onOpenLightbox }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="h-52 w-full bg-slate-950 flex flex-col items-center justify-center text-slate-700">
        <i className="fa-solid fa-city text-3xl mb-1"></i>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">No Image</span>
      </div>
    );
  }

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative h-56 w-full bg-slate-950 overflow-hidden group select-none">
      <img
        src={images[currentIndex]}
        alt={`${title} - Photo ${currentIndex + 1}`}
        className="h-full w-full object-cover transition-transform duration-300 cursor-pointer"
        onClick={() => onOpenLightbox(images, currentIndex)}
      />

      {/* Prev / Next Arrows (Visible on hover if multiple images) */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-slate-950/80 hover:bg-orange-500 text-white flex items-center justify-center text-xs backdrop-blur-md opacity-80 hover:opacity-100 transition-all cursor-pointer shadow-lg z-10"
            title="Previous Image"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-slate-950/80 hover:bg-orange-500 text-white flex items-center justify-center text-xs backdrop-blur-md opacity-80 hover:opacity-100 transition-all cursor-pointer shadow-lg z-10"
            title="Next Image"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </>
      )}

      {/* Image Counter Badge */}
      <div className="absolute top-3 right-3 rounded-lg bg-slate-950/80 border border-slate-700/80 px-2 py-0.5 text-[10px] font-bold text-slate-200 backdrop-blur-md z-10 flex items-center gap-1">
        <i className="fa-solid fa-camera text-orange-400"></i>
        <span>{currentIndex + 1} / {images.length}</span>
      </div>

      {/* Pagination Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1.5 z-10 pointer-events-none">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex ? 'w-4 bg-orange-400' : 'w-1.5 bg-white/50'
              }`}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FlatListingsAuditView() {
  const [listings, setListings] = useState([]);
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, rent, buy
  const [filterStatus, setFilterStatus] = useState('all'); // all, available, rented, sold
  const [filterSalesman, setFilterSalesman] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, price-low, price-high, shares

  // View Mode: 'grid' | 'rows'
  const [viewMode, setViewMode] = useState('grid');
  const [expandedRowId, setExpandedRowId] = useState(null);

  // Lightbox Slider state
  const [lightbox, setLightbox] = useState(null); // { images: [], index: 0, title: '' }

  const fetchData = async () => {
    setLoading(true);
    try {
      const [listingData, shareData] = await Promise.all([
        api('/api/flat-listings'),
        api('/api/shares/list'),
      ]);
      setListings(Array.isArray(listingData) ? listingData : []);
      setShares(Array.isArray(shareData) ? shareData : []);
      setStatus('');
    } catch (err) {
      setStatus(err.message || 'Failed to load flat listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sharesForListing = (listingId) => shares.filter((s) => s.listing?._id === listingId);

  // Unique list of salesmen
  const salesmenList = useMemo(() => {
    const map = new Map();
    listings.forEach((l) => {
      if (l.submittedBy?._id && l.submittedBy?.name) {
        map.set(l.submittedBy._id, l.submittedBy.name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [listings]);

  // Analytics Metrics
  const metrics = useMemo(() => {
    const total = listings.length;
    const rentCount = listings.filter((l) => l.listingType === 'rent').length;
    const buyCount = listings.filter((l) => l.listingType === 'buy').length;
    const closedCount = listings.filter((l) => l.dealStatus === 'rented' || l.dealStatus === 'sold').length;
    const totalSharesCount = shares.length;
    return { total, rentCount, buyCount, closedCount, totalSharesCount };
  }, [listings, shares]);

  // Filtered & Sorted Listings
  const filteredListings = useMemo(() => {
    return listings
      .filter((listing) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const title = (listing.title || '').toLowerCase();
          const config = (listing.configuration || '').toLowerCase();
          const location = (listing.location || '').toLowerCase();
          const salesman = (listing.submittedBy?.name || '').toLowerCase();
          const rera = (listing.reraId || '').toLowerCase();
          const matches =
            title.includes(q) ||
            config.includes(q) ||
            location.includes(q) ||
            salesman.includes(q) ||
            rera.includes(q);
          if (!matches) return false;
        }

        if (filterType !== 'all' && listing.listingType !== filterType) return false;
        if (filterStatus !== 'all' && listing.dealStatus !== filterStatus) return false;
        if (filterSalesman !== 'all' && listing.submittedBy?._id !== filterSalesman) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);

        const priceA = a.listingType === 'rent' ? (a.monthlyRent || 0) : (a.salePrice || 0);
        const priceB = b.listingType === 'rent' ? (b.monthlyRent || 0) : (b.salePrice || 0);

        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'shares') {
          return sharesForListing(b._id).length - sharesForListing(a._id).length;
        }
        return 0;
      });
  }, [listings, shares, searchQuery, filterType, filterStatus, filterSalesman, sortBy]);

  // Helper to compile all images for a listing
  const getListingImages = (listing) => {
    const list = [];
    if (listing.coverImage) list.push(listing.coverImage);
    if (Array.isArray(listing.images)) {
      listing.images.forEach((img) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    return list;
  };

  // Lightbox slider controls
  const handleLightboxPrev = () => {
    if (!lightbox) return;
    setLightbox((prev) => ({
      ...prev,
      index: prev.index === 0 ? prev.images.length - 1 : prev.index - 1,
    }));
  };

  const handleLightboxNext = () => {
    if (!lightbox) return;
    setLightbox((prev) => ({
      ...prev,
      index: prev.index === prev.images.length - 1 ? 0 : prev.index + 1,
    }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <AdminPageHeader
        badge="SALESMEN SUBMISSIONS & WHATSAPP AUDIT"
        title="Flat Listings Audit & Distribution"
        subtitle="Track all flat properties, browse photos with back/next slider, inspect full specifications, and monitor live WhatsApp share status."
        icon="fa-solid fa-building-user"
        iconColor="text-orange-400"
        iconBg="bg-gradient-to-tr from-orange-500/20 to-amber-500/10 border-orange-500/30"
        breadcrumbs={[
          { label: 'Admin Workspace', link: '/admin/dashboard' },
          { label: 'Flat Listings Audit' },
        ]}
      />

      {/* KPI Metrics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-orange-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Submissions</span>
            <div className="h-8 w-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <i className="fa-solid fa-city text-xs"></i>
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2 tracking-tight">{metrics.total}</p>
          <p className="text-[10px] text-slate-500 mt-1">Total listings registered</p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">For Rent</span>
            <div className="h-8 w-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <i className="fa-solid fa-key text-xs"></i>
            </div>
          </div>
          <p className="text-2xl font-black text-blue-400 mt-2 tracking-tight">{metrics.rentCount}</p>
          <p className="text-[10px] text-slate-500 mt-1">Rental apartments</p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">For Sale</span>
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <i className="fa-solid fa-tag text-xs"></i>
            </div>
          </div>
          <p className="text-2xl font-black text-amber-400 mt-2 tracking-tight">{metrics.buyCount}</p>
          <p className="text-[10px] text-slate-500 mt-1">Ownership properties</p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Deals Closed</span>
            <div className="h-8 w-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <i className="fa-solid fa-handshake-check text-xs"></i>
            </div>
          </div>
          <p className="text-2xl font-black text-purple-300 mt-2 tracking-tight">{metrics.closedCount}</p>
          <p className="text-[10px] text-slate-500 mt-1">Rented or Sold</p>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">WhatsApp Shares</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <i className="fa-brands fa-whatsapp text-sm"></i>
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-2 tracking-tight">{metrics.totalSharesCount}</p>
          <p className="text-[10px] text-slate-500 mt-1">Total client touchpoints</p>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-3 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
            <input
              type="text"
              placeholder="Search by title, location, configuration, salesman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:border-orange-500/60 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-xs"></i>
              </button>
            )}
          </div>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800">
              {[
                { id: 'all', label: 'All Types' },
                { id: 'rent', label: 'Rent' },
                { id: 'buy', label: 'Buy' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                    filterType === tab.id
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-300 focus:border-orange-500/50 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available Only</option>
              <option value="rented">Rented Only</option>
              <option value="sold">Sold Only</option>
            </select>

            {salesmenList.length > 0 && (
              <select
                value={filterSalesman}
                onChange={(e) => setFilterSalesman(e.target.value)}
                className="rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-300 focus:border-orange-500/50 focus:outline-none cursor-pointer max-w-[140px] truncate"
              >
                <option value="all">All Salesmen</option>
                {salesmenList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-300 focus:border-orange-500/50 focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="shares">Most WhatsApp Shared</option>
            </select>

            <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800 ml-auto lg:ml-0">
              <button
                onClick={() => setViewMode('grid')}
                title="Grid View"
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-orange-500 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <i className="fa-solid fa-border-all"></i>
              </button>
              <button
                onClick={() => setViewMode('rows')}
                title="Detailed Rows View"
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  viewMode === 'rows' ? 'bg-orange-500 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <i className="fa-solid fa-list-ul"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
          <span>
            Showing <strong className="text-white">{filteredListings.length}</strong> of{' '}
            <strong className="text-white">{listings.length}</strong> flat listings
          </span>
          <button
            onClick={fetchData}
            className="text-slate-400 hover:text-orange-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <i className={`fa-solid fa-rotate-right ${loading ? 'fa-spin' : ''}`}></i> Refresh
          </button>
        </div>
      </div>

      {status && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-medium text-red-300 flex items-center justify-between">
          <span><i className="fa-solid fa-triangle-exclamation mr-2"></i>{status}</span>
          <button onClick={() => setStatus('')} className="text-red-400 hover:text-red-200">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {/* Main Single Component Content Area */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 rounded-3xl border border-slate-800/80 bg-slate-900/40">
          <i className="fa-solid fa-circle-notch fa-spin text-3xl text-orange-500 mb-3 block"></i>
          <p className="text-xs font-semibold text-slate-300">Loading flat listings and WhatsApp distribution data...</p>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="py-20 text-center text-slate-400 rounded-3xl border border-slate-800/80 bg-slate-900/40 space-y-3">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-600 text-2xl">
            <i className="fa-solid fa-house-circle-xmark"></i>
          </div>
          <h3 className="text-sm font-bold text-white">No Flat Listings Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No properties match your current search parameters or filters.
          </p>
        </div>
      ) : (
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 gap-6' : 'grid-cols-1 gap-6'}`}>
          {filteredListings.map((listing) => {
            const listingShares = sharesForListing(listing._id);
            const isRent = listing.listingType === 'rent';
            const images = getListingImages(listing);
            const isExpandedRow = expandedRowId === listing._id;

            return (
              <div
                key={listing._id}
                className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden flex flex-col backdrop-blur-xl transition-all duration-300 hover:border-slate-700"
              >
                {/* Top Section: Photo Slider & Badges */}
                <div className="relative">
                  <CardImageSlider
                    images={images}
                    title={listing.title || listing.configuration}
                    onOpenLightbox={(imgs, idx) =>
                      setLightbox({
                        images: imgs,
                        index: idx,
                        title: listing.title || listing.configuration,
                      })
                    }
                  />

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                    <span
                      className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-md backdrop-blur-md ${
                        isRent
                          ? 'bg-blue-600/90 text-white border border-blue-400/40'
                          : 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border border-amber-400/40'
                      }`}
                    >
                      {isRent ? 'For Rent' : 'For Sale'}
                    </span>

                    <span
                      className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                        listing.dealStatus === 'available'
                          ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                          : listing.dealStatus === 'rented'
                          ? 'bg-purple-950/90 text-purple-300 border-purple-500/40'
                          : 'bg-red-950/90 text-red-300 border-red-500/40'
                      }`}
                    >
                      {listing.dealStatus}
                    </span>
                  </div>

                  {/* Price Tag Banner Overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 flex items-end justify-between z-10">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {isRent ? 'Monthly Rent' : 'Sale Price'}
                      </p>
                      <p className="text-xl font-black text-amber-400 tracking-tight mt-0.5">
                        {formatFlatPrice(listing)}
                      </p>
                    </div>
                    {listing.sizeSqft && (
                      <span className="text-xs font-semibold text-slate-200 bg-slate-900/90 px-2.5 py-1 rounded-xl border border-slate-700/80">
                        <i className="fa-solid fa-ruler-combined text-orange-400 mr-1.5"></i>
                        {listing.sizeSqft} sqft
                      </span>
                    )}
                  </div>
                </div>

                {/* Single Component Body: All Data Rendered Directly */}
                <div className="p-5 flex-1 space-y-5">
                  {/* Title & Location Header */}
                  <div>
                    <h3 className="text-base font-bold text-white leading-snug">
                      {listing.title || listing.configuration}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                      <i className="fa-solid fa-location-dot text-orange-500"></i>
                      <span>{listing.location}</span>
                    </p>
                  </div>

                  {/* Key Specifications Grid */}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <i className="fa-solid fa-list-check text-orange-400"></i> Specifications
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        ['Config', listing.configuration],
                        ['Possession', listing.possessionStatus || 'Ready to Move'],
                        ['Floor', listing.floor ? `${listing.floor} of ${listing.totalFloors || '—'}` : '—'],
                        ['Lift / Elevator', listing.lift || 'YES'],
                        ['Facing', listing.facing || '—'],
                        ['Parking', listing.parking || '—'],
                        ['RERA ID', listing.reraId || 'Not Applicable'],
                        ['Built Year', listing.constructionYear || '—'],
                        ...(isRent
                          ? [
                              ['Security Deposit', listing.securityDeposit ? `₹ ${Number(listing.securityDeposit).toLocaleString('en-IN')}` : '—'],
                              ['Maintenance', listing.maintenanceCharge ? `₹ ${Number(listing.maintenanceCharge).toLocaleString('en-IN')}/mo` : '—'],
                              ['Available From', listing.availableFrom || 'Immediate'],
                            ]
                          : [
                              ['Price / Sqft', listing.pricePerSqft ? `₹ ${Number(listing.pricePerSqft).toLocaleString('en-IN')}` : '—'],
                              ['Negotiable', listing.priceNegotiable ? 'Yes' : 'No'],
                            ]),
                      ].map(([label, val]) => (
                        <div key={label} className="rounded-xl border border-slate-800 bg-slate-950/80 p-2.5">
                          <p className="text-[9px] uppercase font-semibold text-slate-500">{label}</p>
                          <p className="text-xs font-bold text-slate-200 truncate mt-0.5">{val}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  {listing.amenities?.trim() && (
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1.5 flex items-center gap-1.5">
                        <i className="fa-solid fa-shield-halved"></i> Amenities
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {listing.amenities.split(',').map((item, idx) => (
                          <span
                            key={idx}
                            className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-medium text-emerald-300 flex items-center gap-1.5"
                          >
                            <i className="fa-solid fa-check text-[10px] text-emerald-400"></i>
                            {item.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Video Presentation embedded directly if present */}
                  {listing.videoUrl && (
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-2 flex items-center gap-1.5">
                        <i className="fa-solid fa-circle-play"></i> Video Tour
                      </h4>
                      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                        {listing.videoUrl.includes('youtube.com') || listing.videoUrl.includes('youtu.be') ? (
                          <iframe
                            src={listing.videoUrl.replace('watch?v=', 'embed/')}
                            title="Flat Video"
                            className="h-full w-full border-0"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <video src={listing.videoUrl} controls className="h-full w-full object-contain"></video>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {listing.description && (
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                        <i className="fa-solid fa-align-left text-orange-400"></i> Description
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                        {listing.description}
                      </p>
                    </div>
                  )}

                  {/* Salesman Info Tag */}
                  <div className="flex items-center justify-between rounded-xl bg-slate-950 p-3 border border-slate-800">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-7 w-7 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-xs shrink-0">
                        {(listing.submittedBy?.name || 'S')[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] uppercase font-bold text-slate-500">Submitted Salesman</p>
                        <p className="text-xs font-bold text-white truncate">{listing.submittedBy?.name || 'Salesman'}</p>
                      </div>
                    </div>
                    {listing.submittedBy?.email && (
                      <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{listing.submittedBy.email}</span>
                    )}
                  </div>

                  {/* BOTTOM SECTION: PROMINENT WHATSAPP STATUS & DETAILS */}
                  <div className="border-t border-slate-800/90 pt-4 space-y-3">
                    {/* Status Summary Banner */}
                    <div className="rounded-2xl bg-emerald-950/40 border border-emerald-500/30 p-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-base shrink-0 shadow-lg shadow-emerald-500/10">
                          <i className="fa-brands fa-whatsapp"></i>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">WhatsApp Broadcast Status</p>
                          <p className="text-xs font-bold text-white mt-0.5">
                            {listingShares.length === 0 ? (
                              <span className="text-slate-400">Not shared with any customers yet</span>
                            ) : (
                              <span>
                                Sent to <strong className="text-emerald-400">{listingShares.length}</strong> customer{listingShares.length !== 1 ? 's' : ''} via WhatsApp
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {listingShares.length > 0 && (
                        <button
                          onClick={() => setExpandedRowId(isExpandedRow ? null : listing._id)}
                          className="rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <span>{isExpandedRow ? 'Hide Log' : 'View Log'}</span>
                          <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${isExpandedRow ? 'rotate-180' : ''}`}></i>
                        </button>
                      )}
                    </div>

                    {/* WhatsApp Audit Details List (Expanded or visible if shares exist) */}
                    {(isExpandedRow || listingShares.length <= 3) && listingShares.length > 0 && (
                      <div className="space-y-2 pt-1 animate-fadeIn">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          WhatsApp Share Log Details ({listingShares.length})
                        </p>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {listingShares.map((s) => (
                            <div
                              key={s._id}
                              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <i className="fa-solid fa-paper-plane text-emerald-400 text-xs shrink-0"></i>
                                <div className="min-w-0">
                                  <p className="text-slate-200 font-medium truncate">
                                    <strong className="text-white">{s.sharedBy?.name || 'Staff'}</strong> shared with{' '}
                                    <span className="font-mono text-emerald-400 font-bold">+{s.phone}</span>
                                  </p>
                                </div>
                              </div>
                              <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">
                                {new Date(s.createdAt).toLocaleString('en-IN', {
                                  dateStyle: 'short',
                                  timeStyle: 'short',
                                })}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIGHTBOX MEDIA SLIDER OVERLAY */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl animate-fadeIn">
          {/* Close Button */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 h-11 w-11 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center text-xl transition-colors cursor-pointer z-50"
            title="Close Lightbox"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          {/* Prev / Next Arrows */}
          {lightbox.images.length > 1 && (
            <>
              <button
                onClick={handleLightboxPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-slate-900/90 hover:bg-orange-500 border border-slate-700 text-white flex items-center justify-center text-lg transition-all cursor-pointer z-50 shadow-2xl"
                title="Previous Image"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>

              <button
                onClick={handleLightboxNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-slate-900/90 hover:bg-orange-500 border border-slate-700 text-white flex items-center justify-center text-lg transition-all cursor-pointer z-50 shadow-2xl"
                title="Next Image"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </>
          )}

          {/* Image Display */}
          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center select-none">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-bold text-white">{lightbox.title}</span>
              <span className="rounded-lg bg-orange-500/20 border border-orange-500/40 px-2.5 py-0.5 text-xs font-mono font-bold text-orange-400">
                {lightbox.index + 1} / {lightbox.images.length}
              </span>
            </div>

            <img
              src={lightbox.images[lightbox.index]}
              alt={`Photo ${lightbox.index + 1}`}
              className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl border border-slate-800"
            />
          </div>
        </div>
      )}
    </div>
  );
}
