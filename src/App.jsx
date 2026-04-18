import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Itineraries from './pages/Itineraries';
import TourDetail from './pages/TourDetail';
import MapPage from './pages/MapPage';
import Passport from './pages/Passport';
import Community from './pages/Community';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="itineraries" element={ <Itineraries /> } />
        <Route path="itineraries/:id" element={ <TourDetail /> } />
        <Route path="map" element={<MapPage />} />
        <Route path="passport" element={<Passport />} />
        <Route path="community" element={<Community />} />
      </Route>
    </Routes>
  );
}

export default App;

