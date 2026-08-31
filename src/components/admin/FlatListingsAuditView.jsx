import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../services/api';
import { safeEmbedUrl } from '../../utils/sanitize';
import {
  AdminButton,
  AdminSearchBar,
  AdminStatCard,
  AdminBadge,
  AdminDrawer,
  AdminDataTable,
} from '../ui';

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

// Sub-component: Card Media Image Slider with Prev/Next
function CardImageSlider({ images, title, onOpenLightbox }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="h-52 w-full bg-slate-100 flex flex-col items-center justify-center text-slate-400">
        <i className="ri-building-line text-3xl mb-1" />
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">No Photos</span>
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
    <div className="relative h-56 w-full bg-slate-900 overflow-hidden group select-none">
      <img
        src={images[currentIndex]}
        alt={`${title} - Photo ${currentIndex + 1}`}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
        onClick={() => onOpenLightbox(images, currentIndex)}
      />

      {/* Prev / Next Arrows */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-slate-950/70 hover:bg-orange-600 text-white flex items-center justify-center text-xs backdrop-blur-md opacity-80 hover:opacity-100 transition-all cursor-pointer shadow-lg z-10"
            title="Previous Image"
          >
            <i className="ri-arrow-left-s-line text-base" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-slate-950/70 hover:bg-orange-600 text-white flex items-center justify-center text-xs backdrop-blur-md opacity-80 hover:opacity-100 transition-all cursor-pointer shadow-lg z-10"
            title="Next Image"
          >
            <i className="ri-arrow-right-s-line text-base" />
          </button>
        </>
      )}

      {/* Image Counter Badge */}
      <div className="absolute top-3 right-3 rounded-lg bg-slate-950/80 border border-slate-700/80 px-2 py-0.5 text-[10px] font-bold text-slate-200 backdrop-blur-md z-10 flex items-center gap-1">
        <i className="ri-camera-lens-line text-orange-400" />
        <span>{currentIndex + 1} / {images.length}</span>
      </div>

      {/* Pagination Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10 pointer-events-none">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex ? 'w-4 bg-orange-500' : 'w-1.5 bg-white/60'
              }`}
            />
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

  // View Mode: 'grid' | 'table'
  const [viewMode, setViewMode] = useState('grid');
  const [selectedUnit, setSelectedUnit] = useState(null);

  // Lightbox Slider state
  const [lightbox, setLightbox] = useState(null);

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

        const priceA = a.listingType === 'rent' ? a.monthlyRent || 0 : a.salePrice || 0;
        const priceB = b.listingType === 'rent' ? b.monthlyRent || 0 : b.salePrice || 0;

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

  // Columns for the Dense Table View
  const tableColumns = [
    {
      key: 'title',
      label: 'Apartment / Property',
      sortable: true,
      render: (_, listing) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80">
            {listing.coverImage ? (
              <img src={listing.coverImage} alt={listing.title} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-400">
                <i className="ri-building-line" />
              </div>
            )}
          </div>
          <div className="min-w-0 max-w-xs">
            <span className="font-bold text-slate-900 block truncate">{listing.title || listing.configuration}</span>
            <span className="text-[11px] text-slate-400 block truncate">{listing.location}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'listingType',
      label: 'Type & Price',
      sortable: true,
      render: (type, listing) => (
        <div>
          <span className="font-bold text-slate-900 block tabular-nums">
            {formatFlatPrice(listing)}
          </span>
          <AdminBadge variant={type === 'rent' ? 'info' : 'orange'} size="sm">
            {type === 'rent' ? 'Rental' : 'Ownership'}
          </AdminBadge>
        </div>
      ),
    },
    {
      key: 'configuration',
      label: 'Config',
      render: (config, listing) => (
        <div>
          <span className="font-semibold text-slate-800 block">{config}</span>
          {listing.sizeSqft && (
            <span className="text-[11px] text-slate-400">{listing.sizeSqft} sqft</span>
          )}
        </div>
      ),
    },
    {
      key: 'dealStatus',
      label: 'Deal Status',
      sortable: true,
      render: (status) => {
        const isClosed = status === 'sold' || status === 'rented';
        return (
          <AdminBadge variant={isClosed ? 'danger' : 'success'} size="sm" dot>
            {status}
          </AdminBadge>
        );
      },
    },
    {
      key: 'submittedBy',
      label: 'Submitting Salesman',
      render: (submittedBy) => (
        <span className="font-medium text-slate-700 text-xs">
          {submittedBy?.name || 'Sales Desk'}
        </span>
      ),
    },
    {
      key: 'shares',
      label: 'WhatsApp Shares',
      sortable: true,
      align: 'center',
      render: (_, listing) => {
        const count = sharesForListing(listing._id).length;
        return (
          <span className={`font-bold tabular-nums ${count > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
            {count}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, listing) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedUnit(listing)}
            className="p-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition cursor-pointer text-xs font-bold flex items-center gap-1"
            title="Inspect Full Specifications"
          >
            <i className="ri-file-list-3-line" />
            <span>Audit</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-['Inter',sans-serif] text-slate-800 antialiased select-text pb-12">
      {/* ─── TOP EXECUTIVE PAGE HEADER ─── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-orange-500/15 text-orange-600 border border-orange-500/25">
              <i className="ri-community-line" />
              Salesmen Submissions & WhatsApp Audit
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              · Verified Inventory Pipeline
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Flat Listings Audit & Distribution
          </h1>
          <p className="text-xs text-slate-500 font-normal max-w-xl">
            Audit salesmen flat registrations, inspect full property specifications, preview video walkthroughs, and monitor live WhatsApp broadcast touchpoints.
          </p>
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <AdminButton
            variant="outline"
            size="md"
            icon={`ri-refresh-line ${loading ? 'animate-spin' : ''}`}
            onClick={fetchData}
          >
            Refresh Inventory
          </AdminButton>
        </div>
      </div>

      {/* ─── STATUS NOTICE TOAST ─── */}
      {status && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-xs font-bold text-rose-900 flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <i className="ri-error-warning-fill text-rose-600 text-base" />
            <span>{status}</span>
          </div>
          <button
            onClick={() => setStatus('')}
            className="text-rose-700 hover:text-rose-900 p-0.5 cursor-pointer"
          >
            <i className="ri-close-line text-base" />
          </button>
        </div>
      )}

      {/* ─── 4 REUSABLE KPI STAT CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AdminStatCard
          title="Total Units"
          value={metrics.total}
          subValue="Listings"
          icon="ri-building-line"
          theme="orange"
          trendLabel="Registered Properties"
        />

        <AdminStatCard
          title="For Rent"
          value={metrics.rentCount}
          subValue="Units"
          icon="ri-key-2-line"
          theme="emerald"
          trendLabel="Active Rental Inventory"
        />

        <AdminStatCard
          title="For Sale"
          value={metrics.buyCount}
          subValue="Units"
          icon="ri-price-tag-3-line"
          theme="indigo"
          trendLabel="Resale & Builder Floors"
        />

        <AdminStatCard
          title="WhatsApp Shares"
          value={metrics.totalSharesCount}
          subValue="Sent"
          icon="ri-whatsapp-line"
          theme="rose"
          trendLabel="Client WhatsApp Touchpoints"
        />
      </div>

      {/* ─── CONTROLS & FILTER TOOLBAR ─── */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="flex-1 max-w-sm">
            <AdminSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by title, location, configuration..."
            />
          </div>

          {/* Filters & View Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Type Filter Tabs */}
            <div className="flex items-center gap-0.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {[
                { id: 'all', label: 'All' },
                { id: 'rent', label: 'Rent' },
                { id: 'buy', label: 'Buy' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterType(tab.id)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    filterType === tab.id
                      ? 'bg-white text-orange-600 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Status Dropdown */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:border-orange-500 focus:bg-white outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="sold">Sold</option>
            </select>

            {/* Salesmen Filter */}
            {salesmenList.length > 0 && (
              <select
                value={filterSalesman}
                onChange={(e) => setFilterSalesman(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:border-orange-500 focus:bg-white outline-none cursor-pointer max-w-[140px] truncate"
              >
                <option value="all">All Salesmen</option>
                {salesmenList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:border-orange-500 focus:bg-white outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="shares">Most WhatsApp Shares</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-0.5 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 px-2.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-orange-600 shadow-xs font-bold'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Grid Cards View"
              >
                <i className="ri-grid-fill" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 px-2.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-orange-600 shadow-xs font-bold'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Dense Table View"
              >
                <i className="ri-list-check" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT VIEW (GRID OR DENSE TABLE) ─── */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 rounded-3xl border border-slate-200/90 bg-white shadow-xs">
          <div className="inline-block rounded-full border-2 border-slate-200 border-t-orange-600 animate-spin h-8 w-8 mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading apartment inventory...</p>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-16 text-center shadow-xs">
          <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
            <div className="h-14 w-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl border border-orange-200/60 shadow-2xs">
              <i className="ri-building-line" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-2">No Flat Listings Found</h3>
            <p className="text-xs text-slate-400">
              No registered properties match your current search parameters or active filters.
            </p>
            <div className="pt-2">
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                  setFilterStatus('all');
                  setFilterSalesman('all');
                }}
              >
                Reset Filters
              </AdminButton>
            </div>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredListings.map((listing) => {
            const listingShares = sharesForListing(listing._id);
            const isRent = listing.listingType === 'rent';
            const images = getListingImages(listing);
            const isClosed = listing.dealStatus === 'sold' || listing.dealStatus === 'rented';

            return (
              <div
                key={listing._id}
                className={`group rounded-3xl border border-slate-200/90 bg-white shadow-xs hover:shadow-xl hover:border-orange-300 overflow-hidden flex flex-col transition-all duration-300 ${
                  isClosed ? 'opacity-35 bg-slate-100/70 select-none' : ''
                }`}
              >
                {/* Photo Slider */}
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

                  {/* Top Floating Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                    <AdminBadge variant={isRent ? 'info' : 'orange'} size="sm">
                      {isRent ? 'For Rent' : 'For Sale'}
                    </AdminBadge>

                    <AdminBadge
                      variant={isClosed ? 'danger' : 'success'}
                      size="sm"
                      dot
                    >
                      {listing.dealStatus}
                    </AdminBadge>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 space-y-4">
                  {/* Price & Location Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug group-hover:text-orange-600 transition-colors truncate">
                        {listing.title || listing.configuration}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <i className="ri-map-pin-2-line text-orange-500 text-xs" />
                        <span className="truncate">{listing.location}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-lg font-black text-slate-900 tracking-tight tabular-nums block">
                        {formatFlatPrice(listing)}
                      </span>
                      {listing.sizeSqft && (
                        <span className="text-[11px] font-semibold text-slate-400">
                          {listing.sizeSqft} sqft
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Specifications Chip Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">
                        Config
                      </span>
                      <span className="text-xs font-bold text-slate-800 truncate block mt-0.5">
                        {listing.configuration}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">
                        Floor
                      </span>
                      <span className="text-xs font-bold text-slate-800 truncate block mt-0.5">
                        {listing.floor ? `${listing.floor} of ${listing.totalFloors || '—'}` : '—'}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">
                        Facing
                      </span>
                      <span className="text-xs font-bold text-slate-800 truncate block mt-0.5">
                        {listing.facing || 'North-East'}
                      </span>
                    </div>
                  </div>

                  {/* WhatsApp Broadcast Status Banner */}
                  <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-8 w-8 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center text-sm shrink-0">
                        <i className="ri-whatsapp-line text-base" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase block">
                          WhatsApp Distribution
                        </span>
                        <span className="text-xs font-semibold text-slate-800 truncate block">
                          {listingShares.length === 0
                            ? 'Not shared yet'
                            : `Broadcasted to ${listingShares.length} client${listingShares.length !== 1 ? 's' : ''}`}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedUnit(listing)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-600 text-xs font-bold border border-slate-200 transition cursor-pointer shadow-2xs shrink-0"
                    >
                      Audit Details →
                    </button>
                  </div>
                </div>

                {/* Card Footer: Salesman attribution */}
                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <i className="ri-user-3-line text-slate-400" />
                    <span>
                      Registered by <strong className="text-slate-800">{listing.submittedBy?.name || 'Salesman'}</strong>
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(listing.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* DENSE TABLE VIEW */
        <AdminDataTable
          columns={tableColumns}
          data={filteredListings}
          loading={loading}
          keyField="_id"
          rowClassName={(row) =>
            row.dealStatus === 'sold' || row.dealStatus === 'rented'
              ? 'opacity-35 bg-slate-100/70 select-none'
              : ''
          }
        />
      )}

      {/* ─── APARTMENT AUDIT RIGHT-SLIDING DRAWER ─── */}
      <AdminDrawer
        isOpen={!!selectedUnit}
        onClose={() => setSelectedUnit(null)}
        title={selectedUnit?.title || selectedUnit?.configuration || 'Unit Specifications'}
        subtitle={`Location: ${selectedUnit?.location || 'Unspecified'}`}
        icon="ri-building-2-line"
      >
        {selectedUnit && (
          <div className="space-y-5 text-slate-800">
            {/* Price Banner */}
            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-orange-700 uppercase block">
                  {selectedUnit.listingType === 'rent' ? 'Monthly Rent' : 'Sale Valuation'}
                </span>
                <span className="text-2xl font-black text-slate-900 tabular-nums">
                  {formatFlatPrice(selectedUnit)}
                </span>
              </div>
              <AdminBadge
                variant={
                  selectedUnit.dealStatus === 'available'
                    ? 'success'
                    : selectedUnit.dealStatus === 'rented'
                    ? 'purple'
                    : 'danger'
                }
                size="md"
                dot
              >
                {selectedUnit.dealStatus}
              </AdminBadge>
            </div>

            {/* Complete Specifications Grid */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Technical Property Audit
              </span>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Configuration</span>
                  <span className="font-bold text-slate-900">{selectedUnit.configuration}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Super Area</span>
                  <span className="font-bold text-slate-900">{selectedUnit.sizeSqft || '—'} sqft</span>
                </div>
                <div className="border-t border-slate-200/60 pt-2">
                  <span className="text-slate-400 block text-[10px] uppercase">Floor Level</span>
                  <span className="font-bold text-slate-900">
                    {selectedUnit.floor ? `${selectedUnit.floor} of ${selectedUnit.totalFloors || '—'}` : '—'}
                  </span>
                </div>
                <div className="border-t border-slate-200/60 pt-2">
                  <span className="text-slate-400 block text-[10px] uppercase">Facing Direction</span>
                  <span className="font-bold text-slate-900">{selectedUnit.facing || '—'}</span>
                </div>
                <div className="border-t border-slate-200/60 pt-2">
                  <span className="text-slate-400 block text-[10px] uppercase">Lift / Elevator</span>
                  <span className="font-bold text-slate-900">{selectedUnit.lift || 'Yes'}</span>
                </div>
                <div className="border-t border-slate-200/60 pt-2">
                  <span className="text-slate-400 block text-[10px] uppercase">Parking Facility</span>
                  <span className="font-bold text-slate-900">{selectedUnit.parking || 'Covered'}</span>
                </div>
                <div className="border-t border-slate-200/60 pt-2">
                  <span className="text-slate-400 block text-[10px] uppercase">RERA Registration</span>
                  <span className="font-mono text-slate-900">{selectedUnit.reraId || 'Verified / NA'}</span>
                </div>
                <div className="border-t border-slate-200/60 pt-2">
                  <span className="text-slate-400 block text-[10px] uppercase">Possession Status</span>
                  <span className="font-bold text-slate-900">{selectedUnit.possessionStatus || 'Ready to Move'}</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {selectedUnit.amenities && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Furnishing & Amenities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedUnit.amenities.split(',').map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-1"
                    >
                      <i className="ri-check-line text-emerald-600" />
                      {item.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Video Tour Preview (if any) */}
            {selectedUnit.videoUrl && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Video Tour Walkthrough
                </span>
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-200">
                  {(() => {
                    const embedSrc = safeEmbedUrl(selectedUnit.videoUrl);
                    if (embedSrc) {
                      return (
                        <iframe
                          src={embedSrc}
                          title="Flat Video"
                          className="h-full w-full border-0"
                          allowFullScreen
                        />
                      );
                    }
                    return <video src={selectedUnit.videoUrl} controls className="h-full w-full object-contain" />;
                  })()}
                </div>
              </div>
            )}

            {/* Description */}
            {selectedUnit.description && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Salesman Property Description
                </span>
                <p className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                  {selectedUnit.description}
                </p>
              </div>
            )}

            {/* WhatsApp Broadcast Log in Drawer */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                WhatsApp Activity Log ({sharesForListing(selectedUnit._id).length})
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {sharesForListing(selectedUnit._id).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No shares dispatched for this unit yet.</p>
                ) : (
                  sharesForListing(selectedUnit._id).map((s) => (
                    <div
                      key={s._id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <i className="ri-whatsapp-line text-emerald-600" />
                        <span className="text-slate-700">
                          Shared with <strong className="text-slate-900 font-mono">+{s.phone}</strong>
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(s.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </AdminDrawer>

      {/* ─── LIGHTBOX MEDIA SLIDER OVERLAY ─── */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl animate-fadeIn">
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 h-11 w-11 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center text-xl transition-colors cursor-pointer z-50"
            title="Close Lightbox"
          >
            <i className="ri-close-line" />
          </button>

          {/* Prev / Next Arrows */}
          {lightbox.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handleLightboxPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-slate-900/90 hover:bg-orange-600 border border-slate-700 text-white flex items-center justify-center text-lg transition-all cursor-pointer z-50 shadow-2xl"
                title="Previous Image"
              >
                <i className="ri-arrow-left-s-line" />
              </button>

              <button
                type="button"
                onClick={handleLightboxNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-slate-900/90 hover:bg-orange-600 border border-slate-700 text-white flex items-center justify-center text-lg transition-all cursor-pointer z-50 shadow-2xl"
                title="Next Image"
              >
                <i className="ri-arrow-right-s-line" />
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
