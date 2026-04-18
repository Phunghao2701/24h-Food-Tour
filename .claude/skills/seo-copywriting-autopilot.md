# Skill: SEO & Copywriting Autopilot

## Overview
Automated generation of premium, SEO-optimized content for new restaurant listings.

## Instructions
- **Trigger**: New venue entry detection in Firestore.
- **Input Data**: 
  - Venue Name
  - Address/District
  - Category (Street Food, Hidden Gem, etc.)
  - Representative Dishes.
- **Generation Logic**:
  - **Tone**: Premium, emotional, and authentic (Avoid generic marketing fluff).
  - **SEO Hooks**: Include keywords like "Best [Dish] in [District]", "Must-eat Saigon", "Hidden Gem".
  - **Schema Markup**: Generate JSON-LD for LocalBusiness and MenuItem.
- **Copywriting Template**:
  - `Title`: "[Dish Name] at [Venue Name]: A District [Number] Legend"
  - `Body`: Describe the aroma, the history (if available), and why it's a "must-eat". Mention the exact location metadata.
- **Review**: All AI-generated copy must be tagged with `status: "Needs Review"` for the Copywriter agent/Human to finalize before publishing.
