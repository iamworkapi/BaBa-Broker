import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminSidebar({ view }) {
  const navItems = [
    {
      group: 'CORE OVERVIEW',
      icon: 'ri-layout-grid-fill',
      iconColor: 'text-teal-400',
      items: [
        {
          id: 'overview',
          path: '/admin/dashboard',
          label: 'Dashboard',
          icon: 'ri-dashboard-3-line',
          activeIcon: 'ri-dashboard-3-fill',
          badge: 'Live Stats',
          badgeStyle: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
        },
        {
          id: 'projects',
          path: '/admin/projects',
          label: 'All Projects',
          icon: 'ri-building-4-line',
          activeIcon: 'ri-building-4-fill',
          badge: 'Portfolio',
          badgeStyle: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        },
      ],
    },
    {
      group: 'DEALS & INVENTORY',
      icon: 'ri-tools-fill',
      iconColor: 'text-orange-400',
      items: [
        {
          id: 'create-project',
          path: '/admin/create-project',
          label: 'Create Investment',
          icon: 'ri-add-circle-line',
          activeIcon: 'ri-add-circle-fill',
          badge: 'New Deal',
          badgeStyle: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
        },
        {
          id: 'featured',
          path: '/admin/featured',
          label: 'Featured Hot Sale',
          icon: 'ri-fire-line',
          activeIcon: 'ri-fire-fill',
          badge: 'Direct Sale',
          badgeStyle: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
        },
        {
          id: 'add-investor',
          path: '/admin/add-investor',
          label: 'Add Investor',
          icon: 'ri-user-add-line',
          activeIcon: 'ri-user-add-fill',
          badge: 'Directory',
          badgeStyle: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
        },
        {
          id: 'investment-requests',
          path: '/admin/investment-requests',
          label: 'Investment Requests',
          icon: 'ri-hand-coin-line',
          activeIcon: 'ri-hand-coin-fill',
          badge: 'Requests',
          badgeStyle: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        },
      ],
    },
    {
      group: 'CRM & AUDIT',
      icon: 'ri-shield-user-fill',
      iconColor: 'text-indigo-400',
      items: [
        {
          id: 'whatsapp',
          path: '/admin/whatsapp',
          label: 'WhatsApp Share',
          icon: 'ri-whatsapp-line',
          activeIcon: 'ri-whatsapp-fill',
          badge: 'Direct CRM',
          badgeStyle: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        },
        {
          id: 'flats',
          path: '/admin/flats',
          label: 'Flat Listings Audit',
          icon: 'ri-community-line',
          activeIcon: 'ri-community-fill',
          badge: 'Audit',
          badgeStyle: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
        },
        {
          id: 'staff',
          path: '/admin/staff',
          label: 'Manage Staff',
          icon: 'ri-team-line',
          activeIcon: 'ri-team-fill',
          badge: 'Access',
          badgeStyle: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
        },
      ],
    },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800/80 bg-[#080d1a] p-4 flex flex-col justify-between shadow-2xl font-sans">
      <div className="space-y-6">
        {navItems.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-2">
            {/* Section Header */}
            <div className="px-3 flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5">
                <i className={`${group.icon} ${group.iconColor} text-xs`}></i>
                {group.group}
              </span>
            </div>

            {/* Navigation Items */}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = view === item.id;

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`relative group flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-slate-950 font-bold shadow-lg shadow-orange-500/25 ring-1 ring-amber-300/40 translate-x-1'
                        : 'text-slate-300 hover:bg-slate-900/90 hover:text-white border border-transparent hover:border-slate-800/70 hover:translate-x-0.5'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                          isActive
                            ? 'bg-slate-950/20 text-slate-950 font-black'
                            : 'bg-slate-900 border border-slate-800 text-orange-400 group-hover:text-amber-300'
                        }`}
                      >
                        <i className={`${isActive ? item.activeIcon : item.icon} text-base`}></i>
                      </div>

                      <span className="truncate tracking-tight">
                        {item.label}
                      </span>
                    </div>

                    {/* Right Pill Badge */}
                    <span
                      className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 transition-all ${
                        isActive
                          ? 'bg-slate-950 text-amber-300 border-slate-950/40 font-black'
                          : item.badgeStyle
                      }`}
                    >
                      {item.badge}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Modern Sidebar Illustration Promo Card (Inspired by "Upgrade now!" design in concept) */}
      <div className="pt-4 mt-6 border-t border-slate-800/80">
        <div className="relative overflow-hidden rounded-2xl border border-teal-500/30 bg-gradient-to-br from-[#0c222e] via-[#091b26] to-[#061118] p-4 shadow-xl text-center space-y-3 group">
          {/* Ambient Glow & Decorative Shapes */}
          <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-teal-400/20 blur-xl"></div>
          <div className="pointer-events-none absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-amber-400/15 blur-lg"></div>

          {/* Icon / Illustration */}
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-400 to-emerald-400 text-slate-950 shadow-lg shadow-teal-500/30 group-hover:scale-105 transition-transform">
            <i className="ri-sparkling-fill text-xl"></i>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white tracking-wide">
              Baba Engine Pro
            </h4>
            <p className="text-[11px] text-teal-200/70 leading-relaxed font-medium">
              Full investor CRM, automated PDF brochures & WhatsApp dispatch.
            </p>
          </div>

          {/* Action CTA Button */}
          <Link
            to="/admin/create-project"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-3 py-2 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:opacity-95 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <span>+ Quick Deal Booster</span>
            <i className="ri-arrow-right-line text-xs"></i>
          </Link>
        </div>
      </div>
    </aside>
  );
}
