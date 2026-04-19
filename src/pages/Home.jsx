import React from 'react';
import Hero from '../components/sections/Hero';
import NearbyVenues from '../components/sections/NearbyVenues';
import Services from '../components/sections/Services';

const Home = () => {
  return (
    <div className="bg-warm-cream">
      <main>
        <Hero />
        <NearbyVenues />
        <Services />
      </main>
    </div>
  );
};


export default Home;
