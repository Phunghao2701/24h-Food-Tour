import React, { useState, useEffect } from 'react';
import { Sparkles, X, Sparkle, Compass, MapPin, DollarSign, Star, Navigation, Zap } from 'lucide-react';
import Button from '../ui/Button';
import { useConcierge } from '../../context/ConciergeContext';
import { getSmartRecommendations, calculateDistance } from '../../utils/engine';
import { useLocation } from 'react-router-dom';

const AIConcierge = () => {
  const { isConsulting, startConsultation, endConsultation } = useConcierge();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState('welcome'); // welcome, filters, results
  const [filters, setFilters] = useState({ mode: 'All', budget: 'All' });
  const [recommendations, setRecommendations] = useState(null);

  // Auto-trigger on Map page
  useEffect(() => {
    if (location.pathname === '/map' && !isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        startConsultation();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const handleStartConsultation = () => {
    setStep('filters');
  };

  const handleFinishFilters = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    // FPT University anchor as per dynamic-routing.md
    const userLoc = [10.8411, 106.8100]; 
    const recs = getSmartRecommendations(timeStr, 'All', filters.mode, filters.budget, userLoc);
    setRecommendations(recs);
    setStep('results');
    endConsultation(); // Light up map
  };

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-clay-white p-6 rounded-feature border-2 border-clay-black shadow-clay">
               <h4 className="text-2xl font-bold mb-4 tracking-tight">Chào bạn! 🇻🇳</h4>
               <p className="text-warm-charcoal leading-relaxed mb-6">
                 Bây giờ là 3 giờ chiều, trời Sài Gòn đang khá nóng. Mình thấy gần bạn có quán <strong>Trà dâu Đông Du</strong> cực mát hoặc <strong>Bánh tráng trộn chú Viên</strong> đang mở cửa.
               </p>
               <Button onClick={handleStartConsultation} className="w-full">
                 Giúp mình chọn món!
               </Button>
            </div>
          </div>
        );

      case 'filters':
        return (
          <div className="space-y-10 animate-fade-in">
             <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-warm-silver mb-4 block">Bạn muốn ăn gì?</label>
                <div className="grid grid-cols-2 gap-4">
                   {['Snack', 'Meal'].map(m => (
                     <button
                       key={m}
                       onClick={() => setFilters({ ...filters, mode: m })}
                       className={`py-6 rounded-card border-2 font-bold transition-all ${filters.mode === m ? 'bg-matcha-600 border-clay-black text-clay-white shadow-clay' : 'bg-clay-white border-oat-border text-warm-charcoal'}`}
                     >
                       {m === 'Snack' ? 'Ăn vặt' : 'Ăn no'}
                     </button>
                   ))}
                </div>
             </div>

             <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-warm-silver mb-4 block">Ngân sách của bạn?</label>
                <div className="grid grid-cols-3 gap-3">
                   {['$', '$$', '$$$'].map(b => (
                     <button
                       key={b}
                       onClick={() => setFilters({ ...filters, budget: b })}
                       className={`py-4 rounded-card border-2 font-bold transition-all ${filters.budget === b ? 'bg-slushie-500 border-clay-black text-clay-white shadow-clay' : 'bg-clay-white border-oat-border text-warm-charcoal'}`}
                     >
                       {b}
                     </button>
                   ))}
                </div>
             </div>

             <Button onClick={handleFinishFilters} className="w-full py-6 text-lg bg-clay-black text-clay-white shadow-clay">
               Xem gợi ý của mình!
             </Button>
          </div>
        );

      case 'results':
        return (
          <div className="space-y-6 animate-fade-in">
             <div className="flex items-center gap-2 text-matcha-600 font-bold uppercase tracking-widest text-[10px] mb-2">
                <Zap size={14} /> My Top 3 for you
             </div>

             {/* Distance Warning Banner */}
             {recommendations && Object.values(recommendations).some(v => v && calculateDistance(v.coord, [10.8411, 106.8100]) > 5000) && (
               <div className="bg-pomegranate-50 border border-pomegranate-200 rounded-card p-4 flex items-start gap-3 animate-pulse-soft">
                  <div className="p-1 bg-pomegranate-100 rounded-full text-pomegranate-600"><Compass size={16} /></div>
                  <div>
                    <p className="text-xs font-bold text-pomegranate-800">This is a bit far!</p>
                    <p className="text-[10px] text-pomegranate-600">Some spots are 5km away. Do you still want to go?</p>
                  </div>
               </div>
             )}
             
             {recommendations && Object.entries(recommendations).map(([type, venue]) => (
               venue && (
                 <div key={type} className="bg-clay-white border-2 border-clay-black rounded-feature p-6 shadow-clay hover:translate-y-[-2px] transition-transform">
                    <div className="flex justify-between items-start mb-4">
                       <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-pill ${
                         type === 'timeSpecial' ? 'bg-pomegranate-100 text-pomegranate-600' : 
                         type === 'nearest' ? 'bg-matcha-100 text-matcha-600' : 'bg-slushie-100 text-slushie-800'
                       }`}>
                         {type === 'timeSpecial' ? 'Best Match' : type === 'nearest' ? 'Nearest' : 'Hidden Gem'}
                       </span>
                       <div className="flex items-center gap-1 text-xs font-bold ring-1 ring-oat-border px-1.5 py-0.5 rounded-badge">
                          <Star size={10} fill="#facc15" stroke="none" /> {venue.review_score}
                       </div>
                    </div>
                    <h5 className="text-xl font-bold mb-2">{venue.name}</h5>
                    <p className="text-xs text-warm-silver mb-4 line-clamp-2">{venue.summary}</p>
                    <div className="flex items-center justify-between mt-4">
                       <span className="text-[10px] font-bold text-warm-charcoal uppercase">{venue.price_range} • {venue.district}</span>
                       <button className="text-matcha-600 hover:text-matcha-700 font-bold text-xs flex items-center gap-1">
                         Detail <Navigation size={12} />
                       </button>
                    </div>
                 </div>
               )
             ))}

             <button 
               onClick={() => setStep('filters')}
               className="w-full py-4 text-[10px] font-bold uppercase tracking-widest text-warm-silver hover:text-clay-black transition-colors"
             >
               Đổi lựa chọn khác
             </button>
          </div>
        );

      default:
        return null;
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    endConsultation();
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 lg:bottom-12 lg:right-12 z-[60] flex flex-col items-end gap-3">
         {!isOpen && (
           <div className="bg-clay-white border-2 border-clay-black px-4 py-2 rounded-card shadow-clay text-[10px] font-bold uppercase tracking-widest animate-fade-in animate-slide-up">
             Hungry? I'm right here! ✨
           </div>
         )}
         <button
           onClick={() => { setIsOpen(true); if (step === 'welcome' || step === 'filters') startConsultation(); }}
           className={`w-14 h-14 rounded-full bg-clay-black text-clay-white flex items-center justify-center shadow-2xl border-2 border-matcha-600 group overflow-hidden transition-transform active:scale-90 hover:scale-110 ${!isOpen ? 'animate-pulse-soft' : ''}`}
         >
           <Sparkles size={24} className="relative z-10" />
           <div className="absolute inset-0 bg-gradient-to-tr from-matcha-600 to-slushie-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
         </button>
      </div>

      <div 
        onClick={handleClose}
        className={`fixed inset-0 z-[100] bg-clay-black/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      ></div>
      
      <div
        className={`fixed right-0 top-0 bottom-0 w-full max-w-md bg-warm-cream border-l border-oat-border shadow-2xl z-[110] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-8 border-b border-oat-border bg-clay-black text-clay-white flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Sparkle size={20} className="text-slushie-500" /> AI Concierge
            </h3>
            <p className="text-[10px] uppercase font-bold tracking-wide-label opacity-60">Your Soulful Guide</p>
          </div>
          <button 
            onClick={handleClose}
            className="relative z-10 p-2 hover:bg-clay-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10">
            <div className="mb-6 flex items-center gap-2 bg-oat-light/50 border border-oat-border rounded-pill px-3 py-1.5 w-fit">
               <MapPin size={12} className="text-matcha-600" />
               <span className="text-[10px] font-bold uppercase tracking-wide-label text-warm-charcoal">
                 Current Location: <span className="text-clay-black">District 9 (FPTU)</span>
               </span>
            </div>
            {renderStep()}
        </div>

        <div className="p-8 border-t border-oat-border bg-oat-light/20 text-center">
            <p className="text-[10px] text-warm-silver font-bold uppercase tracking-widest">
               Powered by 24h Food Intelligence
            </p>
        </div>
      </div>
    </>
  );
};

export default AIConcierge;

