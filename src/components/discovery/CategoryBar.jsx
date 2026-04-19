import React from 'react';
import { Coffee, Bed, Home, Utensils, Heart, Users, Briefcase, Camera, Eye, ShieldAlert } from 'lucide-react';

const categories = [
  { icon: <Coffee size={24} />, label: 'Quán cà phê', count: '505 địa điểm', color: 'text-orange-500' },
  { icon: <Bed size={24} />, label: 'Khách sạn', count: '8 địa điểm', color: 'text-blue-500' },
  { icon: <Home size={24} />, label: 'Homestay', count: '10 địa điểm', color: 'text-green-500' },
  { icon: <Utensils size={24} />, label: 'Ăn uống', count: '144 địa điểm', color: 'text-orange-600' },
  { icon: <Heart size={24} />, label: 'Hẹn hò', count: '12 địa điểm', color: 'text-pink-500' },
  { icon: <Users size={24} />, label: 'Tụ tập', count: '40 địa điểm', color: 'text-blue-600' },
  { icon: <Briefcase size={24} />, label: 'Làm việc', count: '35 địa điểm', color: 'text-emerald-500' },
  { icon: <Camera size={24} />, label: 'Sống ảo', count: '197 địa điểm', color: 'text-purple-500' },
  { icon: <Eye size={24} />, label: 'View đẹp', count: '38 địa điểm', color: 'text-sky-500' },
  { icon: <ShieldAlert size={24} />, label: 'Yên tĩnh', count: '28 địa điểm', color: 'text-cyan-500' },
];

const CategoryBar = () => {
  return (
    <div className="py-8 overflow-hidden">
      <h2 className="text-2xl font-bold mb-2">Khám phá theo nhu cầu</h2>
      <p className="text-warm-silver text-sm mb-8">Lựa chọn của bạn là gì?</p>
      
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
        {categories.map((cat, idx) => (
          <div 
            key={idx} 
            className="flex flex-col items-center min-w-[100px] cursor-pointer group"
          >
            <div className={`w-16 h-16 rounded-2xl bg-white shadow-clay flex items-center justify-center mb-3 transition-all hover-clay-jump group-hover:bg-warm-cream ${cat.color}`}>
              {cat.icon}
            </div>
            <span className="text-xs font-bold mb-1 text-clay-black">{cat.label}</span>
            <span className="text-[10px] text-warm-silver font-medium">{cat.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;
