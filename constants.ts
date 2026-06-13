
import { Crop, MarketPrice, WeatherData, ChartDataPoint, Task, Livestock, LearningModule, MarketplaceListing, ForumPost, CommunityChatMessage, Story, SocialTrend, SuggestedUser, UserProfile, SystemAlert } from './types';

export const APP_NAME = "AgriFlow";

// --- CURRENT USER IDENTITY ---
export const CURRENT_USER: UserProfile = {
  name: "Adebayo Okonkwo",
  role: "Farm Manager",
  farmName: "Green Sahel Farms",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
  bio: "Managing 200 hectares of maize, rice and cassava in Kano State, Nigeria. Focused on climate-smart agriculture and precision irrigation.",
  followers: 1890,
  following: 120,
  posts: 256
};

export const GUEST_USER: UserProfile = {
  name: "Guest Farmer",
  role: "Visitor",
  farmName: "Demo Farm",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80", 
  bio: "Exploring the AgriFlow platform. Sign in to access your farm dashboard and market prices.",
  followers: 0,
  following: 0,
  posts: 0
};

export const INITIAL_ALERTS: SystemAlert[] = [
  {
    id: '1',
    title: 'Input Cost Spike',
    message: 'Fertilizer (UREA) prices up 12.5% MoM. Re-evaluate application rates for maize plots — NBS reports food inflation at 23.5% (Feb 2025, rebased CPI).',
    severity: 'high',
    category: 'FINANCIAL',
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Severe Dry Spell Warning',
    message: 'Nigerian Met Agency forecasts severe dry spell in northern regions Jun-Aug 2026. Delayed onset and shorter rainy season expected in NE and North-Central zones.',
    severity: 'critical',
    category: 'WEATHER',
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '3',
    title: 'Food Insecurity Alert',
    message: '25.1 million Nigerians acutely food insecure (CH Phase 3+, Q4 2024). Projected 33.2M during Jun-Aug 2025 lean season. Conflict-affected areas most at risk.',
    severity: 'high',
    category: 'LAND',
    timestamp: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: '4',
    title: 'Cereal Production Below Average',
    message: 'Nigeria 2024 cereal output estimated at 28.5M tonnes — 3% below five-year average. Dry spells, floods and pest outbreaks affected yields across the country.',
    severity: 'medium',
    category: 'SYSTEM',
    timestamp: new Date(Date.now() - 10800000).toISOString()
  }
];

export const MOCK_WEATHER: WeatherData = {
  locationName: 'Kano Station, Nigeria',
  temp: 36,
  condition: 'Dry Spell Advisory',
  humidity: 32,
  windSpeed: 22,
  forecast: 'PRESASS forecasts average to above-average Sahel rainfall Jun-Sep 2026, but severe dry spells likely in northern Nigeria (Jun-Aug). Delayed onset in North-Central zone.',
  climateRiskIndex: 'High'
};

export const INITIAL_CROPS: Crop[] = [
  {
    id: '1',
    name: 'Maize',
    variety: 'Drought-Tol OBA Super 2',
    plantingDate: '2026-05-15',
    harvestDate: '2026-09-30',
    status: 'Needs Attention',
    area: 50,
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=1000&auto=format&fit=crop',
    soilHealth: 'Degraded',
    waterEfficiency: 'Low',
    biodiversityScore: 22
  },
  {
    id: '2',
    name: 'Rice',
    variety: 'NERICA L-34 (Lowland)',
    plantingDate: '2026-06-01',
    harvestDate: '2026-10-15',
    status: 'Healthy',
    area: 30,
    imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ced72a?q=80&w=1000&auto=format&fit=crop',
    soilHealth: 'Good',
    waterEfficiency: 'Moderate',
    biodiversityScore: 55
  },
  {
    id: '3',
    name: 'Cassava',
    variety: 'TMS 30572 (IITA)',
    plantingDate: '2026-04-20',
    harvestDate: '2027-02-28',
    status: 'Healthy',
    area: 25,
    imageUrl: 'https://images.unsplash.com/photo-1584345604325-f5091269a0d1?q=80&w=1000&auto=format&fit=crop',
    soilHealth: 'Good',
    waterEfficiency: 'High',
    biodiversityScore: 68
  },
  {
    id: '4',
    name: 'Cowpea',
    variety: 'SAMPEA 11 (IAR)',
    plantingDate: '2026-07-01',
    harvestDate: '2026-10-01',
    status: 'Healthy',
    area: 15,
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop',
    soilHealth: 'Good',
    waterEfficiency: 'High',
    biodiversityScore: 80
  },
  {
    id: '5',
    name: 'Sorghum',
    variety: 'CSR-01 (ICRISAT)',
    plantingDate: '2026-06-15',
    harvestDate: '2026-10-30',
    status: 'Needs Attention',
    area: 20,
    imageUrl: 'https://images.unsplash.com/photo-1533230537024-38c3459c9c9b?q=80&w=1000&auto=format&fit=crop',
    soilHealth: 'Degraded',
    waterEfficiency: 'Moderate',
    biodiversityScore: 35
  }
];

