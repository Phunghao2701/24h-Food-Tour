import React from 'react';
import Hero from '../components/sections/Hero';
import Services from '../components/sections/Services';

const Home = () => {
  return (
    <div className="bg-warm-cream">
      <main>
        <Hero />
        <Services />
      </main>
    </div>
  );
};


export default Home;
