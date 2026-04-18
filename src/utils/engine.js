import { VENUES } from './mockData';

export const getBudgetLabel = (budgetTier) => {
  if (budgetTier === '$') return 'Tiết kiệm';
  if (budgetTier === '$$') return 'Tầm trung';
  if (budgetTier === '$$$') return 'Rộng rãi';
  return 'Linh hoạt';
};

export const getBudgetRange = (venue) => {
  if (venue.price_min && venue.price_max) {
    return { min: venue.price_min, max: venue.price_max };
  }

  if (venue.price_range === '$') return { min: 25000, max: 90000 };
  if (venue.price_range === '$$$') return { min: 180000, max: 400000 };
  return { min: 70000, max: 180000 };
};

export const formatPriceRange = (venue) => {
  const range = getBudgetRange(venue);
  return `${range.min.toLocaleString('vi-VN')}đ - ${range.max.toLocaleString('vi-VN')}đ`;
};

export const inferVenueKind = (venue) => {
  if (venue.venue_kind) return venue.venue_kind;
  const source = `${venue.name} ${venue.summary}`.toLowerCase();
  return /(cafe|coffee|tea|trà|sinh tố|juice|milk tea)/.test(source) ? 'Nước uống' : 'Đồ ăn';
};

export const inferServingStyle = (venue) => {
  if (venue.serving_style) return venue.serving_style;
  const source = `${venue.name} ${venue.summary}`.toLowerCase();
  if (/(phở|bún|hủ tiếu|mì|lẩu|cháo|nước|soup|noodle)/.test(source)) return 'Món nước';
  if (/(cơm|bánh mì|nướng|chiên|khô|snack|bakery|fried|grill)/.test(source)) return 'Món khô';
  return 'Linh hoạt';
};

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
export const getSmartRecommendations = ({
  timeStr,
  district = 'All',
  mode = 'All',
  budget = 'All',
  userLoc = [10.8411, 106.8100],
  radiusKm = 5,
  partySize = 2,
  weatherMode = 'neutral',
  venueKind = 'All',
  servingStyle = 'All',
}) => {
  let candidates = VENUES.filter((venue) => isVenueOpen(venue, timeStr));

  let proximityCandidates = candidates.filter((venue) => calculateDistance(venue.coord, userLoc) <= radiusKm * 1000);

  if (proximityCandidates.length === 0 && radiusKm < 10) {
    proximityCandidates = candidates.filter((venue) => calculateDistance(venue.coord, userLoc) <= 10000);
  }

  candidates = proximityCandidates;

  if (district !== 'All') {
    candidates = candidates.filter((venue) => venue.district === district);
  }
  
  if (budget !== 'All') {
    candidates = candidates.filter((venue) => venue.price_range === budget);
  }

  if (venueKind !== 'All') {
    candidates = candidates.filter((venue) => inferVenueKind(venue) === venueKind);
  }

  if (servingStyle !== 'All') {
    candidates = candidates.filter((venue) => {
      const normalizedStyle = inferServingStyle(venue);
      return normalizedStyle === 'Linh hoạt' || normalizedStyle === servingStyle;
    });
  }

  if (mode === 'Snack') {
    candidates = candidates.filter((venue) => venue.category === 'Street Food');
  } else if (mode === 'Meal') {
    candidates = candidates.filter((venue) => venue.category !== 'Street Food');
  }

  const scoreVenue = (venue) => {
    const distanceScore = userLoc ? Math.max(0, 2 - calculateDistance(venue.coord, userLoc) / 3000) : 0;
    const weatherText = `${venue.name} ${venue.summary}`.toLowerCase();
    const hasCoolVibe = /coffee|cafe|tea|quiet|spacious|vintage|workspace|co-working/.test(weatherText);
    const isIndoorLean = venue.category === 'Hidden Gem' || venue.category === 'Fine Dining';
    const handlesGroup = partySize >= 4 ? (venue.category !== 'Hidden Gem' ? 0.25 : -0.15) : 0;
    const venueKindBonus = venueKind !== 'All' && inferVenueKind(venue) === venueKind ? 0.35 : 0;
    const servingStyleBonus = servingStyle !== 'All' && inferServingStyle(venue) === servingStyle ? 0.35 : 0;
    const weatherBonus =
      weatherMode === 'hot'
        ? hasCoolVibe || isIndoorLean ? 0.45 : -0.1
        : weatherMode === 'rainy'
          ? isIndoorLean ? 0.35 : 0
          : 0;

    return venue.review_score + distanceScore + handlesGroup + weatherBonus + venueKindBonus + servingStyleBonus;
  };

  candidates.sort((a, b) => scoreVenue(b) - scoreVenue(a));

  return {
    timeSpecial: candidates[0] || null,
    nearest: [...candidates].sort((a, b) => calculateDistance(a.coord, userLoc) - calculateDistance(b.coord, userLoc))[0] || null,
    hiddenGem: candidates.find((venue) => venue.is_hidden_gem) || candidates[Math.min(2, candidates.length - 1)] || null
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
