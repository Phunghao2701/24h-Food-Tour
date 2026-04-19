import React, { useState, useEffect, useCallback } from 'react';
import Button from '../ui/Button';
import { Clock, MapPin, Sparkles, X, ChevronRight, Navigation, Loader2, Wallet, RefreshCw } from 'lucide-react';
import { VENUES } from '../../utils/mockData';
import { getTimeSensitiveGreeting, isVenueOpen, calculateDistance } from '../../utils/engine';
import { useVisitHistory } from '../../utils/useVisitHistory';

const DEFAULT_LOC = [10.8411, 106.81];
const MAX_RADIUS_KM = 10;

const getTimeString = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const getPriceDisplay = (venue) => {
  if (venue.price_min && venue.price_max)
    return `${(venue.price_min / 1000).toFixed(0)}k–${(venue.price_max / 1000).toFixed(0)}k`;
  if (venue.price_range === '$') return '25k–90k';
  if (venue.price_range === '$$$') return '180k+';
  return '70k–180k';
};

/** Find the nearest open venue from a given location */
const findNearestOpen = (userLoc, timeStr, excludeIds = []) => {
  const candidates = VENUES
    .filter((v) => !excludeIds.includes(v.id))
    .filter((v) => isVenueOpen(v, timeStr))
    .map((v) => ({ ...v, distanceKm: calculateDistance(userLoc, v.coord) / 1000 }))
    .filter((v) => v.distanceKm <= MAX_RADIUS_KM)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  // If nothing inside radius, fallback to closest of all open venues
  if (candidates.length === 0) {
    return VENUES
      .filter((v) => !excludeIds.includes(v.id) && isVenueOpen(v, timeStr))
      .map((v) => ({ ...v, distanceKm: calculateDistance(userLoc, v.coord) / 1000 }))
      .sort((a, b) => a.distanceKm - b.distanceKm)[0] || null;
  }

  return candidates[0];
};

// ─── GPS state machine ────────────────────────────────────────────────────────
// idle → loading → ready | error

