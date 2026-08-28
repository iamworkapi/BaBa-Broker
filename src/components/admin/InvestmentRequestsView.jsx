import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../services/api';
import AdminPageHeader from './AdminPageHeader';

const STATUS_STYLES = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const FOLLOW_UP_LABELS = {
  unassigned: 'Not Yet Contacted',
  contacted: 'Contacted',
  site_visit_scheduled: 'Site Visit Scheduled',
  negotiating: 'Negotiating',
  converted: 'Converted',
  lost: 'Lost',
};

const FOLLOW_UP_STYLES = {
  unassigned: 'bg-slate-800 text-slate-400 border-slate-700',
  contacted: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  site_visit_scheduled: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  negotiating: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  converted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  lost: 'bg-red-500/10 text-red-400 border-red-500/30',
};

export default function InvestmentRequestsView() {
  const [requests, setRequests] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFollowUp, setFilterFollowUp] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [reqData, staffData] = await Promise.all([
        api('/api/investment-requests'),
        api('/api/staff'),
      ]);
      setRequests(Array.isArray(reqData) ? reqData : []);
      setStaff(Array.isArray(staffData) ? staffData.filter((s) => s.isActive) : []);
      setStatus('');
    } catch (err) {
      setStatus(err.message || 'Failed to load investment requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, nextStatus) => {
    setUpdatingId(id);
    try {
      const updated = await api(`/api/investment-requests/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      setRequests((list) => list.map((r) => (r._id === id ? updated : r)));
    } catch (err) {
      setStatus(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const updateFollowUp = async (id, nextFollowUpStatus) => {
    if (!nextFollowUpStatus) return;
    setUpdatingId(id);
    try {
      const updated = await api(`/api/investment-requests/${id}/follow-up`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followUpStatus: nextFollowUpStatus }),
      });
      setRequests((list) => list.map((r) => (r._id === id ? updated : r)));
    } catch (err) {
      setStatus(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const assignToStaff = async (id, staffId) => {
    if (!staffId) return;
    setUpdatingId(id);
    try {
      const updated = await api(`/api/investment-requests/${id}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId }),
      });
      setRequests((list) => list.map((r) => (r._id === id ? updated : r)));
    } catch (err) {
      setStatus(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // KPI Analytics
  const metrics = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === 'pending').length;
    const approved = requests.filter((r) => r.status === 'approved').length;
    const totalCapital = requests.reduce((sum, r) => sum + (Number(r.requestedAmount) || 0), 0);
    return { total, pending, approved, totalCapital };
  }, [requests]);

  // Filtered & Searched Requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      if (filterStatus !== 'all' && req.status !== filterStatus) return false;
      if (filterFollowUp !== 'all' && (req.followUpStatus || 'unassigned') !== filterFollowUp) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const prop = (req.propertyTitle || '').toLowerCase();
        const loc = (req.propertyLocation || '').toLowerCase();
        const invName = (req.investorName || '').toLowerCase();
        const invPhone = (req.investorPhone || '').toLowerCase();
        const invEmail = (req.investorEmail || '').toLowerCase();
        const msg = (req.message || '').toLowerCase();
        return prop.includes(q) || loc.includes(q) || invName.includes(q) || invPhone.includes(q) || invEmail.includes(q) || msg.includes(q);
      }

      return true;
    });
  }, [requests, filterStatus, filterFollowUp, searchQuery]);

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  const formatCapital = (num) => {
    if (!num) return '₹ 0';
    if (num >= 10000000) return `₹ ${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹ ${(num / 100000).toFixed(2)} Lakhs`;
    return `₹ ${num.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <AdminPageHeader
        badge="INVESTOR REQUESTS CRM"
        title="Investment Requests from Investors"
        subtitle="Manage investor intent requests. Directly initiate WhatsApp calls, assign to staff, and track lead conversion stages."
        icon="fa-solid fa-hand-holding-dollar"
        iconColor="text-orange-400"
        iconBg="bg-gradient-to-tr from-orange-500/20 to-amber-500/10 border-orange-500/30"
        breadcrumbs={[
          { label: 'Admin Workspace', link: '/admin/dashboard' },
          { label: 'Investment Requests' },
        ]}
      />

      {/* KPI Metrics Analytics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-orange-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Requests</span>
            <div className="h-8 w-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <i className="fa-solid fa-inbox text-xs"></i>
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2 tracking-tight">{metrics.total}</p>
          <p className="text-[10px] text-slate-500 mt-1">Submitted by investors</p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Review</span>
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <i className="fa-solid fa-clock text-xs"></i>
            </div>
          </div>
          <p className="text-2xl font-black text-amber-400 mt-2 tracking-tight">{metrics.pending}</p>
          <p className="text-[10px] text-slate-500 mt-1">Awaiting admin decision</p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Demand</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <i className="fa-solid fa-sack-dollar text-xs"></i>
            </div>
          </div>
          <p className="text-xl font-black text-emerald-400 mt-2 tracking-tight">{formatCapital(metrics.totalCapital)}</p>
          <p className="text-[10px] text-slate-500 mt-1">Total capital requested</p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Approved Leads</span>
            <div className="h-8 w-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <i className="fa-solid fa-circle-check text-xs"></i>
            </div>
          </div>
          <p className="text-2xl font-black text-blue-400 mt-2 tracking-tight">{metrics.approved}</p>
          <p className="text-[10px] text-slate-500 mt-1">Approved & active</p>
        </div>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-3 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
            <input
              type="text"
              placeholder="Search by property, investor name, phone, email..."
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

          {/* Follow-up Stage Filter */}
          <select
            value={filterFollowUp}
            onChange={(e) => setFilterFollowUp(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300 focus:border-orange-500/50 focus:outline-none cursor-pointer"
          >
            <option value="all">All Lead Stages</option>
            <option value="unassigned">Not Yet Contacted</option>
            <option value="contacted">Contacted</option>
            <option value="site_visit_scheduled">Site Visit Scheduled</option>
            <option value="negotiating">Negotiating</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60">
          {[
            { id: 'all', label: 'All Requests' },
            { id: 'pending', label: 'Pending' },
            { id: 'approved', label: 'Approved' },
            { id: 'rejected', label: 'Rejected' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                filterStatus === tab.id
                  ? 'border border-orange-500/60 bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 shadow-md shadow-orange-500/10'
                  : 'border border-slate-800 bg-slate-950/80 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              {tab.label}
              <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[10px] font-black text-slate-300">
                {counts[tab.id]}
              </span>
            </button>
          ))}

          <button
            onClick={load}
            className="ml-auto text-xs text-slate-400 hover:text-orange-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <i className={`fa-solid fa-rotate-right ${loading ? 'fa-spin' : ''}`}></i> Refresh
          </button>
        </div>
      </div>

      {status && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-medium text-red-200 flex items-center justify-between">
          <span><i className="fa-solid fa-triangle-exclamation mr-2"></i>{status}</span>
          <button onClick={() => setStatus('')} className="text-red-400 hover:text-red-200 cursor-pointer">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {/* Requests List */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 rounded-3xl border border-slate-800/80 bg-slate-900/40">
          <i className="fa-solid fa-circle-notch fa-spin text-3xl text-orange-500 mb-3 block"></i>
          <p className="text-xs font-semibold text-slate-300">Fetching investor requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="py-20 text-center text-slate-400 rounded-3xl border border-slate-800/80 bg-slate-900/40 space-y-3">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-600 text-2xl">
            <i className="fa-solid fa-inbox"></i>
          </div>
          <h3 className="text-sm font-bold text-white">No Investment Requests Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No investor requests match your current search query or active filter settings.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const expanded = expandedId === req._id;
            const cleanPhone = (req.investorPhone || '').replace(/\D/g, '');
            const waMessage = encodeURIComponent(
              `Hello ${req.investorName}, thank you for your investment request for "${req.propertyTitle}" on Baba Broker. We'd love to share complete financial portfolio details with you!`
            );

            return (
              <div
                key={req._id}
                className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl p-5 sm:p-6 space-y-4 backdrop-blur-xl hover:border-slate-700 transition-all duration-200"
              >
                {/* Header Row: Property Info & Badges */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${STATUS_STYLES[req.status]}`}>
                        {req.status}
                      </span>
                      <span className="rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase bg-slate-800/80 text-slate-300 border border-slate-700">
                        {req.planCategory}
                      </span>
                      <span className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase border ${FOLLOW_UP_STYLES[req.followUpStatus] || FOLLOW_UP_STYLES.unassigned}`}>
                        {FOLLOW_UP_LABELS[req.followUpStatus] || 'Not Yet Contacted'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white tracking-tight">
                      {req.propertyTitle}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      <i className="fa-solid fa-location-dot text-orange-500"></i>
                      <span>{req.propertyLocation || 'Location not specified'}</span>
                    </p>
                  </div>

                  {/* Requested Amount Banner */}
                  <div className="text-left sm:text-right rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-3 shrink-0">
                    <span className="block text-[9px] uppercase tracking-wider text-amber-400 font-bold">Requested Investment</span>
                    <span className="text-lg sm:text-xl font-black text-amber-400 tracking-tight">
                      ₹ {Number(req.requestedAmount || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Approachable Investor Identity & Direct Communication Bar */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Investor Initials Avatar */}
                    <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-black text-base shrink-0 shadow-lg">
                      {(req.investorName || 'I')[0]}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white truncate">{req.investorName}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">
                          • {new Date(req.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 flex items-center gap-3 flex-wrap mt-0.5">
                        <span><i className="fa-solid fa-phone text-emerald-400 mr-1"></i>+{req.investorPhone}</span>
                        {req.investorEmail && (
                          <span><i className="fa-solid fa-envelope text-blue-400 mr-1"></i>{req.investorEmail}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Direct Contact Action Triggers */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${waMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3 py-2 text-xs font-bold text-emerald-400 transition-all flex items-center gap-1.5 shadow"
                        title="Chat with Investor on WhatsApp"
                      >
                        <i className="fa-brands fa-whatsapp text-sm"></i>
                        <span>WhatsApp</span>
                      </a>
                    )}

                    {req.investorPhone && (
                      <a
                        href={`tel:${req.investorPhone}`}
                        className="rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center gap-1.5"
                        title="Call Investor Directly"
                      >
                        <i className="fa-solid fa-phone text-xs text-blue-400"></i>
                        <span>Call</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Investor Note / Message Box */}
                {req.message && (
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3.5">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                      <i className="fa-solid fa-quote-left text-orange-400 text-[10px]"></i> Investor Note
                    </p>
                    <p className="text-xs text-slate-200 font-medium italic leading-relaxed">
                      "{req.message}"
                    </p>
                  </div>
                )}

                {/* Interactive Controls: Staff Assignment & Lead Stage Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Lead Follow-Up Stage Selector */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-2.5 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                      <i className="fa-solid fa-diagram-project text-orange-400 mr-1"></i> Lead Stage:
                    </span>
                    <select
                      value={req.followUpStatus || 'unassigned'}
                      onChange={(e) => updateFollowUp(req._id, e.target.value)}
                      disabled={updatingId === req._id}
                      className="w-full max-w-[170px] rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-white outline-none focus:border-orange-500 cursor-pointer disabled:opacity-60"
                    >
                      <option value="unassigned">Not Yet Contacted</option>
                      <option value="contacted">Contacted</option>
                      <option value="site_visit_scheduled">Site Visit Scheduled</option>
                      <option value="negotiating">Negotiating</option>
                      <option value="converted">Converted</option>
                      <option value="lost">Lost</option>
                    </select>
                  </div>

                  {/* Staff Assignment Selector */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-2.5 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                      <i className="fa-solid fa-user-check text-blue-400 mr-1"></i> Assigned Staff:
                    </span>
                    <select
                      value={req.assignedTo || ''}
                      onChange={(e) => assignToStaff(req._id, e.target.value)}
                      disabled={updatingId === req._id}
                      className="w-full max-w-[170px] rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-white outline-none focus:border-orange-500 cursor-pointer disabled:opacity-60"
                    >
                      <option value="">{req.assignedTo ? 'Reassign to...' : 'Assign to...'}</option>
                      {staff.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name} ({s.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Bottom Action Row: Approval Actions & Activity Log Toggle */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    {req.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => updateStatus(req._id, 'approved')}
                          disabled={updatingId === req._id}
                          className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all disabled:opacity-60 cursor-pointer flex items-center gap-1.5 shadow"
                        >
                          <i className="fa-solid fa-check text-xs"></i>
                          <span>Approve Request</span>
                        </button>
                        <button
                          onClick={() => updateStatus(req._id, 'rejected')}
                          disabled={updatingId === req._id}
                          className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold transition-all disabled:opacity-60 cursor-pointer flex items-center gap-1.5"
                        >
                          <i className="fa-solid fa-xmark text-xs"></i>
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                        <i className={`fa-solid ${req.status === 'approved' ? 'fa-check text-emerald-400' : 'fa-xmark text-red-400'}`}></i>
                        Status: <strong className="text-white uppercase">{req.status}</strong>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setExpandedId(expanded ? null : req._id)}
                    className="text-xs font-semibold text-slate-400 hover:text-orange-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <i className="fa-solid fa-clock-rotate-left"></i>
                    <span>{expanded ? 'Hide' : 'View'} Activity Log ({req.statusHistory?.length || 0})</span>
                    <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${expanded ? 'rotate-180' : ''}`}></i>
                  </button>
                </div>

                {/* Expanded Activity Timeline */}
                {expanded && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3 animate-fadeIn">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <i className="fa-solid fa-timeline text-orange-400"></i> Request Activity Timeline
                    </h5>

                    <div className="space-y-2">
                      {(req.statusHistory || []).slice().reverse().map((entry, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-xs border-b border-slate-900/80 last:border-0 pb-2.5 last:pb-0">
                          <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-orange-400 shrink-0 mt-0.5">
                            <i className="fa-solid fa-circle-dot"></i>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-slate-200 font-medium">
                              {entry.status && <span className="font-bold text-white uppercase">{entry.status}</span>}
                              {entry.status && entry.followUpStatus ? ' • ' : ''}
                              {entry.followUpStatus && (
                                <span className="font-semibold text-amber-400">{FOLLOW_UP_LABELS[entry.followUpStatus] || entry.followUpStatus}</span>
                              )}
                            </p>
                            {entry.note && <p className="text-slate-400 text-[11px] mt-0.5">{entry.note}</p>}
                            <p className="text-[10px] text-slate-500 font-mono mt-1">
                              {entry.changedByName || 'System'} • {new Date(entry.changedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
