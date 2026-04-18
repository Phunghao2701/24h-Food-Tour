import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MOCK_DATA_PATH = path.join(__dirname, '../src/utils/mockData.js');

const AREA_CONFIGS = {
  'district-9': {
    label: 'Quận 9',
    district: 'Quận 9',
    bbox: [10.79, 106.75, 10.89, 106.84],
  },
  'go-vap': {
    label: 'Gò Vấp',
    district: 'Gò Vấp',
    bbox: [10.79, 106.64, 10.87, 106.71],
  },
};

const OVERPASS_TAGS = 'restaurant|cafe|fast_food|bakery|ice_cream|bar';
const GENERIC_NAMES = ['restaurant', 'cafe', 'coffee', 'coffee shop', 'quán ăn', 'quán cà phê', 'bakery', 'fast food'];
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];

const escapeJsString = (value = '') =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, ' ')
    .trim();

const getAreaConfig = () => {
  const areaKey = process.argv[2] || 'district-9';
  const config = AREA_CONFIGS[areaKey];

  if (!config) {
    const supportedAreas = Object.keys(AREA_CONFIGS).join(', ');
    throw new Error(`Khu vực không hợp lệ: "${areaKey}". Hãy dùng một trong các giá trị: ${supportedAreas}`);
  }

  return config;
};

const buildOverpassQuery = ({ bbox }) => {
  const [south, west, north, east] = bbox;
  return `
    [out:json][timeout:25];
    (
      node["amenity"~"${OVERPASS_TAGS}"](${south},${west},${north},${east});
      way["amenity"~"${OVERPASS_TAGS}"](${south},${west},${north},${east});
      relation["amenity"~"${OVERPASS_TAGS}"](${south},${west},${north},${east});
    );
    out center;
  `;
};

const inferCategory = (tags) => {
  if (tags.amenity === 'cafe' || tags.amenity === 'ice_cream') return 'Hidden Gem';
  if (tags.cuisine === 'fine_dining' || tags.amenity === 'bar') return 'Fine Dining';
  return 'Street Food';
};

const inferBudgetTier = (tags) => {
  if (tags.price === 'low') return '$';
  if (tags.price === 'high') return '$$$';
  return '$$';
};

const inferBudgetRange = (priceRange, amenity) => {
  if (priceRange === '$') return { min: 25000, max: amenity === 'cafe' ? 55000 : 90000 };
  if (priceRange === '$$$') return { min: 180000, max: 400000 };
  return { min: amenity === 'cafe' ? 45000 : 70000, max: amenity === 'cafe' ? 120000 : 180000 };
};

const inferVenueKind = (tags) => {
  if (tags.amenity === 'cafe' || tags.amenity === 'ice_cream') return 'Nước uống';
  return 'Đồ ăn';
};

const inferServingStyle = (tags) => {
  const source = `${tags.cuisine || ''} ${tags.description || ''}`.toLowerCase();
  if (/(pho|bun|hu tieu|mi|lau|soup|noodle)/.test(source)) return 'Món nước';
  if (/(rice|com|banh mi|grill|fried|snack|bakery)/.test(source)) return 'Món khô';
  return 'Linh hoạt';
};

const buildSummary = (tags, venueKind, servingStyle) => {
  if (tags.description) return tags.description;
  const cuisine = tags.cuisine ? tags.cuisine.replace(/_/g, ' ') : tags.amenity;
  return `${venueKind} kiểu ${servingStyle.toLowerCase()} với phong cách ${cuisine}, lấy từ OpenStreetMap.`;
};

const parseOpeningHours = (openingHours) => {
  if (openingHours === '24/7') {
    return { open_at: '00:00', close_at: '23:59' };
  }

  if (!openingHours) {
    return { open_at: '08:00', close_at: '22:00' };
  }

  const match = openingHours.match(/(\d{2}:\d{2})-(\d{2}:\d{2})/);
  if (!match) {
    return { open_at: '08:00', close_at: '22:00' };
  }

  return { open_at: match[1], close_at: match[2] };
};

