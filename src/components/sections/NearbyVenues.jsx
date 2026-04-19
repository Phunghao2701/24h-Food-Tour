import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, ChevronRight } from 'lucide-react';
import { VENUES } from '../../utils/mockData';
import { isVenueOpen, calculateDistance } from '../../utils/engine';
import { useNavigate } from 'react-router-dom';

const DEFAULT_LOC = [10.8411, 106.81];

const getTimeString = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const getPriceEmoji = (range) => {
  if (range === '$') return '💰';
  if (range === '$$$') return '💎';
  return '💵';
};

const CATEGORY_EMOJI = {
  'Street Food': '🍜',
  'Café': '☕',
  'Cafe': '☕',
  'Fine Dining': '🍽️',
  'Hidden Gem': '💎',
  'Dessert': '🍡',
  'Bakery': '🥐',
};

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-clay-white border border-oat-border rounded-feature p-5 animate-pulse">
    <div className="h-3 bg-oat-light rounded-full w-1/3 mb-4" />
    <div className="h-5 bg-oat-light rounded-full w-3/4 mb-2" />
    <div className="h-3 bg-oat-light rounded-full w-full mb-1" />
    <div className="h-3 bg-oat-light rounded-full w-2/3 mb-5" />
    <div className="flex gap-2">
      <div className="h-6 bg-oat-light rounded-full w-16" />
      <div className="h-6 bg-oat-light rounded-full w-16" />
    </div>
  </div>
);

// ─── VenueCard ────────────────────────────────────────────────────────────────
const NearbyCard = ({ venue, timeStr }) => {
  const isOpen = isVenueOpen(venue, timeStr);
  const emoji = CATEGORY_EMOJI[venue.category] || '🍴';

  return (
    <div
      id={`nearby-card-${venue.id}`}
      className="bg-clay-white border border-oat-border rounded-feature overflow-hidden shadow-clay hover-clay-jump transition-all cursor-pointer group"
    >
      {/* Top color strip + emoji */}
      <div className={`h-1.5 ${isOpen ? 'bg-matcha-600' : 'bg-oat-border'}`} />
      <div className="p-5">
        {/* Status + distance row */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2.5 py-1 rounded-pill text-[10px] font-bold ${
            isOpen ? 'bg-matcha-50 text-matcha-700' : 'bg-pomegranate-50 text-pomegranate-600'
          }`}>
            {isOpen ? '✅ Đang mở' : '❌ Đã đóng'}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-bold text-warm-silver">
            <Navigation size={11} className="text-matcha-600" />
            {venue.distanceKm < 1
              ? `${(venue.distanceKm * 1000).toFixed(0)}m`
              : `${venue.distanceKm.toFixed(1)}km`}
          </span>
        </div>

        {/* Icon + Name */}
        <div className="flex items-start gap-3 mb-2">
          <span className="text-3xl leading-none mt-0.5">{emoji}</span>
          <div>
            <h3 className="font-bold text-clay-black leading-tight group-hover:text-matcha-700 transition-colors">
              {venue.name}
            </h3>
            <p className="text-[11px] text-warm-silver mt-0.5">{venue.category}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-warm-charcoal leading-relaxed mb-4 line-clamp-2">
          {venue.summary}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between border-t border-oat-border pt-3 mt-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-warm-silver flex items-center gap-1">
              <MapPin size={10} /> {venue.district}
            </span>
            <span className="text-[11px] font-bold text-warm-charcoal">
              {getPriceEmoji(venue.price_range)}
            </span>
            <span className="text-[11px] font-bold text-lemon-700">★ {venue.review_score}</span>
          </div>
          <span className="text-[11px] font-bold text-matcha-600 flex items-center gap-0.5 group-hover:text-matcha-700">
            Xem <ChevronRight size={12} />
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── Main Section ─────────────────────────────────────────────────────────────
const NearbyVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeStr, setTimeStr] = useState(getTimeString);
  const [isGPS, setIsGPS] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const now = getTimeString();
    setTimeStr(now);

    const buildList = (loc, gps) => {
      if (cancelled) return;
      const sorted = VENUES
        .map((v) => ({ ...v, distanceKm: calculateDistance(loc, v.coord) / 1000 }))
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 12); // take top 12 by distance

      // Prefer open ones, always show 4
      const openFirst = [
        ...sorted.filter((v) => isVenueOpen(v, now)),
        ...sorted.filter((v) => !isVenueOpen(v, now)),
      ].slice(0, 4);

      setVenues(openFirst);
      setIsGPS(gps);
      setLoading(false);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => buildList([pos.coords.latitude, pos.coords.longitude], true),
        () => buildList(DEFAULT_LOC, false),
        { enableHighAccuracy: true, timeout: 4000 }
      );
    } else {
      buildList(DEFAULT_LOC, false);
    }

    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-6 bg-warm-cream">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="h-3 bg-oat-border rounded-full w-32 mb-3 animate-pulse" />
              <div className="h-7 bg-oat-border rounded-full w-56 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  if (!venues.length) return null;

  const openCount = venues.filter((v) => isVenueOpen(v, timeStr)).length;

  return (
    <section id="nearby" className="py-16 px-6 bg-warm-cream border-b border-oat-border">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-matcha-50 border border-matcha-200 text-matcha-700 rounded-pill text-[10px] font-bold uppercase tracking-widest mb-3">
              <Clock size={11} />
              {isGPS ? 'Theo GPS của bạn' : 'Vị trí mặc định'}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-display-tight text-clay-black">
              Gần bạn đang mở
            </h2>
            <p className="text-warm-silver mt-1 text-sm font-medium">
              {openCount}/{venues.length} quán đang mở cửa lúc {timeStr}
            </p>
          </div>

          <button
            onClick={() => navigate('/map')}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 border-2 border-clay-black rounded-feature font-bold text-sm hover:bg-clay-black hover:text-clay-white transition-all hover-clay-jump"
          >
            Xem bản đồ <ChevronRight size={16} />
          </button>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {venues.map((venue) => (
            <NearbyCard key={venue.id} venue={venue} timeStr={timeStr} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center md:hidden">
          <button
            onClick={() => navigate('/map')}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-clay-black rounded-feature font-bold text-sm hover:bg-clay-black hover:text-clay-white transition-all"
          >
            Xem tất cả trên bản đồ <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default NearbyVenues;
