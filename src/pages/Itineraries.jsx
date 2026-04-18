import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';
import { ITINERARIES, VENUES } from '../utils/mockData';
import { isVenueOpen } from '../utils/engine';

const Itineraries = () => {
  const [startTime, setStartTime] = useState('08:00');

  // Simple heuristic for "is this stop's typical time compatible with the selected start time"
  // If start time is X, we expect stop 1 at X, stop 2 at X+1.5h, etc.
  // Actually, let's keep it simple: just show a "Recalculating..." banner and highlight stops.

  return (
    <div className="p-6 md:p-12 animate-fade-in bg-oat-light/20 min-h-screen">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-matcha-600 font-bold uppercase tracking-widest text-[10px] mb-4">
            <Sparkles size={14} /> The 24h Challenge
          </div>
          <h1 className="text-4xl font-bold tracking-display-tight mb-4">Smart Itineraries</h1>
          <p className="text-warm-silver text-lg">
            Choose a curated route optimized for the best flavors and digestion. Pick your start time to adapt the experience.
          </p>
        </div>

        <div className="bg-clay-white p-6 rounded-feature border-2 border-clay-black shadow-clay">
          <label className="text-[10px] font-bold uppercase tracking-wide-label text-warm-silver mb-2 block">Set Your Start Time</label>
          <div className="flex items-center gap-4">
            <Clock size={20} className="text-clay-black" />
            <input 
              type="time" 
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="bg-transparent font-bold text-2xl focus:outline-none"
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {ITINERARIES.map((tour) => (
          <div
            key={tour.id}
            className={`group h-full flex flex-col bg-clay-white rounded-feature border-2 border-clay-black shadow-clay overflow-hidden relative transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
          >
            {/* Gradient Header */}
            <div className={`h-32 bg-gradient-to-br ${tour.gradient} p-8 flex flex-col justify-end relative`}>
               <span className="text-[10px] font-bold uppercase tracking-wide-label text-clay-white opacity-80 mb-1">{tour.tagline}</span>
               <h3 className="text-3xl font-bold text-clay-white tracking-tight">{tour.title}</h3>
               <div className="absolute top-4 right-4 bg-clay-white/20 backdrop-blur-md rounded-badge px-2 py-1 text-[9px] font-bold text-clay-white uppercase">
                 4.9 <Star size={10} className="inline mb-0.5" fill="white" />
               </div>
            </div>

            <div className="p-8 flex-1 flex flex-col">
              <p className="text-warm-charcoal mb-8 line-clamp-2 leading-relaxed font-medium">{tour.description}</p>
              
              <div className="space-y-4 mb-10">
                {tour.stops.map((stop, i) => {
                  // Find the venue to check real hours
                  const venue = VENUES.find(v => v.name === stop.name);
                  const isOpen = venue ? isVenueOpen(venue, stop.time) : true;

                  return (
                    <div key={i} className="flex items-center gap-4 group/stop">
                      <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-matcha-600' : 'bg-pomegranate-400 animate-pulse'}`}></div>
                      <span className="text-warm-silver w-10 text-[11px] font-bold uppercase tracking-wider">{stop.time}</span>
                      <span className={`text-sm font-bold ${!isOpen ? 'text-pomegranate-400 line-through' : 'text-clay-black'}`}>{stop.name}</span>
                      {!isOpen && (
                        <span className="text-[8px] font-bold uppercase tracking-tighter bg-pomegranate-100 text-pomegranate-600 px-1 py-0.5 rounded-badge flex items-center gap-0.5">
                          <AlertCircle size={8} /> Closed
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-auto pt-8 border-t-2 border-dashed border-oat-border flex items-center justify-between">
                <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-warm-silver">
                  <span className="flex items-center gap-1.5"><Clock size={16} /> {tour.stops.length} Stops</span>
                </div>
                <Link 
                  to={`/itineraries/${tour.id}`}
                  className="px-6 py-2 rounded-pill bg-clay-black text-clay-white text-[10px] font-bold uppercase tracking-widest hover:bg-matcha-600 transition-colors shadow-clay active:scale-95"
                >
                  Start Tour
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Itineraries;