const Hero = () => {
  const [currentTime, setCurrentTime] = useState(getTimeString);
  const [gpsState, setGpsState] = useState('idle'); // idle | loading | ready | error
  const [userLoc, setUserLoc] = useState(DEFAULT_LOC);
  const [suggestion, setSuggestion] = useState(null);
  const [shownIds, setShownIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { logVisit } = useVisitHistory();

  useEffect(() => {
    const id = setInterval(() => setCurrentTime(getTimeString()), 30_000);
    return () => clearInterval(id);
  }, []);

  const resolveGPS = useCallback(() => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) { resolve(DEFAULT_LOC); return; }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve([pos.coords.latitude, pos.coords.longitude]),
        () => resolve(DEFAULT_LOC),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  }, []);

  const handleHungry = useCallback(async () => {
    setGpsState('loading');
    setShowModal(true);
    setSuggestion(null);
    setShownIds([]);

    const loc = await resolveGPS();
    setUserLoc(loc);

    const timeStr = getTimeString();
    const pick = findNearestOpen(loc, timeStr);
    setSuggestion(pick);
    setShownIds(pick ? [pick.id] : []);
    setGpsState(pick ? 'ready' : 'error');
  }, [resolveGPS]);

  const handleShuffle = useCallback(async () => {
    const timeStr = getTimeString();
    const pick = findNearestOpen(userLoc, timeStr, shownIds);
    if (!pick) return;
    setSuggestion(pick);
    setShownIds((prev) => [...prev, pick.id]);
  }, [userLoc, shownIds]);

  const handleClose = () => {
    setShowModal(false);
    setGpsState('idle');
    setSuggestion(null);
  };

  const handleGoNow = () => {
    if (suggestion) logVisit(suggestion.id);
    handleClose();
  };

  const isGPSDefault = userLoc[0] === DEFAULT_LOC[0] && userLoc[1] === DEFAULT_LOC[1];

  return (
    <section className="relative pt-12 pb-32 px-6 overflow-hidden">
      {/* Decorative dashed lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute left-1/4 top-0 bottom-0 w-[1px] border-l border-dashed border-clay-black"></div>
        <div className="absolute left-3/4 top-0 bottom-0 w-[1px] border-l border-dashed border-clay-black"></div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-block px-3 py-1 mb-8 rounded-badge bg-badge-bluebg text-badge-bluetext font-semibold text-[11px] uppercase tracking-wide-label border border-blue-200">
          Live: HCMC Smart Food Assistant
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-display-tight leading-display mb-12">
          {getTimeSensitiveGreeting(currentTime)}
        </h1>

        {/* Action Hub */}
        <div className="bg-clay-white rounded-feature p-8 md:p-12 shadow-2xl border-4 border-clay-black relative max-w-2xl mx-auto mb-16 group hover:translate-y-[-4px] transition-transform duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div className="text-left">
              <label className="text-[10px] font-bold uppercase tracking-wide-label text-warm-silver mb-3 block">
                Mấy giờ rồi?
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-clay-black" size={20} />
                <input
                  type="time"
                  value={currentTime}
                  onChange={(e) => setCurrentTime(e.target.value)}
                  className="w-full bg-oat-light border-2 border-clay-black rounded-card py-4 pl-12 pr-4 font-bold text-xl focus:outline-none focus:ring-4 focus:ring-matcha-600/20"
                />
              </div>
            </div>

            <div className="text-left">
              <label className="text-[10px] font-bold uppercase tracking-wide-label text-warm-silver mb-3 block">
                Vị trí
              </label>
              <div className="flex items-center gap-3 px-4 py-4 bg-oat-light border-2 border-clay-black rounded-card font-bold text-base">
                <MapPin size={20} className="text-matcha-600 flex-shrink-0" />
                <span className="truncate text-clay-black">
                  {isGPSDefault ? 'Nhấn nút để xác định' : 'Đã lấy vị trí GPS ✓'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <Button
              id="hungry-btn"
              onClick={handleHungry}
              className="w-full py-6 text-xl bg-pomegranate-400 text-clay-black shadow-clay hover:bg-pomegranate-600 scale-105"
            >
              <Sparkles className="mr-2" /> Tôi đang đói, gợi ý đi!
            </Button>
            <p className="text-xs text-warm-silver mt-3 font-medium">
              App sẽ xin GPS để tìm quán gần nhất đang mở cửa
            </p>
          </div>
        </div>

        <p className="text-lg text-warm-charcoal max-w-xl mx-auto mb-4 italic opacity-60">
          "The best way to experience Saigon is through its stomach, according to your time."
        </p>
      </div>

      {/* ── GPS Recommendation Modal ───────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-clay-black/60 backdrop-blur-md" onClick={handleClose} />
          <div className="bg-warm-cream w-full max-w-md rounded-feature p-10 relative z-10 border-4 border-clay-black shadow-2xl animate-slide-up">
            <button
              onClick={handleClose}
              className="absolute right-6 top-6 text-warm-silver hover:text-clay-black transition-colors"
            >
              <X size={28} />
            </button>

            {/* Loading state */}
            {gpsState === 'loading' && (
              <div className="text-center py-8">
                <Loader2 size={48} className="text-matcha-600 animate-spin mx-auto mb-4" />
                <h2 className="text-xl font-bold text-clay-black mb-2">Đang xác định vị trí...</h2>
                <p className="text-warm-silver text-sm">Tìm quán gần nhất đang mở cửa</p>
              </div>
            )}

            {/* Error state */}
            {gpsState === 'error' && (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">😅</div>
                <h2 className="text-xl font-bold text-clay-black mb-2">Không tìm được quán phù hợp</h2>
                <p className="text-warm-silver text-sm mb-6">Thử lại sau hoặc vào Map để khám phá thêm</p>
                <Button onClick={handleClose} className="w-full bg-clay-black text-clay-white shadow-clay">
                  Đóng
                </Button>
              </div>
            )}

            {/* Ready state */}
            {gpsState === 'ready' && suggestion && (
              <div className="animate-fade-in">
                {/* Header badge */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-matcha-600 text-clay-white rounded-pill text-[10px] font-bold uppercase tracking-widest mb-1">
                    <Navigation size={12} /> Gần nhất đang mở
                  </div>
                </div>

                {/* Venue name */}
                <h2 className="text-3xl font-bold text-clay-black mb-1 tracking-display-tight text-center">
                  {suggestion.name}
                </h2>
                <p className="text-warm-charcoal text-center text-sm mb-6 leading-relaxed line-clamp-2">
                  {suggestion.summary}
                </p>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-oat-light rounded-card p-3 text-center">
                    <Navigation size={16} className="mx-auto mb-1 text-matcha-600" />
                    <div className="text-sm font-bold text-clay-black">{suggestion.distanceKm.toFixed(1)}km</div>
                    <div className="text-[10px] text-warm-silver">Khoảng cách</div>
                  </div>
                  <div className="bg-oat-light rounded-card p-3 text-center">
                    <Wallet size={16} className="mx-auto mb-1 text-lemon-600" />
                    <div className="text-sm font-bold text-clay-black">{getPriceDisplay(suggestion)}</div>
                    <div className="text-[10px] text-warm-silver">Mỗi người</div>
                  </div>
                  <div className="bg-matcha-50 rounded-card p-3 text-center border border-matcha-200">
                    <div className="text-lg mb-0.5">✅</div>
                    <div className="text-sm font-bold text-matcha-700">Đang mở</div>
                    <div className="text-[10px] text-matcha-600">{suggestion.open_at}–{suggestion.close_at}</div>
                  </div>
                </div>

                {/* Context tags */}
                <div className="flex flex-wrap gap-2 mb-6 justify-center">
                  <span className="px-3 py-1 bg-oat-light rounded-pill text-[11px] font-bold text-warm-charcoal">
                    {suggestion.category}
                  </span>
                  <span className="px-3 py-1 bg-oat-light rounded-pill text-[11px] font-bold text-warm-charcoal">
                    <MapPin size={10} className="inline mr-1" />{suggestion.district}
                  </span>
                  <span className="px-3 py-1 bg-lemon-400/20 rounded-pill text-[11px] font-bold text-lemon-800">
                    ★ {suggestion.review_score}
                  </span>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-3">
                  <Button
                    id="go-now-btn"
                    onClick={handleGoNow}
                    className="w-full py-4 text-lg shadow-clay flex items-center justify-center gap-2 bg-matcha-600 text-clay-white hover:bg-matcha-700"
                  >
                    Đi ngay! <ChevronRight size={18} />
                  </Button>
                  <button
                    id="shuffle-btn"
                    onClick={handleShuffle}
                    className="flex items-center justify-center gap-2 text-sm font-bold text-warm-silver hover:text-clay-black transition-colors py-2"
                  >
                    <RefreshCw size={14} /> Không hợp, thử quán khác
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
