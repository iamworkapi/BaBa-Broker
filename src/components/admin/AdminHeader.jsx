import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuth } from '../../lib/auth';

export default function AdminHeader({ auth }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/admin/login');
  };

  const adminName = auth?.name || 'Administrator';
  const initial = adminName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-2xl transition-all">
      {/* Left Brand & Live Badge */}
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center group">
          <div className="relative flex items-center gap-2">
            <img
              src="/assets/img/logo.svg"
              alt="Baba Broker"
              className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-800/80 bg-slate-900/60 px-3 py-1 text-[11px] font-medium text-slate-300 shadow-inner">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-400">System Status:</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <i className="ri-shield-check-fill text-xs"></i> Secure Live
          </span>
        </div>
      </div>

      {/* Right User Control Bar */}
      <div className="flex items-center gap-3">
        {/* Live Website Quick Action */}
        <Link
          to="/"
          target="_blank"
          className="group relative flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800/90 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-md hover:shadow-orange-500/10 cursor-pointer"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 group-hover:scale-110 transition-transform">
            <i className="ri-global-line text-xs"></i>
          </span>
          <span className="hidden sm:inline">Live Website</span>
          <i className="ri-external-link-line text-[10px] text-slate-500 group-hover:text-orange-400 transition-colors"></i>
        </Link>

        {/* Vertical Divider */}
        <div className="h-6 w-[1px] bg-slate-800/80 hidden sm:block"></div>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-800/80 bg-slate-900/90 px-2.5 py-1 shadow-lg">
          <div className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-tr from-orange-500 to-amber-400 font-extrabold text-xs text-slate-950 shadow-md">
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
            className="ml-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 p-1.5 transition-colors cursor-pointer"
            title="Logout of Admin"
          >
            <i className="ri-logout-box-r-line text-sm"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
