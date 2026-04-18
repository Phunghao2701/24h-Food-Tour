import { VENUES } from './mockData';

/**
 * Checks if a venue is open at a specific time string (HH:mm)
 */
export const isVenueOpen = (venue, timeStr) => {
  if (!venue.open_at || !venue.close_at) return true; // Assume 24/7 if missing
  
  const [targetH, targetM] = timeStr.split(':').map(Number);
  const targetTotal = targetH * 60 + targetM;
  
  const [openH, openM] = venue.open_at.split(':').map(Number);
  const openTotal = openH * 60 + openM;
  
  const [closeH, closeM] = venue.close_at.split(':').map(Number);
  const closeTotal = closeH * 60 + closeM;
  
  // Handle overnight closure (e.g. 22:00 to 04:00)
  if (closeTotal < openTotal) {
    return targetTotal >= openTotal || targetTotal <= closeTotal;
  }
  
  return targetTotal >= openTotal && targetTotal <= closeTotal;
};

/**
 * Gets a single recommendation based on time and district
 */
export const getEmergencySuggestion = (timeStr, district = 'All') => {
  const openVenues = VENUES.filter(v => {
    const isTimeMatch = isVenueOpen(v, timeStr);
    const isDistrictMatch = district === 'All' || v.district === district;
    return isTimeMatch && isDistrictMatch;
  });
  
  if (openVenues.length === 0) return null;
  
  // Return a random one for "Emergency" feel, or the first one
  return openVenues[Math.floor(Math.random() * openVenues.length)];
};

/**
 * Haversine formula for real-world distances in meters
 */
export const calculateDistance = (c1, c2) => {
  if (!c1 || !c2) return 9999;
  const R = 6371e3; // Earth radius in meters
  const [lat1, lon1] = c1;
  const [lat2, lon2] = c2;
  
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // Distance in meters
};

/**
 * Advanced filtering following dynamic-routing.md priorities
 */
export const getSmartRecommendations = (timeStr, district = 'All', mode = 'All', budget = 'All', userLoc = [10.8411, 106.8100]) => {
  // 1. Filter by Priority 1: Opening Hours
  let candidates = VENUES.filter(v => isVenueOpen(v, timeStr));
  
  // 2. Filter by 3KM RADIUS (dynamic-routing.md rule)
  let proximityCandidates = candidates.filter(v => calculateDistance(v.coord, userLoc) <= 3000);

  // Fallback to 5km if no spots found within 3km
  if (proximityCandidates.length === 0) {
    proximityCandidates = candidates.filter(v => calculateDistance(v.coord, userLoc) <= 5000);
  }

  candidates = proximityCandidates;

  // 3. District Context (Safety check)
  if (district !== 'All') {
    candidates = candidates.filter(v => v.district === district);
  }
  
  // 4. Match Budget ($ / $$ / $$$)
  if (budget !== 'All') {
    candidates = candidates.filter(v => v.price_range === budget);
  }

  // 5. Match Mode
  if (mode === 'Snack') {
    candidates = candidates.filter(v => v.category === 'Street Food');
  } else if (mode === 'Meal') {
    candidates = candidates.filter(v => v.category !== 'Street Food');
  }

  // Safety Sort
  candidates.sort((a, b) => b.review_score - a.review_score);

  // Pick 3 Distinct Types:
  return {
    timeSpecial: candidates[0] || null,
    nearest: [...candidates].sort((a, b) => calculateDistance(a.coord, userLoc) - calculateDistance(b.coord, userLoc))[0] || null,
    hiddenGem: candidates.find(v => v.is_hidden_gem) || candidates[Math.min(2, candidates.length - 1)] || null
  };
};

/**
 * Returns greeting based on time
 */
export const getTimeSensitiveGreeting = (timeStr) => {
  const [h] = timeStr.split(':').map(Number);
  if (h >= 5 && h < 11) return "Ready for your Breakfast adventure?";
  if (h >= 11 && h < 14) return "Ready for a hearty Lunch?";
  if (h >= 14 && h < 19) return "Afternoon snack cravings?";
  if (h >= 19 && h < 22) return "Time for an epic Dinner?";
  return "Late-night hunger, aren't we?";
};
