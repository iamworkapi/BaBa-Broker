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
    <header className="px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3 bg-white border-b border-slate-200/90 flex items-center justify-between gap-3 font-['Inter',sans-serif] shrink-0 sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Menu Toggle & Search */}
      <div className="flex items-center gap-2.5 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden h-9 w-9 rounded-xl bg-orange-50 hover:bg-orange-100/80 text-orange-600 border border-orange-200/80 flex items-center justify-center cursor-pointer shrink-0 transition-all shadow-2xs"
          title="Toggle Menu"
        >
          <i className="ri-menu-2-line text-lg font-bold"></i>
        </button>

        {/* Search Input with Ctrl+K Hint */}
        <div className="relative flex-1">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none"></i>
          <input
            ref={searchInputRef}
            type="text"
            value={searchVal}
            onChange={handleSearchChange}
            placeholder="Search projects, deals, leads..."
            className="w-full rounded-xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white pl-9 pr-14 sm:pr-18 py-1.5 sm:py-2 text-xs text-slate-800 placeholder-slate-400 outline-none border border-slate-200/90 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all font-medium shadow-2xs"
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
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200/90 rounded shadow-2xs">
                ⌘K
              </kbd>
            )}
          </div>
        </div>
      </div>

      {/* Right Controls & Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
        {/* User Profile Chip with Letter Avatar */}
        <div className="flex items-center gap-2 sm:gap-2.5 bg-slate-50/80 px-2 sm:px-2.5 py-1 rounded-xl border border-slate-200/70">
          <div className="relative">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
              {initialLetter}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 leading-tight">
              {adminName}
            </span>
            <span className="text-[9.5px] text-orange-600 font-bold uppercase tracking-wider">
              Super Admin
            </span>
          </div>
        </div>

        {/* Enhanced Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-600 hover:text-red-600 text-xs font-bold transition-all shadow-2xs cursor-pointer group active:scale-95"
          title="Sign Out"
        >
          <i className="ri-logout-box-r-line text-sm text-slate-400 group-hover:text-red-500 transition-colors"></i>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
