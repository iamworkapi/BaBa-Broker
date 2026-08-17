import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuth } from '../../lib/auth';

export default function AdminHeader({ auth, onSearch, onExport }) {
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('1 Mar – 15 Mar');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);

  const handleLogout = () => {
    clearAuth();
    navigate('/admin/login');
  };

  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const handleExportClick = () => {
    if (onExport) {
      onExport();
    } else {
      // Default CSV/Report trigger
      alert('Generating and downloading latest Real Estate & Investment Portfolio Report (PDF/CSV)...');
    }
  };

  const adminName = auth?.name || 'Administrator';
  const initial = adminName.charAt(0).toUpperCase();

  const periods = [
    '1 Mar – 15 Mar',
    '15 Feb – 28 Feb',
    'This Month (March)',
    'Last 30 Days',
    'Q1 2026 Summary',
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-2xl transition-all font-sans">
      {/* Left: Brand & Search Bar */}
      <div className="flex items-center gap-4 lg:gap-8 flex-1 max-w-2xl">
        <Link to="/" className="flex items-center group shrink-0">
          <div className="relative flex items-center gap-2">
            <img
              src="/assets/img/logo.svg"
              alt="Baba Broker"
              className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Global Search Bar (like screenshot) */}
        <div className="relative flex-1 max-w-md hidden sm:block">
          <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input
            type="text"
            value={searchVal}
            onChange={handleSearchChange}
            placeholder="Search projects, investors, leads..."
            className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 pl-10 pr-9 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-orange-500/80 focus:bg-slate-900 focus:ring-2 focus:ring-orange-500/20 transition-all font-medium"
          />
          {searchVal && (
            <button
              onClick={() => {
                setSearchVal('');
                if (onSearch) onSearch('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <i className="ri-close-circle-fill text-xs"></i>
            </button>
          )}
        </div>
      </div>

      {/* Right Controls: Period Picker, Download Report, Notifications & Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Period Selector Dropdown */}
        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => setShowPeriodDropdown((v) => !v)}
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer"
          >
            <i className="ri-calendar-event-line text-orange-400 text-xs"></i>
            <span>{selectedPeriod}</span>
            <i className="ri-arrow-down-s-line text-xs text-slate-500"></i>
          </button>

          {showPeriodDropdown && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              {periods.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setSelectedPeriod(p);
                    setShowPeriodDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg font-medium transition cursor-pointer flex items-center justify-between ${
                    selectedPeriod === p
                      ? 'bg-orange-500/10 text-orange-400 font-bold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  {p}
                  {selectedPeriod === p && <i className="ri-check-line text-xs"></i>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Download Report Button (Inspired by design concept) */}
        <button
          type="button"
          onClick={handleExportClick}
          className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 px-3.5 py-1.5 text-xs font-bold transition-all shadow-md shadow-teal-500/5 hover:scale-[1.02] cursor-pointer"
        >
          <i className="ri-download-2-line text-sm text-teal-400"></i>
          <span>Download report</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setHasNotification((prev) => !prev)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer"
            title="Notifications"
          >
            <i className="ri-notification-3-line text-sm"></i>
            {hasNotification && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-slate-950"></span>
            )}
          </button>
        </div>

        {/* User Profile Chip */}
        <div className="flex items-center gap-2.5 rounded-2xl border border-slate-800/90 bg-slate-900/95 px-2.5 py-1.5 shadow-lg">
          <div className="relative grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-tr from-orange-500 via-amber-400 to-yellow-400 font-extrabold text-xs text-slate-950 shadow-md">
            {initial}
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-emerald-400"></span>
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-white leading-tight truncate max-w-[120px]">
              {adminName}
            </span>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-orange-400">
              Super Admin
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="ml-1 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 p-1.5 transition-colors cursor-pointer"
            title="Logout"
          >
            <i className="ri-logout-box-r-line text-sm"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
