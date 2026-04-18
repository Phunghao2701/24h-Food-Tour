# Skill: Dynamic Routing

## Overview
The core logic for the "Smart Planning" engine. This skill calculates the feasibility and optimization of food tour itineraries.

## Instructions
- **Logic Constraints**:
  - Minimum eating time per stop: 30-45 minutes.
  - Travel time: Calculate using Mapbox/Google Maps Matrix API (Add a 10-minute "buffer" for parking/finding the spot).
  - Business Hours: Check `opening_hours` for EVERY stop. A stop is only valid if it remains open for at least 60 minutes after the estimated arrival time.
- **Optimization Goal**:
  - Prioritize "Clustered Tours" (short travel distances between 8h-11h).
  - Transition between districts (e.g., Q1 to Q3) should ideally happen during non-peak traffic hours.
- **Example Calculation**:
  - `If (UserArrival[StopA] == 08:00) && (Duration[StopA] == 45min) && (Travel[StopA -> StopB] == 15min)`
  - `Then (EstimatedArrival[StopB] == 09:00)`
  - `Check If (StopB.open_at <= 09:00) && (StopB.close_at >= 10:00)`
- **Output**: Return a JSON itinerary with exact timestamps and optimized routes.