const mapOSMToVenue = (element, areaConfig) => {
  const tags = element.tags || {};
  const lat = element.lat || element.center?.lat;
  const lon = element.lon || element.center?.lon;
  const category = inferCategory(tags);
  const priceRange = inferBudgetTier(tags);
  const budgetRange = inferBudgetRange(priceRange, tags.amenity);
  const venueKind = inferVenueKind(tags);
  const servingStyle = inferServingStyle(tags);
  const opening = parseOpeningHours(tags.opening_hours);

  return {
    name: tags.name,
    category,
    coord: [lat, lon],
    district: areaConfig.district,
    open_at: opening.open_at,
    close_at: opening.close_at,
    review_score: 4.1 + Math.random() * 0.8,
    price_range: priceRange,
    price_min: budgetRange.min,
    price_max: budgetRange.max,
    venue_kind: venueKind,
    serving_style: servingStyle,
    cuisine_tags: tags.cuisine || tags.amenity || 'local',
    is_hidden_gem: category === 'Hidden Gem' || !!tags['contact:phone'],
    summary: buildSummary(tags, venueKind, servingStyle),
  };
};

const buildEntryString = (venue, id) => `  {
    id: ${id},
    name: "${escapeJsString(venue.name)}",
    category: "${escapeJsString(venue.category)}",
    isLocal: true,
    status: "Active",
    coord: [${venue.coord[0]}, ${venue.coord[1]}],
    district: "${escapeJsString(venue.district)}",
    open_at: "${venue.open_at}",
    close_at: "${venue.close_at}",
    review_score: ${venue.review_score.toFixed(1)},
    price_range: "${venue.price_range}",
    price_min: ${venue.price_min},
    price_max: ${venue.price_max},
    venue_kind: "${escapeJsString(venue.venue_kind)}",
    serving_style: "${escapeJsString(venue.serving_style)}",
    cuisine_tags: "${escapeJsString(venue.cuisine_tags)}",
    is_hidden_gem: ${venue.is_hidden_gem},
    summary: "${escapeJsString(venue.summary)}"
  }`;

const updateMockDataFile = (venues) => {
  const content = fs.readFileSync(MOCK_DATA_PATH, 'utf8');
  const venuesMatch = content.match(/export const VENUES = \[\s*([\s\S]*?)\s*\];/);

  if (!venuesMatch) {
    throw new Error('Không tìm thấy mảng VENUES trong mockData.js');
  }

  const existingVenuesStr = venuesMatch[1];
  const existingNames = [...content.matchAll(/name: "(.*?)"/g)].map((match) => match[1]);
  const idMatches = existingVenuesStr.match(/id: (\d+)/g);
  let maxId = idMatches ? Math.max(...idMatches.map((match) => Number(match.split(': ')[1]))) : 0;

  const filteredVenues = venues.filter((venue) => {
    const nameLower = venue.name.toLowerCase().trim();
    const isGeneric = GENERIC_NAMES.includes(nameLower);
    const isTooShort = venue.name.length < 3;
    const alreadyExists = existingNames.includes(venue.name);
    return !alreadyExists && !isGeneric && !isTooShort;
  });

  if (!filteredVenues.length) {
    console.log('✨ Không có địa điểm mới để thêm.');
    return;
  }

  const newEntries = filteredVenues.map((venue) => {
    maxId += 1;
    return buildEntryString(venue, maxId);
  }).join(',\n');

  const updatedVenues = `export const VENUES = [\n${existingVenuesStr},\n${newEntries}\n];`;
  const nextContent = content.replace(/export const VENUES = \[\s*[\s\S]*?\s*\];/, updatedVenues);
  fs.writeFileSync(MOCK_DATA_PATH, nextContent);

  console.log(`✅ Đã thêm ${filteredVenues.length} địa điểm mới vào dữ liệu mock.`);
};

const runScraper = async () => {
  const areaConfig = getAreaConfig();
  console.log(`🌍 Đang lấy dữ liệu Overpass cho ${areaConfig.label}...`);
  const query = buildOverpassQuery(areaConfig);
  let data = null;
  let lastError = null;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: query,
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      data = await response.json();
      console.log(`✅ Nhận dữ liệu từ ${endpoint}`);
      break;
    } catch (error) {
      lastError = error;
      console.warn(`⚠️ Endpoint lỗi ${endpoint}: ${error.message}`);
    }
  }

  if (!data) {
    throw new Error(`Không endpoint Overpass nào phản hồi thành công. Lỗi cuối: ${lastError?.message || 'unknown'}`);
  }

  const elements = data.elements || [];

  if (!elements.length) {
    console.log('⚠️ Overpass không trả về địa điểm nào.');
    return;
  }

  const venues = elements
    .filter((element) => element.tags?.name)
    .map((element) => mapOSMToVenue(element, areaConfig));

  console.log(`📍 Tìm thấy ${venues.length} địa điểm có tên ở ${areaConfig.label}.`);
  updateMockDataFile(venues);
};

runScraper().catch((error) => {
  console.error('❌ Scraper thất bại:', error.message);
  process.exitCode = 1;
});
