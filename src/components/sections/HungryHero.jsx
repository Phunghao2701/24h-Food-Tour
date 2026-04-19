import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Clock, Navigation, Users, Wallet, Utensils, Sparkles, Loader2, RefreshCw, ChevronRight } from 'lucide-react';
import { useConcierge } from '../../context/ConciergeContext';
import { getSmartRecommendations, isVenueOpen, calculateDistance, getTimeSensitiveGreeting } from '../../utils/engine';

const STEPS = [
  {
    id: 'people',
    title: 'Đi bao nhiêu người?',
    subtitle: 'Để chọn quán phù hợp nhóm',
    icon: <Users size={28} />,
    options: [
      { label: '1 mình', value: 1, emoji: '🧑', desc: 'Yên một góc' },
      { label: '2 người', value: 2, emoji: '👫', desc: 'Đôi bạn thân' },
      { label: '3-4 người', value: 4, emoji: '👨‍👩‍👧‍👦', desc: 'Nhóm nhỏ' },
      { label: '5+ người', value: 6, emoji: '🎉', desc: 'Bữa tiệc' },
    ],
  },
  {
    id: 'budget',
    title: 'Kinh phí mỗi người?',
    subtitle: 'Chọn mức chi tiêu thoải mái nhất',
    icon: <Wallet size={28} />,
    options: [
      { label: 'Tiết kiệm', value: '$', emoji: '💰', desc: 'Dưới 90k', priceRange: '25k - 90k' },
      { label: 'Tầm trung', value: '$$', emoji: '💵', desc: '70k - 180k', priceRange: '70k - 180k' },
      { label: 'Sang chảnh', value: '$$$', emoji: '💎', desc: 'Trên 180k', priceRange: '180k+' },
    ],
  },
  {
    id: 'distance',
    title: 'Đi bao xa?',
    subtitle: 'Tính từ vị trí hiện tại của bạn',
    icon: <Navigation size={28} />,
    options: [
      { label: 'Gần xịt', value: 2, emoji: '🚶', desc: 'Dưới 2km' },
      { label: 'Vừa tầm', value: 5, emoji: '🛵', desc: 'Dưới 5km' },
      { label: 'Xa cũng được', value: 10, emoji: '🚗', desc: 'Dưới 10km' },
    ],
  },
  {
    id: 'kind',
    title: 'Thèm gì?',
    subtitle: 'Món ăn hay nước uống?',
    icon: <Utensils size={28} />,
    options: [
      { label: 'Đồ ăn', value: 'Đồ ăn', emoji: '🍜', desc: 'Ăn no bụng' },
      { label: 'Nước uống', value: 'Nước uống', emoji: '☕', desc: 'Giải khát' },
      { label: 'Gì cũng được', value: 'All', emoji: '✨', desc: 'Ngẫu hứng' },
    ],
  },
];

