import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { clearAuth, getAuth } from '../lib/auth';
import AssignedLeadsPanel from '../components/AssignedLeadsPanel';

const formatINR = (val) => {
  const num = Number(val);
  if (!num) return '₹ 0';
  return '₹ ' + num.toLocaleString('en-IN');
};

const priceLabel = (listing) =>
  listing.listingType === 'rent' ? `${formatINR(listing.monthlyRent)} / month` : formatINR(listing.salePrice);

const buildFlatWhatsAppMessage = (listing, clientName, note) => {
  const greeting = clientName ? `Hi ${clientName}, ` : 'Hi, ';
  const dealInfo =
    listing.listingType === 'rent'
      ? `\n🏠 For Rent | ${listing.configuration}\n💰 Monthly Rent: ${formatINR(listing.monthlyRent)}${listing.securityDeposit ? `\n🔒 Security Deposit: ${formatINR(listing.securityDeposit)}` : ''}${listing.availableFrom ? `\n📅 Available From: ${listing.availableFrom}` : ''}`
      : `\n🏠 For Sale | ${listing.configuration}\n💰 Price: ${formatINR(listing.salePrice)}${listing.priceNegotiable ? ' (Negotiable)' : ''}`;

  const specs = `\n📐 Size: ${listing.sizeSqft || 'N/A'} sqft${listing.floor ? ` | Floor: ${listing.floor}` : ''}${listing.possessionStatus ? ` | ${listing.possessionStatus}` : ''}`;
  const noteText = note ? `\n\n📌 Note: ${note}` : '';

  return encodeURIComponent(
    `${greeting}Check out this flat listing from Baba Broker:\n\n*${listing.title || listing.configuration}*\n📍 Location: ${listing.location}${dealInfo}${specs}${noteText}`
  );
};

