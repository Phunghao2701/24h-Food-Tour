import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Compass, 
  Heart, 
  Calendar, 
  Map as MapIcon, 
  UserPlus, 
  Users, 
  Mail, 
  FileText,
  MapPin
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { to: '/', icon: <Home size={20} />, label: 'Trang chủ' },
    { to: '/itineraries', icon: <Compass size={20} />, label: 'Khám phá' },
    { to: '/favorites', icon: <Heart size={20} />, label: 'Yêu thích' },
    { to: '/planning', icon: <Calendar size={20} />, label: 'Tạo lịch trình' },
    { to: '/map', icon: <MapIcon size={20} />, label: 'Bản đồ' },
    { to: '/room', icon: <UserPlus size={20} />, label: 'Tạo phòng cùng đi' },
    { to: '/team', icon: <Users size={20} />, label: 'Đội ngũ' },
    { to: '/contact', icon: <Mail size={20} />, label: 'Liên hệ' },
    { to: '/policy', icon: <FileText size={20} />, label: 'Chính sách' },
  ];

  return (
    <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col bg-white border-r border-oat-border/30 p-6 lg:flex z-50">
      <div className="mb-10 pl-2 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-clay text-orange-500 border border-oat-border/20">
          <MapPin size={22} fill="currentColor" fillOpacity={0.2} />
        </div>
        <span className="text-2xl font-black tracking-tighter text-slate-800">didaune</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-sm ${
                isActive
                  ? 'bg-orange-50 text-orange-600 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`
            }
          >
            <span className={({ isActive }) => isActive ? 'text-orange-600' : 'text-slate-400'}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="mt-auto pt-6 border-t border-oat-border/20">
         <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-2">© 2026 24h Food Tour</div>
      </div>
    </aside>
  );
};

export default Sidebar;
