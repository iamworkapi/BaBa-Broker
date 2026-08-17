import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    <div className="space-y-3.5 font-['Inter',sans-serif]">
      {status && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-2.5 text-[11px] font-normal text-orange-800 flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-1.5"><i className="ri-information-line text-[#ea580c] text-xs"></i> {status}</span>
          <button onClick={() => setStatus('')} className="text-slate-400 hover:text-slate-600 cursor-pointer"><i className="ri-close-line text-xs"></i></button>
        </div>
      )}

      <div className="grid gap-3.5 lg:grid-cols-[320px_1fr]">
        {/* Add Investor Form */}
        <form onSubmit={submit} className="rounded-2xl border border-slate-100 bg-white p-3.5 space-y-2.5 shadow-xs h-fit">
          <h3 className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <i className="ri-user-add-line text-[#ea580c]"></i> Add New Investor
          </h3>

          <label className="block text-[11px] font-medium text-slate-700">
            Full Name *
            <input
              name="name"
              value={form.name}
              onChange={change}
              placeholder="e.g. Rahul Sharma"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-[11px] text-slate-800 outline-none focus:border-[#ea580c] focus:bg-white"
            />
          </label>

          <label className="block text-[11px] font-medium text-slate-700">
            Phone Number *
            <input
              name="phone"
              value={form.phone}
              onChange={change}
              placeholder="e.g. 9876543210"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-[11px] text-slate-800 outline-none focus:border-[#ea580c] focus:bg-white"
            />
          </label>

          <label className="block text-[11px] font-medium text-slate-700">
            Email Address
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={change}
              placeholder="e.g. rahul@email.com"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-[11px] text-slate-800 outline-none focus:border-[#ea580c] focus:bg-white"
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label className="block text-[11px] font-medium text-slate-700">
              City
              <input
                name="city"
                value={form.city}
                onChange={change}
                placeholder="e.g. Noida"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-[11px] text-slate-800 outline-none focus:border-[#ea580c] focus:bg-white"
              />
            </label>
            <label className="block text-[11px] font-medium text-slate-700">
              Occupation
              <input
                name="occupation"
                value={form.occupation}
                onChange={change}
                placeholder="e.g. Business"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-[11px] text-slate-800 outline-none focus:border-[#ea580c] focus:bg-white"
              />
            </label>
          </div>

          <label className="block text-[11px] font-medium text-slate-700">
            Budget Range
            <input
              name="budgetRange"
              value={form.budgetRange}
              onChange={change}
              placeholder="e.g. ₹25L - ₹50L"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-[11px] text-slate-800 outline-none focus:border-[#ea580c] focus:bg-white"
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-[#ea580c] hover:bg-[#c2410c] disabled:opacity-50 py-2 text-[11px] font-semibold uppercase tracking-wider text-white shadow-xs cursor-pointer transition-all"
          >
            {saving ? 'Adding...' : 'Add Investor'}
          </button>
        </form>

        {/* Investor Directory List */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-xs overflow-hidden h-fit">
          <h3 className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 p-3">
            <i className="ri-contacts-book-line text-[#ea580c]"></i> Investor Directory ({investors.length})
          </h3>
          {loading ? (
            <div className="py-8 text-center text-slate-400 text-[11px] font-normal">Loading investors...</div>
          ) : investors.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-[11px] font-normal">No investors added yet. Add one on the left.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {investors.map((investor) => (
                <div key={investor._id} className="flex items-center justify-between gap-2.5 p-2.5 hover:bg-slate-50 transition">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-800 flex items-center gap-1.5 flex-wrap">
                      {investor.name}
                      {investor.budgetRange && (
                        <span className="rounded-full px-2 py-0.5 text-[8px] font-semibold bg-orange-50 text-[#ea580c]">
                          {investor.budgetRange}
                        </span>
                      )}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5 font-normal">
                      {investor.phone}
                      {investor.email ? ` · ${investor.email}` : ''}
                      {investor.city ? ` · ${investor.city}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => removeInvestor(investor)}
                    className="shrink-0 rounded-md bg-red-50 hover:bg-red-500 text-red-500 hover:text-white p-1 transition-colors cursor-pointer"
                    title="Remove Investor"
                  >
                    <i className="ri-delete-bin-line text-xs"></i>
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
  const [selectedPeriod, setSelectedPeriod] = useState('1 March – 14 March');
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);

  return (
    <div className="space-y-3.5 font-['Inter',sans-serif]">
      {/* OVERVIEW DASHBOARD VIEW (Reduced Font Size & Compact PinHome layout) */}
      {view === 'overview' ? (
        <>
          {/* Top Title & Download Report Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-slate-800 tracking-tight">
                My Bookings
              </h1>
            </div>

            {/* Compact Download Report Button */}
            <button
              type="button"
              onClick={() => alert('Downloading latest Portfolio & Inflow Report...')}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white px-3.5 py-1 text-[11px] font-medium shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
            >
              <i className="ri-download-2-line text-xs"></i>
              <span>Download report</span>
            </button>
          </div>

          {/* Period Filter & Legend Subheader */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
            {/* Period Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPeriodMenu(!showPeriodMenu)}
                className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-normal transition cursor-pointer"
              >
                <span className="text-slate-400">Period:</span>
                <i className="ri-calendar-event-line text-[#ea580c] text-xs"></i>
                <span className="font-semibold text-slate-800">{selectedPeriod}</span>
                <i className="ri-arrow-down-s-line text-slate-400 text-[10px]"></i>
              </button>

              {showPeriodMenu && (
                <div className="absolute left-0 mt-1.5 w-40 rounded-xl bg-white border border-slate-100 p-1 shadow-lg z-50">
                  {['1 March – 14 March', '15 Feb – 28 Feb', 'This Month', 'Last 30 Days'].map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setSelectedPeriod(p);
                        setShowPeriodMenu(false);
                      }}
                      className="w-full text-left px-2 py-1 text-[11px] rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Legend Dots */}
            <div className="flex items-center gap-4 text-[11px] text-slate-500 font-normal">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#ffdc69]"></span>
                <span className="text-slate-700 font-medium">Today</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#b2ebf2]"></span>
                <span className="text-slate-700 font-medium">Earned</span>
              </span>
            </div>
          </div>

          {/* 14-Day Analytics Bar Chart */}
          <div className="relative pt-3 pb-1">
            {/* Horizontal Gridlines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40 text-[9px] text-slate-400 font-normal">
              <div className="border-b border-slate-100 w-full flex justify-between"><span>$3.000</span></div>
              <div className="border-b border-slate-100 w-full flex justify-between"><span>$2.000</span></div>
              <div className="border-b border-slate-100 w-full flex justify-between"><span>$1.000</span></div>
              <div className="border-b border-slate-100 w-full flex justify-between"><span>$0</span></div>
            </div>

            {/* Flexbox Horizontal 14 Daily Bars */}
            <div className="relative z-10 flex items-end justify-between gap-1 sm:gap-2 h-36 sm:h-44 pt-5 w-full">
              {[
                { day: 1, height: 48 },
                { day: 2, height: 70 },
                { day: 3, height: 90 },
                { day: 4, height: 35 },
                { day: 5, height: 80 },
                { day: 6, height: 45 },
                { day: 7, height: 32 },
                { day: 8, height: 55 },
                { day: 9, height: 85, isToday: true, displayValue: '$1894.83' },
                { day: 10, height: 42 },
                { day: 11, height: 36 },
                { day: 12, height: 88 },
                { day: 13, height: 50 },
                { day: 14, height: 40 },
              ].map((bar) => (
                <div key={bar.day} className="flex-1 max-w-[26px] group relative flex flex-col items-center justify-end h-full">
                  {/* Floating White Tooltip on Day 9 */}
                  {bar.isToday && (
                    <div className="absolute -top-10 z-30 flex flex-col items-center">
                      <div className="rounded-lg bg-white border border-slate-100 px-2 py-0.5 shadow-md text-center whitespace-nowrap">
                        <span className="text-[10px] font-bold text-slate-800 block leading-tight">{bar.displayValue}</span>
                        <span className="text-[8px] text-slate-400 font-normal block leading-tight">Total per day</span>
                      </div>
                      <div className="h-1.5 w-1.5 rotate-45 bg-white shadow-xs -mt-0.5"></div>
                    </div>
                  )}

                  {/* Bar Shape */}
                  <div
                    style={{ height: `${bar.height}%` }}
                    className={`w-full rounded-t-sm transition-all duration-200 group-hover:scale-105 ${
                      bar.isToday
                        ? 'bg-[#ffdc69] shadow-xs'
                        : 'bg-[#b2ebf2] hover:bg-[#80deea]'
                    }`}
                  ></div>

                  {/* Day Number */}
                  <span
                    className={`mt-1 text-[10px] font-normal ${
                      bar.isToday ? 'text-slate-800 font-bold' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  >
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* TWO-COLUMN LOWER SECTION (Reduced Fonts) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 pt-1">
            {/* Left Column: Arriving today (2/3 width) */}
            <div className="lg:col-span-2 space-y-2">
              <div className="flex items-center justify-between pb-0.5">
                <h3 className="text-sm font-semibold text-slate-800 tracking-tight">
                  Arriving today
                </h3>
                <Link
                  to="/admin/projects"
                  className="text-[11px] font-medium text-[#ea580c] hover:text-[#c2410c] flex items-center gap-0.5 transition"
                >
                  Show all <i className="ri-arrow-right-s-line text-xs"></i>
                </Link>
              </div>

              {/* Rows */}
              <div className="space-y-1.5">
                {[
                  {
                    id: '1',
                    title: 'Valencia apartment',
                    subtitle: '3 nights',
                    iconBg: 'bg-[#c8f1f1]',
                    iconColor: 'text-[#0ca694]',
                    icon: 'ri-building-line',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
                    status: 'Approved',
                    statusStyle: 'bg-[#e0f7f4] text-[#0ca694]',
                    price: '$580',
                    date: 'March 6, at 12:00',
                  },
                  {
                    id: '2',
                    title: 'Night swimmingpool',
                    subtitle: '1 nights',
                    iconBg: 'bg-[#ffe8d6]',
                    iconColor: 'text-[#ea580c]',
                    icon: 'ri-hotel-bed-line',
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
                    status: 'Pending',
                    statusStyle: 'bg-[#fff8e1] text-[#f59e0b]',
                    price: '$1000',
                    date: 'March 6, at 22:00',
                  },
                  {
                    id: '3',
                    title: 'Unique & Cozy studio',
                    subtitle: '10 nights',
                    iconBg: 'bg-[#ede7f6]',
                    iconColor: 'text-[#7e57c2]',
                    icon: 'ri-store-2-line',
                    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
                    status: 'Approved',
                    statusStyle: 'bg-[#e0f7f4] text-[#0ca694]',
                    price: '$3844',
                    date: 'March 6, at 14:00',
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-slate-100 hover:shadow-xs transition-all group"
                  >
                    {/* Left: Chip + Title */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`h-8 w-8 rounded-lg ${item.iconBg} flex items-center justify-center ${item.iconColor} text-base shrink-0`}>
                        <i className={item.icon}></i>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[11px] font-semibold text-slate-800 truncate group-hover:text-[#ea580c] transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-normal">{item.subtitle}</p>
                      </div>
                    </div>

                    {/* Right: Avatar + Status + Price + Date + 3-Dots */}
                    <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 border-t sm:border-t-0 border-slate-100 pt-1 sm:pt-0">
                      <img
                        src={item.avatar}
                        alt="Guest"
                        className="h-5 w-5 rounded-full object-cover border border-white shadow-xs"
                      />

                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-semibold ${item.statusStyle}`}>
                        {item.status}
                      </span>

                      <span className="text-[11px] font-bold text-slate-800">{item.price}</span>

                      <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">{item.date}</span>

                      <button
                        type="button"
                        onClick={() => openWhatsAppShare && openWhatsAppShare({ title: item.title, price: item.price })}
                        className="text-slate-400 hover:text-slate-600 p-0.5 transition cursor-pointer"
                      >
                        <i className="ri-more-2-fill text-xs"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Low Occupancy Promo Card */}
            <div className="relative overflow-hidden rounded-2xl bg-[#c8f1f1] p-3.5 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-0.5 relative z-10">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
                  Low occupancy!
                </h3>
                <p className="text-[10px] text-slate-600 font-normal leading-tight">
                  Create a last minute promotion to maximize occupancy!
                </p>
              </div>

              {/* Action Button */}
              <div className="relative z-10">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof openCreateProjectModal === 'function') {
                      openCreateProjectModal();
                    } else if (typeof setShowProjectModal === 'function') {
                      if (typeof setEditingId === 'function') setEditingId(null);
                      if (typeof setPropertyForm === 'function') setPropertyForm(emptyProperty(false));
                      if (typeof setActiveFormTab === 'function') setActiveFormTab('financial');
                      setShowProjectModal(true);
                    }
                  }}
                  className="rounded-full bg-[#ffdc69] hover:bg-[#ffe58f] py-1 px-4 text-[10px] font-bold text-slate-800 shadow-xs transition-all hover:scale-105 cursor-pointer"
                >
                  Create
                </button>
              </div>

              {/* Bottom Botanical Graphics */}
              <div className="relative pt-0.5 flex justify-end">
                <div className="h-10 w-16 relative flex items-end justify-end opacity-85">
                  <div className="h-6 w-6 rounded-t-md bg-[#e0838a]/40 mr-1"></div>
                  <i className="ri-plant-line text-2xl text-[#0ca694]"></i>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* OTHER SUB-VIEWS */
        <>
          {/* COMPACT UNIFIED HIGH-DEMAND HEADER & TOOLBAR */}
          <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-xs space-y-2.5">
            {/* Top Row: Title + High Demand Badge + Action CTA Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#ea580c]">
                  {isContacts
                    ? 'Leads Directory'
                    : view === 'featured'
                    ? 'Direct Hot Sales'
                    : 'Investment Deals'}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-orange-50 text-[#ea580c] border border-orange-200/60">
                  <i className="ri-fire-fill text-[10px]"></i> High Demand
                </span>
                <h1 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                  {isContacts
                    ? 'Customer Leads & Proposals'
                    : view === 'featured'
                    ? 'Featured Hot Sale Properties'
                    : 'All Investment Projects'}
                  <span className="text-[11px] font-normal text-slate-400">({filteredProperties?.length || 0})</span>
                </h1>
              </div>

              {/* Action Button */}
              <div className="shrink-0">
                {view === 'featured' ? (
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
                    className="inline-flex items-center gap-1 rounded-full bg-[#ea580c] hover:bg-[#c2410c] px-3 py-1 text-[11px] font-semibold text-white shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <i className="ri-fire-line text-xs"></i>
                    <span>Create Hot Deal</span>
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
                    className="inline-flex items-center gap-1 rounded-full bg-[#ea580c] hover:bg-[#c2410c] px-3 py-1 text-[11px] font-semibold text-white shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <i className="ri-add-circle-line text-xs"></i>
                    <span>Create Investment Project</span>
                  </button>
                ) : null}
              </div>
            </div>

            {/* Bottom Row: Quick Status Tabs + Compact Search + Type Dropdown */}
            {!isContacts && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2 border-t border-slate-100">
                {/* Status Tab Pills */}
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'running', label: '🚀 Running' },
                    { id: 'upcoming', label: '⏳ Upcoming' },
                    { id: 'delivered', label: '✅ Delivered' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setFilterStatus(st.id)}
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                        filterStatus === st.id
                          ? 'bg-[#ea580c] text-white shadow-xs'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

                {/* Search & Type Select */}
                <div className="flex items-center gap-1.5">
                  <div className="relative flex-1 sm:w-48">
                    <i className="ri-search-line absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400"></i>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search title, location..."
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-7 pr-2 py-1 text-[10px] text-slate-800 placeholder-slate-400 outline-none focus:border-[#ea580c] focus:bg-white font-normal"
                    />
                  </div>

                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] text-slate-700 outline-none cursor-pointer hover:bg-slate-100"
                  >
                    <option value="all">All Types</option>
                    <option value="residential">🏢 Residential</option>
                    <option value="commercial">🏬 Commercial</option>
                    <option value="plot">🏞️ Plot / Land</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {isContacts && <AddInvestorPanel />}

          {!isContacts && (
            <>

              {/* Property Cards Grid */}
              <div>
                {loading ? (
                  <div className="py-10 text-center text-slate-400 font-normal text-[11px]">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-100 border-t-[#ea580c]"></div>
                    <p className="mt-1.5">Loading investment portfolio...</p>
                  </div>
                ) : filteredProperties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 font-normal">
                    {filteredProperties.map((p) => (
                      <div
                        key={p._id}
                        className="group relative flex flex-col justify-between rounded-xl border border-slate-100 bg-white overflow-hidden shadow-xs transition-all duration-200 hover:shadow-md"
                      >
                        <div>
                          <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                            {p.image ? (
                              <img
                                src={p.image}
                                alt={p.title}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 text-slate-400">
                                <i className="ri-building-line text-xl mb-1"></i>
                                <span className="text-[10px]">No Cover Photo</span>
                              </div>
                            )}

                            <div className="absolute left-2 top-2 right-2 flex items-center justify-between gap-1 z-10">
                              <span className="rounded-md px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider bg-[#ea580c] text-white">
                                {p.status || 'Running'}
                              </span>

                              <button
                                type="button"
                                onClick={() => toggleFeaturedStatus(p)}
                                className={`rounded-md px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider backdrop-blur-md transition-all cursor-pointer ${
                                  p.isFeatured
                                    ? 'bg-amber-400 text-slate-900'
                                    : 'bg-white/90 text-slate-600 hover:text-slate-900 border border-slate-200'
                                }`}
                              >
                                {p.isFeatured ? '⭐ Hot Product' : 'Mark Hot Sale'}
                              </button>
                            </div>
                          </div>

                          <div className="p-3 space-y-1">
                            <h3 className="text-[11px] font-semibold text-slate-800 line-clamp-1">
                              {p.title}
                            </h3>
                            <p className="text-[10px] text-slate-500 flex items-center gap-1 font-normal">
                              <i className="ri-map-pin-line text-[#ea580c]"></i>
                              <span className="truncate">{p.location}</span>
                            </p>
                            <p className="text-[11px] font-bold text-[#ea580c]">
                              {formatINR(p.totalValuation) || p.price || '₹0'}
                            </p>
                          </div>
                        </div>

                        <div className="p-3 pt-0 flex items-center gap-1.5 border-t border-slate-100 mt-1">
                          <button
                            type="button"
                            onClick={() => startEdit(p)}
                            className="flex-1 rounded-md bg-slate-100 hover:bg-slate-200 py-1 text-[10px] font-semibold text-slate-700 transition cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProperty(p._id)}
                            className="rounded-md bg-red-50 hover:bg-red-500 text-red-500 hover:text-white p-1 transition cursor-pointer"
                          >
                            <i className="ri-delete-bin-line text-[10px]"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center text-slate-400 text-[11px] font-normal">No properties found.</div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