export const INITIAL_LIVESTOCK: Livestock[] = [
  {
    id: '1',
    name: 'Fulani Herd Unit A',
    species: 'Cattle',
    count: 85,
    status: 'Healthy',
    grazingType: 'Rotational',
    imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=1000&auto=format&fit=crop',
    notes: 'Transhumance herd. Dry season migration from Sahel zone to southern pasture (Nov-May).'
  },
  {
    id: '2',
    name: 'Free-Range Poultry Flock',
    species: 'Chicken',
    count: 250,
    status: 'Healthy',
    grazingType: 'Free Range',
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000&auto=format&fit=crop',
    notes: 'Newcastle disease vaccination completed Q1 2026. Scavenging system with supplementary feeding.'
  },
  {
    id: '3',
    name: 'Sahel Goat Herd',
    species: 'Goat',
    count: 60,
    status: 'Healthy',
    grazingType: 'Free Range',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop',
    notes: 'Sokoto Red breed. Drought-resistant. Used for meat and manure for soil fertility.'
  }
];

export const INITIAL_MODULES: LearningModule[] = [
  {
    id: '1',
    title: 'Climate-Smart Sahel Farming',
    instructor: 'Dr. Amina Bello (IITA)',
    thumbnail: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800&fit=crop',
    lessonsCount: 12,
    category: 'Resilience',
    difficulty: 'Advanced',
    duration: '4h 15m',
    completed: false,
    description: 'Drought-tolerant varieties, conservation agriculture, and Zai pit techniques for the Sahel. Improve soil organic matter and water retention on sandy soils.'
  },
  {
    id: '2',
    title: 'Farm Finance in Volatile Markets',
    instructor: 'Chukwuma Eze (CBN Agric)',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800',
    lessonsCount: 8,
    category: 'Economics',
    difficulty: 'Intermediate',
    duration: '2h 30m',
    completed: true,
    description: 'Navigating Naira volatility, input cost spikes, and cooperative bulk purchasing. Accessing NIRSAL credit and BOA loan windows for 2026 season.'
  },
  {
    id: '3',
    title: 'Precision Irrigation for Drylands',
    instructor: 'Prof. Issa Garba (ABU Zaria)',
    thumbnail: 'https://images.unsplash.com/photo-1563309461-a319263584d7?q=80&w=800',
    lessonsCount: 15,
    category: 'Tech',
    difficulty: 'Advanced',
    duration: '5h 00m',
    completed: false,
    description: 'Solar-powered drip irrigation, treadle pumps, and smart soil moisture sensors. Optimizing water usage under Sahel dry spell conditions.'
  },
  {
    id: '4',
    title: 'Drone Scouting for Crop Health',
    instructor: 'Tech Lead Aisha (AgriMach NG)',
    thumbnail: 'https://images.unsplash.com/photo-1508614589041-895b8c9d7ef5?q=80&w=800',
    lessonsCount: 6,
    category: 'Tech',
    difficulty: 'Beginner',
    duration: '1h 45m',
    completed: false,
    description: 'Deploy NDVI drones to detect Fall Armyworm and Striga stress early. Practical training for smallholder and medium-scale farms.'
  },
  {
    id: '5',
    title: 'Integrated Pest & Disease Management',
    instructor: 'Dr. Sunday Eze (IAR Samaru)',
    thumbnail: 'https://images.unsplash.com/photo-1585652684742-c24c64db7071?q=80&w=800',
    lessonsCount: 10,
    category: 'Resilience',
    difficulty: 'Intermediate',
    duration: '3h 20m',
    completed: false,
    description: 'Push-pull technology for FAW control, Striga management, pheromone traps, and cowpea intercropping. Reducing pesticide dependence across West Africa.'
  }
];

