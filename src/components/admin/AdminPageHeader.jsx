import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminPageHeader({
  badge,
  title,
  subtitle,
  icon = 'ri-layout-grid-fill',
  iconColor = 'text-orange-400',
  iconBg = 'bg-orange-500/10 border-orange-500/20',
  actions,
  breadcrumbs = [],
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-4 sm:p-5 shadow-xl transition-all">
      {/* Left Icon + Badge + Title + Subtitle */}
      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
        {/* Crisp Gradient Icon Pill */}
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl border ${iconBg} shadow-md shadow-orange-500/5`}>
          <i className={`${icon} ${iconColor} text-xl`}></i>
        </div>

        <div className="min-w-0 space-y-0.5">

          {/* Badge Tag */}
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400 flex items-center gap-1.5">
            {badge}
          </span>

          {/* Main Page Title */}
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug truncate">
            {title}
          </h1>

          {/* Subtitle Description */}
          {subtitle && (
            <p className="text-xs text-slate-400 font-normal leading-normal truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Action Buttons */}
      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
          {actions}
        </div>
      )}
    </div>
  );
}
