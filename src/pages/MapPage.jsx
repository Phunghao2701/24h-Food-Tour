import React, { useEffect, useMemo, useState } from 'react';
import { Info, MapPin, Navigation, Search, Smartphone, Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import SafeImage from '../components/ui/SafeImage';
import { useConcierge } from '../context/ConciergeContext';
import { isVenueOpen, calculateDistance } from '../utils/engine';
import { VENUES } from '../utils/mockData';

const getCurrentTimeLabel = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const markerPosition = (index, venueId) => {
  const lane = index % 3;
  const row = Math.floor(index / 3);
  const x = 16 + lane * 24 + (venueId % 2 === 0 ? 6 : 0);
  const y = 20 + row * 16 + (venueId % 3) * 3;

  return {
    left: `${Math.min(x, 86)}%`,
    top: `${Math.min(y, 78)}%`,
  };
};

const MapPage = () => {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpenNowOnly, setIsOpenNowOnly] = useState(false);
  const [currentTime] = useState(() => getCurrentTimeLabel());

  const {
    activeVenueId,
    botDraft,
    focusConfig,
    focusVenue,
    highlightedVenueIds,
    mapNarrative,
    searchProfile,
  } = useConcierge();

  const filteredVenues = useMemo(
    () =>
      VENUES.filter((venue) => {
        const isCategoryMatch = filter === 'All' || venue.category === filter;
        const isTimeMatch = !isOpenNowOnly || isVenueOpen(venue, currentTime);
        const isSearchMatch =
          venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          venue.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          venue.district.toLowerCase().includes(searchQuery.toLowerCase());
        const isRadiusMatch =
          !searchProfile.radiusKm ||
          calculateDistance(venue.coord, searchProfile.userLoc) <= searchProfile.radiusKm * 1000;

        return isCategoryMatch && isTimeMatch && isSearchMatch && isRadiusMatch;
      }),
    [currentTime, filter, isOpenNowOnly, searchProfile.radiusKm, searchProfile.userLoc, searchQuery]
  );

  const selectedVenue =
    filteredVenues.find((venue) => venue.id === activeVenueId) ||
    VENUES.find((venue) => venue.id === activeVenueId) ||
    null;

  useEffect(() => {
    if (!selectedVenue && activeVenueId) {
      const fallbackVenue = VENUES.find((venue) => venue.id === activeVenueId);
      if (fallbackVenue) {
        focusVenue(fallbackVenue, {
          source: 'map-filter',
          headline: fallbackVenue.name,
          body: fallbackVenue.summary,
        });
      }
    }
  }, [activeVenueId, focusVenue, selectedVenue]);

  const handleVenueSelect = (venue, source = 'map') => {
    focusVenue(venue, {
      source,
      headline: venue.name,
      body: `${venue.summary} Open ${venue.open_at} - ${venue.close_at}.`,
    });
  };

  const activeHighlights = highlightedVenueIds.length
    ? highlightedVenueIds
    : selectedVenue
      ? [selectedVenue.id]
      : [];

  return (
    <div
      className={`flex h-[calc(100vh-81px)] flex-col overflow-hidden transition-all duration-700 lg:h-screen lg:flex-row ${focusConfig.blur ? 'pointer-events-none blur-[4px]' : ''}`}
      style={{ opacity: focusConfig.opacity }}
    >
      <div className="z-20 flex w-full flex-col border-r border-oat-border bg-warm-cream shadow-xl lg:w-96">
        <div className="border-b border-oat-border p-6">
          <h1 className="mb-4 text-2xl font-bold tracking-display-tight">Smart Map</h1>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-silver" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, district, or vibe..."
              className="w-full rounded-card border border-oat-border bg-clay-white py-2 pl-10 pr-4 text-sm focus:border-matcha-600 focus:outline-none"
            />
          </div>
          <div className="mb-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['All', 'Hidden Gem', 'Fine Dining', 'Street Food'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`flex-shrink-0 rounded-pill border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide-label transition-all ${
                  filter === cat
                    ? 'border-clay-black bg-clay-black text-clay-white shadow-clay'
                    : 'border-oat-border bg-clay-white text-warm-charcoal hover:bg-oat-light'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpenNowOnly((prev) => !prev)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-card border-2 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                isOpenNowOnly
                  ? 'border-matcha-600 bg-matcha-100 text-matcha-800'
                  : 'border-oat-border bg-clay-white text-warm-silver'
              }`}
            >
              <div className={`h-2 w-2 rounded-full ${isOpenNowOnly ? 'animate-pulse bg-matcha-600' : 'bg-warm-silver'}`} />
              Open Now
            </button>
          </div>
        </div>

        <div className="border-b border-oat-border bg-clay-white/70 px-4 py-4">
          <div className="rounded-feature border border-matcha-200 bg-gradient-to-br from-matcha-50 via-clay-white to-slushie-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-matcha-700">Bot to Map sync</p>
            <p className="mt-2 text-sm font-bold text-warm-charcoal">
              {selectedVenue
                ? `${selectedVenue.name} đang là điểm mà Chú Ổi ưu tiên.`
                : 'Chú Ổi sẽ ghim quán trên map ngay khi nhận ra ý định của bạn.'}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-warm-silver">
              {mapNarrative?.body || botDraft?.cta || 'Thử nhận một gợi ý từ bot hoặc bấm vào marker để bắt đầu một cuộc dẫn đường.'}
            </p>
            <p className="mt-2 text-[11px] font-bold text-matcha-700">
              {searchProfile.radiusKm
                ? `Đang lọc theo bán kính ${searchProfile.radiusKm}km quanh ${searchProfile.locationReady ? 'vị trí của bạn' : 'vị trí tạm thời'}.`
                : 'Chú Ổi đang chờ bạn chọn bán kính 3km, 5km hoặc 10km.'}
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          <div className="flex items-center justify-between px-2">
            <p className="text-[10px] font-bold uppercase tracking-wide-label text-warm-silver">
              Điểm gần bạn ({filteredVenues.length})
            </p>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-[10px] font-bold text-matcha-600 hover:underline">
                Clear Search
              </button>
            )}
          </div>

          {filteredVenues.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-oat-light">
                <Search size={24} className="text-warm-silver" />
              </div>
              <p className="text-sm font-bold text-warm-charcoal">Không tìm thấy quán phù hợp</p>
              <p className="text-xs text-warm-silver">Thử nới bộ lọc hoặc đổi từ khóa tìm kiếm nhé.</p>
            </div>
          ) : (
            filteredVenues.map((venue) => {
              const distance = calculateDistance(venue.coord, searchProfile.userLoc);
              const isActive = selectedVenue?.id === venue.id;
              const isHighlighted = activeHighlights.includes(venue.id);

              return (
                <div
                  key={venue.id}
                  onClick={() => handleVenueSelect(venue)}
                  className={`cursor-pointer rounded-card border p-4 transition-all duration-300 ${
                    isActive
                      ? 'scale-[1.02] border-matcha-600 bg-clay-white shadow-clay'
                      : isHighlighted
                        ? 'border-slushie-500 bg-slushie-50 shadow-sm'
                        : 'border-oat-border bg-clay-white hover:border-warm-silver hover:shadow-sm'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-card border border-oat-border bg-oat-light">
                      <SafeImage src={venue.image_url} alt={venue.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <h3 className="truncate text-sm font-bold">{venue.name}</h3>
                        <span className="rounded-badge bg-matcha-300 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-tight text-matcha-800">
                          {venue.category}
                        </span>
                      </div>
                      <p className="mb-2 line-clamp-1 text-[11px] leading-tight text-warm-silver">{venue.summary}</p>
                      <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wide-label">
                        <span className="flex items-center gap-1 text-matcha-600">
                          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-matcha-600" />
                          {isHighlighted ? 'Bot đồng bộ' : 'Đang mở'}
                        </span>
                        <span className="text-warm-charcoal">
                          {distance < 1000 ? `${Math.round(distance)}m` : `${(distance / 1000).toFixed(1)}km`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="relative m-6 flex-1 overflow-hidden rounded-feature border-4 border-clay-black bg-[#e5e7eb] shadow-[inset_0_4px_12px_rgba(0,0,0,0.1)]">
        <div className="absolute inset-0 opacity-40">
          <div
            className="absolute inset-0"
            style={{ backgroundImage: 'radial-gradient(#dad4c8 1px, transparent 1px)', backgroundSize: '40px 40px' }}
          />
          <div className="absolute left-0 right-0 top-1/3 h-4 rotate-[-1deg] bg-oat-border/50 shadow-sm" />
          <div className="absolute bottom-0 top-0 left-1/4 w-4 rotate-[2deg] bg-oat-border/50 shadow-sm" />
          <div className="absolute left-0 right-0 top-2/3 h-8 rotate-[0.5deg] bg-oat-border/30 shadow-sm" />
          <div className="absolute bottom-1/4 top-1/4 right-1/3 w-2 rotate-[-15deg] bg-oat-border/40" />
        </div>

        <div className="absolute left-6 top-6 z-30 max-w-sm rounded-feature border border-clay-black bg-clay-white/90 p-4 shadow-clay backdrop-blur">
          <p className="text-[10px] font-bold uppercase tracking-widest text-matcha-700">Live handoff</p>
          <h2 className="mt-2 text-lg font-bold text-warm-charcoal">
            {selectedVenue ? `Chú Ổi đang dẫn bạn tới ${selectedVenue.name}` : 'Bot đang chờ bước tiếp theo'}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-warm-silver">
            {selectedVenue
              ? `${selectedVenue.summary} Marker này đang được ưu tiên trên bản đồ và card chi tiết đã mở sẵn.`
              : 'Khi bot nhắc tới một quán cụ thể, marker và card bên dưới sẽ tự động đồng bộ.'}
          </p>
        </div>

        {filteredVenues.map((venue, index) => {
          const isActive = selectedVenue?.id === venue.id;
          const isHighlighted = activeHighlights.includes(venue.id);
          const position = markerPosition(index, venue.id);

          return (
            <div
              key={venue.id}
              onClick={() => handleVenueSelect(venue)}
              className={`group absolute cursor-pointer transition-all duration-300 hover:scale-110 ${isActive ? 'z-20' : 'z-10'} animate-fade-in`}
              style={position}
            >
              <div className="relative flex flex-col items-center">
                {isHighlighted && (
                  <div className="absolute -inset-3 animate-ping rounded-full bg-matcha-300/60" />
                )}
                <div
                  className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-clay-white shadow-clay transition-colors duration-300 ${
                    isActive ? 'bg-matcha-600' : isHighlighted ? 'bg-slushie-600' : 'bg-clay-black group-hover:bg-matcha-600'
                  }`}
                >
                  <MapPin size={18} className="text-clay-white" />
                </div>
                {(isActive || isHighlighted) && (
                  <div className="absolute -top-12 rounded-card bg-clay-black px-3 py-1.5 text-xs font-bold whitespace-nowrap text-clay-white shadow-clay animate-slide-up">
                    {venue.name}
                    <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-clay-black" />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div className="absolute right-6 top-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2 rounded-card border border-oat-border bg-warm-cream p-2 shadow-clay">
            <button className="rounded-standard p-2 transition-colors hover:bg-oat-light">
              <Info size={20} />
            </button>
            <button className="rounded-standard p-2 transition-colors hover:bg-oat-light">
              <Navigation size={20} />
            </button>
            <button className="rounded-standard p-2 transition-colors hover:bg-oat-light">
              <Smartphone size={20} />
            </button>
          </div>
        </div>

        {selectedVenue && (
          <div className="absolute bottom-6 left-6 right-6 z-40 overflow-hidden rounded-feature border border-oat-border bg-warm-cream shadow-2xl animate-slide-up lg:left-auto lg:w-[420px]">
            <div className="relative h-48 w-full bg-oat-light">
              <SafeImage src={selectedVenue.image_url} alt={selectedVenue.name} className="h-full w-full object-cover" />
              <div className="absolute left-4 top-4 rounded-pill border border-clay-white/40 bg-clay-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-clay-white backdrop-blur">
                {mapNarrative?.source === 'bot' || mapNarrative?.source === 'proactive' ? 'Chú Ổi chọn' : 'Focus thủ công'}
              </div>
              <button
                onClick={() => handleVenueSelect(selectedVenue, 'map-refresh')}
                className="absolute right-4 top-4 rounded-full bg-clay-black/40 p-2 text-clay-white backdrop-blur-md transition-colors hover:bg-clay-black"
              >
                <Plus className="rotate-45" size={20} />
              </button>
            </div>

            <div className="p-8">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-wide-label text-matcha-600">
                Featured {selectedVenue.category}
              </span>
              <h2 className="mb-4 text-3xl font-bold">{selectedVenue.name}</h2>
              <p className="mb-4 leading-relaxed text-warm-charcoal">{selectedVenue.summary}</p>
              <p className="mb-6 rounded-card border border-matcha-200 bg-matcha-50 px-4 py-3 text-sm text-matcha-900">
                {mapNarrative?.body || botDraft?.cta || 'Quán này đang được đồng bộ với cuộc hội thoại để bạn xem và ra quyết định nhanh hơn.'}
              </p>
              <div className="flex gap-4">
                <Button variant="pill" className="flex-1 bg-matcha-600 text-clay-white shadow-clay transition-all hover:bg-matcha-800 active:scale-95">
                  Book Grab/Be
                </Button>
                <Button variant="white" className="flex-1 shadow-clay">
                  Direction
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-oat-border px-8 py-6 text-xs font-bold uppercase tracking-wide-label text-warm-silver">
              <span>Status: {selectedVenue.status}</span>
              <span>Est. {Math.max(3, Math.round(calculateDistance(selectedVenue.coord, searchProfile.userLoc) / 80))} min walk</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