export const MARKET_PRICES: MarketPrice[] = [
  { cropName: 'Maize', price: 28500, unit: 'per 100kg (NGN)', trend: 'up', changePercentage: 8.2, inputCostIndex: 115 },
  { cropName: 'Rice (Local)', price: 52000, unit: 'per 100kg (NGN)', trend: 'up', changePercentage: 15.0, inputCostIndex: 108 },
  { cropName: 'Cassava', price: 18500, unit: 'per 100kg (NGN)', trend: 'stable', changePercentage: 1.2, inputCostIndex: 95 },
  { cropName: 'Sorghum', price: 22000, unit: 'per 100kg (NGN)', trend: 'up', changePercentage: 10.5, inputCostIndex: 110 },
  { cropName: 'Millet', price: 20000, unit: 'per 100kg (NGN)', trend: 'up', changePercentage: 12.0, inputCostIndex: 108 },
  { cropName: 'Cocoa', price: 8950, unit: 'per ton (USD)', trend: 'up', changePercentage: 4.2, inputCostIndex: 130 },
  { cropName: 'Cowpea', price: 35000, unit: 'per 100kg (NGN)', trend: 'down', changePercentage: -3.5, inputCostIndex: 100 },
  { cropName: 'Groundnut', price: 42000, unit: 'per 100kg (NGN)', trend: 'stable', changePercentage: 0.8, inputCostIndex: 105 },
  { cropName: 'Yam', price: 45000, unit: 'per 100kg (NGN)', trend: 'up', changePercentage: 5.5, inputCostIndex: 98 },
  { cropName: 'Fertilizer (UREA)', price: 28000, unit: 'per 50kg (NGN)', trend: 'up', changePercentage: 12.5, inputCostIndex: 100 },
];

export const YIELD_DATA: ChartDataPoint[] = [
  { name: '2020', value: 1520, cost: 685 },
  { name: '2021', value: 1610, cost: 780 },
  { name: '2022', value: 1580, cost: 920 },
  { name: '2023', value: 1654, cost: 1050 },
  { name: '2024', value: 1654, cost: 1180 },
  { name: '2025 (Est)', value: 1620, cost: 1200 },
  { name: '2026 (Fcast)', value: 1580, cost: 1280 },
];

export const INITIAL_TASKS: Task[] = [
  { id: '1', text: 'Secure drought-tolerant maize seed (OBA Super 2) before July planting window', completed: false, priority: 'high' },
  { id: '2', text: 'Irrigation pump maintenance — dry spell forecast Jun-Aug', completed: false, priority: 'high' },
  { id: '3', text: 'Apply split fertilizer dose — urea price up 12.5%, optimize usage', completed: false, priority: 'normal' },
  { id: '4', text: 'Vaccinate poultry flock — Newcastle disease booster Q2 2026', completed: false, priority: 'high' },
  { id: '5', text: 'Soil moisture test — northern fields before sorghum planting', completed: false, priority: 'normal' },
];

export const INITIAL_LISTINGS: MarketplaceListing[] = [
  { 
    id: '1', 
    type: 'SELL', 
    item: 'Local Rice - 50 Bags (100kg)', 
    price: '₦52,000/bag', 
    location: 'Kano, Nigeria', 
    contact: 'adebayo@greensahel.com', 
    verified: true,
    status: 'ACTIVE',
    date: new Date(Date.now() - 86400000).toISOString(),
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ced72a?q=80&w=400&auto=format&fit=crop'
  },
  { 
    id: '2', 
    type: 'BUY', 
    item: 'Tractor Ploughing Service - 5 Hectares', 
    price: '₦45,000/ha', 
    location: 'Kaduna, Nigeria', 
    contact: 'adebayo@greensahel.com', 
    verified: true,
    status: 'ACTIVE',
    date: new Date(Date.now() - 172800000).toISOString(),
    image: 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?w=400&fit=crop'
  },
  { 
    id: '3', 
    type: 'SELL', 
    item: 'Cocoa Beans - Premium Grade (2 Tons)', 
    price: '$8,950/ton', 
    location: 'Kumasi, Ghana', 
    contact: 'kwame@cocoak.Asante.co', 
    verified: true,
    status: 'ACTIVE',
    date: new Date(Date.now() - 259200000).toISOString(),
    image: 'https://images.unsplash.com/photo-1584345604325-f5091269a0d1?q=80&w=400&auto=format&fit=crop'
  },
];

