import React, { useState } from 'react';
import { Menu, X, MapPin } from 'lucide-react';
import Button from '../ui/Button';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-warm-cream border-b border-oat-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-matcha-600 rounded-standard flex items-center justify-center shadow-clay">
            <MapPin className="text-clay-white" size={20} />
          </div>
          <span className="font-semibold text-xl tracking-tight-sm">24h Food Tour</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 font-medium">
          <a href="#tours" className="text-clay-black hover:text-matcha-800 transition-colors">Tours</a>
          <a href="#about" className="text-clay-black hover:text-matcha-800 transition-colors">About</a>
          <a href="#reviews" className="text-clay-black hover:text-matcha-800 transition-colors">Reviews</a>
        </nav>
        
        <div className="hidden md:block">
          <Button variant="pill">Book a Tour</Button>
        </div>
        
        <button 
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-oat-border bg-warm-cream p-6 flex flex-col gap-4">
          <a href="#tours" className="block py-2">Tours</a>
          <a href="#about" className="block py-2">About</a>
          <a href="#reviews" className="block py-2">Reviews</a>
          <Button variant="pill" className="w-full mt-4">Book a Tour</Button>
        </div>
      )}
    </header>
  );
};

export default Header;
