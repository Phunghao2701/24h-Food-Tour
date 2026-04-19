import React from 'react';
import PlaceCard from './PlaceCard';
import { VENUES } from '../../utils/mockData';

const PlaceGrid = () => {
  // Filter for coffee places or hidden gems
  const coffeePlaces = VENUES.filter(v => 
    v.name.toLowerCase().includes('coffee') || 
    v.summary.toLowerCase().includes('coffee') ||
    v.id < 5
  ).slice(0, 4);

  // Add sample images to match the screenshot or similar vibes
  const sampleData = [
    { ...coffeePlaces[0], image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=600&q=80', rating: 5 },
    { ...coffeePlaces[1], image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80', isMaps: true, rating: 5 },
    { ...coffeePlaces[2], image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80', rating: 5 },
    { ...coffeePlaces[3], image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80', rating: 4.9 },
  ];

  return (
    <div className="py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">
          Gợi ý Cà phê tại <span className="text-orange-500">Thành phố Hồ Chí Minh</span>
        </h2>
        <button className="text-sm font-bold text-orange-500 hover:underline flex items-center gap-1">
          Xem tất cả <span className="text-lg">→</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {sampleData.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>
    </div>
  );
};

export default PlaceGrid;