const getTimeString = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const HungryHero = ({ onComplete }) => {
  const { searchProfile, updateSearchProfile, seedProactivePlan } = useConcierge();

  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({});
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(getTimeString);
  const [userLoc, setUserLoc] = useState(searchProfile.userLoc || [10.8411, 106.81]);
  const [locError, setLocError] = useState(null);

  useEffect(() => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const loc = [pos.coords.latitude, pos.coords.longitude];
            setUserLoc(loc);
            setLocError(null);
            updateSearchProfile({ userLoc: loc, locationReady: true, locationLabel: 'Vị trí hiện tại' });
          },
          (err) => {
            console.warn('Geolocation failed:', err);
            setLocError('Không lấy được vị trí — đang dùng vị trí mặc định');
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      }
    } catch {
      /* silent */
    }
  }, [updateSearchProfile]);

  const handleSelect = useCallback((value) => {
    const stepId = STEPS[currentStep].id;
    const newSelections = { ...selections, [stepId]: value };
    setSelections(newSelections);

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step — trigger recommendations
      fetchRecommendations(newSelections);
    }
  }, [currentStep, selections]);

  const fetchRecommendations = useCallback((finalSelections) => {
    const timeStr = getTimeString();
    const radiusKm = finalSelections.distance || 5;
    const partySize = finalSelections.people || 2;
    const budget = finalSelections.budget || 'All';
    const venueKind = finalSelections.kind || 'All';

    setIsLoading(true);
    setResults(null);

    // Simulate small delay for UX
    setTimeout(() => {
      const picks = getSmartRecommendations({
        timeStr,
        district: 'All',
        mode: 'All',
        budget,
        userLoc,
        radiusKm,
        partySize,
        weatherMode: 'neutral',
        venueKind,
        servingStyle: 'All',
      });

      const allPicks = [picks.timeSpecial, picks.nearest, picks.hiddenGem]
        .filter(Boolean)
        .filter((v, i, arr) => arr.findIndex((x) => x.id === v.id) === i)
        .slice(0, 6);

      const withDistance = allPicks.map((v) => ({
        ...v,
        distanceKm: calculateDistance(userLoc, v.coord) / 1000,
      }));

      const plan = seedProactivePlan({
        timeStr,
        district: 'All',
        budget,
        partySize,
        radiusKm,
        userLoc,
        weatherMode: 'neutral',
      });

      setResults({ venues: withDistance, plan });
      setIsLoading(false);
      if (onComplete) onComplete(finalSelections);
    }, 800);
  }, [userLoc, seedProactivePlan, onComplete]);

  const handleReset = () => {
    setCurrentStep(0);
    setSelections({});
    setResults(null);
    setCurrentTime(getTimeString());
  };

  const step = STEPS[currentStep];

  // Results view
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
        <Loader2 size={48} className="text-matcha-600 animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-clay-black mb-2">Đang tìm quán ngon...</h2>
        <p className="text-warm-silver">Check quán mở cửa + tính khoảng cách từ vị trí của bạn</p>
      </div>
    );
  }

  if (results && results.venues.length > 0) {
    return (
      <div className="animate-fade-in">
        {/* Results Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-matcha-600 text-white rounded-pill text-sm font-bold mb-4">
            <Sparkles size={16} />
            Gợi ý cho bạn
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-display-tight text-clay-black mb-2">
            {results.venues.length} quán phù hợp
          </h2>
          <p className="text-warm-silver">
            {selections.people} người · {selections.budget === '$' ? 'Tiết kiệm' : selections.budget === '$$' ? 'Tầm trung' : 'Sang chảnh'} · {selections.distance}km
          </p>
        </div>

        {/* Top Pick */}
        {results.venues[0] && (
          <div className="max-w-2xl mx-auto mb-8">
            <VenueResultCard venue={results.venues[0]} isPrimary userLoc={userLoc} />
          </div>
        )}

        {/* More picks grid */}
        {results.venues.length > 1 && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.venues.slice(1).map((venue) => (
              <VenueResultCard key={venue.id} venue={venue} userLoc={userLoc} />
            ))}
          </div>
        )}

        {/* Reset */}
        <div className="text-center mt-12">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-8 py-4 bg-clay-black text-white rounded-feature shadow-clay hover:bg-matcha-600 transition-colors font-bold text-lg"
          >
            <RefreshCw size={20} /> Chưa hợp, tìm lại!
          </button>
        </div>
      </div>
    );
  }

  if (results && results.venues.length === 0) {
    return (
      <div className="text-center py-24 animate-fade-in">
        <div className="text-6xl mb-6">🤷</div>
        <h2 className="text-2xl font-bold text-clay-black mb-3">Chưa tìm được quán phù hợp</h2>
        <p className="text-warm-silver mb-8 max-w-md mx-auto">
          Thử tăng bán kính hoặc đổi món ăn/nước uống nhé!
        </p>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-8 py-4 bg-pomegranate-400 text-white rounded-feature shadow-clay hover:bg-pomegranate-600 transition-colors font-bold text-lg"
        >
          <RefreshCw size={20} /> Tìm lại
        </button>
      </div>
    );
  }

  // Quiz flow
  return (
    <div className="animate-fade-in">
      {/* Greeting */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-lemon-400/20 text-lemon-800 rounded-pill text-[11px] font-bold uppercase tracking-widest mb-6">
          <Clock size={14} /> {currentTime} · {getTimeSensitiveGreeting(currentTime)}
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-display-tight text-clay-black mb-4">
          Đang đói? Để mình lo! 🍽️
        </h1>
        <p className="text-lg text-warm-silver max-w-md mx-auto">
          Trả lời 4 câu nhanh, mình gợi ý quán ăn ngay lập tức
        </p>
      </div>

      {/* Location status */}
      <div className="max-w-lg mx-auto mb-8">
        <div className={`flex items-center gap-3 px-4 py-3 rounded-card text-sm ${locError ? 'bg-amber-50 border border-amber-200 text-amber-700' : 'bg-matcha-50 border border-matcha-200 text-matcha-700'}`}>
          <MapPin size={16} className="flex-shrink-0" />
          <span>{locError || 'Đã xác định vị trí — khoảng cách sẽ tính từ đây'}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex gap-2">
          {STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                idx <= currentStep ? 'bg-matcha-600' : 'bg-oat-border/30'
              }`}
            />
          ))}
        </div>
        <div className="text-center mt-3 text-xs font-bold text-warm-silver">
          Bước {currentStep + 1} / {STEPS.length}
        </div>
      </div>

      {/* Question */}
      <div className="max-w-2xl mx-auto text-center mb-10 animate-slide-up">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-clay-black text-white mb-5">
          {step.icon}
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-clay-black mb-2 tracking-tight">
          {step.title}
        </h2>
        <p className="text-warm-silver font-medium">{step.subtitle}</p>
      </div>

      {/* Options */}
      <div className={`grid gap-4 animate-fade-in ${STEPS[currentStep].options.length === 2 ? 'sm:grid-cols-2 max-w-xl mx-auto' : STEPS[currentStep].options.length === 3 ? 'sm:grid-cols-3 max-w-2xl mx-auto' : 'sm:grid-cols-2 md:grid-cols-4 max-w-3xl mx-auto'}`}>
        {step.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className="flex flex-col items-center justify-center p-6 bg-clay-white border-2 border-oat-border rounded-feature hover:border-matcha-600 hover:bg-matcha-50 hover-clay-jump transition-all group"
          >
            <span className="text-4xl mb-3">{opt.emoji}</span>
            <span className="font-bold text-lg text-clay-black group-hover:text-matcha-700">{opt.label}</span>
            <span className="text-xs text-warm-silver mt-1">{opt.desc}</span>
            {opt.priceRange && (
              <span className="text-[10px] font-bold text-matcha-600 mt-1 px-2 py-0.5 bg-matcha-50 rounded-pill">{opt.priceRange}</span>
            )}
          </button>
        ))}
      </div>

      {/* Back */}
      {currentStep > 0 && (
        <div className="text-center mt-10">
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="text-warm-silver hover:text-clay-black font-bold transition-colors flex items-center gap-1 mx-auto"
          >
            ← Quay lại
          </button>
        </div>
      )}
    </div>
  );
};

const VenueResultCard = ({ venue, isPrimary, userLoc }) => {
  const now = getTimeString();
  const open = isVenueOpen(venue, now);
  const dist = venue.distanceKm ? venue.distanceKm : (calculateDistance(userLoc, venue.coord) / 1000);

  const budgetEmoji = venue.price_range === '$' ? '💰' : venue.price_range === '$$' ? '💵' : '💎';

  const priceDisplay = venue.price_min && venue.price_max
    ? `${(venue.price_min / 1000).toFixed(0)}k - ${(venue.price_max / 1000).toFixed(0)}đ`
    : venue.price_range === '$' ? '25k - 90k'
    : venue.price_range === '$$$' ? '180k+'
    : '70k - 180k';

  return (
    <div
      className={`rounded-feature border shadow-clay transition-all hover-clay-jump cursor-pointer bg-clay-white overflow-hidden ${
        isPrimary
          ? 'border-matcha-600 ring-2 ring-matcha-600/20'
          : 'border-oat-border'
      }`}
    >
      {/* Color top bar */}
      <div className={`h-2 ${isPrimary ? 'bg-matcha-600' : 'bg-oat-border/40'}`} />

      <div className="p-6">
        {/* Badges row */}
        <div className="flex flex-wrap gap-2 mb-4">
          {isPrimary && (
            <span className="px-3 py-1 bg-matcha-600 text-white rounded-pill text-[10px] font-bold uppercase tracking-widest">
              ⭐ Phù hợp nhất
            </span>
          )}
          <span className={`px-3 py-1 rounded-pill text-[11px] font-bold ${
            open ? 'bg-matcha-50 text-matcha-700' : 'bg-pomegranate-50 text-pomegranate-600'
          }`}>
            {open ? '✅ Đang mở' : '❌ Đã đóng'}
          </span>
          <span className="px-3 py-1 bg-oat-light rounded-pill text-[11px] font-bold text-warm-charcoal">
            {venue.category}
          </span>
        </div>

        {/* Name & Description */}
        <h3 className="text-xl font-bold text-clay-black mb-2">{venue.name}</h3>
        <p className="text-sm text-warm-charcoal leading-relaxed mb-5 line-clamp-2">{venue.summary}</p>

        {/* Info row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-oat-light rounded-card">
            <Navigation size={16} className="mx-auto mb-1 text-matcha-600" />
            <div className="text-[11px] font-bold text-warm-charcoal">{dist.toFixed(1)}km</div>
            <div className="text-[9px] text-warm-silver">Khoảng cách</div>
          </div>
          <div className="text-center p-3 bg-oat-light rounded-card">
            <Wallet size={16} className="mx-auto mb-1 text-lemon-600" />
            <div className="text-[11px] font-bold text-warm-charcoal">{priceDisplay}</div>
            <div className="text-[9px] text-warm-silver">Mỗi người</div>
          </div>
          <div className="text-center p-3 bg-oat-light rounded-card">
            <Users size={16} className="mx-auto mb-1 text-pomegranate-400" />
            <div className="text-[11px] font-bold text-warm-charcoal">{venue.review_score}★</div>
            <div className="text-[9px] text-warm-silver">Đánh giá</div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-oat-border">
          <span className="text-xs font-bold text-warm-silver flex items-center gap-1">
            <MapPin size={12} /> {venue.district}
          </span>
          <span className="text-sm text-matcha-600 font-bold flex items-center gap-1 group-hover:text-matcha-700">
            Đi ngay <ChevronRight size={16} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default HungryHero;
