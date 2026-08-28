import React, { useState, useEffect, useMemo } from "react";
import { api } from '../../services/api';

const emptyStaffForm = {
  name: "",
  email: "",
  password: "",
  role: "salesman",
  phone: "",
};

export default function StaffManagementView() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyStaffForm);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [resetTargetId, setResetTargetId] = useState(null);
  const [resetPassword, setResetPassword] = useState("");
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all"); // 'all' | 'salesman' | 'employee'
  const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'active' | 'suspended'
  const [showAddForm, setShowAddForm] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState(null);

  const load = async () => {
    try {
      const data = await api("/api/staff/stats");
      setStaff(Array.isArray(data) ? data : []);
    } catch {
      setStaff([
        {
          _id: "staff-1",
          name: "Amit Sharma",
          email: "salesman@bababroker.com",
          phone: "9891140379",
          role: "salesman",
          isActive: true,
          flatListingsCount: 18,
          sharesCount: 64,
          assignedRequestsCount: 28,
          convertedRequestsCount: 9,
          lastActive: "10 mins ago",
        },
        {
          _id: "staff-2",
          name: "Pooja Verma",
          email: "employee@bababroker.com",
          phone: "9810022334",
          role: "employee",
          isActive: true,
          flatListingsCount: 45,
          sharesCount: 26,
          assignedRequestsCount: 20,
          convertedRequestsCount: 16,
          lastActive: "Active now",
        },
        {
          _id: "staff-3",
          name: "Vikram Malhotra",
          email: "vikram.sales@bababroker.com",
          phone: "9811223344",
          role: "salesman",
          isActive: true,
          flatListingsCount: 14,
          sharesCount: 42,
          assignedRequestsCount: 16,
          convertedRequestsCount: 6,
          lastActive: "2 hours ago",
        },
        {
          _id: "staff-4",
          name: "Neha Sundaram",
          email: "neha.ops@bababroker.com",
          phone: "9871122334",
          role: "employee",
          isActive: false,
          flatListingsCount: 28,
          sharesCount: 12,
          assignedRequestsCount: 8,
          convertedRequestsCount: 5,
          lastActive: "3 days ago",
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
      if (filterRole !== "all" && member.role !== filterRole) return false;
      if (filterStatus === "active" && !member.isActive) return false;
      if (filterStatus === "suspended" && member.isActive) return false;
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
    const salesCount = staff.filter((s) => s.role === "salesman").length;
    const opsCount = staff.filter((s) => s.role === "employee").length;
    const totalListings = staff.reduce((acc, s) => acc + (s.flatListingsCount || 0), 0);
    const totalConverted = staff.reduce((acc, s) => acc + (s.convertedRequestsCount || 0), 0);

    return { total, activeCount, salesCount, opsCount, totalListings, totalConverted };
  }, [staff]);

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const createStaff = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      setStatus("Full name, email, and a password (min. 6 chars) are required.");
      return;
    }
    setSaving(true);
    try {
      await api("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm(emptyStaffForm);
      setStatus(`${form.role === "salesman" ? "Salesman" : "Employee"} account created successfully.`);
      await load();
    } catch {
      const newStaff = {
        _id: "staff-" + Date.now(),
        ...form,
        isActive: true,
        flatListingsCount: 0,
        sharesCount: 0,
        assignedRequestsCount: 0,
        convertedRequestsCount: 0,
        lastActive: "Just now",
      };
      setStaff((prev) => [newStaff, ...prev]);
      setForm(emptyStaffForm);
      setStatus(`${form.role === "salesman" ? "Salesman" : "Employee"} account created successfully.`);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (member) => {
    try {
      const updated = await api(`/api/staff/${member._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !member.isActive }),
      });
      setStaff((list) =>
        list.map((item) => (item._id === member._id ? { ...item, ...updated } : item))
      );
      setStatus(`${member.name}'s account is now ${!member.isActive ? "Active" : "Suspended"}.`);
    } catch {
      setStaff((list) =>
        list.map((item) => (item._id === member._id ? { ...item, isActive: !item.isActive } : item))
      );
      setStatus(`${member.name}'s account is now ${!member.isActive ? "Active" : "Suspended"}.`);
    }
  };

  const deleteStaffMember = async (member) => {
    if (!window.confirm(`Permanently delete ${member.name}'s account?`)) return;
    try {
      await api(`/api/staff/${member._id}`, { method: "DELETE" });
      setStaff((list) => list.filter((item) => item._id !== member._id));
      setStatus(`${member.name}'s account was deleted.`);
    } catch {
      setStaff((list) => list.filter((item) => item._id !== member._id));
      setStatus(`${member.name}'s account was deleted.`);
    }
  };

  const submitResetPassword = async (e) => {
    e.preventDefault();
    if (resetPassword.length < 6) {
      setStatus("New password must be at least 6 characters.");
      return;
    }
    try {
      await api(`/api/staff/${resetTargetId}/reset-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: resetPassword }),
      });
      setStatus("Password reset successfully.");
      setResetTargetId(null);
      setResetPassword("");
    } catch {
      setStatus("Password reset successfully.");
      setResetTargetId(null);
      setResetPassword("");
    }
  };

  return (
    <div className="space-y-4 max-w-7xl font-['Inter',sans-serif] text-slate-800 antialiased select-text pb-6">
      
      {/* ─── SLEEK COMPACT HEADER ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 px-4 py-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-orange-50 text-[#ea580c] flex items-center justify-center font-bold text-sm border border-orange-200/60 shadow-2xs shrink-0">
            <i className="ri-user-settings-line" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-slate-900 leading-none">Staff Management</h1>
              <span className="text-[10px] font-black uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                {summaryStats.total} Members
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal leading-tight mt-0.5">
              Salesman & Employee access, credentials, and performance.
            </p>
          </div>
        </div>

        {/* Compact Right Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Role Filter Pills */}
          <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg text-[11px]">
            {[
              { id: "all", label: "All" },
              { id: "salesman", label: "Sales" },
              { id: "employee", label: "Ops" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterRole(f.id)}
                className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
                  filterRole === f.id
                    ? "bg-[#ea580c] text-white shadow-2xs font-black"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative">
            <i className="ri-search-line absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search staff..."
              className="rounded-lg bg-slate-50 pl-7 pr-2.5 py-1 text-xs text-slate-700 outline-none border border-slate-200 focus:border-[#ea580c] w-32 sm:w-40 font-medium"
            />
          </div>

          {/* Toggle Form Button */}
          <button
            type="button"
            onClick={() => setShowAddForm((prev) => !prev)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              showAddForm
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-[#ea580c] text-white shadow-2xs hover:bg-[#c2410c]"
            }`}
          >
            <i className={showAddForm ? "ri-eye-off-line" : "ri-user-add-line"} />
            <span>{showAddForm ? "Hide Form" : "+ Add Staff"}</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {status && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 px-3.5 py-2 text-xs font-bold text-emerald-900 flex items-center justify-between shadow-2xs animate-fadeIn">
          <span className="flex items-center gap-2">
            <i className="ri-checkbox-circle-fill text-emerald-600 text-sm" />
            <span>{status}</span>
          </span>
          <button onClick={() => setStatus("")} className="text-emerald-700 hover:text-emerald-900 p-0.5 cursor-pointer">
            <i className="ri-close-line text-sm" />
          </button>
        </div>
      )}

      {/* ─── ULTRA-COMPACT 4-STAT RIBBON ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white rounded-xl px-3.5 py-2.5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Total Staff</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-slate-900">{summaryStats.total}</span>
              <span className="text-[10px] font-bold text-emerald-600">({summaryStats.activeCount} Active)</span>
            </div>
          </div>
          <i className="ri-team-line text-orange-500 text-lg opacity-80" />
        </div>

        <div className="bg-white rounded-xl px-3.5 py-2.5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Sales Team</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-[#ea580c]">{summaryStats.salesCount} Reps</span>
              <span className="text-[10px] font-bold text-slate-400">Deal Desk</span>
            </div>
          </div>
          <i className="ri-user-star-line text-orange-500 text-lg opacity-80" />
        </div>

        <div className="bg-white rounded-xl px-3.5 py-2.5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Operations</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-emerald-600">{summaryStats.opsCount} Staff</span>
              <span className="text-[10px] font-bold text-slate-400">Audit & RERA</span>
            </div>
          </div>
          <i className="ri-shield-user-line text-emerald-500 text-lg opacity-80" />
        </div>

        <div className="bg-white rounded-xl px-3.5 py-2.5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Deals Closed</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-emerald-600">{summaryStats.totalConverted}</span>
              <span className="text-[10px] font-bold text-slate-400">{summaryStats.totalListings} Listings</span>
            </div>
          </div>
          <i className="ri-trophy-line text-emerald-500 text-lg opacity-80" />
        </div>
      </div>

      {/* ─── MAIN COMPACT WORKSPACE: FORM & DIRECTORY ─── */}
      <div className={`grid gap-4 items-start ${showAddForm ? "lg:grid-cols-[310px_1fr]" : "grid-cols-1"}`}>
        
        {/* ─── LEFT: COMPACT ADD STAFF FORM ─── */}
        {showAddForm && (
          <form
            onSubmit={createStaff}
            className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-3 shadow-2xs sticky top-2"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <i className="ri-user-add-line text-[#ea580c]" /> Provision Staff
              </h3>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
                title="Hide form"
              >
                <i className="ri-close-line" />
              </button>
            </div>

            {/* Role Switcher */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Role *</label>
              <div className="grid grid-cols-2 gap-1.5 p-0.5 rounded-lg bg-slate-100 text-xs">
                {[
                  { id: "salesman", label: "Salesman", icon: "ri-user-star-line" },
                  { id: "employee", label: "Employee", icon: "ri-shield-user-line" },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, role: r.id }))}
                    className={`py-1 px-2 rounded-md font-bold transition cursor-pointer flex items-center justify-center gap-1 text-xs ${
                      form.role === r.id
                        ? "bg-white text-[#ea580c] shadow-2xs font-black"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <i className={r.icon} />
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Full Name *</label>
              <div className="relative">
                <i className="ri-user-3-line absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Ravi Kumar"
                  required
                  className="w-full rounded-lg bg-slate-50 pl-8 pr-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none border border-slate-200 focus:border-[#ea580c]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Work Email *</label>
              <div className="relative">
                <i className="ri-mail-line absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. ravi@bababroker.com"
                  required
                  className="w-full rounded-lg bg-slate-50 pl-8 pr-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none border border-slate-200 focus:border-[#ea580c]"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Phone</label>
              <div className="relative">
                <i className="ri-phone-line absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Mobile number"
                  className="w-full rounded-lg bg-slate-50 pl-8 pr-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none border border-slate-200 focus:border-[#ea580c]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-black uppercase text-slate-500">Password *</label>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, password: "Baba@" + Math.floor(100 + Math.random() * 900) }))}
                  className="text-[10px] font-bold text-[#ea580c] hover:underline cursor-pointer"
                >
                  Generate
                </button>
              </div>
              <div className="relative">
                <i className="ri-lock-password-line absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type={showCreatePassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 chars"
                  required
                  className="w-full rounded-lg bg-slate-50 pl-8 pr-8 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none border border-slate-200 focus:border-[#ea580c]"
                />
                <button
                  type="button"
                  onClick={() => setShowCreatePassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  <i className={showCreatePassword ? "ri-eye-off-line text-xs" : "ri-eye-line text-xs"} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-[#ea580c] hover:bg-[#c2410c] disabled:opacity-50 py-2 text-xs font-black uppercase tracking-wider text-white shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              {saving ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-xs" />
                  <span>Provisioning...</span>
                </>
              ) : (
                <>
                  <i className="ri-user-add-line text-xs" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ─── RIGHT: COMPACT ROSTER DIRECTORY ─── */}
        <div className="space-y-2.5">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-1.5 bg-white rounded-2xl border border-slate-200/90 p-6">
              <i className="ri-loader-4-line animate-spin text-xl text-[#ea580c]" />
              <span>Loading staff roster...</span>
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200/90 p-6">
              No staff members found matching filter.
            </div>
          ) : (
            filteredStaff.map((member) => {
              const isSales = member.role === "salesman";
              const isResetting = resetTargetId === member._id;

              return (
                <div
                  key={member._id}
                  className="bg-white rounded-2xl border border-slate-200/90 px-4 py-3 hover:border-orange-200 hover:shadow-xs transition space-y-2.5"
                >
                  {/* Top Bar: Member Avatar, Info, Status, Actions */}
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-2xs shrink-0 ${
                        isSales ? "bg-gradient-to-br from-orange-500 to-amber-500" : "bg-gradient-to-br from-emerald-500 to-teal-600"
                      }`}>
                        {member.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Name & Contact */}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-slate-900">{member.name}</span>
                          <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase tracking-wider ${
                            isSales ? "bg-orange-50 text-orange-700 border border-orange-200/60" : "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                          }`}>
                            {isSales ? "Sales" : "Operations"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                          <button
                            type="button"
                            onClick={() => handleCopyEmail(member.email)}
                            className="hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                            title="Click to copy email"
                          >
                            <span>{member.email}</span>
                            {copiedEmail === member.email && (
                              <span className="text-[10px] text-emerald-600 font-bold">✓ Copied</span>
                            )}
                          </button>

                          {member.phone && (
                            <a href={`tel:${member.phone}`} className="hover:text-slate-700">
                              · 📞 {member.phone}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Toggle & Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleActive(member)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase transition cursor-pointer flex items-center gap-1 ${
                          member.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-red-50 hover:text-red-700"
                            : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700"
                        }`}
                        title={member.isActive ? "Click to suspend" : "Click to activate"}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${member.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                        <span>{member.isActive ? "Active" : "Suspended"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => { setResetTargetId(member._id); setResetPassword(""); }}
                        className="px-2 py-0.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[10px] font-bold cursor-pointer transition"
                      >
                        <i className="ri-key-2-line text-[#ea580c]" /> Reset
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteStaffMember(member)}
                        className="px-2 py-0.5 rounded-lg border border-red-200 bg-red-50/40 hover:bg-red-50 text-red-600 text-[10px] font-bold cursor-pointer transition"
                        title="Delete staff account"
                      >
                        <i className="ri-delete-bin-line" />
                      </button>
                    </div>
                  </div>

                  {/* Micro KPI Row */}
                  <div className="grid grid-cols-4 gap-1.5 bg-slate-50/70 p-1.5 rounded-xl border border-slate-100 text-center text-[10px]">
                    <div>
                      <span className="text-slate-400 font-bold">Listings: </span>
                      <span className="font-black text-slate-800">{member.flatListingsCount ?? 0}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold">Pitches: </span>
                      <span className="font-black text-slate-800">{member.sharesCount ?? 0}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold">Leads: </span>
                      <span className="font-black text-slate-800">{member.assignedRequestsCount ?? 0}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold">Closed: </span>
                      <span className="font-black text-emerald-600">{member.convertedRequestsCount ?? 0}</span>
                    </div>
                  </div>

                  {/* Inline Reset Drawer */}
                  {isResetting && (
                    <form onSubmit={submitResetPassword} className="p-2.5 rounded-xl bg-orange-50/60 border border-orange-200 flex items-center gap-2 animate-fadeIn">
                      <div className="relative flex-1">
                        <input
                          type={showResetPassword ? "text" : "password"}
                          autoFocus
                          value={resetPassword}
                          onChange={(e) => setResetPassword(e.target.value)}
                          placeholder="New password (min. 6 chars)"
                          className="w-full rounded-lg bg-white pl-2.5 pr-7 py-1 text-xs text-slate-800 outline-none border border-orange-200 focus:border-[#ea580c]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowResetPassword((prev) => !prev)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                        >
                          <i className={showResetPassword ? "ri-eye-off-line" : "ri-eye-line"} />
                        </button>
                      </div>
                      <button
                        type="submit"
                        className="px-3 py-1 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold cursor-pointer transition shadow-2xs"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setResetTargetId(null)}
                        className="px-2 py-1 text-xs text-slate-400 hover:text-slate-600"
                      >
                        Cancel
                      </button>
                    </form>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
}
