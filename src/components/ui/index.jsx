import { Link } from 'react-router-dom';

export function Spinner({ size = 24 }) {
  return (
    <div
      className="inline-block rounded-full border-2 border-slate-200 border-t-[#ea580c] animate-spin"
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
      <i className={`${icon} text-4xl text-slate-600 mb-1`} />
      <p className="text-sm font-bold text-slate-400">{title}</p>
      {subtitle && <p className="text-xs text-slate-500 max-w-xs">{subtitle}</p>}
    </div>
  );
}

export function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = 'Confirm', variant = 'danger' }) {
  if (!open) return null;
  const btnColor = variant === 'danger' ? 'from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' : 'from-[#ea580c] to-orange-600 hover:from-orange-700 hover:to-orange-800';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fadeIn">
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
    orange: { border: 'border-amber-500/30', bg: 'bg-amber-500/5', title: 'text-amber-400', icon: 'text-amber-400' },
    emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/5', title: 'text-emerald-400', icon: 'text-emerald-400' },
    indigo: { border: 'border-indigo-500/30', bg: 'bg-indigo-500/5', title: 'text-indigo-400', icon: 'text-indigo-400' },
    slate: { border: 'border-slate-700', bg: 'bg-slate-900/60', title: 'text-slate-300', icon: 'text-slate-400' },
  };
  const c = colors[accent] || colors.slate;
  return (
    <div className={`rounded-2xl border ${c.border} ${c.bg} p-4 sm:p-5 space-y-3 shadow-sm ${className}`}>
      {(title || subtitle) && (
        <div className="flex items-center gap-2.5 border-b border-slate-800/60 pb-2.5">
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
        className="h-8 w-8 rounded-lg border border-slate-800 text-xs font-bold text-slate-400 hover:bg-slate-900 hover:text-white disabled:opacity-30 transition cursor-pointer"
      >
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`h-8 w-8 rounded-lg text-xs font-bold transition cursor-pointer ${
            p === currentPage
              ? 'bg-[#ea580c] text-white shadow-md shadow-orange-500/25'
              : 'border border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="h-8 w-8 rounded-lg border border-slate-800 text-xs font-bold text-slate-400 hover:bg-slate-900 hover:text-white disabled:opacity-30 transition cursor-pointer"
      >
        ›
      </button>
    </div>
  );
}
