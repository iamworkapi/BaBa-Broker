import React, { useState, useEffect } from "react";
import { api } from "../../lib/api";
import AdminPageHeader from "./AdminPageHeader";

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

  const load = async () => {
    try {
      const data = await api("/api/staff/stats");
      setStaff(Array.isArray(data) ? data : []);
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createStaff = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      setStatus(
        "Name, email and a password of at least 6 characters are required.",
      );
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
      setStatus(
        `${form.role === "salesman" ? "Salesman" : "Employee"} account created successfully.`,
      );
      await load();
    } catch (err) {
      setStatus(err.message);
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
        list.map((item) =>
          item._id === member._id ? { ...item, ...updated } : item,
        ),
      );
    } catch (err) {
      setStatus(err.message);
    }
  };

  const deleteStaffMember = async (member) => {
    if (
      !window.confirm(
        `Permanently delete ${member.name}'s account? Any leads assigned to them will be unassigned.`,
      )
    )
      return;
    try {
      await api(`/api/staff/${member._id}`, { method: "DELETE" });
      setStaff((list) => list.filter((item) => item._id !== member._id));
      setStatus(`${member.name}'s account was deleted.`);
    } catch (err) {
      setStatus(err.message);
    }
  };

  const openResetPassword = (member) => {
    setResetTargetId(member._id);
    setResetPassword("");
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
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <div className="space-y-5 max-w-6xl">
      <AdminPageHeader
        badge="STAFF MANAGEMENT DIRECTORY"
        title="Manage Salesman & Employee Accounts"
        subtitle="Create login credentials, reset passwords, review performance, and deactivate or remove staff accounts."
        icon="fa-solid fa-users"
        iconColor="text-blue-400"
        iconBg="bg-blue-500/10 border-blue-500/20"
        breadcrumbs={[
          { label: "Admin Workspace", link: "/admin/dashboard" },
          { label: "Staff Management" },
        ]}
      />

      {status && (
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-3 text-xs font-normal text-orange-200 flex items-center justify-between shadow-sm">
          <span className="flex items-center gap-1.5">
            <i className="fa-solid fa-circle-info text-orange-400 text-xs"></i>{" "}
            {status}
          </span>
          <button
            onClick={() => setStatus("")}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <form
          onSubmit={createStaff}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4 shadow-xl h-fit"
        >
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <i className="ri-user-add-line text-blue-400"></i> Create Staff
            Account
          </h3>
          <label className="block text-xs font-medium text-slate-300">
            Role *
            <div className="mt-1.5 flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 p-1">
              {["salesman", "employee"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, role: r }))}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold capitalize transition-all cursor-pointer ${
                    form.role === r
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </label>
          <label className="block text-xs font-medium text-slate-300">
            Full Name *
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Ravi Kumar"
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white outline-none focus:border-blue-500"
            />
          </label>
          <label className="block text-xs font-medium text-slate-300">
            Email *
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="e.g. ravi@bababroker.com"
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white outline-none focus:border-blue-500"
            />
          </label>
          <label className="block text-xs font-medium text-slate-300">
            Phone
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="e.g. 9876543210"
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white outline-none focus:border-blue-500"
            />
          </label>
          <label className="block text-xs font-medium text-slate-300">
            Password *
            <div className="relative mt-1.5">
              <input
                type={showCreatePassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 6 characters"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 pr-11 text-xs text-white outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowCreatePassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2.5 py-2 text-slate-400 hover:text-white hover:bg-slate-800 transition"
                aria-label={
                  showCreatePassword ? "Hide password" : "Show password"
                }
                title={showCreatePassword ? "Hide password" : "Show password"}
              >
                <i
                  className={`fa-solid ${showCreatePassword ? "fa-eye-slash" : "fa-eye"} text-xs`}
                />
              </button>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              Click the eye icon to show or hide the password.
            </p>
          </label>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 py-3 text-xs font-medium uppercase tracking-wider text-white shadow-md shadow-blue-600/20 cursor-pointer"
          >
            {saving ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden h-fit">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 p-4">
            <i className="ri-list-check-2 text-blue-400"></i> Staff Directory (
            {staff.length})
          </h3>
          {loading ? (
            <div className="py-14 text-center text-slate-400 text-xs">
              Loading staff...
            </div>
          ) : staff.length === 0 ? (
            <div className="py-14 text-center text-slate-400 text-xs">
              No staff accounts yet. Create one on the left.
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {staff.map((member) => (
                <div key={member._id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-white flex items-center gap-2">
                        {member.name}
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${member.role === "salesman" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}
                        >
                          {member.role}
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {member.email}
                        {member.phone ? ` · ${member.phone}` : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleActive(member)}
                      className={`shrink-0 rounded-xl px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border cursor-pointer ${
                        member.isActive
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
                          : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-emerald-500/10 hover:text-emerald-400"
                      }`}
                    >
                      {member.isActive ? "Active" : "Inactive"}
                    </button>
                  </div>

                  {/* Performance Stats */}
                  <div className="grid grid-cols-4 gap-1.5 rounded-xl border border-slate-800 bg-slate-950 p-2 text-center">
                    <div>
                      <p className="text-[9px] uppercase text-slate-500">
                        Listings
                      </p>
                      <p className="text-[11px] font-bold text-white">
                        {member.flatListingsCount ?? 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase text-slate-500">
                        Shares
                      </p>
                      <p className="text-[11px] font-bold text-white">
                        {member.sharesCount ?? 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase text-slate-500">
                        Assigned Leads
                      </p>
                      <p className="text-[11px] font-bold text-white">
                        {member.assignedRequestsCount ?? 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase text-slate-500">
                        Converted
                      </p>
                      <p className="text-[11px] font-bold text-emerald-400">
                        {member.convertedRequestsCount ?? 0}
                      </p>
                    </div>
                  </div>

                  {resetTargetId === member._id ? (
                    <form
                      onSubmit={submitResetPassword}
                      className="flex flex-col gap-3"
                    >
                      <div className="relative">
                        <input
                          type={showResetPassword ? "text" : "password"}
                          autoFocus
                          value={resetPassword}
                          onChange={(e) => setResetPassword(e.target.value)}
                          placeholder="New password (min. 6 chars)"
                          className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 pr-11 text-[11px] text-white outline-none focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowResetPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2.5 py-2 text-slate-400 hover:text-white hover:bg-slate-800 transition"
                          aria-label={
                            showResetPassword
                              ? "Hide password"
                              : "Show password"
                          }
                          title={
                            showResetPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          <i
                            className={`fa-solid ${showResetPassword ? "fa-eye-slash" : "fa-eye"} text-xs`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          className="rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-[10px] font-bold text-white cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setResetTargetId(null)}
                          className="rounded-lg border border-slate-800 px-3 py-1.5 text-[10px] font-bold text-slate-400 hover:text-white cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openResetPassword(member)}
                        className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-[10px] font-bold uppercase text-slate-300 hover:text-white hover:border-slate-700 cursor-pointer"
                      >
                        <i className="fa-solid fa-key text-[10px] mr-1"></i>{" "}
                        Reset Password
                      </button>
                      <button
                        onClick={() => deleteStaffMember(member)}
                        className="flex-1 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-[10px] font-bold uppercase text-red-400 hover:bg-red-500 hover:text-white cursor-pointer"
                      >
                        <i className="fa-solid fa-trash-can text-[10px] mr-1"></i>{" "}
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
