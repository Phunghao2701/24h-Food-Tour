export const ITINERARIES = [
  {
    id: 'night-owl',
    title: 'The Night Owl',
    tagline: '22h - 4h • Late Night Cravings',
    description: 'When the city slows down, the best food comes out. From "Trash Can Rice" to midnight noodles.',
    gradient: 'from-ube-800 to-blueberry-800',
    accent: 'ube-300',
    stops: [
      { time: '22:30', name: 'Cháo Trắng Hàng Xanh', type: 'Late Night Comfort', status: 'Active' },
      { time: '00:00', name: 'Hủ Tiếu Gõ Cô Ba', type: 'Street Food', status: 'Packing Up Soon' },
      { time: '02:00', name: 'Cơm Tấm Bãi Rác', type: 'Hidden Gem', status: 'Full House' },
    ]
  },
  {
    id: 'early-bird',
    title: 'The Early Bird',
    tagline: '05h - 10h • Sunrise & Steam',
    description: 'Start your day with the rhythmic clinking of coffee filters and the aroma of morning broth.',
    gradient: 'from-lemon-400 to-lemon-700',
    accent: 'lemon-800',
    stops: [
      { time: '05:30', name: 'Cà Phê Vợt Phan Đình Phùng', type: 'Traditional', status: 'Vibrant' },
      { time: '07:00', name: 'Bún Mọc Thanh Mai', type: 'Market Breakfast', status: 'Queuing' },
      { time: '09:00', name: 'Phở Bưng Vỉa Hè', type: 'Street Food', status: 'Running Out' },
    ]
  },
  {
    id: 'non-stop-challenge',
    title: '24h Non-stop Challenge',
    tagline: '8 Meals • 24 Hours • 1 Champion',
    description: 'The ultimate culinary marathon. 8 curated stops with optimized digestion breaks.',
    gradient: 'from-pomegranate-400 to-slushie-800',
    accent: 'matcha-300',
    stops: [
      { time: '08:00', name: 'Stop 1: Breakfast Phở', type: 'Start' },
      { time: '12:00', name: 'Stop 2: Lunch Bún Chả', type: 'Progress' },
      { time: '16:00', name: 'Stop 3: Afternoon Snacks', type: 'Progress' },
      { time: '19:00', name: 'Stop 4: Dinner BBQ', type: 'Progress' },
      // ... more stops
    ]
  },
  {
    id: 'district-9-night',
    title: 'Làng Đại Học Night',
    tagline: '22h - 5h • The Study Marathon',
    description: "District 9's legendary student life. From workspace cafes to silent corners for pre-exam grinds.",
    gradient: 'from-matcha-600 to-matcha-900',
    accent: 'matcha-300',
    stops: [
      { time: '22:00', name: 'TRẠM 24h', type: 'Workspace', status: 'Focused' },
      { time: '01:00', name: 'Créma Coffee 24h', type: 'Social Study', status: 'Full Capacity' },
      { time: '03:30', name: 'KATALI COFFEE', type: 'Chill Out', status: 'Quiet' },
    ]
  }
];

export const VENUES = [
  {
    id: 1,
    name: "Hẻm 158 Pasteur",
    category: "Hidden Gem",
    isLocal: true,
    status: "Busy",
    coord: [10.776, 106.696],
    summary: "Deep in the alley, no signs, just 30 years of noodle mastery."
  },
  {
    id: 2,
    name: "The Gantry",
    category: "Fine Dining",
    isLocal: false,
    status: "Booking Required",
    coord: [10.778, 106.702],
    summary: "High-end Twist on traditional flavors."
  },
  {
    id: 3,
    name: "TRẠM 24h",
    category: "Street Food",
    isLocal: true,
    status: "Active",
    coord: [10.825, 106.765],
    summary: "The ultimate student sanctuary in Phước Long B. Quiet, spacious, and open forever."
  },
  {
    id: 4,
    name: "Trân Kỳ Coffee & Tea",
    category: "Hidden Gem",
    isLocal: true,
    status: "Vibrant",
    coord: [10.815, 106.775],
    summary: "Vintage aesthetics meet 24/7 convenience on Đỗ Xuân Hợp."
  },
  {
    id: 5,
    name: "KATALI COFFEE",
    category: "Street Food",
    isLocal: true,
    status: "Focused",
    coord: [10.840, 106.772],
    summary: "Modern vibes and strong energy on the busy Lê Văn Việt strip."
  },
  {
    id: 6,
    name: "WORKAHOLIC CAFE 24/7",
    category: "Hidden Gem",
    isLocal: true,
    status: "Quiet",
    coord: [10.845, 106.785],
    summary: "Dedicated co-working pods and a serious atmosphere for 'running deadlines'."
  },
  {
    id: 7,
    name: "Créma Coffee 24h",
    category: "Street Food",
    isLocal: true,
    status: "Social",
    coord: [10.842, 106.781],
    summary: "The heart of Man Thiện student life. Always bustling, always welcoming."
  }
];
