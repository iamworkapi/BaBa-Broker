import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen w-screen bg-[#070e1c] text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 font-['Inter',sans-serif] relative overflow-hidden select-none">
      {/* Ambient Background Glow Orbs */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-orange-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-orange-500/5 blur-[130px] pointer-events-none" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Main 404 Glass Card */}
      <div className="relative w-full max-w-lg bg-slate-900/80 backdrop-blur-2xl rounded-[32px] sm:rounded-[36px] border border-slate-800/80 shadow-2xl shadow-black/80 p-8 sm:p-10 text-center flex flex-col items-center z-10 animate-fadeIn">
        
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30 mb-6">
          <i className="ri-compass-3-line" />
          404 Destination Not Found
        </span>

        {/* 404 Big Display */}
        <div className="relative my-2">
          <span className="text-8xl sm:text-9xl font-black bg-gradient-to-b from-white via-slate-200 to-slate-600 bg-clip-text text-transparent tracking-tighter drop-shadow-2xl">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl sm:text-2xl font-bold text-orange-400/30 uppercase tracking-widest pointer-events-none">
              Lost In Orbit
            </span>
          </div>
        </div>

        {/* Header & Subtitle */}
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-2 mb-2">
          Page Not Available
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed mb-8">
          The property listing, admin module, or page you are looking for has been moved, unpublished, or does not exist.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <Link
            to="/admin/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold shadow-lg shadow-orange-600/25 transition cursor-pointer active:scale-98"
          >
            <i className="ri-dashboard-3-line text-sm" />
            <span>Admin Workspace</span>
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-slate-700/80 transition cursor-pointer"
          >
            <i className="ri-home-4-line text-sm" />
            <span>Portal Home</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 w-full flex items-center justify-between text-[11px] text-slate-500 font-normal">
          <span>Baba Broker Real Estate</span>
          <Link to="/contact" className="text-orange-400 hover:text-orange-300 transition">
            Need Help?
          </Link>
        </div>
      </div>
    </div>
  );
}