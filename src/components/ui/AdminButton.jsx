import React from 'react';
import { Spinner } from './index';

export function AdminButton({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className = '',
  title,
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

  const sizeClasses = {
    xs: 'px-2.5 py-1 text-[10px] gap-1',
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-xs gap-2',
    lg: 'px-5 py-2.5 text-sm gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-md shadow-orange-500/25 border border-transparent',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 shadow-2xs',
    outline:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs hover:border-orange-300',
    danger:
      'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md shadow-red-500/25 border border-transparent',
    dangerOutline:
      'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 shadow-2xs',
    success:
      'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-500/25 border border-transparent',
    successOutline:
      'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-2xs',
    dark:
      'bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-950/20 border border-slate-800',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      className={`
        ${baseClasses}
        ${sizeClasses[size] || sizeClasses.md}
        ${variantClasses[variant] || variantClasses.primary}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading ? (
        <Spinner size={size === 'xs' ? 12 : size === 'sm' ? 14 : 16} />
      ) : icon ? (
        <i className={`${icon} ${size === 'xs' ? 'text-xs' : 'text-sm'}`} />
      ) : null}

      <span>{children}</span>

      {!loading && iconRight && (
        <i className={`${iconRight} ${size === 'xs' ? 'text-xs' : 'text-sm'}`} />
      )}
    </button>
  );
}

export default AdminButton;
