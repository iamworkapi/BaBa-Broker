import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthContext';

export default function AdminHeader({ auth, onSearch }) {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();
  const [searchVal, setSearchVal] = useState('');
  const [hasNotification, setHasNotification] = useState(true);

  const handleLogout = () => {
    clearAuth();
    navigate('/admin/login');
  };

  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const adminName = auth?.name || 'Johathan Stinson';

  return (
    <header className="px-5 sm:px-7 py-2.5 border-b border-slate-100 flex items-center justify-between gap-4 font-['Inter',sans-serif] bg-white">
      {/* Search input (Compact) */}
      <div className="relative flex-1 max-w-xs">
        <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
        <input
          type="text"
          value={searchVal}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="w-full rounded-xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white pl-8 pr-7 py-1.5 text-xs text-slate-700 placeholder-slate-400 outline-none border border-slate-200/80 focus:border-orange-400 focus:ring-1 focus:ring-orange-400/20 transition-all font-normal"
        />
        {searchVal && (
          <button
            onClick={() => {
              setSearchVal('');
              if (onSearch) onSearch('');
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <i className="ri-close-line text-xs"></i>
          </button>
        )}
      </div>

      {/* Right: User profile chip with photo & Notification Bell */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* User Info with Avatar */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-medium text-slate-800 hidden sm:inline">
            {adminName}
          </span>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
              alt="User avatar"
              className="h-8 w-8 rounded-full object-cover border border-orange-100 shadow-xs"
            />
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
          </div>
        </div>

        {/* Notification Bell with Orange Dot */}
        <button
          type="button"
          onClick={() => setHasNotification((prev) => !prev)}
          className="relative text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer transition-colors"
          title="Notifications"
        >
          <i className="ri-notification-3-line text-lg"></i>
          {hasNotification && (
            <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-[#ea580c] ring-2 ring-white"></span>
          )}
        </button>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="text-slate-400 hover:text-red-500 p-0.5 cursor-pointer transition-colors"
          title="LogOut"
        >
          <i className="ri-logout-box-r-line text-base"></i>
        </button>
      </div>
    </header>
  );
}
