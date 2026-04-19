/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { VENUES } from '../utils/mockData';
import { getSmartRecommendations, isVenueOpen } from '../utils/engine';

const ConciergeContext = createContext();
const DEFAULT_USER_LOC = [10.8411, 106.81];
const SESSION_KEY = 'concierge_profile';

// Keys to persist in sessionStorage (skip ephemeral UI state)
const PERSIST_KEYS = ['radiusKm', 'partySize', 'budget', 'venueKind', 'servingStyle', 'userLoc', 'locationReady', 'locationLabel'];

const loadSessionProfile = () => {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const saveSessionProfile = (profile) => {
  try {
    const toSave = Object.fromEntries(
      PERSIST_KEYS.filter((k) => profile[k] != null).map((k) => [k, profile[k]])
    );
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(toSave));
  } catch {
    /* silent */
  }
};

const DEFAULT_SEARCH_PROFILE = {
  userLoc: DEFAULT_USER_LOC,
  locationLabel: 'Vị trí mặc định',
  locationReady: false,
  radiusKm: null,
  partySize: null,
  budget: null,
  venueKind: null,
  servingStyle: null,
  weatherMode: 'neutral',
  weatherLabel: 'Chưa có dữ liệu thời tiết',
  temperatureC: null,
};

export const ConciergeProvider = ({ children }) => {
  const [isConsulting, setIsConsulting] = useState(false);
  const [focusConfig, setFocusConfig] = useState({
    blur: false,
    opacity: 1,
  });
  const [activeVenueId, setActiveVenueId] = useState(null);
  const [highlightedVenueIds, setHighlightedVenueIds] = useState([]);
  const [botDraft, setBotDraft] = useState(null);
  const [mapNarrative, setMapNarrative] = useState(null);
  const [searchProfile, setSearchProfile] = useState(() => ({
    ...DEFAULT_SEARCH_PROFILE,
    ...loadSessionProfile(),
  }));

  const findVenueById = useCallback((venueId) => VENUES.find((venue) => venue.id === venueId) || null, []);

  const findVenueMentions = useCallback((text = '') => {
    const lowered = text.toLowerCase();
    return VENUES.filter((venue) => lowered.includes(venue.name.toLowerCase()));
  }, []);

  const syncMapWithVenues = useCallback((venues, source = 'bot') => {
    if (!venues.length) {
      setHighlightedVenueIds([]);
      return [];
    }

    setActiveVenueId(venues[0].id);
    setHighlightedVenueIds(venues.slice(0, 3).map((venue) => venue.id));
    setMapNarrative({
      source,
      venueIds: venues.map((venue) => venue.id),
      updatedAt: Date.now(),
    });

    return venues;
  }, []);

  const startConsultation = useCallback(() => {
    setIsConsulting(true);
    setFocusConfig({ blur: true, opacity: 0.3 });
  }, []);

  const endConsultation = useCallback(() => {
    setIsConsulting(false);
    setFocusConfig({ blur: false, opacity: 1 });
  }, []);

  const focusVenue = useCallback((venueOrId, options = {}) => {
    const venue = typeof venueOrId === 'object' ? venueOrId : findVenueById(venueOrId);
    if (!venue) return null;

    setActiveVenueId(venue.id);
    setHighlightedVenueIds((prev) => {
      const next = [venue.id, ...prev.filter((id) => id !== venue.id)];
      return next.slice(0, 3);
    });
    setMapNarrative({
      source: options.source || 'manual',
      venueIds: [venue.id],
      headline: options.headline || venue.name,
      body: options.body || venue.summary,
      updatedAt: Date.now(),
    });

    return venue;
  }, [findVenueById]);

  const clearMapFocus = useCallback(() => {
    setActiveVenueId(null);
    setHighlightedVenueIds([]);
    setMapNarrative(null);
    setBotDraft(null);
  }, []);

  const updateSearchProfile = useCallback((patch) => {
    setSearchProfile((prev) => {
      const next = { ...prev, ...patch };
      saveSessionProfile(next);
      return next;
    });
  }, []);

  const resetSearchProfile = useCallback(() => {
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* silent */ }
    setSearchProfile(DEFAULT_SEARCH_PROFILE);
  }, []);

  const syncBotResponse = useCallback((text) => {
    const mentionedVenues = findVenueMentions(text);
    if (!mentionedVenues.length) {
      setBotDraft(null);
      return [];
    }

    const primaryVenue = syncMapWithVenues(mentionedVenues, 'bot')[0];
    setBotDraft({
      venueIds: mentionedVenues.map((venue) => venue.id),
      primaryVenueId: primaryVenue.id,
      cta: 'Bản đồ đã ghim quán này để bạn xem nhanh trên map.',
    });

    return mentionedVenues;
  }, [findVenueMentions, syncMapWithVenues]);

  const seedProactivePlan = useCallback(({
    timeStr,
    district = 'All',
    mode = 'All',
    budget,
    userLoc,
    radiusKm,
    partySize,
    weatherMode,
  }) => {
    const picks = getSmartRecommendations({
      timeStr,
      district,
      mode,
      budget: budget || 'All',
      userLoc: userLoc || searchProfile.userLoc,
      radiusKm: radiusKm || searchProfile.radiusKm || 5,
      partySize: partySize || searchProfile.partySize || 2,
      venueKind: searchProfile.venueKind || 'All',
      servingStyle: searchProfile.servingStyle || 'All',
      weatherMode: weatherMode || searchProfile.weatherMode,
    });
    const recommendedVenues = [picks.timeSpecial, picks.nearest, picks.hiddenGem].filter(Boolean);

    if (!recommendedVenues.length) {
      return null;
    }

    const uniqueVenues = recommendedVenues.filter(
      (venue, index, arr) => arr.findIndex((item) => item.id === venue.id) === index
    );

    syncMapWithVenues(uniqueVenues, 'proactive');

    const openVenues = uniqueVenues.filter((venue) => isVenueOpen(venue, timeStr));
    const primaryVenue = openVenues[0] || uniqueVenues[0];

    const draft = {
      primaryVenue,
      venues: uniqueVenues,
      intro: `Mình đã ghim sẵn ${primaryVenue.name} trên bản đồ cho khung giờ này.`,
      followUp:
        uniqueVenues.length > 1
          ? `Nếu chưa hợp, mình có sẵn ${uniqueVenues[1].name} để bạn so sánh ngay.`
          : 'Bạn có thể bấm marker đang sáng để xem card chi tiết và đi tiếp.',
    };

    setBotDraft({
      primaryVenueId: primaryVenue.id,
      venueIds: uniqueVenues.map((venue) => venue.id),
      cta: draft.followUp,
    });

    return draft;
  }, [
    searchProfile.partySize,
    searchProfile.radiusKm,
    searchProfile.servingStyle,
    searchProfile.userLoc,
    searchProfile.venueKind,
    searchProfile.weatherMode,
    syncMapWithVenues,
  ]);

  const value = useMemo(() => ({
    isConsulting,
    focusConfig,
    activeVenueId,
    highlightedVenueIds,
    botDraft,
    mapNarrative,
    searchProfile,
    startConsultation,
    endConsultation,
    focusVenue,
    clearMapFocus,
    updateSearchProfile,
    resetSearchProfile,
    syncBotResponse,
    seedProactivePlan,
  }), [
    activeVenueId,
    botDraft,
    clearMapFocus,
    endConsultation,
    focusConfig,
    focusVenue,
    highlightedVenueIds,
    isConsulting,
    mapNarrative,
    resetSearchProfile,
    searchProfile,
    seedProactivePlan,
    startConsultation,
    syncBotResponse,
    updateSearchProfile,
  ]);

  return (
    <ConciergeContext.Provider value={value}>
      {children}
    </ConciergeContext.Provider>
  );
};

export const useConcierge = () => useContext(ConciergeContext);
