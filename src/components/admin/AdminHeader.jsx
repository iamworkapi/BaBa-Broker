import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store';
import { logoutAction } from '../../store/authSlice.js';

export default function AdminHeader({ auth, onSearch, onToggleSidebar }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchVal, setSearchVal] = useState('');
  const searchInputRef = useRef(null);

  // Global Keyboard Shortcuts (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutAction());
    navigate('/admin/login');
  };

  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const adminName = auth?.name || 'Admin';
  const initialLetter = adminName.charAt(0).toUpperCase() || 'A';

  return (
    <header className="px-3 sm:px-6 lg:px-8 py-3 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between gap-2.5 sm:gap-4 font-['Inter',sans-serif] shrink-0 sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Menu Toggle Button */}
      <button
        type="button"
        onClick={onToggleSidebar}
        className="lg:hidden h-9 w-9 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 border border-orange-500/20 flex items-center justify-center cursor-pointer shrink-0 transition-all"
        title="Toggle Menu"
      >
        <i className="ri-menu-2-line text-lg font-bold"></i>
      </button>

      {/* Search Input with Ctrl+K Hint */}
      <div className="relative flex-1 max-w-xs sm:max-w-md">
        <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none"></i>
        <input
          ref={searchInputRef}
          type="text"
          value={searchVal}
          onChange={handleSearchChange}
          placeholder="Search projects, deals, leads..."
          className="w-full rounded-xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white pl-8 sm:pl-10 pr-8 sm:pr-20 py-1.5 sm:py-2 text-xs text-slate-800 placeholder-slate-400 outline-none border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all font-normal shadow-2xs"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
          {searchVal ? (
            <button
              type="button"
              onClick={() => {
                setSearchVal('');
                if (onSearch) onSearch('');
              }}
              className="pointer-events-auto p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <i className="ri-close-line text-sm"></i>
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Right Controls & Profile */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* User Profile Chip with Letter Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white font-black text-xs flex items-center justify-center shadow-xs ring-2 ring-orange-500/20">
                {initialLetter}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                {adminName}
              </span>
              <span className="text-[10px] text-orange-600 font-semibold uppercase tracking-wider">
                Super Admin
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-500 hover:text-red-600 flex items-center justify-center cursor-pointer transition-all"
            title="Sign Out"
          >
            <i className="ri-logout-box-r-line text-sm"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
