import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import AdminPageHeader from './AdminPageHeader';

const emptyInvestorForm = {
  name: '',
  phone: '',
  email: '',
  city: '',
  address: '',
  occupation: '',
  panNumber: '',
  budgetRange: '',
  notes: '',
};

function AddInvestorPanel() {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyInvestorForm);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  const load = async () => {
    try {
      const data = await api('/api/investors');
      setInvestors(Array.isArray(data) ? data : []);
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const change = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || form.phone.replace(/\D/g, '').length < 10) {
      setStatus('A name and valid 10-digit phone number are required.');
      return;
    }
    setSaving(true);
    try {
      await api('/api/investors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setForm(emptyInvestorForm);
      setStatus('Investor added successfully.');
      await load();
    } catch (err) {
      setStatus(err.message);
    } finally {
      setSaving(false);
    }
  };

  const removeInvestor = async (investor) => {
    if (!window.confirm(`Remove investor "${investor.name}" from the directory?`)) return;
    try {
      await api(`/api/investors/${investor._id}`, { method: 'DELETE' });
      setInvestors((list) => list.filter((item) => item._id !== investor._id));
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <div className="space-y-5">
      {status && (
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-3 text-xs font-normal text-orange-200 flex items-center justify-between shadow-sm">
          <span className="flex items-center gap-1.5"><i className="fa-solid fa-circle-info text-orange-400 text-xs"></i> {status}</span>
          <button onClick={() => setStatus('')} className="text-slate-400 hover:text-white cursor-pointer"><i className="fa-solid fa-xmark text-xs"></i></button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Add Investor Form */}
        <form onSubmit={submit} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4 shadow-xl h-fit">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <i className="fa-solid fa-user-tie text-blue-400"></i> Add New Investor
          </h3>

          <label className="block text-xs font-medium text-slate-300">
            Full Name *
            <input
              name="name"
              value={form.name}
              onChange={change}
              placeholder="e.g. Rahul Sharma"
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white outline-none focus:border-blue-500"
            />
          </label>

          <label className="block text-xs font-medium text-slate-300">
            Phone Number *
            <input
              name="phone"
              value={form.phone}
              onChange={change}
              placeholder="e.g. 9876543210"
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white outline-none focus:border-blue-500"
            />
          </label>

          <label className="block text-xs font-medium text-slate-300">
            Email Address
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={change}
              placeholder="e.g. rahul@email.com"
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white outline-none focus:border-blue-500"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-medium text-slate-300">
              City
              <input
                name="city"
                value={form.city}
                onChange={change}
                placeholder="e.g. Noida"
                className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white outline-none focus:border-blue-500"
              />
            </label>
            <label className="block text-xs font-medium text-slate-300">
              Occupation
              <input
                name="occupation"
                value={form.occupation}
                onChange={change}
                placeholder="e.g. Business Owner"
                className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white outline-none focus:border-blue-500"
              />
            </label>
          </div>

          <label className="block text-xs font-medium text-slate-300">
            Address
            <input
              name="address"
              value={form.address}
              onChange={change}
              placeholder="e.g. Sector 62, Noida, UP"
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white outline-none focus:border-blue-500"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-medium text-slate-300">
              PAN Number
              <input
                name="panNumber"
                value={form.panNumber}
                onChange={change}
                placeholder="e.g. ABCDE1234F"
                className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white outline-none focus:border-blue-500"
              />
            </label>
            <label className="block text-xs font-medium text-slate-300">
              Budget Range
              <input
                name="budgetRange"
                value={form.budgetRange}
                onChange={change}
                placeholder="e.g. ₹25L - ₹50L"
                className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white outline-none focus:border-blue-500"
              />
            </label>
          </div>

          <label className="block text-xs font-medium text-slate-300">
            Notes
            <textarea
              name="notes"
              value={form.notes}
              onChange={change}
              rows="2"
              placeholder="Any additional details about this investor..."
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white outline-none focus:border-blue-500"
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 py-3 text-xs font-medium uppercase tracking-wider text-white shadow-md shadow-blue-600/20 cursor-pointer"
          >
            {saving ? 'Adding...' : 'Add Investor'}
          </button>
        </form>

        {/* Investor Directory List */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden h-fit">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 p-4">
            <i className="fa-solid fa-address-book text-blue-400"></i> Investor Directory ({investors.length})
          </h3>
          {loading ? (
            <div className="py-14 text-center text-slate-400 text-xs">Loading investors...</div>
          ) : investors.length === 0 ? (
            <div className="py-14 text-center text-slate-400 text-xs">No investors added yet. Add one on the left.</div>
          ) : (
            <div className="divide-y divide-slate-800">
              {investors.map((investor) => (
                <div key={investor._id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white flex items-center gap-2 flex-wrap">
                      {investor.name}
                      {investor.budgetRange && (
                        <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {investor.budgetRange}
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {investor.phone}
                      {investor.email ? ` · ${investor.email}` : ''}
                      {investor.city ? ` · ${investor.city}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => removeInvestor(investor)}
                    className="shrink-0 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white p-2 transition-colors cursor-pointer"
                    title="Remove Investor"
                  >
                    <i className="fa-solid fa-trash-can text-xs"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminOverview({
  isContacts,
  view,
  metrics,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterType,
  setFilterType,
  loading,
  filteredProperties,
  startEdit,
  deleteProperty,
  toggleFeaturedStatus,
  openWhatsAppShare,
  openCreateFeaturedModal,
  openCreateProjectModal,
  setShowProjectModal,
  setActiveFormTab,
  setEditingId,
  setPropertyForm,
  emptyProperty,
  formatINR,
}) {
  return (
    <div className="space-y-5">
      {/* Reusable Header Section */}
      <AdminPageHeader
        badge={
          isContacts
            ? 'Customer Leads Directory'
            : view === 'featured'
            ? 'Featured Hot Products'
            : view === 'projects'
            ? 'Investment Projects Portfolio'
            : 'Admin Control Center'
        }
        title={
          isContacts
            ? 'Customer Leads & WhatsApp Proposals'
            : view === 'featured'
            ? 'Featured Hot Sale Properties'
            : view === 'projects'
            ? 'All Investment Projects'
            : 'Overview Dashboard'
        }
        subtitle={
          isContacts
            ? 'Track incoming investor leads, client inquiries, and WhatsApp proposal history.'
            : view === 'featured'
            ? 'Showcase direct purchase properties live on website for instant buyer inquiries.'
            : view === 'projects'
            ? 'Manage fractional co-investment deals, renovate & flip projects, and return rates.'
            : 'Real-time performance analytics, capital allocation metrics, and quick action shortcuts.'
        }
        icon={
          isContacts
            ? 'fa-solid fa-address-book'
            : view === 'featured'
            ? 'fa-solid fa-fire'
            : view === 'projects'
            ? 'fa-solid fa-city'
            : 'fa-solid fa-chart-pie'
        }
        iconColor={
          isContacts
            ? 'text-blue-400'
            : view === 'featured'
            ? 'text-amber-400'
            : 'text-orange-400'
        }
        iconBg={
          isContacts
            ? 'bg-blue-500/10 border-blue-500/20'
            : view === 'featured'
            ? 'bg-amber-500/10 border-amber-500/20'
            : 'bg-orange-500/10 border-orange-500/20'
        }
        breadcrumbs={[
          { label: 'Admin Workspace', link: '/admin/dashboard' },
          {
            label:
              view === 'featured'
                ? 'Featured Deals'
                : view === 'projects'
                ? 'All Projects'
                : 'Overview',
          },
        ]}
        actions={
          view === 'featured' ? (
            <button
              onClick={() => {
                if (typeof openCreateFeaturedModal === 'function') {
                  openCreateFeaturedModal();
                } else {
                  if (typeof setEditingId === 'function') setEditingId(null);
                  if (typeof setPropertyForm === 'function') setPropertyForm(emptyProperty(true));
                  if (typeof setActiveFormTab === 'function') setActiveFormTab('basic');
                  if (typeof setShowProjectModal === 'function') setShowProjectModal(true);
                }
              }}
              className="rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all shrink-0 cursor-pointer"
            >
              <i className="fa-solid fa-fire text-sm"></i> Create New Featured Hot Product
            </button>
          ) : view === 'projects' ? (
            <button
              onClick={() => {
                if (typeof openCreateProjectModal === 'function') {
                  openCreateProjectModal();
                } else {
                  if (typeof setEditingId === 'function') setEditingId(null);
                  if (typeof setPropertyForm === 'function') setPropertyForm(emptyProperty(false));
                  if (typeof setActiveFormTab === 'function') setActiveFormTab('financial');
                  if (typeof setShowProjectModal === 'function') setShowProjectModal(true);
                }
              }}
              className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all shrink-0 cursor-pointer"
            >
              <i className="ri-add-circle-line text-base"></i> Create New Investment Project
            </button>
          ) : null
        }
      />

      {/* OVERVIEW METRICS DASHBOARD (Only shown on /admin/dashboard) */}
      {view === 'overview' && (
        <>
          {/* Top 4 Key Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-normal">
            {/* Card 1: Total Valuation */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl transition-all hover:border-orange-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Valuation</span>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  <i className="ri-wallet-3-line text-lg"></i>
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-white tracking-tight">
                ₹ {(metrics.totalValuationSum / 10000000).toFixed(2)} Cr
              </p>
              <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                <i className="ri-arrow-up-line text-xs"></i>
                <span>Active Capital Pool</span>
              </div>
            </div>

            {/* Card 2: Active Projects */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl transition-all hover:border-amber-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Deals</span>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <i className="ri-building-line text-lg"></i>
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-white tracking-tight">{metrics.totalCount}</p>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                <span className="text-orange-400 font-medium">{metrics.runningCount} Running</span> ·
                <span className="text-blue-400 font-medium">{metrics.upcomingCount} Launching</span>
              </div>
            </div>

            {/* Card 3: Direct Website Hot Deals */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl transition-all hover:border-yellow-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Direct Hot Deals</span>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                  <i className="ri-star-line text-lg"></i>
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-white tracking-tight">{metrics.featuredCount}</p>
              <div className="mt-2 flex items-center gap-1 text-[11px] text-yellow-400 font-medium">
                <i className="ri-fire-line text-xs"></i>
                <span>Direct Purchase Products</span>
              </div>
            </div>

            {/* Card 4: WhatsApp Shares */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl transition-all hover:border-emerald-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">WhatsApp Sent</span>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <i className="ri-whatsapp-line text-lg"></i>
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-white tracking-tight">{metrics.totalSharesCount}</p>
              <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                <i className="ri-send-plane-line text-xs"></i>
                <span>Proposals Shared Live</span>
              </div>
            </div>
          </div>

          {/* Graphical Analytics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 font-normal">
            {/* Graph Card 1: Asset Type Capital Allocation */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <i className="ri-bar-chart-box-line text-lg text-orange-400"></i>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Category Valuation Share</h3>
                    <p className="text-[11px] text-slate-400 font-normal">Portfolio allocation by asset type</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-slate-300">
                  Total: ₹{(metrics.totalValuationSum / 100000).toFixed(1)}L
                </span>
              </div>

              {/* Graphical Progress Bars */}
              <div className="space-y-3 pt-1">
                {/* 1. Residential */}
                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <i className="ri-building-line text-orange-400"></i> Residential
                    </span>
                    <span className="text-white font-bold">
                      ₹{(metrics.residentialValuation / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.round((metrics.residentialValuation / (metrics.maxValuation || 1)) * 100))}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* 2. Commercial */}
                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <i className="ri-store-2-line text-emerald-400"></i> Commercial
                    </span>
                    <span className="text-white font-bold">
                      ₹{(metrics.commercialValuation / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.round((metrics.commercialValuation / (metrics.maxValuation || 1)) * 100))}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* 3. Plots & Land */}
                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <i className="ri-landscape-line text-amber-400"></i> Plot / Land
                    </span>
                    <span className="text-white font-bold">
                      ₹{(metrics.plotValuation / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.round((metrics.plotValuation / (metrics.maxValuation || 1)) * 100))}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Sub Metrics Summary Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-normal">Fractional Pool</span>
                  <span className="font-semibold text-orange-400">{metrics.coInvestmentCount} Projects</span>
                </div>
                <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-normal">Renovate & Flip</span>
                  <span className="font-semibold text-amber-400">{metrics.renovateFlipCount} Projects</span>
                </div>
                <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-normal">Delivered Record</span>
                  <span className="font-semibold text-emerald-400">{metrics.deliveredCount} Projects</span>
                </div>
              </div>
            </div>

            {/* Graph Card 2: Status Lifecycle Breakdown */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <i className="ri-pie-chart-2-line text-lg text-emerald-400"></i>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Status Breakdown</h3>
                    <p className="text-[11px] text-slate-400 font-normal">Project Lifecycle Ratio</p>
                  </div>
                </div>

                <div className="space-y-3 pt-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <i className="ri-play-circle-fill text-orange-400 text-lg"></i>
                      <div>
                        <span className="font-medium text-white text-xs block">Running Projects</span>
                        <span className="text-[10px] text-slate-400">Active investor pools</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-orange-400">{metrics.runningCount}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <i className="ri-time-fill text-blue-400 text-lg"></i>
                      <div>
                        <span className="font-medium text-white text-xs block">Upcoming Projects</span>
                        <span className="text-[10px] text-slate-400">Launch pipeline</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-blue-400">{metrics.upcomingCount}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <i className="ri-checkbox-circle-fill text-emerald-400 text-lg"></i>
                      <div>
                        <span className="font-medium text-white text-xs block">Delivered Projects</span>
                        <span className="text-[10px] text-slate-400">Successfully completed</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-emerald-400">{metrics.deliveredCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add Investor Form (Customer Leads / Add Investor pages) */}
      {isContacts && <AddInvestorPanel />}

      {/* Filter Bar & Projects Directory Cards Grid (Hidden on Overview Dashboard & Investor pages) */}
      {view !== 'overview' && !isContacts && (
        <>
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-3.5 shadow-md">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <i className="ri-search-2-line absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search project title or location..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2 text-xs text-white outline-none focus:border-orange-500 font-normal"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto font-normal">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300 outline-none font-normal cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="running">🚀 Running</option>
                <option value="upcoming">⏳ Upcoming</option>
                <option value="delivered">✅ Delivered</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300 outline-none font-normal cursor-pointer"
              >
                <option value="all">All Property Types</option>
                <option value="residential">🏢 Residential</option>
                <option value="commercial">🏬 Commercial</option>
                <option value="plot">🏞️ Plot / Land</option>
              </select>
            </div>
          </div>

          {/* Property Cards Grid */}
          <div id="project-cards-grid">
            {loading ? (
              <div className="py-20 text-center text-slate-400 font-normal">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-orange-500"></div>
                <p className="mt-3 text-xs">Loading investment portfolio...</p>
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 font-normal">
                {filteredProperties.map((p) => {
                  const hasPhotos = p.image || (p.images && p.images.length > 0);
                  const hasVideo = p.videoUrl && p.videoUrl.trim().length > 0;
                  const hasPdf = p.pdfUrl && p.pdfUrl.trim().length > 0;

                  return (
                    <div
                      key={p._id}
                      className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl transition-all duration-300 hover:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/10"
                    >
                      <div>
                        {/* Thumbnail Cover Image & Status Badges */}
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center bg-slate-950 text-slate-600">
                              <i className="ri-building-line text-3xl mb-1"></i>
                              <span className="text-[10px]">No Photo Cover Attached</span>
                            </div>
                          )}

                          {/* Top Badges Overlay */}
                          <div className="absolute left-3 top-3 right-3 flex items-center justify-between gap-2 z-10">
                            <span
                              className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-md backdrop-blur-md ${
                                p.status === 'running'
                                  ? 'bg-orange-500/90 text-white'
                                  : p.status === 'upcoming'
                                  ? 'bg-blue-600/90 text-white'
                                  : 'bg-emerald-600/90 text-white'
                              }`}
                            >
                              {p.status === 'running'
                                ? '🚀 Running'
                                : p.status === 'upcoming'
                                ? '⏳ Upcoming'
                                : '✅ Delivered'}
                            </span>

                            <button
                              type="button"
                              onClick={() => toggleFeaturedStatus(p)}
                              className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-md backdrop-blur-md transition-all cursor-pointer ${
                                p.isFeatured
                                  ? 'bg-yellow-500 text-slate-950 border border-yellow-300'
                                  : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
                              }`}
                            >
                              {p.isFeatured ? '⭐ Hot Product' : 'Mark Hot Sale'}
                            </button>
                          </div>

                          {/* Valuation Pill Bottom Left */}
                          <div className="absolute left-3 bottom-3 z-10">
                            <span className="rounded-lg bg-slate-950/90 border border-slate-800 px-2.5 py-1 text-[11px] font-bold text-emerald-400 backdrop-blur-md shadow-md block">
                              {formatINR(p.totalValuation) || (p.price && p.price.startsWith('₹') ? p.price : `₹${p.price}`) || '₹0'}
                            </span>
                            <span className="text-[9px] font-normal text-slate-400 block text-left mt-0.5">
                              (Total Selling Price)
                            </span>
                          </div>

                          {/* Media Indicators Bottom Right */}
                          <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
                            {hasPhotos && (
                              <span className="rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] text-white backdrop-blur-md border border-slate-800" title="Photos Uploaded">
                                📷 {(p.images?.length || 1)}
                              </span>
                            )}
                            {hasVideo && (
                              <span className="rounded-md bg-red-600/90 px-2 py-0.5 text-[10px] text-white backdrop-blur-md" title="Video Attached">
                                🎥 Video
                              </span>
                            )}
                            {hasPdf && (
                              <span className="rounded-md bg-amber-500/90 px-2 py-0.5 text-[10px] text-slate-950 font-bold backdrop-blur-md" title="Brochure PDF Available">
                                📄 PDF
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Content Body */}
                        <div className="p-4 space-y-3">
                          <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-400">
                              {p.propertyType} {p.bhk ? `· ${p.bhk}` : ''}
                            </span>
                            <h3 className="text-sm font-bold text-white line-clamp-1 mt-0.5">
                              {p.title}
                            </h3>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-normal">
                              <i className="fa-solid fa-location-dot text-orange-500 text-xs shrink-0"></i>
                              <span className="truncate">{p.location}</span>
                            </p>
                          </div>

                          {/* Direct Sale Specs vs Investment Metrics Bar */}
                          {view === 'featured' || (p.isFeatured && !p.investmentModel) ? (
                            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-2.5 space-y-1 shadow-inner">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-yellow-400 font-extrabold flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                                  <i className="fa-solid fa-fire text-amber-400"></i> Direct Sale Item
                                </span>
                                <span className="text-amber-300 font-bold">{p.price || (p.totalValuation ? formatINR(p.totalValuation) : 'Contact for Price')}</span>
                              </div>
                              <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-slate-300 pt-0.5 font-normal">
                                {p.sizeSqft && (
                                  <span className="rounded-md bg-slate-950 border border-slate-800 px-2 py-0.5">
                                    📐 {p.sizeSqft} sqft
                                  </span>
                                )}
                                {p.facing && (
                                  <span className="rounded-md bg-slate-950 border border-slate-800 px-2 py-0.5">
                                    🧭 {p.facing}
                                  </span>
                                )}
                                {p.possession && (
                                  <span className="rounded-md bg-slate-950 border border-slate-800 px-2 py-0.5">
                                    🔑 {p.possession}
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : p.investmentModel === 'renovate_flip' ? (
                            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5 space-y-1">
                              <div className="flex justify-between text-[11px]">
                                <span className="text-slate-400">Renovate & Flip</span>
                                <span className="font-bold text-amber-400">{p.estimatedNetProfit || 'Flip Deal'}</span>
                              </div>
                              <div className="flex justify-between text-[10px] text-slate-400">
                                <span>Buy: ₹{(Number(p.purchasePrice || 0) / 100000).toFixed(1)}L</span>
                                <span>Target Sale: ₹{(Number(p.expectedSalePrice || 0) / 100000).toFixed(1)}L</span>
                              </div>
                            </div>
                          ) : (
                            <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 space-y-1.5">
                              <div className="flex justify-between text-[11px]">
                                <span className="text-slate-400">Funded Equity</span>
                                <span className="font-bold text-orange-400">{p.fundedPercentage || 0}%</span>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-slate-900 overflow-hidden">
                                <div
                                  className="h-full bg-orange-500 rounded-full"
                                  style={{ width: `${Math.min(100, Number(p.fundedPercentage) || 0)}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                                <span>Min: ₹{(Number(p.minInvestment || 0) / 100000).toFixed(1)}L</span>
                                <span className="text-emerald-400 font-semibold">Target ROI: +{p.expectedRoi || 15}%</span>
                              </div>
                            </div>
                          )}

                          {p.description && (
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-normal">
                              {p.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Card Action Buttons Footer */}
                      <div className="flex items-center justify-between border-t border-slate-800 p-3 bg-slate-950/40 gap-2">
                        <button
                          type="button"
                          onClick={() => openWhatsAppShare(p)}
                          className="flex-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <i className="fa-brands fa-whatsapp text-sm"></i> WhatsApp Share
                        </button>

                        <button
                          type="button"
                          onClick={() => startEdit(p)}
                          className="rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 transition-colors cursor-pointer"
                          title="Edit Project"
                        >
                          <i className="fa-solid fa-pen-to-square text-xs"></i>
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteProperty(p._id)}
                          className="rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white p-2 transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <i className="fa-solid fa-trash-can text-xs"></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400 font-normal">
                <i className={`fa-solid ${view === 'featured' ? 'fa-fire' : 'fa-folder-open'} text-3xl text-slate-600 mb-2`}></i>
                <p className="text-base font-medium text-slate-200">
                  {view === 'featured' ? 'Nothing Published Yet' : 'No Projects Found'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 font-normal">
                  {view === 'featured'
                    ? "Create a Featured Hot Product below and it will go live in the website's 🔥 Direct Sale Hot Deals section immediately."
                    : 'Try creating a project or adjusting search filters.'}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
