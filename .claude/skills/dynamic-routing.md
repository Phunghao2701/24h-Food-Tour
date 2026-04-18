# Skill: Dynamic Routing & Spatial Intelligence

## Overview
The core logic for the "Smart Planning" engine. This skill calculates the feasibility, optimization, and **spatial proximity** of food tour itineraries.

## Core Logic & Spatial Constraints
- **Proximity Filtering (The "3km Rule")**: 
  - By default, suggestions must be within a **3km radius** of the user's current GPS coordinates.
  - If no high-quality spots are found within 3km, expand to 5km, but prioritize the closest option.
- **Distance Calculation**: 
  - Use the **Haversine Formula** to calculate direct distance ($d$) between two points:
    $$d = 2r \arcsin\left(\sqrt{\sin^2\left(\frac{\phi_2 - \phi_1}{2}\right) + \cos(\phi_1) \cos(\phi_2) \sin^2\left(\frac{\lambda_2 - \lambda_1}{2}\right)}\right)$$
  - *Where $r = 6371$ km (Earth's radius).*
- **Location Fallback**:
  - If `user_location` is null/undefined, default anchor to **FPT University HCMC (10.8411, 106.8100)**.
  - Always flag "Using Default Location" in the UI if GPS is disabled.

## Time & Route Optimization
- **Logic Constraints**:
  - Minimum eating time per stop: 30-45 minutes.
  - Travel time: Calculate using Mapbox Matrix API. Add a **10-minute "buffer"** for parking/finding the spot (crucial for HCMC alleys).
  - Business Hours: Check `opening_hours`. A stop is only valid if it remains open for at least 60 minutes after the estimated arrival time.
- **Priority Rules**:
  - **Priority 1 (Proximity)**: Rank suggestions by ascending distance from current coordinates.
  - **Priority 2 (Opening Status)**: Must be currently `Open`.
  - **Priority 3 (Quality)**: Prioritize venues with `review_score > 4.5`.
  - **Priority 4 (Variation)**: Pivot categories (e.g., from Pho to Coffee) if user requests a change.

## Output Generation
- Return a JSON itinerary including:
  - `distance_from_user`: Exact distance in km.
  - `estimated_arrival`: Based on current time + travel buffer.
  - `map_action`: Instructions for the Map component to `flyTo` the suggested coordinates.

## Example Scenario:
- **Input**: User at Vinhome Grand Park (10.83xx, 106.83xx) at 20:00.
- **Agent Action**:
  1. Filter `RAW_FOOD_DATA` within 3km.
  2. Filter for `isOpen` at 20:00.
  3. Sort by Distance -> Result: "Ốc Đào D9" (1.2km away).
  4. Output: Suggest "Ốc Đào D9" with a 5-min travel estimate.