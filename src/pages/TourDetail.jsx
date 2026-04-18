import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Clock, Info, MapPin, Share2 } from 'lucide-react';
import { ITINERARIES } from '../utils/mockData';
import Button from '../components/ui/Button';

const TourDetail = () => {
  const { id } = useParams();
  const tour = ITINERARIES.find(t => t.id === id);

  if (!tour) return <div className="p-12 text-center animate-fade-in">Tour not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 animate-fade-in">

      <Link to="/itineraries" className="inline-flex items-center gap-2 text-warm-silver hover:text-clay-black font-semibold mb-8 transition-colors">
        <ChevronLeft size={20} /> Back to Tours
      </Link>

      <div className={`rounded-feature bg-gradient-to-br ${tour.gradient} p-8 md:p-12 text-clay-white mb-12 shadow-clay relative overflow-hidden`}>
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 rounded-badge bg-clay-white/20 text-[10px] font-bold uppercase tracking-wide-label mb-4">
            {tour.tagline}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{tour.title}</h1>
          <p className="text-xl opacity-90 leading-relaxed max-w-2xl">{tour.description}</p>
        </div>
        {/* Abstract background shape */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-clay-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Timeline */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-8"> Culinary Timeline</h2>
          <div className="relative space-y-12 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-oat-border">
            {tour.stops.map((stop, i) => (
              <div key={i} className="relative pl-12">
                <div className="absolute left-0 top-1.5 w-6.5 h-6.5 rounded-full bg-clay-white border-2 border-clay-black z-10 flex items-center justify-center">
                   <div className="w-1.5 h-1.5 rounded-full bg-clay-black"></div>
                </div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-sm font-bold text-matcha-600 block mb-1">{stop.time}</span>
                    <h3 className="text-xl font-bold">{stop.name}</h3>
                  </div>
                  {stop.status && (
                    <span className="text-[10px] uppercase font-bold tracking-wide-label px-2 py-1 rounded-badge bg-warm-cream border border-oat-border">
                      {stop.status}
                    </span>
                  )}
                </div>
                <p className="text-warm-silver mb-4 leading-relaxed">
                  Best dish: Traditional noodles with extra toppings. Estimated wait: 10 mins.
                </p>
                <div className="flex gap-4">
                   <Button variant="ghost" className="text-xs h-8">View Map</Button>
                   <Button variant="ghost" className="text-xs h-8">Reviews</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Metrics */}
        <div className="space-y-8">
          <div className="p-6 bg-clay-white border border-oat-border rounded-card shadow-clay">
            <h3 className="text-sm font-bold uppercase tracking-wide-label mb-4 flex items-center gap-2">
              <Info size={16} /> Digest Metrics
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-wide-label opacity-60">
                  <span>Intensity</span>
                  <span>High</span>
                </div>
                <div className="h-1.5 bg-oat-light rounded-full overflow-hidden">
                  <div className="h-full bg-pomegranate-400 w-4/5"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-wide-label opacity-60">
                  <span>Walking</span>
                  <span>~2.4 km</span>
                </div>
                <div className="h-1.5 bg-oat-light rounded-full overflow-hidden">
                  <div className="h-full bg-matcha-600 w-2/5"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-clay-black text-clay-white rounded-card shadow-clay">
            <h3 className="text-xl font-bold mb-4">Ready to go?</h3>
            <p className="text-sm opacity-70 mb-6">Start this tour now and we'll sync your progress with your Food Passport.</p>
            <Button variant="pill" className="w-full bg-slushie-500 text-clay-black">Start Challenge</Button>
          </div>
          
          <Button variant="white" className="w-full gap-2"><Share2 size={18} /> Share Route</Button>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;
