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
 * Simple pythagorean distance for mock coordinates
 */
const calculateDistance = (c1, c2) => {
  if (!c1 || !c2) return 999;
  return Math.sqrt(Math.pow(c1[0] - c2[0], 2) + Math.pow(c1[1] - c2[1], 2));
};

/**
 * Advanced filtering following dynamic-routing.md priorities
 */
export const getSmartRecommendations = (timeStr, district = 'All', mode = 'All', budget = 'All') => {
  // 1. Filter by Priority 1: Opening Hours
  let candidates = VENUES.filter(v => isVenueOpen(v, timeStr));
  
  // 2. Filter by District if specified
  if (district !== 'All') {
    candidates = candidates.filter(v => v.district === district);
  }
  
  // 3. Match Budget ($ / $$ / $$$)
  if (budget !== 'All') {
    candidates = candidates.filter(v => v.price_range === budget);
  }

  // 4. Match Mode (Street Food is usually 'Snack', Fine Dining/Gem is 'Meal' - Simplified)
  // In a real app, we'd have a 'type' tag. For now:
  if (mode === 'Snack') {
    candidates = candidates.filter(v => v.category === 'Street Food');
  } else if (mode === 'Meal') {
    candidates = candidates.filter(v => v.category !== 'Street Food');
  }

  // Generate 3 Distinct Types:
  
  // A. Time Specialist (Highest Review Score)
  const timeSpecial = [...candidates]
    .sort((a, b) => b.review_score - a.review_score)[0];

  // B. Nearest (Mocked center at District 1 [10.77, 106.70])
  const nearest = [...candidates]
    .sort((a, b) => calculateDistance(a.coord, [10.77, 106.70]) - calculateDistance(b.coord, [10.77, 106.70]))[0];

  // C. Hidden Gem
  const hiddenGems = candidates.filter(v => v.is_hidden_gem);
  const hiddenGem = hiddenGems.length > 0 
    ? hiddenGems[Math.floor(Math.random() * hiddenGems.length)]
    : candidates[candidates.length - 1];

  return {
    timeSpecial,
    nearest,
    hiddenGem
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
