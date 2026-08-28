import { Link } from 'react-router-dom';

export default function AdminSidebar({ view }) {
  const navItems = [
    {
      id: 'overview',
      path: '/admin/dashboard',
      label: 'Home',
      icon: 'ri-home-5-line',
      activeIcon: 'ri-home-5-fill',
    },
    {
      id: 'projects',
      path: '/admin/projects',
      label: 'All Projects',
      icon: 'ri-bar-chart-2-line',
      activeIcon: 'ri-bar-chart-2-fill',
    },
    {
      id: 'featured',
      path: '/admin/featured',
      label: 'Bookings & Sales',
      icon: 'ri-calendar-check-line',
      activeIcon: 'ri-calendar-check-fill',
    },
    {
      id: 'flats',
      path: '/admin/flats',
      label: 'Apartments',
      icon: 'ri-community-line',
      activeIcon: 'ri-community-fill',
    },
    {
      id: 'investment-requests',
      path: '/admin/investment-requests',
      label: 'Pricing & Deals',
      icon: 'ri-price-tag-3-line',
      activeIcon: 'ri-price-tag-3-fill',
    },
    {
      id: 'whatsapp',
      path: '/admin/whatsapp',
      label: 'Support & CRM',
      icon: 'ri-message-3-line',
      activeIcon: 'ri-message-3-fill',
    },
    {
      id: 'staff',
      path: '/admin/staff',
      label: 'Staff Access',
      icon: 'ri-user-settings-line',
      activeIcon: 'ri-user-settings-fill',
    },
    {
      id: 'excel',
      path: '/admin/excel',
      label: 'Excel Upload',
      icon: 'ri-file-excel-2-line',
      activeIcon: 'ri-file-excel-2-fill',
    },
  ];

  return (
    <aside className="w-full lg:w-56 h-full lg:h-screen bg-[#ea580c] text-white flex flex-col justify-between pl-3.5 py-3.5 pr-0 select-none shrink-0 overflow-y-auto font-['Inter',sans-serif] z-20 shadow-md">
      <div className="space-y-4">
        {/* Original Clean Logo */}
        <div className="pr-3.5">
          <Link to="/" className="flex items-center px-1 py-1 group">
            <img
              src="/assets/img/logo.svg"
              alt="Baba Broker"
              className="h-8 sm:h-9 w-auto max-w-[170px] object-contain brightness-0 invert transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-md"
            />
          </Link>
        </div>

        {/* Navigation Items with Premium Interactive Hover Effects */}
        <nav className="space-y-1.5 pt-0.5 pr-0">
          {navItems.map((item) => {
            const isActive =
              view === item.id ||
              (view === 'overview' && item.id === 'overview') ||
              (view === 'create-project' && item.id === 'projects') ||
              (view === 'add-investor' && item.id === 'investment-requests');

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`sidebar-nav-item w-full group relative flex items-center justify-between text-xs cursor-pointer text-left transition-all duration-300 ${
                  isActive ? 'active' : ''
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {isActive ? (
                    <div className="icon-pop h-6 w-6 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center text-xs shadow-xs shrink-0 ring-2 ring-orange-100/90">
                      <i className={item.activeIcon} />
                    </div>
                  ) : (
                    <i className={`${item.icon} text-base shrink-0 text-white/90 transition-transform duration-200 group-hover:scale-115`} />
                  )}
                  <span className="truncate">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Bottom Footer: "Made with ❤️ by OrrishItSolutions" */}
      <div className="pt-3 pr-3.5 mt-auto border-t border-white/20 text-center select-none">
        <p className="text-[10px] text-white/85 font-normal leading-tight">
          Made with <span className="text-red-200">❤️</span> by{' '}
          <span className="font-semibold text-white tracking-wide">OrrishItSolutions</span>
        </p>
      </div>
    </aside>
  );
}

