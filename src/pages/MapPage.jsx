import React, { useState } from 'react';
import { MapPin, Search, Filter, Info, Navigation, Smartphone } from 'lucide-react';
import { VENUES } from '../utils/mockData';
import Button from '../components/ui/Button';

const MapPage = () => {
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [filter, setFilter] = useState('All');

  const filteredVenues = filter === 'All' 
    ? VENUES 
    : VENUES.filter(v => v.category === filter);

  return (
    <div className="h-[calc(100vh-81px)] lg:h-screen flex flex-col lg:flex-row overflow-hidden bg-oat-light/30">
      {/* Sidebar Content */}
      <div className="w-full lg:w-96 bg-warm-cream border-r border-oat-border flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-oat-border">
          <h1 className="text-2xl font-bold tracking-display-tight mb-4">Smart Map</h1>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-silver" size={16} />
            <input 
              type="text" 
              placeholder="Filter by name or street..."
              className="w-full bg-clay-white border border-oat-border rounded-card py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-matcha-600"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['All', 'Hidden Gem', 'Fine Dining', 'Street Food'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-pill text-[10px] font-bold uppercase tracking-wide-label border transition-all ${
                  filter === cat 
                  ? 'bg-clay-black text-clay-white border-clay-black shadow-clay' 
                  : 'bg-clay-white text-warm-charcoal border-oat-border hover:bg-oat-light'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <p className="text-[10px] uppercase font-bold tracking-wide-label text-warm-silver px-2">Nearby Venues (2km)</p>
          {filteredVenues.map(venue => (
            <div
              key={venue.id}
              onClick={() => setSelectedVenue(venue)}
              className={`p-4 rounded-card border cursor-pointer transition-all duration-300 ${
                selectedVenue?.id === venue.id 
                ? 'bg-clay-white border-matcha-600 shadow-clay scale-[1.02]' 
                : 'bg-clay-white border-oat-border hover:border-warm-silver hover:shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{venue.name}</h3>
                <span className="text-[9px] font-bold uppercase tracking-wide-label bg-matcha-300 px-1.5 py-0.5 rounded-badge text-matcha-800">
                  {venue.category}
                </span>
              </div>
              <p className="text-sm text-warm-silver line-clamp-2 mb-3 leading-relaxed">{venue.summary}</p>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide-label">
                <span className="text-matcha-600 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-matcha-600 animate-pulse"></div> {venue.status}
                </span>
                <span className="text-warm-charcoal">400m away</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Map View */}
      <div className="flex-1 relative bg-[#e5e7eb] overflow-hidden border-4 border-clay-black m-6 rounded-feature shadow-[inset_0_4px_12px_rgba(0,0,0,0.1)]">
        {/* Abstract Simulated Map Grid */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#dad4c8 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          {/* Simulated Streets */}
          <div className="absolute top-1/3 left-0 right-0 h-4 bg-oat-border/50 rotate-[-1deg] shadow-sm"></div>
          <div className="absolute top-0 bottom-0 left-1/4 w-4 bg-oat-border/50 rotate-[2deg] shadow-sm"></div>
          <div className="absolute top-2/3 left-0 right-0 h-8 bg-oat-border/30 rotate-[0.5deg] shadow-sm"></div>
          <div className="absolute top-1/4 bottom-1/4 right-1/3 w-2 bg-oat-border/40 rotate-[-15deg]"></div>
        </div>

        {/* Venue Markers */}
        {filteredVenues.map((venue, idx) => (
          <div
            key={venue.id}
            onClick={() => setSelectedVenue(venue)}
            className="absolute cursor-pointer group transition-all duration-300 hover:scale-110 animate-fade-in"
            style={{ left: `${30 + idx * 20}%`, top: `${40 + (idx % 2) * 20}%` }}
          >
             <div className="relative flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-clay border-2 border-clay-white transition-colors duration-300 ${selectedVenue?.id === venue.id ? 'bg-matcha-600' : 'bg-clay-black group-hover:bg-matcha-600'}`}>
                  <MapPin size={18} className="text-clay-white" />
                </div>
                {selectedVenue?.id === venue.id && (
                  <div 
                    className="absolute -top-12 bg-clay-black text-clay-white px-3 py-1.5 rounded-card text-xs font-bold whitespace-nowrap shadow-clay animate-slide-up"
                  >
                    {venue.name}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-clay-black rotate-45"></div>
                  </div>
                )}
             </div>
          </div>
        ))}

        {/* Floating Controls */}
        <div className="absolute right-6 top-6 flex flex-col gap-4">
           <div className="bg-warm-cream p-2 rounded-card shadow-clay border border-oat-border flex flex-col gap-2">
              <button className="p-2 hover:bg-oat-light rounded-standard transition-colors"><Info size={20} /></button>
              <button className="p-2 hover:bg-oat-light rounded-standard transition-colors"><Navigation size={20} /></button>
              <button className="p-2 hover:bg-oat-light rounded-standard transition-colors"><Smartphone size={20} /></button>
           </div>
        </div>

        {/* Selection Detail Overlay (Mobile) / Card (Desktop) */}
        {selectedVenue && (
          <div
            className="absolute bottom-6 left-6 right-6 lg:left-auto lg:w-[400px] bg-warm-cream rounded-feature p-8 border border-oat-border shadow-2xl z-40 animate-slide-up"
          >
            <button 
              onClick={() => setSelectedVenue(null)}
              className="absolute right-4 top-4 text-warm-silver hover:text-clay-black transition-colors"
            >
              Close
            </button>
            <div className="mb-6">
              <span className="text-[10px] font-bold tracking-wide-label uppercase text-matcha-600 mb-2 block">Featured {selectedVenue.category}</span>
              <h2 className="text-3xl font-bold mb-4">{selectedVenue.name}</h2>
              <p className="text-warm-charcoal leading-relaxed mb-6">{selectedVenue.summary}</p>
              <div className="flex gap-4">
                <Button variant="pill" className="flex-1 bg-matcha-600 text-clay-white hover:bg-matcha-800 shadow-clay transition-all active:scale-95">
                  Book Grab/Be
                </Button>
                <Button variant="white" className="flex-1 shadow-clay">Direction</Button>
              </div>
            </div>
            <div className="pt-6 border-t border-oat-border flex items-center justify-between text-xs font-bold uppercase tracking-wide-label text-warm-silver">
               <span>Status: {selectedVenue.status}</span>
               <span>Est. 8 min Walk</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
