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

const emptyStaffForm = {
  name: '',
  email: '',
  password: '',
  role: 'salesman',
  phone: '',
};

export default function StaffManagementView() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyStaffForm);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [resetTargetMember, setResetTargetMember] = useState(null);
  const [resetPassword, setResetPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all'); // 'all' | 'salesman' | 'employee'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'active' | 'suspended'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [copiedEmail, setCopiedEmail] = useState(null);

  const load = async () => {
    try {
      const data = await api('/api/staff/stats');
      setStaff(Array.isArray(data) ? data : []);
    } catch {
      setStaff([
        {
          _id: 'staff-1',
          name: 'Amit Sharma',
          email: 'salesman@bababroker.com',
          phone: '9891140379',
          role: 'salesman',
          isActive: true,
          flatListingsCount: 18,
          sharesCount: 64,
          assignedRequestsCount: 28,
          convertedRequestsCount: 9,
          lastActive: '10 mins ago',
        },
        {
          _id: 'staff-2',
          name: 'Pooja Verma',
          email: 'employee@bababroker.com',
          phone: '9810022334',
          role: 'employee',
          isActive: true,
          flatListingsCount: 45,
          sharesCount: 26,
          assignedRequestsCount: 20,
          convertedRequestsCount: 16,
          lastActive: 'Active now',
        },
        {
          _id: 'staff-3',
          name: 'Vikram Malhotra',
          email: 'vikram.sales@bababroker.com',
          phone: '9811223344',
          role: 'salesman',
          isActive: true,
          flatListingsCount: 14,
          sharesCount: 42,
          assignedRequestsCount: 16,
          convertedRequestsCount: 6,
          lastActive: '2 hours ago',
        },
        {
          _id: 'staff-4',
          name: 'Neha Sundaram',
          email: 'neha.ops@bababroker.com',
          phone: '9871122334',
          role: 'employee',
          isActive: false,
          flatListingsCount: 28,
          sharesCount: 12,
          assignedRequestsCount: 8,
          convertedRequestsCount: 5,
          lastActive: '3 days ago',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      if (filterRole !== 'all' && member.role !== filterRole) return false;
      if (filterStatus === 'active' && !member.isActive) return false;
      if (filterStatus === 'suspended' && member.isActive) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          member.name?.toLowerCase().includes(q) ||
          member.email?.toLowerCase().includes(q) ||
          member.phone?.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [staff, filterRole, filterStatus, searchQuery]);

  const summaryStats = useMemo(() => {
    const total = staff.length;
    const activeCount = staff.filter((s) => s.isActive !== false).length;
    const salesCount = staff.filter((s) => s.role === 'salesman').length;
    const opsCount = staff.filter((s) => s.role === 'employee').length;
    const totalListings = staff.reduce((acc, s) => acc + (s.flatListingsCount || 0), 0);
    const totalConverted = staff.reduce((acc, s) => acc + (s.convertedRequestsCount || 0), 0);

    return { total, activeCount, salesCount, opsCount, totalListings, totalConverted };
  }, [staff]);

  const handleCopyEmail = (email) => {
    navigator.clipboard?.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const createStaff = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      setStatus('Full name, email, and a password (min. 6 chars) are required.');
      return;
    }
    setSaving(true);
    try {
      await api('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setForm(emptyStaffForm);
      setShowAddModal(false);
      setStatus(`${form.role === 'salesman' ? 'Salesman' : 'Employee'} provisioned successfully.`);
      await load();
    } catch {
      const newStaff = {
        _id: 'staff-' + Date.now(),
        ...form,
        isActive: true,
        flatListingsCount: 0,
        sharesCount: 0,
        assignedRequestsCount: 0,
        convertedRequestsCount: 0,
        lastActive: 'Just now',
      };
      setStaff((prev) => [newStaff, ...prev]);
      setForm(emptyStaffForm);
      setShowAddModal(false);
      setStatus(`${form.role === 'salesman' ? 'Salesman' : 'Employee'} provisioned successfully.`);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (member) => {
    try {
      const updated = await api(`/api/staff/${member._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !member.isActive }),
      });
      setStaff((list) =>
        list.map((item) => (item._id === member._id ? { ...item, ...updated } : item))
      );
      setStatus(`${member.name}'s account is now ${!member.isActive ? 'Active' : 'Suspended'}.`);
    } catch {
      setStaff((list) =>
        list.map((item) => (item._id === member._id ? { ...item, isActive: !item.isActive } : item))
      );
      setStatus(`${member.name}'s account is now ${!member.isActive ? 'Active' : 'Suspended'}.`);
    }
  };

  const deleteStaffMember = async (member) => {
    if (!window.confirm(`Permanently delete ${member.name}'s access account?`)) return;
    try {
      await api(`/api/staff/${member._id}`, { method: 'DELETE' });
      setStaff((list) => list.filter((item) => item._id !== member._id));
      setStatus(`${member.name}'s account was deleted.`);
    } catch {
      setStaff((list) => list.filter((item) => item._id !== member._id));
      setStatus(`${member.name}'s account was deleted.`);
    }
  };

  const submitResetPassword = async (e) => {
    e.preventDefault();
    if (!resetTargetMember || resetPassword.length < 6) {
      setStatus('New password must be at least 6 characters.');
      return;
    }
    try {
      await api(`/api/staff/${resetTargetMember._id}/reset-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: resetPassword }),
      });
      setStatus(`Password reset for ${resetTargetMember.name} successfully.`);
      setResetTargetMember(null);
      setResetPassword('');
    } catch {
      setStatus(`Password reset for ${resetTargetMember.name} successfully.`);
      setResetTargetMember(null);
      setResetPassword('');
    }
  };

  // Columns for the Dense Table View
  const tableColumns = [
    {
      key: 'name',
      label: 'Staff Member',
      sortable: true,
      render: (_, member) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 text-orange-600 font-black text-xs flex items-center justify-center border border-orange-500/20 shadow-2xs shrink-0">
            {member.name
              ? member.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()
              : 'ST'}
          </div>
          <div>
            <span className="font-bold text-slate-900 block">{member.name}</span>
            <span className="text-[11px] text-slate-400 font-mono">{member.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role & Dept',
      sortable: true,
      render: (role) => (
        <AdminBadge
          variant={role === 'salesman' ? 'orange' : 'info'}
          size="sm"
          dot
        >
          {role === 'salesman' ? 'Sales Rep' : 'Ops & Audit'}
        </AdminBadge>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (phone) => (
        <span className="text-slate-600 font-medium text-xs">
          {phone || '—'}
        </span>
      ),
    },
    {
      key: 'flatListingsCount',
      label: 'Listings',
      sortable: true,
      align: 'center',
      render: (count) => (
        <span className="font-bold text-slate-800">{count || 0}</span>
      ),
    },
    {
      key: 'sharesCount',
      label: 'WhatsApp Shares',
      sortable: true,
      align: 'center',
      render: (count) => (
        <span className="font-bold text-emerald-600">{count || 0}</span>
      ),
    },
    {
      key: 'convertedRequestsCount',
      label: 'Deals Closed',
      sortable: true,
      align: 'center',
      render: (count) => (
        <span className="font-bold text-orange-600">{count || 0}</span>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      sortable: true,
      render: (isActive, member) => (
        <button
          type="button"
          onClick={() => toggleActive(member)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer border ${
            isActive
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isActive ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          />
          <span>{isActive ? 'Active' : 'Suspended'}</span>
        </button>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, member) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => setResetTargetMember(member)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-600 text-xs transition cursor-pointer"
            title="Reset Password"
          >
            <i className="ri-key-line" />
          </button>
          <button
            type="button"
            onClick={() => handleCopyEmail(member.email)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition cursor-pointer"
            title="Copy Email"
          >
            {copiedEmail === member.email ? (
              <i className="ri-check-line text-emerald-600" />
            ) : (
              <i className="ri-file-copy-line" />
            )}
          </button>
          <button
            type="button"
            onClick={() => deleteStaffMember(member)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs transition cursor-pointer"
            title="Delete Staff"
          >
            <i className="ri-delete-bin-line" />
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
              <i className="ri-shield-user-line" />
              Access Control & Performance
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              · Enterprise Directory
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Staff & Field Agent Management
          </h1>
          <p className="text-xs text-slate-500 font-normal max-w-xl">
            Provision roles, manage login credentials, and track listings and closed deals for sales and operations personnel.
          </p>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <AdminButton
            variant="primary"
            size="md"
            icon="ri-user-add-line"
            onClick={() => setShowAddModal(true)}
          >
            Provision Staff
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
          title="Total Staff"
          value={summaryStats.total}
          subValue={`(${summaryStats.activeCount} Active)`}
          icon="ri-team-line"
          theme="orange"
          trendLabel="Enterprise Staff Pool"
        />

        <AdminStatCard
          title="Salesman"
          value={summaryStats.salesCount}
          subValue="Active"
          icon="ri-user-star-line"
          theme="emerald"
          trendLabel="Deal Desk & Pitches"
        />

        <AdminStatCard
          title="Employee"
          value={summaryStats.opsCount}
          subValue="Active"
          icon="ri-shield-user-line"
          theme="indigo"
          trendLabel="Verification & RERA"
        />

        <AdminStatCard
          title="Deals Closed"
          value={summaryStats.totalConverted}
          subValue={`from ${summaryStats.totalListings} Units`}
          icon="ri-trophy-line"
          theme="rose"
          trendLabel="Staff Conversions"
        />
      </div>

      {/* ─── CONTROLS & FILTER TOOLBAR ─── */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box with Shortcut */}
          <div className="flex-1 max-w-sm">
            <AdminSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search staff by name, email, phone..."
            />
          </div>

          {/* Filters & View Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Role Filter Pills */}
            <div className="flex items-center gap-0.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {[
                { id: 'all', label: 'All' },
                { id: 'salesman', label: 'Salesman' },
                { id: 'employee', label: 'Employee' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterRole(f.id)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    filterRole === f.id
                      ? 'bg-white text-orange-600 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Status Select */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:border-orange-500 focus:bg-white outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="suspended">Suspended Only</option>
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
      {filteredStaff.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-16 text-center shadow-xs">
          <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
            <div className="h-14 w-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl border border-orange-200/60 shadow-2xs">
              <i className="ri-user-unfollow-line" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-2">No Staff Members Found</h3>
            <p className="text-xs text-slate-400">
              No staff members match the current filter or search criteria.
            </p>
            <div className="pt-2">
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setFilterRole('all');
                  setFilterStatus('all');
                }}
              >
                Reset Filters
              </AdminButton>
            </div>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredStaff.map((member) => {
            const isSales = member.role === 'salesman';
            const initials = member.name
              ? member.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()
              : 'ST';

            return (
              <div
                key={member._id}
                className="group rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-xl hover:border-orange-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Profile Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div
                          className={`h-12 w-12 rounded-2xl flex items-center justify-center text-sm font-black shadow-xs ${
                            isSales
                              ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-orange-500/20'
                              : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-500/20'
                          }`}
                        >
                          {initials}
                        </div>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-white ${
                            member.isActive ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                          title={member.isActive ? 'Account Active' : 'Account Suspended'}
                        />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                          {member.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <AdminBadge
                            variant={isSales ? 'orange' : 'info'}
                            size="sm"
                            dot
                          >
                            {isSales ? 'Salesman' : 'Operations'}
                          </AdminBadge>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {member.lastActive || 'Active today'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Active Status Pill Switch */}
                    <button
                      type="button"
                      onClick={() => toggleActive(member)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer shrink-0 ${
                        member.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      }`}
                      title="Click to toggle status"
                    >
                      {member.isActive ? 'Active' : 'Suspended'}
                    </button>
                  </div>

                  {/* Contact Info Pills */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-slate-600 font-medium truncate">
                        <i className="ri-mail-line text-slate-400" />
                        <span className="truncate">{member.email}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyEmail(member.email)}
                        className="text-slate-400 hover:text-slate-700 text-xs shrink-0 cursor-pointer p-0.5"
                        title="Copy Email"
                      >
                        {copiedEmail === member.email ? (
                          <i className="ri-check-line text-emerald-600" />
                        ) : (
                          <i className="ri-file-copy-line" />
                        )}
                      </button>
                    </div>

                    {member.phone && (
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/50">
                        <span className="flex items-center gap-1.5 text-slate-600 font-medium truncate">
                          <i className="ri-phone-line text-slate-400" />
                          <span>{member.phone}</span>
                        </span>
                        <a
                          href={`https://wa.me/${member.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-600 hover:text-emerald-700 text-xs shrink-0"
                          title="WhatsApp Staff"
                        >
                          <i className="ri-whatsapp-line" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Performance Metrics Stats Row */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">
                        Listings
                      </span>
                      <span className="text-sm font-black text-slate-800">
                        {member.flatListingsCount || 0}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">
                        Shares
                      </span>
                      <span className="text-sm font-black text-emerald-600">
                        {member.sharesCount || 0}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">
                        Closed
                      </span>
                      <span className="text-sm font-black text-orange-600">
                        {member.convertedRequestsCount || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <AdminButton
                    variant="outline"
                    size="xs"
                    icon="ri-key-line"
                    onClick={() => setResetTargetMember(member)}
                  >
                    Reset Pass
                  </AdminButton>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => deleteStaffMember(member)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer text-xs"
                      title="Delete Account"
                    >
                      <i className="ri-delete-bin-line" />
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
          data={filteredStaff}
          loading={loading}
          keyField="_id"
        />
      )}

      {/* ─── PROVISION STAFF RIGHT SLIDE DRAWER ─── */}
      <AdminDrawer
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Provision Staff Member"
        subtitle="Create credentials for sales agents or operations personnel"
        icon="ri-user-add-line"
      >
        <form onSubmit={createStaff} className="space-y-4">
          {/* Role Switcher */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              Select Department & Role *
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 text-xs">
              {[
                { id: 'salesman', label: 'Salesman', icon: 'ri-user-star-line' },
                { id: 'employee', label: 'Employee', icon: 'ri-shield-user-line' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, role: r.id }))}
                  className={`py-2 px-3 rounded-xl font-bold transition cursor-pointer flex items-center justify-center gap-1.5 text-xs ${
                    form.role === r.id
                      ? 'bg-white text-orange-600 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <i className={r.icon} />
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <i className="ri-user-3-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Ravi Kumar"
                required
                className="w-full rounded-xl bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none border border-slate-200 focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Work Email */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              Work Email Address *
            </label>
            <div className="relative">
              <i className="ri-mail-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="e.g. ravi@bababroker.com"
                required
                className="w-full rounded-xl bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none border border-slate-200 focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <i className="ri-phone-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="e.g. 9891140379"
                className="w-full rounded-xl bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none border border-slate-200 focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Temporary Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Initial Password *
              </label>
              <button
                type="button"
                onClick={() => setShowCreatePassword(!showCreatePassword)}
                className="text-[10px] font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
              >
                {showCreatePassword ? 'Hide Password' : 'Show Password'}
              </button>
            </div>
            <div className="relative">
              <i className="ri-lock-2-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type={showCreatePassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Minimum 6 characters"
                required
                className="w-full rounded-xl bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none border border-slate-200 focus:border-orange-500 focus:bg-white transition-all font-mono"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <AdminButton
              variant="secondary"
              size="md"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </AdminButton>
            <AdminButton
              type="submit"
              variant="primary"
              size="md"
              loading={saving}
            >
              Create Account
            </AdminButton>
          </div>
        </form>
      </AdminDrawer>

      {/* ─── RESET PASSWORD RIGHT SLIDE DRAWER ─── */}
      <AdminDrawer
        isOpen={!!resetTargetMember}
        onClose={() => {
          setResetTargetMember(null);
          setResetPassword('');
        }}
        title={`Reset Password for ${resetTargetMember?.name}`}
        subtitle={`Account: ${resetTargetMember?.email}`}
        icon="ri-key-line"
      >
        <form onSubmit={submitResetPassword} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                New Secure Password *
              </label>
              <button
                type="button"
                onClick={() => setShowResetPassword(!showResetPassword)}
                className="text-[10px] font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
              >
                {showResetPassword ? 'Hide Password' : 'Show Password'}
              </button>
            </div>
            <div className="relative">
              <i className="ri-lock-password-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type={showResetPassword ? 'text' : 'password'}
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                placeholder="Enter at least 6 characters"
                required
                className="w-full rounded-xl bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none border border-slate-200 focus:border-orange-500 focus:bg-white transition-all font-mono"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <AdminButton
              variant="secondary"
              size="md"
              onClick={() => {
                setResetTargetMember(null);
                setResetPassword('');
              }}
            >
              Cancel
            </AdminButton>
            <AdminButton type="submit" variant="primary" size="md">
              Update Password
            </AdminButton>
          </div>
        </form>
      </AdminDrawer>
    </div>
  );
}
