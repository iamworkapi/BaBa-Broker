import React from 'react';

export function AdminSearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  shortcutHint = '⌘K',
  className = '',
  size = 'md',
  autoFocus = false,
}) {
  const sizeClasses = {
    sm: 'py-1.5 pl-8 pr-14 text-xs',
    md: 'py-2 pl-9 pr-16 text-xs',
    lg: 'py-2.5 pl-10 pr-20 text-sm',
  };

  const iconSizes = {
    sm: 'left-2.5 text-xs',
    md: 'left-3 text-sm',
    lg: 'left-3.5 text-base',
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <i
        className={`ri-search-line absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none ${
          iconSizes[size] || iconSizes.md
        }`}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`w-full rounded-xl bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 placeholder-slate-400 outline-none border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all font-normal shadow-2xs ${
          sizeClasses[size] || sizeClasses.md
        }`}
      />

      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {value ? (
          <button
            type="button"
            onClick={() => {
              if (onClear) onClear();
              else if (onChange) onChange('');
            }}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition cursor-pointer"
            title="Clear search"
          >
            <i className="ri-close-line text-xs" />
          </button>
        ) : shortcutHint ? (
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded">
            {shortcutHint}
          </kbd>
        ) : null}
      </div>
    </div>
  );
}

export default AdminSearchBar;
