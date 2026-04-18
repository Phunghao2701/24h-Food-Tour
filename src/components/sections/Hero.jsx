import React from 'react';
import Button from '../ui/Button';

const Hero = () => {
  return (
    <section className="relative pt-24 pb-32 px-6 overflow-hidden">
      {/* Decorative dashed lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute left-1/4 top-0 bottom-0 w-[1px] border-l border-dashed border-clay-black"></div>
        <div className="absolute left-3/4 top-0 bottom-0 w-[1px] border-l border-dashed border-clay-black"></div>
      </div>
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-block px-3 py-1 mb-6 rounded-badge bg-badge-bluebg text-badge-bluetext font-semibold text-[11px] uppercase tracking-wide-label">
          Explore the Unseen
        </div>
        
        <h1 className="text-5xl md:text-7xl font-semibold tracking-display-tight leading-display mb-8">
          Discover the City's<br />
          Best Bites in <span className="text-pomegranate-400">24 Hours</span>
        </h1>
        
        <p className="text-lg md:text-xl text-warm-charcoal max-w-2xl mx-auto mb-12 leading-relaxed">
          Forget the tourist traps. We guide you through the authentic alleys and hidden gems where locals actually eat. Come hungry.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button variant="pill">View Our Tours</Button>
          <Button variant="white">How It Works</Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
