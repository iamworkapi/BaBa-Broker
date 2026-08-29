import React from 'react';

export function AdminStatCard({
  title,
  value,
  subValue,
  icon = 'ri-funds-box-line',
  theme = 'orange', // 'orange' | 'emerald' | 'indigo' | 'rose' | 'amber' | 'blue'
  trend,
  trendLabel,
  trendPositive = true,
  onClick,
  active = false,
  sparklineData,
  className = '',
}) {
  const themeStyles = {
    orange: {
      gradient: 'from-orange-500 to-amber-500',
      shadow: 'shadow-orange-500/25',
      lightBg: 'bg-orange-500/10',
      activeBorder: 'border-orange-500 ring-2 ring-orange-500/20',
      sparkColor: '#ea580c',
    },
    emerald: {
      gradient: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-500/25',
      lightBg: 'bg-emerald-500/10',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/20',
      sparkColor: '#10b981',
    },
    indigo: {
      gradient: 'from-indigo-500 to-violet-600',
      shadow: 'shadow-indigo-500/25',
      lightBg: 'bg-indigo-500/10',
      activeBorder: 'border-indigo-500 ring-2 ring-indigo-500/20',
      sparkColor: '#6366f1',
    },
    rose: {
      gradient: 'from-rose-500 to-orange-500',
      shadow: 'shadow-rose-500/25',
      lightBg: 'bg-rose-500/10',
      activeBorder: 'border-rose-500 ring-2 ring-rose-500/20',
      sparkColor: '#f43f5e',
    },
    blue: {
      gradient: 'from-blue-500 to-cyan-500',
      shadow: 'shadow-blue-500/25',
      lightBg: 'bg-blue-500/10',
      activeBorder: 'border-blue-500 ring-2 ring-blue-500/20',
      sparkColor: '#3b82f6',
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.orange;

  // Mini sparkline inline renderer if data exists
  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length < 2) return null;
    const width = 80;
    const height = 28;
    const max = Math.max(...sparklineData, 1);
    const min = Math.min(...sparklineData, 0);
    const range = max - min || 1;
    const step = width / (sparklineData.length - 1);

    const coords = sparklineData.map((val, idx) => ({
      x: idx * step,
      y: height - ((val - min) / range) * (height - 8) - 4,
    }));

    let path = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const xc = (coords[i].x + coords[i + 1].x) / 2;
      const yc = (coords[i].y + coords[i + 1].y) / 2;
      path += ` Q ${coords[i].x.toFixed(1)} ${coords[i].y.toFixed(1)}, ${xc.toFixed(1)} ${yc.toFixed(1)}`;
    }
    path += ` L ${coords[coords.length - 1].x.toFixed(1)} ${coords[coords.length - 1].y.toFixed(1)}`;
    const fill = `${path} L ${width} ${height} L 0 ${height} Z`;

    const gradId = `stat-grad-${theme}-${Math.random().toString(36).substr(2, 5)}`;

    return (
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={currentTheme.sparkColor} stopOpacity="0.35" />
            <stop offset="100%" stopColor={currentTheme.sparkColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={fill} fill={`url(#${gradId})`} />
        <path
          d={path}
          fill="none"
          stroke={currentTheme.sparkColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={coords[coords.length - 1].x}
          cy={coords[coords.length - 1].y}
          r="2.8"
          fill={currentTheme.sparkColor}
        />
      </svg>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl bg-slate-50/90 hover:bg-white p-4 sm:p-5 border shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${
        active
          ? currentTheme.activeBorder
          : 'border-slate-200/80 hover:border-slate-300'
      } ${className}`}
    >
      <div
        className={`absolute top-0 right-0 h-28 w-28 bg-gradient-to-br ${currentTheme.lightBg} to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500`}
      />

      <div className="flex items-start justify-between gap-2.5 relative z-10">
        <div className="space-y-1 min-w-0">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {title}
          </span>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              {value}
            </span>
            {subValue && (
              <span className="text-xs font-bold text-slate-400">{subValue}</span>
            )}
          </div>
        </div>

        <div
          className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${currentTheme.gradient} text-white flex items-center justify-center text-xl shadow-md ${currentTheme.shadow} shrink-0 group-hover:scale-110 transition-transform`}
        >
          <i className={icon} />
        </div>
      </div>

      {(trend || trendLabel || sparklineData) && (
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2 relative z-10">
          <div className="space-y-0.5 min-w-0">
            {trend && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  trendPositive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-700'
                }`}
              >
                <i className={trendPositive ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} />
                {trend}
              </span>
            )}
            {trendLabel && (
              <span className="text-[10px] text-slate-400 block truncate font-medium">
                {trendLabel}
              </span>
            )}
          </div>
          {renderSparkline()}
        </div>
      )}
    </div>
  );
}

export default AdminStatCard;
