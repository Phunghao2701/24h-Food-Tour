import React, { useState, useMemo } from 'react';
import { Trophy, QrCode, Grid, List, CheckCircle, Lock, Award, X, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';
import { QRCodeSVG } from 'qrcode.react';
import { useVisitHistory } from '../utils/useVisitHistory';
import { VENUES } from '../utils/mockData';
import { useNavigate } from 'react-router-dom';

// Stamp definitions: each maps to a real venue category or ID
// If a venue in visit history matches the condition, the stamp unlocks
const STAMP_DEFINITIONS = [
  { id: 'pho',     name: 'Phở Explorer',   icon: '🍜', condition: (v) => /phở|pho/i.test(v.name + ' ' + v.summary), place: 'Các quán Phở' },
  { id: 'cafe',    name: 'Cafe Hopper',     icon: '☕', condition: (v) => /cafe|coffee|cà phê|vợt/i.test(v.name + ' ' + v.summary), place: 'Quán cà phê' },
  { id: 'comtam',  name: 'Cơm Tấm Fan',    icon: '🍛', condition: (v) => /cơm tấm|com tam/i.test(v.name + ' ' + v.summary), place: 'Quán cơm tấm' },
  { id: 'street',  name: 'Street Food Pro', icon: '🥢', condition: (v) => v.category === 'Street Food', place: 'Chợ đêm & vỉa hè' },
  { id: 'hidden',  name: 'Hidden Gem',      icon: '💎', condition: (v) => v.is_hidden_gem === true, place: 'Quán bí ẩn' },
  { id: 'dessert', name: 'Sweet Tooth',     icon: '🍡', condition: (v) => /bánh|tráng miệng|dessert|che|chè/i.test(v.name + ' ' + v.summary), place: 'Bánh & tráng miệng' },
];

const Passport = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();
  const { visitedVenueIds, logVisit, clearHistory } = useVisitHistory();

  // Resolve visited venues from IDs
  const visitedVenues = useMemo(
    () => VENUES.filter((v) => visitedVenueIds.includes(v.id)),
    [visitedVenueIds]
  );

  // Compute which stamps are unlocked
  const stamps = useMemo(() =>
    STAMP_DEFINITIONS.map((def) => {
      const unlockedVenue = visitedVenues.find(def.condition);
      return {
        ...def,
        unlocked: !!unlockedVenue,
        date: unlockedVenue
          ? new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })
          : null,
      };
    }),
  [visitedVenues]);

  const unlockedCount = stamps.filter((s) => s.unlocked).length;
  const totalGoal = stamps.length;

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setScanSuccess(true);
    }, 2000);
  };

  const handleConfirmScan = () => {
    // Simulate scanning a random unvisited venue
    const unvisited = VENUES.filter((v) => !visitedVenueIds.includes(v.id));
    if (unvisited.length > 0) {
      const pick = unvisited[Math.floor(Math.random() * unvisited.length)];
      logVisit(pick.id);
    }
    setScanSuccess(true);
  };

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto font-sans animate-fade-in">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-display-tight mb-2">Food Passport</h1>
          <p className="text-warm-silver">Your culinary journey, documented in stamps.</p>
        </div>
        <div className="flex -space-x-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-warm-cream bg-oat-light flex items-center justify-center font-bold text-xs shadow-clay">
              U{i}
            </div>
          ))}
          <div className="w-10 h-10 rounded-full border-2 border-warm-cream bg-clay-black text-clay-white flex items-center justify-center font-bold text-xs shadow-clay">
            +12
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Statistics & Scan */}
        <div className="space-y-8">
          <div className="bg-clay-black text-clay-white rounded-feature p-8 shadow-clay relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-wide-label text-slushie-500 mb-2">
                {unlockedCount === 0 ? 'Chưa có stamp!' : unlockedCount >= totalGoal ? 'Master Foodie! 🎉' : 'Đang khám phá'}
              </p>
              <div className="text-5xl font-bold mb-1">
                {unlockedCount}{' '}
                <span className="text-xl font-normal opacity-60">/ {totalGoal} Stamps</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full mb-4 mt-3 overflow-hidden">
                <div
                  className="h-full bg-slushie-500 transition-all duration-700 rounded-full"
                  style={{ width: `${(unlockedCount / totalGoal) * 100}%` }}
                />
              </div>
              {unlockedCount < totalGoal ? (
                <p className="text-sm opacity-70 mb-8 max-w-[200px]">
                  {totalGoal - unlockedCount} stamp nữa để mở tất cả thành tích!
                </p>
              ) : (
                <p className="text-sm opacity-70 mb-8">Bạn đã khám phá mọi loại ẩm thực! 🏆</p>
              )}
              <Button
                onClick={() => setIsScanning(true)}
                className="w-full bg-slushie-500 text-clay-black gap-2 hover:bg-slushie-300 transition-transform active:scale-95"
              >
                <QrCode size={18} /> Scan Point
              </Button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-slushie-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          </div>

          {/* Challenges */}
          <div className="bg-clay-white border border-oat-border rounded-feature p-8 shadow-clay">
            <h3 className="text-sm font-bold uppercase tracking-wide-label mb-6 flex items-center gap-2">
              <Trophy size={16} /> Challenges
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm">Thực Thần (24h)</span>
                  <span className="text-[10px] font-bold text-matcha-600">{visitedVenueIds.length}/5</span>
                </div>
                <div className="h-1.5 bg-oat-light rounded-full overflow-hidden">
                  <div
                    className="h-full bg-matcha-600 transition-all duration-1000"
                    style={{ width: `${Math.min(100, (visitedVenueIds.length / 5) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="opacity-50 flex items-center gap-4">
                <div className="w-10 h-10 rounded-card bg-oat-light flex items-center justify-center">
                  <Lock size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Spicy Marathon</h4>
                  <p className="text-[10px] uppercase font-bold tracking-wide-label">Unlock with 5 Hot Spots</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visit History */}
          {visitedVenues.length > 0 && (
            <div className="bg-clay-white border border-oat-border rounded-feature p-6 shadow-clay">
              <h3 className="text-sm font-bold uppercase tracking-wide-label mb-4 flex items-center gap-2">
                <MapPin size={14} /> Đã ghé ({visitedVenues.length})
              </h3>
              <div className="space-y-2">
                {visitedVenues.slice(0, 4).map((v) => (
                  <div key={v.id} className="flex items-center gap-2 text-xs">
                    <CheckCircle size={12} className="text-matcha-600 flex-shrink-0" />
                    <span className="font-bold text-clay-black truncate">{v.name}</span>
                    <span className="text-warm-silver ml-auto flex-shrink-0">{v.district}</span>
                  </div>
                ))}
                {visitedVenues.length > 4 && (
                  <p className="text-[10px] text-warm-silver">+{visitedVenues.length - 4} quán nữa...</p>
                )}
              </div>
            </div>
          )}

          {/* Empty state CTA */}
          {visitedVenueIds.length === 0 && (
            <div className="border-2 border-dashed border-oat-border rounded-feature p-6 text-center">
              <p className="text-2xl mb-2">🍜</p>
              <p className="text-sm font-bold text-clay-black mb-1">Chưa ghé quán nào</p>
              <p className="text-xs text-warm-silver mb-4">Bấm "Tôi đang đói" để bắt đầu hành trình!</p>
              <button
                onClick={() => navigate('/')}
                className="text-xs font-bold text-matcha-600 hover:text-matcha-700 underline"
              >
                Về trang chủ
              </button>
            </div>
          )}
        </div>

        {/* Stamps Grid */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Stamp Collection</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-standard active:scale-90 transition-transform shadow-clay ${viewMode === 'grid' ? 'bg-clay-black text-clay-white' : 'bg-oat-light text-warm-charcoal'}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-standard active:scale-90 transition-transform ${viewMode === 'list' ? 'bg-clay-black text-clay-white shadow-clay' : 'bg-oat-light text-warm-charcoal'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
            {stamps.map((stamp) => (
              viewMode === 'grid' ? (
                <div
                  key={stamp.id}
                  className={`aspect-square rounded-feature flex flex-col items-center justify-center p-6 border-2 relative transition-all duration-300 hover:-translate-y-1 ${
                    stamp.unlocked
                      ? 'bg-clay-white border-matcha-600 shadow-clay'
                      : 'bg-oat-light/30 border-dashed border-oat-border opacity-60'
                  }`}
                >
                  {stamp.unlocked ? (
                    <>
                      <div className="text-4xl mb-4">{stamp.icon}</div>
                      <h4 className="font-bold text-sm mb-1 text-center">{stamp.name}</h4>
                      <span className="text-[9px] font-bold uppercase tracking-wide-label text-warm-silver">{stamp.date}</span>
                      <div className="absolute top-3 right-3 text-matcha-600">
                        <CheckCircle size={16} fill="currentColor" className="text-clay-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full border-2 border-oat-border flex items-center justify-center mb-4">
                        <Lock size={20} className="text-oat-border" />
                      </div>
                      <h4 className="font-bold text-xs text-warm-silver text-center">{stamp.name}</h4>
                      <p className="text-[9px] text-warm-silver mt-1 text-center opacity-70">{stamp.place}</p>
                    </>
                  )}
                </div>
              ) : (
                <div
                  key={stamp.id}
                  className={`flex items-center gap-4 p-4 rounded-feature border-2 transition-all ${
                    stamp.unlocked ? 'bg-clay-white border-matcha-600 shadow-clay' : 'bg-oat-light/30 border-dashed border-oat-border opacity-60'
                  }`}
                >
                  <div className="text-3xl">{stamp.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{stamp.name}</h4>
                    <p className="text-xs text-warm-silver">{stamp.place}</p>
                  </div>
                  {stamp.unlocked ? (
                    <div>
                      <CheckCircle size={20} className="text-matcha-600" />
                    </div>
                  ) : (
                    <Lock size={16} className="text-oat-border" />
                  )}
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Scanning Modal */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] bg-clay-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in shadow-2xl">
          <div className="bg-warm-cream w-full max-w-sm rounded-feature p-12 text-center relative overflow-hidden border border-oat-border shadow-clay animate-slide-up">
            <button
              onClick={() => { setIsScanning(false); setScanSuccess(false); }}
              className="absolute right-6 top-6 text-warm-silver hover:text-clay-black transition-colors"
            >
              <X size={24} />
            </button>

            {!scanSuccess ? (
              <>
                <h2 className="text-2xl font-bold mb-8 tracking-display-tight">Quét mã tại quán</h2>
                <div className="w-56 h-56 mx-auto bg-clay-white rounded-card p-4 shadow-clay flex items-center justify-center relative border border-oat-border mb-8 overflow-hidden">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-matcha-600" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-matcha-600" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-matcha-600" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-matcha-600" />
                  <QRCodeSVG value="https://24h-food-tour.app/scan" size={160} />
                  <div className="absolute left-0 right-0 h-0.5 bg-matcha-600 shadow-glow pointer-events-none animate-scanning-line z-20" />
                </div>
                <p className="text-warm-charcoal font-medium text-sm mb-8 italic">Đến quán và quét mã QR tại bàn...</p>
                <Button onClick={handleConfirmScan} className="w-full bg-clay-black text-clay-white shadow-clay">
                  Xác nhận (Demo)
                </Button>
              </>
            ) : (
              <div className="animate-fade-in">
                <div className="w-20 h-20 bg-matcha-600 rounded-full flex items-center justify-center mx-auto mb-6 text-clay-white shadow-clay scale-110">
                  <Award size={40} />
                </div>
                <h2 className="text-3xl font-bold mb-2 tracking-display-tight">Stamp Unlocked!</h2>
                <p className="text-warm-silver mb-8">Chuyến ghé này đã được ghi vào hành trình của bạn.</p>
                <Button
                  onClick={() => { setIsScanning(false); setScanSuccess(false); }}
                  className="w-full bg-clay-black text-clay-white shadow-clay"
                >
                  Awesome!
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Passport;
