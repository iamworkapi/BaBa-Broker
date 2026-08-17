import React from 'react';

export default function AdminPageHeader({
  badge,
  title,
  subtitle,
  actions,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 font-['Inter',sans-serif]">
      {/* Left Title & Subtitle */}
      <div className="space-y-0.5 min-w-0">
        {badge && (
          <span className="text-[10px] font-semibold text-[#ea580c] tracking-wide block uppercase">
            {badge}
          </span>
        )}
        <h1 className="text-lg sm:text-xl font-semibold text-slate-800 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-slate-500 font-normal">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Action Buttons */}
      {actions && (
        <div className="flex items-center gap-2.5 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
