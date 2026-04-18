# Skill: Content Scraper & Curator

## Overview
This skill enables the backend agent to periodically scan and validate restaurant data from external sources to ensure the absolute accuracy of the "24h Food Tour" platform.

## Instructions
- **Trigger**: Run scheduled checks (e.g., weekly) or on-demand when a venue reports a potential change.
- **Sources**: 
  - OpenStreetMap / Overpass API (Primary source for free, community-driven venue discovery).
  - Google Maps API (Check for temporary closures/ratings).
  - Social Media Groups (Local food communities for trending status).
  - Official restaurant websites/pages.
- **Validation Logic**:
  - Check if `opening_hours` matches current Firestore data.
  - Check for "Permanently Closed" or "Temporarily Closed" flags.
  - Scan for price range updates in recent user review photos.
- **Update Workflow**:
  - If a change is detected, stage the update for human review or updates Firestore directly if confidence > 95%.
  - Log all changes for the Project Manager agent to review in the next sprint planning.
