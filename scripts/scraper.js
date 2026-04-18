import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Environment Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MOCK_DATA_PATH = path.join(__dirname, '../src/utils/mockData.js');

async function runScraper() {
  console.log('🌍 Switching to Overpass API (OpenStreetMap)...');
  
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"~"restaurant|cafe|fast_food|bakery"](10.79,106.75,10.89,106.84);
      way["amenity"~"restaurant|cafe|fast_food|bakery"](10.79,106.75,10.89,106.84);
      relation["amenity"~"restaurant|cafe|fast_food|bakery"](10.79,106.75,10.89,106.84);
    );
    out center;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    });

    if (!response.ok) {
      throw new Error(`Overpass API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.elements && data.elements.length > 0) {
      const newVenues = data.elements
        .filter(el => el.tags && el.tags.name) // Must have a name
        .map(el => mapOSMToVenue(el));
      
      console.log(`✅ Found ${newVenues.length} locations in District 9 via OSM.`);
      updateMockDataFile(newVenues);
    } else {
      console.warn('⚠️ No locations found via Overpass query.');
    }
  } catch (error) {
    console.error('❌ Overpass Scraper Failed:', error.message);
  }
}

function mapOSMToVenue(el) {
  const tags = el.tags;
  const lat = el.lat || (el.center && el.center.lat);
  const lon = el.lon || (el.center && el.center.lon);

  // Parse category
  let category = "Street Food";
  if (tags.amenity === 'cafe') category = "Hidden Gem";
  if (tags.cuisine === 'fine_dining') category = "Fine Dining";

  // Basic Opening Hours Parser
  let open_at = "08:00";
  let close_at = "22:00";
  if (tags.opening_hours === '24/7') {
    open_at = "00:00";
    close_at = "23:59";
  } else if (tags.opening_hours) {
    // Attempt to extract first time range like 08:00-22:00
    const match = tags.opening_hours.match(/(\d{2}:\d{2})-(\d{2}:\d{2})/);
    if (match) {
      open_at = match[1];
      close_at = match[2];
    }
  }

  return {
    name: tags.name,
    category: category,
    coord: [lat, lon],
    district: "District 9",
    open_at: open_at,
    close_at: close_at,
    review_score: 4.0 + (Math.random() * 0.9), // OSM doesn't have ratings, generating realistic mock score
    price_range: tags.price === 'low' ? '$' : '$$',
    is_hidden_gem: category === 'Hidden Gem' || !!tags['contact:phone'],
    summary: tags.description || `Authentic ${tags.cuisine || tags.amenity} spot discovered via OpenStreetMap.`
  };
}

function updateMockDataFile(venues) {
  try {
    const content = fs.readFileSync(MOCK_DATA_PATH, 'utf8');
    const venuesMatch = content.match(/export const VENUES = \[\s*([\s\S]*?)\s*\];/);
    
    if (!venuesMatch) {
      console.error('❌ Could not find VENUES array');
      return;
    }

    const existingVenuesStr = venuesMatch[1];
    const existingNames = [...content.matchAll(/name: "(.*?)"/g)].map(m => m[1]);
    const idMatches = existingVenuesStr.match(/id: (\d+)/g);
    let maxId = idMatches ? Math.max(...idMatches.map(m => parseInt(m.split(': ')[1]))) : 0;

    const filteredVenues = venues.filter(v => !existingNames.includes(v.name)).slice(0, 10); // Limit to 10 for sanity

    if (filteredVenues.length === 0) {
       console.log('✨ No new OSM venues to add.');
       return;
    }

    const newEntriesStr = filteredVenues.map(v => {
      maxId++;
      return `  {
    id: ${maxId},
    name: "${v.name}",
    category: "${v.category}",
    isLocal: true,
    status: "Active",
    coord: [${v.coord[0]}, ${v.coord[1]}],
    district: "${v.district}",
    open_at: "${v.open_at}",
    close_at: "${v.close_at}",
    review_score: ${v.review_score.toFixed(1)},
    price_range: "${v.price_range}",
    is_hidden_gem: ${v.is_hidden_gem},
    summary: "${v.summary}"
  }`;
    }).join(',\n');

    const updatedVenues = `export const VENUES = [\n${existingVenuesStr},\n${newEntriesStr}\n];`;
    const newFileContent = content.replace(/export const VENUES = \[\s*[\s\S]*?\s*\];/, updatedVenues);

    fs.writeFileSync(MOCK_DATA_PATH, newFileContent);
    console.log(`✅ Successfully added ${filteredVenues.length} NEW venues from OpenStreetMap!`);
    
  } catch (error) {
    console.error('❌ Error updating file:', error);
  }
}

runScraper();