function FlatCard({ listing, onShare }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden">
      {listing.coverImage && (
        <img src={listing.coverImage} alt={listing.title || listing.location} className="h-36 w-full object-cover" />
      )}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              listing.listingType === 'rent' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
            }`}>
              {listing.listingType === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
            <h3 className="mt-1.5 text-sm font-semibold text-white">{listing.title || listing.configuration}</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <i className="fa-solid fa-location-dot text-orange-500 text-[10px]"></i> {listing.location}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1.5 rounded-xl border border-slate-800 bg-slate-950 p-2 text-center">
          <div>
            <p className="text-[9px] uppercase text-slate-500">Config</p>
            <p className="text-[11px] font-semibold text-white truncate">{listing.configuration}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase text-slate-500">Status</p>
            <p className="text-[11px] font-semibold text-white truncate">{listing.possessionStatus}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase text-slate-500">Price</p>
            <p className="text-[11px] font-semibold text-amber-400 truncate">{priceLabel(listing)}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase text-slate-500">Size</p>
            <p className="text-[11px] font-semibold text-white truncate">{listing.sizeSqft || '—'} sqft</p>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
          <i className="fa-solid fa-user-tie text-orange-400"></i> Submitted by {listing.submittedBy?.name || 'Unknown'}
        </p>

        <button
          onClick={() => onShare(listing)}
          className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 py-2.5 text-xs font-medium uppercase tracking-wider text-white shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
        >
          <i className="fa-brands fa-whatsapp text-sm"></i> Send to Customer
        </button>
      </div>
    </div>
  );
}

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [view, setView] = useState('listings');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const [shareTarget, setShareTarget] = useState(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [customNote, setCustomNote] = useState('');

  const load = async () => {
    try {
      const data = await api('/api/flat-listings');
      setListings(Array.isArray(data) ? data : []);
    } catch (err) {
      setStatus(err.message);
      if (/sign in|session/i.test(err.message)) navigate('/employee/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      if (filterType !== 'all' && item.listingType !== filterType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = item.location?.toLowerCase().includes(q) || item.configuration?.toLowerCase().includes(q) || item.title?.toLowerCase().includes(q);
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
    if (!phone) {
      setStatus('Please enter a valid WhatsApp number.');
      return;
    }

    try {
      await api('/api/shares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing: shareTarget._id, phone }),
      });
      const message = buildFlatWhatsAppMessage(shareTarget, clientName, customNote);
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank', 'noopener,noreferrer');
      setShareTarget(null);
      setStatus('Listing shared and logged successfully.');
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 text-xs leading-relaxed">
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center group">
            <img src="/assets/img/logo.svg" alt="Logo" className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105" />
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-normal uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <i className="fa-solid fa-headset text-[10px]"></i> Office Employee — {auth?.name}
          </span>
        </div>
        <button
          onClick={() => { clearAuth(); navigate('/employee/login'); }}
          className="text-xs font-normal uppercase tracking-wider text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
        >
          <i className="fa-solid fa-right-from-bracket"></i> Logout
        </button>
      </header>

      <main className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
            <i className="fa-solid fa-building"></i> Flat Listings Directory
          </span>
          <h1 className="mt-1 text-xl sm:text-2xl font-bold text-white tracking-tight">
            {view === 'leads' ? 'My Assigned Investment Leads' : 'All Salesman Submissions'}
          </h1>
          <p className="mt-0.5 text-xs text-slate-400">
            {view === 'leads'
              ? 'Investment requests assigned to you for follow-up. Update progress as you contact each investor.'
              : 'Browse every flat submitted by the sales team and send details directly to a customer via WhatsApp.'}
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 p-1 w-fit">
          {[
            { id: 'listings', label: 'Flat Listings', icon: 'fa-building' },
            { id: 'leads', label: 'My Investment Leads', icon: 'fa-hand-holding-dollar' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                view === t.id ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              <i className={`fa-solid ${t.icon} text-[11px]`}></i> {t.label}
            </button>
          ))}
        </div>

        {status && (
          <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-3 text-xs font-normal text-orange-200 flex items-center justify-between shadow-sm">
            <span className="flex items-center gap-1.5"><i className="fa-solid fa-circle-info text-orange-400 text-xs"></i> {status}</span>
            <button onClick={() => setStatus('')} className="text-slate-400 hover:text-white"><i className="fa-solid fa-xmark text-xs"></i></button>
          </div>
        )}

        {view === 'leads' ? (
          <AssignedLeadsPanel />
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by location, configuration..."
                className="flex-1 rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs text-white outline-none focus:border-emerald-500"
              />
              <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 p-1">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'rent', label: 'For Rent' },
                  { id: 'buy', label: 'For Sale' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setFilterType(t.id)}
                    className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                      filterType === t.id ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center text-slate-400">
                <i className="fa-solid fa-circle-notch fa-spin text-2xl text-emerald-500 mb-3 block"></i> Loading listings...
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <i className="fa-solid fa-folder-open text-3xl mb-3 block text-slate-700"></i>
                No flat listings match your search.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredListings.map((listing) => (
                  <FlatCard key={listing._id} listing={listing} onShare={openShare} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {shareTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <i className="fa-brands fa-whatsapp text-emerald-400"></i> Send to Customer via WhatsApp
              </h3>
              <button onClick={() => setShareTarget(null)} className="text-slate-400 hover:text-white"><i className="fa-solid fa-xmark"></i></button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <p className="text-xs font-semibold text-white">{shareTarget.title || shareTarget.configuration}</p>
              <p className="text-[11px] text-slate-400">{shareTarget.location}</p>
            </div>

            <label className="block text-xs font-medium text-slate-300">
              Customer Name
              <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. Rahul Sharma" className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white outline-none focus:border-emerald-500" />
            </label>
            <label className="block text-xs font-medium text-slate-300">
              WhatsApp Number *
              <input value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="e.g. 9876543210" className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white outline-none focus:border-emerald-500" />
            </label>
            <label className="block text-xs font-medium text-slate-300">
              Custom Note (Optional)
              <textarea value={customNote} onChange={(e) => setCustomNote(e.target.value)} rows="2" placeholder="e.g. This one matches your budget perfectly!" className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white outline-none focus:border-emerald-500" />
            </label>

            <button
              onClick={sendShare}
              disabled={!clientPhone}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 py-3 text-xs font-medium uppercase tracking-wider text-white shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              <i className="fa-brands fa-whatsapp text-lg"></i> Send via WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
