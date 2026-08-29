import React from 'react';
import { Link } from 'react-router-dom';

export { AdminButton } from './AdminButton';
export { AdminSearchBar } from './AdminSearchBar';
export { AdminStatCard } from './AdminStatCard';
export { AdminBadge } from './AdminBadge';
export { AdminModal } from './AdminModal';
export { AdminDrawer } from './AdminDrawer';
export { AdminDataTable } from './AdminDataTable';

export function Spinner({ size = 24, color = 'border-t-orange-600' }) {
  return (
    <div
      className={`inline-block rounded-full border-2 border-slate-200 ${color} animate-spin`}
      style={{ width: size, height: size }}
    />
  );
}

export function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Spinner size={36} />
      <p className="text-xs font-semibold text-slate-400">{text}</p>
    </div>
  );
}

export function EmptyState({ icon = 'ri-inbox-line', title = 'No data found', subtitle = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-2 text-center">
      <i className={`${icon} text-4xl text-slate-300 mb-1`} />
      <p className="text-sm font-bold text-slate-700">{title}</p>
      {subtitle && <p className="text-xs text-slate-400 max-w-xs">{subtitle}</p>}
    </div>
  );
}

export function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = 'Confirm', variant = 'danger' }) {
  if (!open) return null;
  const btnColor = variant === 'danger' ? 'from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700' : 'from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{message}</p>
        <div className="flex items-center gap-2.5 pt-1">
          <button onClick={onCancel} className="flex-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 text-xs font-bold transition cursor-pointer">
            Cancel
          </button>
          <button onClick={onConfirm} className={`flex-1 rounded-xl bg-gradient-to-r ${btnColor} text-white py-2.5 text-xs font-bold shadow-lg transition cursor-pointer`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function SectionCard({ title, subtitle, icon, accent = 'orange', children, className = '' }) {
  const colors = {
    orange: { border: 'border-orange-200', bg: 'bg-white', title: 'text-orange-600', icon: 'text-orange-600' },
    emerald: { border: 'border-emerald-200', bg: 'bg-white', title: 'text-emerald-600', icon: 'text-emerald-600' },
    indigo: { border: 'border-indigo-200', bg: 'bg-white', title: 'text-indigo-600', icon: 'text-indigo-600' },
    slate: { border: 'border-slate-200', bg: 'bg-white', title: 'text-slate-800', icon: 'text-slate-500' },
  };
  const c = colors[accent] || colors.slate;
  return (
    <div className={`rounded-2xl border ${c.border} ${c.bg} p-4 sm:p-5 space-y-3 shadow-xs ${className}`}>
      {(title || subtitle) && (
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2.5">
          {icon && <i className={`${icon} text-sm ${c.icon}`} />}
          <div>
            {title && <h3 className={`text-xs font-black uppercase tracking-wider ${c.title}`}>{title}</h3>}
            {subtitle && <p className="text-[11px] text-slate-400 font-medium">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

export function Pagination({ currentPage, totalPages, onPageChange, maxButtons = 5 }) {
  if (totalPages <= 1) return null;
  let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let end = Math.min(totalPages, start + maxButtons - 1);
  if (end - start < maxButtons - 1) start = Math.max(1, end - maxButtons + 1);
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);
  return (
    <div className="flex items-center justify-center gap-1.5 pt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="h-8 w-8 rounded-lg border border-slate-200 text-xs font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 transition cursor-pointer"
      >
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`h-8 w-8 rounded-lg text-xs font-bold transition cursor-pointer ${
            p === currentPage
              ? 'bg-orange-600 text-white shadow-md shadow-orange-500/25'
              : 'border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="h-8 w-8 rounded-lg border border-slate-200 text-xs font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 transition cursor-pointer"
      >
        ›
      </button>
    </div>
  );
}
