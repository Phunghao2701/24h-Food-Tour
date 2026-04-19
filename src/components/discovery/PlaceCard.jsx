import React from 'react';
import { Star, Heart, MapPin } from 'lucide-react';

const PlaceCard = ({ venue, isPriority }) => {
  const { name, review_score, category, summary, distance } = venue;

  return (
    <div className={`bg-white rounded-[40px] overflow-hidden shadow-clay hover-clay-jump transition-all cursor-pointer group border ${isPriority ? 'border-orange-200 ring-4 ring-orange-50' : 'border-slate-100'}`}>
      <div className="relative h-64 overflow-hidden bg-slate-50">
        {/* Placeholder logic or actual image if exists */}
        <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-10 font-black italic select-none">
          {venue.venue_kind === 'Nước uống' ? '☕' : '🍜'}
        </div>
        
        {/* Priority Badge */}
        {isPriority && (
          <div className="absolute top-4 left-4 z-10 px-4 py-1.5 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
            Đề xuất hàng đầu
          </div>
        )}

        {/* Rating Badge */}
        {!isPriority && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm border border-slate-100">
            <Star size={14} className="text-orange-400 fill-orange-400" />
            <span className="text-sm font-bold text-slate-800">{review_score || '4.8'}</span>
          </div>
        )}

        {/* Favorite Button */}
        <button className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full text-slate-400 hover:text-orange-500 transition-colors shadow-sm group-hover:scale-110 transition-transform">
          <Heart size={20} />
        </button>

        {/* Maps overlay simulation from screenshot */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="text-8xl font-black text-slate-900/10 italic select-none">maps</span>
        </div>
      </div>

      <div className="p-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-md">
            {category}
          </span>
          {distance && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
              <MapPin size={12} /> {(distance / 1000).toFixed(1)}km
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">{name}</h3>
        <p className="text-sm text-slate-400 font-medium line-clamp-2 leading-relaxed">{summary}</p>
      </div>
    </div>
  );
};

export default PlaceCard;
