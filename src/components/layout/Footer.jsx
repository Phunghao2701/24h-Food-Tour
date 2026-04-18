import React from 'react';
import { MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import Button from '../ui/Button';

const Footer = () => {
  return (
    <footer className="bg-warm-cream py-12 px-6">
      <div className="max-w-7xl mx-auto bg-blueberry-800 rounded-section p-12 md:p-20 shadow-clay flex flex-col md:flex-row justify-between text-clay-white border border-dark-charcoal/20">
        
        <div className="max-w-md mb-12 md:mb-0">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-light-frost text-blueberry-800 rounded-card flex items-center justify-center">
              <MapPin size={24} />
            </div>
            <span className="font-semibold text-2xl tracking-tight-sm">24h Food Tour</span>
          </div>
          <p className="text-warm-silver text-lg mb-8 leading-relaxed">
            Curated culinary experiences that show you the true flavors of the city. Rated 5 stars by thousands of hungry travelers.
          </p>
          <div className="flex space-x-4">
             <a href="#" className="w-10 h-10 bg-dark-charcoal/40 rounded-standard flex items-center justify-center hover:bg-slushie-500 hover:text-clay-black transition-colors">
               <Instagram size={20} />
             </a>
             <a href="#" className="w-10 h-10 bg-dark-charcoal/40 rounded-standard flex items-center justify-center hover:bg-slushie-500 hover:text-clay-black transition-colors">
               <Facebook size={20} />
             </a>
             <a href="#" className="w-10 h-10 bg-dark-charcoal/40 rounded-standard flex items-center justify-center hover:bg-slushie-500 hover:text-clay-black transition-colors">
               <Twitter size={20} />
             </a>
          </div>
        </div>


        <div className="flex flex-col md:flex-row gap-12 md:gap-24">
          <div>
            <h4 className="font-semibold text-clay-white uppercase tracking-wide-label text-[12px] mb-6">Company</h4>
            <div className="flex flex-col gap-4 font-medium">
              <a href="#" className="text-light-frost hover:text-slushie-500">About Us</a>
              <a href="#" className="text-light-frost hover:text-slushie-500">Careers</a>
              <a href="#" className="text-light-frost hover:text-slushie-500">Contact</a>
              <a href="#" className="text-light-frost hover:text-slushie-500">Press</a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-clay-white uppercase tracking-wide-label text-[12px] mb-6">Our Tours</h4>
            <div className="flex flex-col gap-4 font-medium">
              <a href="#" className="text-light-frost hover:text-slushie-500">Street Food Crawl</a>
              <a href="#" className="text-light-frost hover:text-slushie-500">Midnight Market</a>
              <a href="#" className="text-light-frost hover:text-slushie-500">Morning Cafe Run</a>
              <a href="#" className="text-light-frost hover:text-slushie-500">Private Dining</a>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center text-warm-silver text-sm px-4">
        <p>© 2026 24h Food Tour. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-clay-black">Privacy Policy</a>
          <a href="#" className="hover:text-clay-black">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
