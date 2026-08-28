import { Link } from 'react-router-dom';

export default function SidebarNav({
  items,
  currentView,
  brandColor = '#ea580c',
  width = '14rem',
  collapsed = false,
  logoUrl = '/assets/img/logo.svg',
  logoAlt = 'Baba Broker',
  logoLink = '/',
  footerText,
  isActive,
  notchCutout = true,
  className = '',
  headerExtra,
}) {
  return (
    <aside
      className={`h-screen flex flex-col justify-between select-none shrink-0 overflow-y-auto font-['Inter',sans-serif] shadow-lg z-20 ${className}`}
      style={{ backgroundColor: brandColor, width: collapsed ? '3.5rem' : width }}
    >
      <div className="space-y-5">
        <Link to={logoLink} className="flex items-center gap-2.5 px-1 group shrink-0">
          <img src={logoUrl} alt={logoAlt} className="h-8 sm:h-9 w-auto object-contain brightness-0 invert transition-transform group-hover:scale-105" />
          {!collapsed && <span className="text-xs font-black uppercase tracking-[0.12em] text-white/90">Baba Broker</span>}
        </Link>

        {headerExtra && !collapsed && <div className="mt-2 px-1">{headerExtra}</div>}

        <nav className="space-y-0.5 pt-1">
          {items.map((item) => {
            const active = typeof isActive === 'function' ? isActive(currentView, item) : currentView === item.id;

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl sm:rounded-r-none transition-all duration-200 ease-out text-xs ${
                  active
                    ? 'bg-white text-[color:var(--brand)] font-bold shadow-sm sm:shadow-none sm:-mr-3.5 sm:pr-5 z-10'
                    : 'text-white/75 hover:text-white hover:bg-white/15 hover:translate-x-1 font-normal'
                }`}
                style={active ? { color: brandColor } : undefined}
              >
                {notchCutout && active && (
                  <>
                    <span className="hidden sm:block absolute -top-2 right-0 w-3 h-3 pointer-events-none rounded-br-lg" style={{ backgroundColor: brandColor, boxShadow: `3px 3px 0 3px #ffffff` }} />
                    <span className="hidden sm:block absolute -bottom-2 right-0 w-3 h-3 pointer-events-none rounded-tr-lg" style={{ backgroundColor: brandColor, boxShadow: `3px -3px 0 3px #ffffff` }} />
                  </>
                )}

                <div className="flex items-center gap-2.5 min-w-0">
                  <i className={`${active ? item.activeIcon : item.icon} text-sm shrink-0 transition-transform duration-200 group-hover:scale-110 ${active ? '' : 'text-white/90 group-hover:text-white'}`} style={active ? { color: brandColor } : undefined} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {item.badge && !collapsed && (
                  <span className="text-[10px] font-black px-1.5 py-0.3 rounded-full bg-black/15 text-white/90">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {footerText && (
        <div className="pt-3 mt-auto border-t border-white/15 text-center select-none shrink-0">
          <p className="text-[10px] text-white/80 font-medium leading-tight">{footerText}</p>
        </div>
      )}
    </aside>
  );
}
