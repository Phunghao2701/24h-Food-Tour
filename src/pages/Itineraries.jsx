import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, ChevronRight } from 'lucide-react';
import { ITINERARIES } from '../utils/mockData';

const Itineraries = () => {
  return (
    <div className="p-6 md:p-12 animate-fade-in">
      <header className="mb-12">
        <h1 className="text-4xl font-semibold tracking-display-tight mb-4">Automated Itineraries</h1>
        <p className="text-warm-silver text-lg max-w-2xl">
          Don't waste time searching. Choose a curated route optimized for the best flavors and digestion.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ITINERARIES.map((tour) => (
          <div
            key={tour.id}
            className={`group h-full flex flex-col bg-clay-white rounded-feature border border-oat-border shadow-clay overflow-hidden relative transition-all duration-300 hover:scale-[1.02] hover:border-warm-silver`}
          >
            {/* Gradient Header */}
            <div className={`h-32 bg-gradient-to-br ${tour.gradient} p-6 flex flex-col justify-end`}>
               <span className="text-[10px] font-bold uppercase tracking-wide-label text-clay-white opacity-80 mb-1">{tour.tagline}</span>
               <h3 className="text-2xl font-bold text-clay-white">{tour.title}</h3>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <p className="text-warm-charcoal mb-6 line-clamp-2 leading-relaxed">{tour.description}</p>
              
              <div className="space-y-3 mb-8">
                {tour.stops.map((stop, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-clay-black opacity-30"></div>
                    <span className="text-warm-silver w-10 uppercase tracking-wide">{stop.time}</span>
                    <span className="text-clay-black">{stop.name}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-oat-light flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wide-label text-warm-silver">
                  <span className="flex items-center gap-1"><Clock size={14} /> {tour.stops.length} Stops</span>
                  <span className="flex items-center gap-1"><Star size={14} /> 4.9</span>
                </div>
                <Link 
                  to={`/itineraries/${tour.id}`}
                  className="w-10 h-10 rounded-pill bg-clay-black text-clay-white flex items-center justify-center hover-clay-jump shadow-clay active:scale-90 transition-transform"
                >
                  <ChevronRight size={20} />
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
