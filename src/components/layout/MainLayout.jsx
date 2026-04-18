import { NavLink, Outlet } from 'react-router-dom';
import { Home, Compass, Map, User, Users, Search } from 'lucide-react';
import AIConcierge from '../AI/Concierge';

const MainLayout = () => {
  const navItems = [
    { to: '/', icon: <Home size={24} />, label: 'Home' },
    { to: '/itineraries', icon: <Compass size={24} />, label: 'Tours' },
    { to: '/map', icon: <Map size={24} />, label: 'Map' },
    { to: '/passport', icon: <User size={24} />, label: 'Passport' },
    { to: '/community', icon: <Users size={24} />, label: 'Feed' },
  ];

  return (
    <div className="flex min-h-screen bg-warm-cream">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col border-r border-oat-border bg-warm-cream p-6 lg:flex shadow-[0_0_20px_rgba(250,249,247,0.5)]">
        <div className="mb-12 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-standard bg-matcha-600 text-clay-white shadow-clay relative group overflow-hidden">
            <Compass size={20} className="relative z-10" />
            <div className="absolute inset-0 bg-slushie-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          <span className="text-xl font-bold tracking-heading-tight">24h Food Tour</span>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-card px-4 py-3 transition-all hover-clay-jump active:scale-95 ${
                  isActive
                    ? 'bg-clay-black text-clay-white shadow-clay'
                    : 'text-warm-charcoal hover:bg-oat-light'
                }`
              }
            >
              {item.icon}
              <span className="font-bold text-sm uppercase tracking-wide-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="rounded-feature bg-slushie-500 p-6 shadow-clay relative overflow-hidden group">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wide-label text-slushie-800 opacity-70">Insider Tip</p>
          <p className="text-xs font-bold leading-relaxed text-slushie-800">Cơm Tấm bãi rác is best at 1am. Don't skip the pork skin!</p>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-clay-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pb-24 lg:ml-64 lg:pb-0">
        {/* Top Search Bar - Desktop */}
        <header className="sticky top-0 z-40 hidden items-center justify-between border-b border-oat-border bg-warm-cream/80 px-8 py-4 backdrop-blur-md lg:flex">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-silver" size={18} />
            <input 
              type="text" 
              placeholder="Search for districts, flavours..."
              className="w-full rounded-pill border border-oat-border bg-clay-white py-2 pl-10 pr-4 text-sm font-medium focus:border-matcha-600 focus:outline-none shadow-inner"
            />
          </div>
          <div className="flex items-center gap-4">
             <div className="px-3 py-1 bg-matcha-600/10 text-matcha-600 rounded-badge text-[10px] font-bold uppercase tracking-wide-label">Saigon, VN</div>
             <div className="flex h-10 w-10 items-center justify-center rounded-pill bg-clay-black font-bold text-clay-white shadow-clay">PH</div>
          </div>
        </header>

        <Outlet />
      </main>

      {/* Bottom Nav - Mobile */}
      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-oat-border bg-warm-cream/95 px-2 py-4 backdrop-blur-xl lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1.5 transition-all active:scale-90 ${
                isActive ? 'text-matcha-600 scale-110' : 'text-warm-silver'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  {item.icon}
                  {isActive && <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-matcha-600 rounded-full"></div>}
                </div>
                <span className="text-[8px] font-bold uppercase tracking-[1.5px]">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <AIConcierge />
    </div>
  );
};



export default MainLayout;
