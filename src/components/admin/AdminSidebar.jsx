import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminSidebar({ view }) {
  const navItems = [
    {
      id: 'overview',
      path: '/admin/dashboard',
      label: 'Home',
      icon: 'ri-home-5-line',
      activeIcon: 'ri-home-5-fill',
    },
    {
      id: 'projects',
      path: '/admin/projects',
      label: 'All Projects',
      icon: 'ri-bar-chart-2-line',
      activeIcon: 'ri-bar-chart-2-fill',
    },
    {
      id: 'featured',
      path: '/admin/featured',
      label: 'Bookings & Sales',
      icon: 'ri-calendar-check-line',
      activeIcon: 'ri-calendar-check-fill',
    },
    {
      id: 'flats',
      path: '/admin/flats',
      label: 'Apartments',
      icon: 'ri-community-line',
      activeIcon: 'ri-community-fill',
    },
    {
      id: 'investment-requests',
      path: '/admin/investment-requests',
      label: 'Pricing & Deals',
      icon: 'ri-price-tag-3-line',
      activeIcon: 'ri-price-tag-3-fill',
    },
    {
      id: 'whatsapp',
      path: '/admin/whatsapp',
      label: 'Support & CRM',
      icon: 'ri-message-3-line',
      activeIcon: 'ri-message-3-fill',
    },
    {
      id: 'staff',
      path: '/admin/staff',
      label: 'Staff Access',
      icon: 'ri-user-settings-line',
      activeIcon: 'ri-user-settings-fill',
    },
  ];

  return (
    <aside className="w-full lg:w-52 h-full lg:h-screen bg-[#ea580c] text-white flex flex-col justify-between p-3.5 select-none shrink-0 overflow-y-auto font-['Inter',sans-serif] z-20 shadow-md">
      <div className="space-y-4">
        {/* Original Clean Logo */}
        <Link to="/" className="flex items-center px-1 py-1 group">
          <img
            src="/assets/img/logo.svg"
            alt="Baba Broker"
            className="h-8 sm:h-9 w-auto max-w-[170px] object-contain brightness-0 invert transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        {/* Navigation Items with Enhanced Hover Effects */}
        <nav className="space-y-1 pt-0.5">
          {navItems.map((item) => {
            const isActive = view === item.id || (view === 'overview' && item.id === 'overview') || (view === 'create-project' && item.id === 'projects') || (view === 'add-investor' && item.id === 'investment-requests');

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`relative flex items-center gap-2.5 px-3 py-2 rounded-xl sm:rounded-r-none transition-all duration-200 text-xs ${
                  isActive
                    ? 'bg-white text-[#ea580c] font-semibold shadow-sm sm:shadow-none sm:-mr-3.5 sm:pr-5 z-10'
                    : 'text-white/80 hover:text-white hover:bg-white/15 hover:translate-x-1 hover:shadow-xs font-normal'
                }`}
              >
                {/* Active Indicator Notch Cutout */}
                {isActive && (
                  <>
                    <span className="hidden sm:block absolute -top-3 right-0 w-3 h-3 bg-[#ea580c] pointer-events-none rounded-br-lg shadow-[3px_3px_0_3px_#ffffff]"></span>
                    <span className="hidden sm:block absolute -bottom-3 right-0 w-3 h-3 bg-[#ea580c] pointer-events-none rounded-tr-lg shadow-[3px_-3px_0_3px_#ffffff]"></span>
                  </>
                )}

                <i className={`${isActive ? item.activeIcon : item.icon} text-sm shrink-0 transition-transform duration-200 group-hover:scale-110`}></i>
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Bottom Footer: "Made with ❤️ by OrrishItSolutions" */}
      <div className="pt-3 mt-auto border-t border-white/20 text-center select-none">
        <p className="text-[10px] text-white/85 font-normal leading-tight">
          Made with <span className="text-red-200">❤️</span> by{' '}
          <span className="font-semibold text-white tracking-wide">OrrishItSolutions</span>
        </p>
      </div>
    </aside>
  );
}
