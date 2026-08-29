import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../services/api';
import {
  AdminButton,
  AdminSearchBar,
  AdminStatCard,
  AdminBadge,
  AdminDrawer,
  AdminDataTable,
} from '../ui';

const STATUS_BADGES = {
  pending: { variant: 'warning', label: 'Pending Review' },
  approved: { variant: 'success', label: 'Approved Lead' },
  rejected: { variant: 'danger', label: 'Declined' },
};

const FOLLOW_UP_STAGES = [
  { id: 'unassigned', label: 'Not Contacted', badgeVariant: 'neutral', icon: 'ri-time-line' },
  { id: 'contacted', label: 'Contacted', badgeVariant: 'info', icon: 'ri-phone-line' },
  { id: 'site_visit_scheduled', label: 'Site Visit', badgeVariant: 'purple', icon: 'ri-calendar-event-line' },
  { id: 'negotiating', label: 'Negotiating', badgeVariant: 'warning', icon: 'ri-scales-3-line' },
  { id: 'converted', label: 'Converted Deal', badgeVariant: 'success', icon: 'ri-checkbox-circle-line' },
  { id: 'lost', label: 'Lost Lead', badgeVariant: 'danger', icon: 'ri-close-circle-line' },
];

export default function InvestmentRequestsView() {
  const [requests, setRequests] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFollowUp, setFilterFollowUp] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

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
      // Mock fallback data for demonstration if offline
      setRequests([
        {
          _id: 'req-1',
          investorName: 'Rajesh Singhania',
          investorEmail: 'rajesh.singhania@apexventures.in',
          investorPhone: '9820198201',
          propertyTitle: 'Godrej Palm Retreat Phase II',
          propertyLocation: 'Sector 150, Noida Express Highway',
          requestedAmount: 5000000,
          planCategory: 'Co-Investment Pool',
          status: 'pending',
          followUpStatus: 'contacted',
          assignedStaffId: 'staff-1',
          message: 'Interested in acquiring 3 equity slots for the co-investment pool. Please share the RERA registration deck.',
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        },
        {
          _id: 'req-2',
          investorName: 'Meera Chawla',
          investorEmail: 'meera.chawla@gmail.com',
          investorPhone: '9811223344',
          propertyTitle: '2BHK Builder Floor Renovate & Flip',
          propertyLocation: 'Dwarka Mor, New Delhi',
          requestedAmount: 2000000,
          planCategory: 'Flip Yield',
          status: 'approved',
          followUpStatus: 'site_visit_scheduled',
          assignedStaffId: 'staff-2',
          message: 'Can we schedule a site walkthrough this Saturday afternoon?',
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
        {
          _id: 'req-3',
          investorName: 'Sunil Mittal & Partners',
          investorEmail: 'invest@mittalcapital.com',
          investorPhone: '9988776655',
          propertyTitle: 'Commercial Retail Hub Block C',
          propertyLocation: 'Golf Course Road, Gurugram',
          requestedAmount: 15000000,
          planCategory: 'Commercial Asset',
          status: 'pending',
          followUpStatus: 'unassigned',
          message: 'High conviction commercial retail space. Looking for minimum 18% IRR projections.',
          createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        },
      ]);
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
      setRequests((list) => list.map((r) => (r._id === id ? { ...r, ...updated, status: nextStatus } : r)));
      setStatus(`Request marked as ${nextStatus.toUpperCase()}.`);
    } catch {
      setRequests((list) => list.map((r) => (r._id === id ? { ...r, status: nextStatus } : r)));
      setStatus(`Request marked as ${nextStatus.toUpperCase()}.`);
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
      setRequests((list) => list.map((r) => (r._id === id ? { ...r, ...updated, followUpStatus: nextFollowUpStatus } : r)));
    } catch {
      setRequests((list) => list.map((r) => (r._id === id ? { ...r, followUpStatus: nextFollowUpStatus } : r)));
    } finally {
      setUpdatingId(null);
    }
  };

  const assignToStaff = async (id, staffId) => {
    setUpdatingId(id);
    try {
      const updated = await api(`/api/investment-requests/${id}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId }),
      });
      setRequests((list) => list.map((r) => (r._id === id ? { ...r, ...updated, assignedStaffId: staffId } : r)));
      const staffMember = staff.find((s) => s._id === staffId);
      setStatus(`Assigned to ${staffMember ? staffMember.name : 'staff'}.`);
    } catch {
      setRequests((list) => list.map((r) => (r._id === id ? { ...r, assignedStaffId: staffId } : r)));
      const staffMember = staff.find((s) => s._id === staffId);
      setStatus(`Assigned to ${staffMember ? staffMember.name : 'staff'}.`);
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
        return (
          prop.includes(q) ||
          loc.includes(q) ||
          invName.includes(q) ||
          invPhone.includes(q) ||
          invEmail.includes(q) ||
          msg.includes(q)
        );
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
    if (num >= 100000) return `₹ ${(num / 100000).toFixed(2)} L`;
    return `₹ ${Number(num).toLocaleString('en-IN')}`;
  };

  // Columns for the Dense Table View
  const tableColumns = [
    {
      key: 'investorName',
      label: 'Investor',
      sortable: true,
      render: (_, req) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 text-orange-600 font-bold text-xs flex items-center justify-center border border-orange-500/20 shadow-2xs shrink-0">
            {(req.investorName || 'I')[0]}
          </div>
          <div>
            <span className="font-bold text-slate-900 block truncate">{req.investorName}</span>
            <span className="text-[11px] text-slate-400 font-mono">{req.investorPhone}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'propertyTitle',
      label: 'Target Property / Project',
      sortable: true,
      render: (_, req) => (
        <div className="min-w-0 max-w-xs">
          <span className="font-semibold text-slate-800 block truncate">{req.propertyTitle}</span>
          <span className="text-[11px] text-slate-400 block truncate">
            {req.propertyLocation || 'Location unspecified'}
          </span>
        </div>
      ),
    },
    {
      key: 'requestedAmount',
      label: 'Demand Capital',
      sortable: true,
      render: (amount) => (
        <span className="font-bold text-slate-900 tabular-nums">
          {formatCapital(amount)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Decision Status',
      sortable: true,
      render: (status) => {
        const b = STATUS_BADGES[status] || STATUS_BADGES.pending;
        return (
          <AdminBadge variant={b.variant} size="sm" dot>
            {b.label}
          </AdminBadge>
        );
      },
    },
    {
      key: 'followUpStatus',
      label: 'Lead Stage',
      sortable: true,
      render: (stage) => {
        const found = FOLLOW_UP_STAGES.find((s) => s.id === stage) || FOLLOW_UP_STAGES[0];
        return (
          <AdminBadge variant={found.badgeVariant} size="sm">
            {found.label}
          </AdminBadge>
        );
      },
    },
    {
      key: 'assignedStaffId',
      label: 'Assigned Agent',
      render: (staffId, req) => {
        const assignedMember = staff.find((s) => s._id === staffId);
        return (
          <select
            value={staffId || ''}
            onChange={(e) => assignToStaff(req._id, e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 outline-none focus:border-orange-500 focus:bg-white cursor-pointer max-w-[130px] truncate font-medium"
          >
            <option value="">Unassigned</option>
            {staff.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.role === 'salesman' ? 'Sales' : 'Employee'})
              </option>
            ))}
          </select>
        );
      },
    },
    {
      key: 'actions',
      label: 'Quick Contact',
      align: 'right',
      render: (_, req) => {
        const cleanPhone = (req.investorPhone || '').replace(/\D/g, '');
        const waMessage = encodeURIComponent(
          `Hello ${req.investorName}, thank you for your investment interest in "${req.propertyTitle}" with Baba Broker. We're happy to connect and share financial documentation!`
        );

        return (
          <div className="flex items-center justify-end gap-1.5">
            {cleanPhone && (
              <a
                href={`https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${waMessage}`}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition cursor-pointer text-xs"
                title="WhatsApp Investor"
              >
                <i className="ri-whatsapp-line" />
              </a>
            )}
            {req.investorPhone && (
              <a
                href={`tel:${req.investorPhone}`}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer text-xs"
                title="Call Directly"
              >
                <i className="ri-phone-line" />
              </a>
            )}
            <button
              type="button"
              onClick={() => setSelectedRequest(req)}
              className="p-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition cursor-pointer text-xs"
              title="View Full Details"
            >
              <i className="ri-eye-line" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 font-['Inter',sans-serif] text-slate-800 antialiased select-text pb-12">
      {/* ─── TOP EXECUTIVE PAGE HEADER ─── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-orange-500/15 text-orange-600 border border-orange-500/25">
              <i className="ri-funds-box-line" />
              Capital Demand & Deal Pipeline
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              · Live Investor Touchpoints
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Investment Requests from Investors
          </h1>
          <p className="text-xs text-slate-500 font-normal max-w-xl">
            Track co-investment intents, review capital commitments, coordinate WhatsApp walkthroughs, and assign sales representatives.
          </p>
        </div>

        {/* Right CTA / Refresh */}
        <div className="flex items-center gap-2.5 shrink-0">
          <AdminButton
            variant="outline"
            size="md"
            icon={`ri-refresh-line ${loading ? 'animate-spin' : ''}`}
            onClick={load}
          >
            Refresh Desk
          </AdminButton>
        </div>
      </div>

      {/* ─── STATUS NOTICE TOAST ─── */}
      {status && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-xs font-bold text-emerald-900 flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <i className="ri-checkbox-circle-fill text-emerald-600 text-base" />
            <span>{status}</span>
          </div>
          <button
            onClick={() => setStatus('')}
            className="text-emerald-700 hover:text-emerald-900 p-0.5 cursor-pointer"
          >
            <i className="ri-close-line text-base" />
          </button>
        </div>
      )}

      {/* ─── 4 REUSABLE KPI STAT CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AdminStatCard
          title="Total Requests"
          value={metrics.total}
          subValue="Pool"
          icon="ri-inbox-archive-line"
          theme="orange"
          trendLabel="Submitted by Investors"
        />

        <AdminStatCard
          title="Pending Review"
          value={metrics.pending}
          subValue="Queued"
          icon="ri-time-line"
          theme="emerald"
          trendLabel="Awaiting Review & Approval"
        />

        <AdminStatCard
          title="Total Capital Demand"
          value={formatCapital(metrics.totalCapital)}
          icon="ri-money-dollar-circle-line"
          theme="indigo"
          trendLabel="Cumulative Investor Intent"
        />

        <AdminStatCard
          title="Approved Leads"
          value={metrics.approved}
          subValue="Active"
          icon="ri-shield-check-line"
          theme="rose"
          trendLabel="Ready for Deal Closing"
        />
      </div>

      {/* ─── CONTROLS & FILTER TOOLBAR ─── */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="flex-1 max-w-sm">
            <AdminSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by investor, property, location..."
            />
          </div>

          {/* Filters & View Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-0.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {[
                { id: 'all', label: 'All', count: counts.all },
                { id: 'pending', label: 'Pending', count: counts.pending },
                { id: 'approved', label: 'Approved', count: counts.approved },
                { id: 'rejected', label: 'Declined', count: counts.rejected },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    filterStatus === tab.id
                      ? 'bg-white text-orange-600 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      filterStatus === tab.id
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Lead Stage Dropdown */}
            <select
              value={filterFollowUp}
              onChange={(e) => setFilterFollowUp(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:border-orange-500 focus:bg-white outline-none cursor-pointer"
            >
              <option value="all">All Lead Stages</option>
              {FOLLOW_UP_STAGES.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.label}
                </option>
              ))}
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
          <p className="text-xs font-semibold text-slate-500">Loading investment requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-16 text-center shadow-xs">
          <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
            <div className="h-14 w-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl border border-orange-200/60 shadow-2xs">
              <i className="ri-inbox-line" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-2">No Requests Found</h3>
            <p className="text-xs text-slate-400">
              No investor requests match your current search query or active filter settings.
            </p>
            <div className="pt-2">
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                  setFilterFollowUp('all');
                }}
              >
                Reset Filters
              </AdminButton>
            </div>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRequests.map((req) => {
            const cleanPhone = (req.investorPhone || '').replace(/\D/g, '');
            const waMessage = encodeURIComponent(
              `Hello ${req.investorName}, thank you for your investment interest in "${req.propertyTitle}" with Baba Broker. We'd love to share complete financial and ROI documentation with you!`
            );
            const statusBadge = STATUS_BADGES[req.status] || STATUS_BADGES.pending;
            const followUpStage = FOLLOW_UP_STAGES.find((s) => s.id === req.followUpStatus) || FOLLOW_UP_STAGES[0];

            return (
              <div
                key={req._id}
                className="group rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs hover:shadow-xl hover:border-orange-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3.5">
                  {/* Top Bar: Property Title & Demand Banner */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <AdminBadge variant={statusBadge.variant} size="sm" dot>
                          {statusBadge.label}
                        </AdminBadge>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60 uppercase">
                          {req.planCategory || 'Co-Investment'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 tracking-tight truncate group-hover:text-orange-600 transition-colors">
                        {req.propertyTitle}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <i className="ri-map-pin-2-line text-orange-500 text-xs" />
                        <span className="truncate">{req.propertyLocation || 'Location unspecified'}</span>
                      </p>
                    </div>

                    {/* Capital Demand Amount Card */}
                    <div className="text-right p-3 rounded-2xl bg-orange-50/70 border border-orange-200/60 shrink-0">
                      <span className="text-[9px] uppercase font-bold text-orange-700 block tracking-wider">
                        Requested Capital
                      </span>
                      <span className="text-lg font-black text-slate-900 tracking-tight tabular-nums">
                        ₹ {Number(req.requestedAmount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Investor Identity Chip */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0">
                        {(req.investorName || 'I')[0]}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {req.investorName}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
                          <span>{req.investorPhone}</span>
                          {req.investorEmail && (
                            <span className="hidden sm:inline font-mono text-[10px]">
                              · {req.investorEmail}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Direct Contact Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {cleanPhone && (
                        <a
                          href={`https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${waMessage}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition cursor-pointer text-xs font-bold flex items-center gap-1"
                          title="WhatsApp Investor"
                        >
                          <i className="ri-whatsapp-line text-sm" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </a>
                      )}
                      {req.investorPhone && (
                        <a
                          href={`tel:${req.investorPhone}`}
                          className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer text-xs font-bold flex items-center gap-1"
                          title="Call Investor"
                        >
                          <i className="ri-phone-line text-sm" />
                          <span className="hidden sm:inline">Call</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Investor Message Note (if any) */}
                  {req.message && (
                    <div className="p-3 rounded-2xl bg-amber-50/40 border border-amber-200/50 text-xs text-slate-700 italic">
                      <span className="font-bold text-amber-800 not-italic block text-[10px] uppercase mb-0.5">
                        Investor Note:
                      </span>
                      "{req.message}"
                    </div>
                  )}

                  {/* Lead Controls: Stage Selector & Staff Assignment */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {/* Stage Selector */}
                    <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Stage:</span>
                      <select
                        value={req.followUpStatus || 'unassigned'}
                        onChange={(e) => updateFollowUp(req._id, e.target.value)}
                        disabled={updatingId === req._id}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-orange-500 outline-none cursor-pointer max-w-[140px] truncate font-medium"
                      >
                        {FOLLOW_UP_STAGES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Staff Selector */}
                    <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Agent:</span>
                      <select
                        value={req.assignedStaffId || ''}
                        onChange={(e) => assignToStaff(req._id, e.target.value)}
                        disabled={updatingId === req._id}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-orange-500 outline-none cursor-pointer max-w-[140px] truncate font-medium"
                      >
                        <option value="">Unassigned</option>
                        {staff.map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.name} ({s.role === 'salesman' ? 'Sales' : 'Employee'})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bottom Decision Status Actions */}
                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Received: {new Date(req.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {req.status !== 'approved' && (
                      <AdminButton
                        variant="success"
                        size="xs"
                        icon="ri-check-line"
                        onClick={() => updateStatus(req._id, 'approved')}
                        loading={updatingId === req._id}
                      >
                        Approve
                      </AdminButton>
                    )}
                    {req.status !== 'rejected' && (
                      <AdminButton
                        variant="outline"
                        size="xs"
                        icon="ri-close-line"
                        onClick={() => updateStatus(req._id, 'rejected')}
                        loading={updatingId === req._id}
                      >
                        Decline
                      </AdminButton>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(req)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer text-xs"
                      title="Inspect Details"
                    >
                      <i className="ri-external-link-line" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* DENSE TABLE VIEW */
        <AdminDataTable
          columns={tableColumns}
          data={filteredRequests}
          loading={loading}
          keyField="_id"
        />
      )}

      {/* ─── INVESTOR REQUEST DETAILS RIGHT-SLIDING DRAWER ─── */}
      <AdminDrawer
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title="Investor Deal Dossier"
        subtitle={`Reference ID: ${selectedRequest?._id || 'REQ'}`}
        icon="ri-funds-line"
      >
        {selectedRequest && (
          <div className="space-y-5 text-slate-800">
            {/* Property Banner Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">
                Target Real Estate Asset
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {selectedRequest.propertyTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {selectedRequest.propertyLocation || 'Location unspecified'}
              </p>
            </div>

            {/* Requested Amount */}
            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-orange-700 uppercase block">
                  Capital Commitment
                </span>
                <span className="text-2xl font-black text-slate-900 tabular-nums">
                  ₹ {Number(selectedRequest.requestedAmount || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <AdminBadge
                variant={STATUS_BADGES[selectedRequest.status]?.variant || 'warning'}
                size="md"
                dot
              >
                {STATUS_BADGES[selectedRequest.status]?.label || 'Pending'}
              </AdminBadge>
            </div>

            {/* Investor Contact Details */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Investor Credentials
              </span>
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Full Name</span>
                  <span className="font-bold text-slate-900">{selectedRequest.investorName}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                  <span className="text-slate-500">Phone</span>
                  <span className="font-mono font-medium text-slate-900">+{selectedRequest.investorPhone}</span>
                </div>
                {selectedRequest.investorEmail && (
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                    <span className="text-slate-500">Work Email</span>
                    <span className="font-mono text-slate-900">{selectedRequest.investorEmail}</span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                  <span className="text-slate-500">Submitted</span>
                  <span className="text-slate-700">
                    {new Date(selectedRequest.createdAt).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Message */}
            {selectedRequest.message && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Investor Inquiry Message
                </span>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed italic">
                  "{selectedRequest.message}"
                </div>
              </div>
            )}

            {/* Quick Action Controls in Drawer */}
            <div className="pt-2 flex items-center gap-2">
              {selectedRequest.status !== 'approved' && (
                <AdminButton
                  variant="success"
                  fullWidth
                  icon="ri-check-line"
                  onClick={() => {
                    updateStatus(selectedRequest._id, 'approved');
                    setSelectedRequest((prev) => ({ ...prev, status: 'approved' }));
                  }}
                >
                  Approve Deal
                </AdminButton>
              )}
              {selectedRequest.status !== 'rejected' && (
                <AdminButton
                  variant="danger"
                  fullWidth
                  icon="ri-close-line"
                  onClick={() => {
                    updateStatus(selectedRequest._id, 'rejected');
                    setSelectedRequest((prev) => ({ ...prev, status: 'rejected' }));
                  }}
                >
                  Decline Lead
                </AdminButton>
              )}
            </div>
          </div>
        )}
      </AdminDrawer>
    </div>
  );
}
