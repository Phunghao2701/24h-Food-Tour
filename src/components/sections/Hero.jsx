import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { Clock, MapPin, Sparkles, X, ChevronRight, Navigation } from 'lucide-react';
import { getEmergencySuggestion, getTimeSensitiveGreeting } from '../../utils/engine';

const Hero = () => {
  const [currentTime, setCurrentTime] = useState('08:00');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [suggestion, setSuggestion] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    setCurrentTime(`${h}:${m}`);
  }, []);

  const handleHungry = () => {
    const suggest = getEmergencySuggestion(currentTime, selectedDistrict);
    setSuggestion(suggest);
    setShowModal(true);
  };

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
                <label className="text-[10px] font-bold uppercase tracking-wide-label text-warm-silver mb-3 block">When do you want to eat?</label>
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
                <label className="text-[10px] font-bold uppercase tracking-wide-label text-warm-silver mb-3 block">Where are you?</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-clay-black" size={20} />
                  <select 
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full bg-oat-light border-2 border-clay-black rounded-card py-4 pl-12 pr-4 font-bold text-lg appearance-none focus:outline-none focus:ring-4 focus:ring-matcha-600/20"
                  >
                    <option value="All">Anywhere</option>
                    <option value="District 1">District 1</option>
                    <option value="District 9">District 9</option>
                  </select>
                </div>
              </div>
           </div>

           <div className="mt-12">
             <Button 
               onClick={handleHungry}
               className="w-full py-6 text-xl bg-pomegranate-400 text-clay-white shadow-clay hover:bg-pomegranate-600 scale-105"
             >
               <Sparkles className="mr-2" /> Tôi đang đói, gợi ý đi!
             </Button>
           </div>
        </div>
        
        <p className="text-lg text-warm-charcoal max-w-xl mx-auto mb-4 italic opacity-60">
          "The best way to experience Saigon is through its stomach, according to your time."
        </p>
      </div>

      {/* Emergency Suggestion Modal */}
      {showModal && suggestion && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-clay-black/60 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <div className="bg-warm-cream w-full max-w-md rounded-feature p-12 relative z-10 border-4 border-clay-black shadow-2xl animate-slide-up">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute right-6 top-6 text-warm-silver hover:text-clay-black"
            >
              <X size={28} />
            </button>
            <div className="text-center">
              <div className="inline-block px-4 py-1.5 bg-matcha-600 text-clay-white rounded-pill text-[10px] font-bold uppercase tracking-widest mb-6">Found for you!</div>
              <h2 className="text-4xl font-bold mb-4 tracking-display-tight">{suggestion.name}</h2>
              <div className="flex items-center justify-center gap-2 text-warm-silver font-bold uppercase tracking-wide-label mb-8">
                <Navigation size={14} /> {suggestion.district} • {suggestion.open_at}-{suggestion.close_at}
              </div>
              <p className="text-lg leading-relaxed text-warm-charcoal mb-10">{suggestion.summary}</p>
              
              <div className="flex flex-col gap-4">
                 <Button className="w-full py-4 text-lg shadow-clay flex items-center justify-center gap-2">
                   Let's Go! <ChevronRight size={18} />
                 </Button>
                 <button 
                   onClick={handleHungry}
                   className="text-sm font-bold uppercase tracking-wide-label text-warm-silver hover:text-pomegranate-400 transition-colors"
                 >
                   Nah, something else
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
