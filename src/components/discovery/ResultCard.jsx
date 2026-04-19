import React from 'react';
import { MapPin, Clock, DollarSign, Star } from 'lucide-react';
import { formatPriceRange, isVenueOpen } from '../../utils/engine';

const ResultCard = ({ venue, currentTime, userLoc, distance, isPrimary, onClick }) => {
  const open = isVenueOpen(venue, currentTime || '12:00');

  return (
    <div
      onClick={onClick}
      className={`rounded-feature border bg-clay-white shadow-clay transition-all duration-300 cursor-pointer hover-clay-jump ${
        isPrimary ? 'border-matcha-600 scale-[1.01] ring-2 ring-matcha-600/20' : 'border-oat-border'
      }`}
    >
      {/* Top image area */}
      <div className="relative h-48 overflow-hidden rounded-t-feature bg-oat-light">
        {isPrimary && (
          <div className="absolute top-3 left-3 z-10 rounded-pill bg-matcha-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-clay-white">
            Đề xuất số 1
          </div>
        )}
        <div className="flex h-full items-center justify-center text-6xl opacity-30">
          {venue.category === 'Hidden Gem' ? '💎' : venue.venue_kind === 'Nước uống' ? '☕' : '🍜'}
        </div>
      </div>

      <div className="p-6">
        <h3 className="mb-2 text-xl font-bold text-clay-black">{venue.name}</h3>
        
        <p className="mb-4 text-sm leading-relaxed text-warm-charcoal line-clamp-2">
          {venue.summary}
        </p>

        <div className="flex flex-wrap gap-3 mb-4">
          {/* Open/Closed */}
          <span className={`flex items-center gap-1 rounded-pill px-3 py-1 text-[11px] font-bold ${
            open
              ? 'bg-matcha-50 text-matcha-700 border border-matcha-200'
              : 'bg-pomegranate-50 text-pomegranate-600 border border-pomegranate-200'
          }`}>
            <Clock size={12} /> {open ? 'Đang mở' : 'Đã đóng'}
          </span>

          {/* Price */}
          <span className="flex items-center gap-1 rounded-pill bg-oat-light px-3 py-1 text-[11px] font-bold text-warm-charcoal border border-oat-border">
            <DollarSign size={12} /> {formatPriceRange(venue)}
          </span>

          {/* Rating */}
          <span className="flex items-center gap-1 rounded-pill bg-oat-light px-3 py-1 text-[11px] font-bold text-warm-charcoal border border-oat-border">
            <Star size={12} className="text-lemon-500 fill-lemon-500" /> {venue.review_score}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide-label text-warm-silver">
          <span className="flex items-center gap-1">
            <MapPin size={12} /> {venue.district}
          </span>
          {distance && (
            <span>
              {distance < 1000 ? `${Math.round(distance)}m` : `${(distance / 1000).toFixed(1)}km`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;