export const INITIAL_POSTS: ForumPost[] = [
  { 
    id: '1', 
    author: 'Fatima M.', 
    title: 'Best cover crop for Sahel sandy soil before rainy season?', 
    content: 'My millet fields in Sokoto have degrading sandy soil. Has anyone tried cowpea as a cover crop before the main season? Worried about the delayed onset forecast.',
    replies: 18, 
    likes: 8,
    category: 'General',
    date: new Date(Date.now() - 86400000).toISOString(),
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=400&auto=format&fit=crop'
  },
  { 
    id: '2', 
    author: 'Ibrahim D.', 
    title: 'Fall Armyworm alert in Kano maize fields', 
    content: 'Spotted FAW damage on early-planted maize. Pheromone traps catching 40+ moths per night. Start scouting whorls immediately — early action saves the crop.',
    replies: 52, 
    likes: 189,
    category: 'Pests',
    date: new Date(Date.now() - 3600000).toISOString(),
    image: 'https://images.unsplash.com/photo-1533230537024-38c3459c9c9b?q=80&w=400&auto=format&fit=crop'
  },
  { 
    id: '3', 
    author: 'AgriSolar Nigeria', 
    title: 'Solar irrigation pump review: Grundfos vs Lobera for dry season', 
    content: 'We field-tested both solar pump systems in Kebbi State. Flow rates under partial cloud cover and cost per hectare results inside...',
    replies: 14, 
    likes: 28,
    category: 'Equipment',
    date: new Date(Date.now() - 604800000).toISOString(),
    image: 'https://images.unsplash.com/photo-1591466068305-64906f363065?q=80&w=400&auto=format&fit=crop'
  },
  { 
    id: '4', 
    author: 'Kwame A.', 
    title: 'Ghana cocoa output drops 4th consecutive year — impact on West Africa', 
    content: 'Ghana Statistical Services reports another year of reduced cocoa output, causing significant livelihood losses in central and southern regions. How are farmers adapting?',
    replies: 35, 
    likes: 72,
    category: 'Market',
    date: new Date(Date.now() - 432000000).toISOString(),
    image: 'https://images.unsplash.com/photo-1584345604325-f5091269a0d1?q=80&w=400&auto=format&fit=crop'
  },
];

export const INITIAL_CHAT_MESSAGES: CommunityChatMessage[] = [
  { id: '1', channelId: 'general', author: 'Mallam Yusuf', text: 'Rain started in Katsina yesterday but very light. NiMet says we may get a dry spell in July — keep irrigation ready.', timestamp: new Date(Date.now() - 3600000).toISOString(), avatar: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', isMe: false },
  { id: '2', channelId: 'general', author: 'Fatima M.', text: 'Thanks Yusuf! My cowpea is already in the ground. Should I consider replanting if the rains fail in July?', timestamp: new Date(Date.now() - 1800000).toISOString(), avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop', isMe: false },
  { id: '3', channelId: 'market', author: 'Ibrahim D.', text: 'Maize prices up 8% in Kano market this week. Fertilizer costs still climbing — urea at ₦28,000 per 50kg bag.', timestamp: new Date(Date.now() - 900000).toISOString(), avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop', isMe: false },
  { id: '4', channelId: 'livestock', author: 'Herdsmann Ali', text: 'Moving cattle south early this year — Sahel pasture already thinning. Who else is doing early transhumance?', timestamp: new Date(Date.now() - 4000000).toISOString(), avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop', isMe: false },
];

export const INITIAL_STORIES: Story[] = [
  { id: 'create', name: 'Add Story', img: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', isUser: true },
  { id: '1', name: 'SahelGrowers', img: 'https://images.unsplash.com/photo-1627920769842-6887c7df0561?w=150&h=150&fit=crop', hasUpdate: true },
  { id: '2', name: 'CocoaCo GH', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=150&h=150&fit=crop', hasUpdate: true },
  { id: '3', name: 'Vet Dr. Amadou', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop', hasUpdate: false },
  { id: '4', name: 'AgriMach NG', img: 'https://images.unsplash.com/photo-1595514682057-01053229b150?w=150&h=150&fit=crop', hasUpdate: true },
];

export const INITIAL_TRENDS: SocialTrend[] = [
  { id: '1', tag: '#SahelRain2026', volume: '18.7K Posts' },
  { id: '2', tag: '#FoodSecurityNG', volume: '14.3K Posts' },
  { id: '3', tag: '#DrySpellAlert', volume: '9.5K Posts' },
  { id: '4', tag: '#CocoaPrices', volume: '6.8K Posts' },
  { id: '5', tag: '#AgriTechWestAfrica', volume: '4.2K Posts' },
];

export const INITIAL_SUGGESTED_USERS: SuggestedUser[] = [
  { id: 'sf1', name: "Amina Bello", role: "Rice Agronomist (IITA)", img: "https://images.unsplash.com/photo-1627920769842-6887c7df0561?w=150&h=150&fit=crop", mutual: 24 },
  { id: 'sf2', name: "Kwame Asante", role: "Cocoa Specialist (Ghana)", img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=150&h=150&fit=crop", mutual: 18 },
  { id: 'sf3', name: "Dr. Ousmane Diop", role: "Livestock Vet (Senegal)", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop", mutual: 31 }
];
