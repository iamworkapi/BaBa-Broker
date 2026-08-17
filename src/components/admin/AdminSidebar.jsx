import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminSidebar({ view }) {
  const navItems = [
    {
      group: 'CORE NAVIGATION',
      icon: 'ri-layout-grid-fill',
      iconColor: 'text-orange-400',
      items: [
        {
          id: 'overview',
          path: '/admin/dashboard',
          label: 'Dashboard',
          icon: 'ri-dashboard-3-fill',
          badge: 'Overview',
          badgeStyle: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
          gradient: 'from-orange-500 to-amber-500',
          iconBg: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
        },
        {
          id: 'projects',
          path: '/admin/projects',
          label: 'All Projects',
          icon: 'ri-building-4-fill',
          badge: 'Portfolio',
          badgeStyle: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          gradient: 'from-amber-500 to-yellow-500',
          iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        },
      ],
    },
    {
      group: 'MANAGEMENT & DEALS',
      icon: 'ri-tools-fill',
      iconColor: 'text-amber-400',
      items: [
        {
          id: 'create-project',
          path: '/admin/create-project',
          label: 'Create Investment',
          icon: 'ri-add-circle-fill',
          badge: 'New Deal',
          badgeStyle: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
          gradient: 'from-orange-500 to-amber-500',
          iconBg: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
        },
        {
          id: 'featured',
          path: '/admin/featured',
          label: 'Featured Hot Sale',
          icon: 'ri-fire-fill',
          badge: 'Direct Sale',
          badgeStyle: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
          gradient: 'from-amber-500 to-yellow-500 text-slate-950',
          iconBg: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
        },
        {
          id: 'add-investor',
          path: '/admin/add-investor',
          label: 'Add Investor',
          icon: 'ri-user-add-fill',
          badge: 'Investors',
          badgeStyle: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          gradient: 'from-blue-600 to-indigo-600',
          iconBg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
        },
        {
          id: 'investment-requests',
          path: '/admin/investment-requests',
          label: 'Investment Requests',
          icon: 'ri-hand-coin-fill',
          badge: 'Requests',
          badgeStyle: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          gradient: 'from-emerald-600 to-teal-600',
          iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        },
      ],
    },
    {
      group: 'CRM & AUDIT LOGS',
      icon: 'ri-shield-user-fill',
      iconColor: 'text-emerald-400',
      items: [
        {
          id: 'whatsapp',
          path: '/admin/whatsapp',
          label: 'WhatsApp Share',
          icon: 'ri-whatsapp-fill',
          badge: 'Direct CRM',
          badgeStyle: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          gradient: 'from-emerald-600 to-teal-600',
          iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        },
        {
          id: 'flats',
          path: '/admin/flats',
          label: 'Flat Listings & Audit',
          icon: 'ri-community-fill',
          badge: 'Audit',
          badgeStyle: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
          gradient: 'from-purple-600 to-indigo-600',
          iconBg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
        },
        {
          id: 'staff',
          path: '/admin/staff',
          label: 'Manage Staff',
          icon: 'ri-team-fill',
          badge: 'Users',
          badgeStyle: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
          gradient: 'from-indigo-600 to-blue-600',
          iconBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
        },
      ],
    },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800/80 bg-slate-950/95 p-3.5 space-y-5 shadow-2xl">
      {navItems.map((group, groupIdx) => (
        <div key={groupIdx} className="space-y-1.5">
          {/* Section Header */}
          <div className="px-3 py-1 flex items-center justify-between text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
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
                  className={`relative group flex items-center justify-between rounded-2xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? item.id === 'featured'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/50'
                        : `bg-gradient-to-r ${item.gradient} text-white font-bold shadow-lg shadow-orange-500/15 ring-1 ring-white/10`
                      : 'text-slate-300 hover:bg-slate-900/90 hover:text-white border border-transparent hover:border-slate-800/80'
                  }`}
                >
                  {/* Left Active Line Indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-white rounded-r-full shadow-md"></span>
                  )}

                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border shadow-inner transition-transform duration-300 group-hover:scale-110 ${
                        isActive
                          ? item.id === 'featured'
                            ? 'bg-slate-950/20 border-slate-950/30 text-slate-950'
                            : 'bg-white/20 border-white/30 text-white'
                          : item.iconBg
                      }`}
                    >
                      <i className={`${item.icon} text-base`}></i>
                    </div>

                    <span className="truncate tracking-tight font-medium">
                      {item.label}
                    </span>
                  </div>

                  {/* Right Pill Badge */}
                  <span
                    className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 transition-all ${
                      isActive
                        ? item.id === 'featured'
                          ? 'bg-slate-950 text-amber-300 border-slate-950'
                          : 'bg-white/20 text-white border-white/30'
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

      {/* Sidebar Bottom Upgrade/Support Card */}
      <div className="pt-2 border-t border-slate-800/80">
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-3.5 shadow-xl space-y-2">
          <div className="flex items-center gap-2 text-orange-400">
            <div className="h-6 w-6 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <i className="ri-rocket-fill text-xs"></i>
            </div>
            <span className="text-xs font-bold text-white">Baba Broker Engine</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed font-normal">
            Real Estate CRM & Investment Pool Manager v2.5 Live.
          </p>
        </div>
      </div>
    </aside>
  );
}
