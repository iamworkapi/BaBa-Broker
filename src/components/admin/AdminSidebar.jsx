import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminSidebar({ view, isOpen, onClose }) {
  const navSections = [
    {
      title: 'CORE PLATFORM',
      items: [
        {
          id: 'overview',
          path: '/admin/dashboard',
          label: 'Dashboard',
          icon: 'ri-dashboard-3-line',
          activeIcon: 'ri-dashboard-3-fill',
          badge: 'Live',
        },
      ],
    },
    {
      title: 'INVESTMENT',
      items: [
        {
          id: 'projects',
          path: '/admin/projects',
          label: 'All Investment',
          icon: 'ri-funds-box-line',
          activeIcon: 'ri-funds-box-fill',
        },
        {
          id: 'create-project',
          path: '/admin/create-project',
          label: 'Create Investment',
          icon: 'ri-add-box-line',
          activeIcon: 'ri-add-box-fill',
        },
        {
          id: 'featured',
          path: '/admin/featured',
          label: 'Featured Projects',
          icon: 'ri-star-smile-line',
          activeIcon: 'ri-star-smile-fill',
        },
        {
          id: 'investment-requests',
          path: '/admin/investment-requests',
          label: 'Pricing & Deals',
          icon: 'ri-price-tag-3-line',
          activeIcon: 'ri-price-tag-3-fill',
          badge: 'Hot',
          badgeColor: 'bg-white/20 text-white border border-white/30',
        },
      ],
    },
    {
      title: 'INVENTORY',
      items: [
        {
          id: 'flats',
          path: '/admin/flats',
          label: 'Flat Listings Audit',
          icon: 'ri-community-line',
          activeIcon: 'ri-community-fill',
        },
        {
          id: 'excel',
          path: '/admin/excel',
          label: 'Bulk Excel Upload',
          icon: 'ri-file-excel-2-line',
          activeIcon: 'ri-file-excel-2-fill',
        },
      ],
    },
    {
      title: 'ADMIN & OPERATIONS',
      items: [
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
          label: 'Staff Management',
          icon: 'ri-user-settings-line',
          activeIcon: 'ri-user-settings-fill',
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 animate-fadeIn"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-72 sm:w-80 lg:w-60 xl:w-64 bg-gradient-to-b from-[#ea580c] via-[#f97316] to-[#c2410c] text-white flex flex-col justify-between pl-3 sm:pl-3.5 py-3 pr-0 select-none shrink-0 overflow-y-auto font-['Inter',sans-serif] z-50 lg:z-20 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-3.5">
          {/* Brand Header & Mobile Close Button */}
          <div className="px-1.5 pt-0.5 pr-3.5 flex items-center justify-between">
            <Link to="/" onClick={onClose} className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-xl bg-white text-orange-600 flex items-center justify-center shadow-md shadow-black/15 group-hover:scale-105 transition-all">
                <i className="ri-building-line text-lg font-bold"></i>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black tracking-tight text-white flex items-center gap-1.5 drop-shadow-xs">
                  BABA BROKER
                  <span className="text-[8px] px-1 py-0.2 rounded bg-white/25 text-white font-bold border border-white/35">
                    PRO
                  </span>
                </span>
                <span className="text-[9px] text-white/80 font-medium tracking-wide">
                  Executive Portal
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden h-8 w-8 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer"
              title="Close Menu"
            >
              <i className="ri-close-line text-lg"></i>
            </button>
          </div>

          {/* Navigation Categories */}
          <nav className="space-y-3">
            {navSections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                <span className="px-2 text-[9px] font-extrabold tracking-wider text-white/75 uppercase block">
                  {section.title}
                </span>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive =
                      view === item.id ||
                      (view === 'overview' && item.id === 'overview') ||
                      (view === 'create-investment' && item.id === 'create-project') ||
                      (view === 'add-investor' && item.id === 'investment-requests');

                    return (
                      <Link
                        key={item.id}
                        to={item.path}
                        onClick={onClose}
                        className={`group relative flex items-center justify-between transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'w-full mr-0 bg-white text-orange-600 shadow-md shadow-black/15 font-bold pl-3 pr-4 py-2 rounded-l-2xl rounded-r-none z-10'
                            : 'mr-3 sm:mr-3.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white/90 hover:text-white hover:bg-white/20 hover:translate-x-0.5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`h-8 w-8 rounded-lg flex items-center justify-center text-[20px] transition-transform duration-200 group-hover:scale-105 shrink-0 ${
                              isActive
                                ? 'bg-orange-500 text-white shadow-xs'
                                : 'bg-white/15 text-white group-hover:bg-white/25'
                            }`}
                          >
                            <i className={isActive ? item.activeIcon : item.icon} />
                          </div>
                          <span className="truncate text-xs font-semibold">{item.label}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={`text-[8px] font-bold px-1.5 py-0.2 rounded shrink-0 ml-1 ${
                              isActive
                                ? 'bg-orange-100 text-orange-700'
                                : item.badgeColor ||
                                  'bg-white/20 text-white border border-white/30'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
