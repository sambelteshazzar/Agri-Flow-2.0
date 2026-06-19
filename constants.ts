
import { Crop, MarketPrice, WeatherData, ChartDataPoint, Task, Livestock, LearningModule, MarketplaceListing, ForumPost, CommunityChatMessage, Story, SocialTrend, SuggestedUser, UserProfile, SystemAlert, CountryConfig } from './types';

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
  posts: 256,
  countryCode: "NG",
  currencyCode: "NGN",
  currencySymbol: "₦",
  language: "en",
  region: "West Africa",
  farmType: "mixed",
  areaUnit: "ha",
  climateZone: "sahel",
  phoneNumber: "+234 801 234 5678",
  location: "Kano, Kano State"
};

export const GUEST_USER: UserProfile = {
  name: "Guest Farmer",
  role: "Visitor",
  farmName: "Demo Farm",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80", 
  bio: "Exploring the AgriFlow platform. Sign in to access your farm dashboard and market prices.",
  followers: 0,
  following: 0,
  posts: 0,
  countryCode: "",
  currencyCode: "USD",
  currencySymbol: "$",
  language: "en",
  region: "",
  farmType: "mixed",
  areaUnit: "ha",
  climateZone: "temperate",
  phoneNumber: "",
  location: ""
};

export const INITIAL_ALERTS: SystemAlert[] = [
  {
    id: '1',
    title: 'Input Cost Spike',
    message: 'Fertilizer (UREA) prices up 12.5% MoM. Re-evaluate application rates for maize plots — NBS reports food inflation at 22.8% (Q1 2026, rebased CPI).',
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
    message: '33.2 million Nigerians projected acutely food insecure (CH Phase 3+, Jun-Aug 2026 lean season). Northeast and Northwest zones most at risk — plan accordingly.',
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
    content: 'We jade-tested both solar pump systems in Kebbi State. Flow rates under partial cloud cover and cost per hectare results inside...',
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

// ============================================================
// COUNTRY REGISTRY — Regional data for multi-country support
// Each CountryConfig provides country-specific defaults that
// drive the onboarding wizard and all component data.
// ============================================================

export const COUNTRY_REGISTRY: Record<string, CountryConfig> = {
  NG: {
    code: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    currencyCode: 'NGN',
    currencySymbol: '₦',
    language: 'en',
    region: 'West Africa',
    climateZone: 'sahel',
    areaUnit: 'ha',
    defaultCrops: INITIAL_CROPS,
    defaultLivestock: INITIAL_LIVESTOCK,
    marketPrices: MARKET_PRICES,
    alerts: INITIAL_ALERTS,
    learningModules: INITIAL_MODULES,
    tasks: INITIAL_TASKS,
    marketplaceListings: INITIAL_LISTINGS,
    forumPosts: INITIAL_POSTS,
    chatMessages: INITIAL_CHAT_MESSAGES,
    trends: INITIAL_TRENDS,
    suggestedUsers: INITIAL_SUGGESTED_USERS,
    stories: INITIAL_STORIES,
    weatherDefaults: { locationName: 'Kano Station, Nigeria', temp: 36, condition: 'Dry Spell Advisory', humidity: 32, windSpeed: 22, forecast: 'PRESASS forecasts average to above-average Sahel rainfall Jun-Sep 2026, but severe dry spells likely in northern Nigeria (Jun-Aug). Delayed onset in North-Central zone.', climateRiskIndex: 'High' },
    dailyWageLocal: 3500,
    dailyWageUSD: 2.33,
    laborCurrencyCode: 'NGN',
  },
  GH: {
    code: 'GH',
    name: 'Ghana',
    flag: '🇬🇭',
    currencyCode: 'GHS',
    currencySymbol: 'GH₵',
    language: 'en',
    region: 'West Africa',
    climateZone: 'tropical_wet_dry',
    areaUnit: 'ha',
    defaultCrops: [
      { id: '1', name: 'Cocoa', variety: 'Amelonado (Hybrid)', plantingDate: '2026-04-01', harvestDate: '2026-11-30', status: 'Healthy', area: 40, imageUrl: 'https://images.unsplash.com/photo-1584345604325-f5091269a0d1?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'High', biodiversityScore: 72 },
      { id: '2', name: 'Oil Palm', variety: 'Tenera (OPRI)', plantingDate: '2026-03-15', harvestDate: '2027-02-28', status: 'Healthy', area: 25, imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'Moderate', biodiversityScore: 55 },
      { id: '3', name: 'Maize', variety: 'Obatanpa (CSIR)', plantingDate: '2026-05-01', harvestDate: '2026-09-15', status: 'Needs Attention', area: 15, imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Degraded', waterEfficiency: 'Low', biodiversityScore: 30 },
      { id: '4', name: 'Rice', variety: 'CRI-Amankraw (Inland Valley)', plantingDate: '2026-06-15', harvestDate: '2026-10-30', status: 'Healthy', area: 10, imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ced72a?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'High', biodiversityScore: 60 },
    ],
    defaultLivestock: [
      { id: '1', name: 'Dagbon Cattle Herd', species: 'Cattle', count: 40, status: 'Healthy', grazingType: 'Free Range', imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=1000&auto=format&fit=crop', notes: 'Sanga cattle. Free-range grazing with dry season supplementation.' },
      { id: '2', name: 'Free-Range Poultry', species: 'Chicken', count: 180, status: 'Healthy', grazingType: 'Free Range', imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000&auto=format&fit=crop', notes: 'Newcastle + Gumboro vaccination completed Q1 2026.' },
      { id: '3', name: 'West African Dwarf Goats', species: 'Goat', count: 35, status: 'Healthy', grazingType: 'Free Range', imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop', notes: 'Dwarf goat breed. Dual-purpose (meat and manure).' },
    ],
    marketPrices: [
      { cropName: 'Cocoa', price: 14500, unit: 'per 100kg (GHS)', trend: 'up', changePercentage: 6.8, inputCostIndex: 135 },
      { cropName: 'Oil Palm', price: 5200, unit: 'per 100kg (GHS)', trend: 'stable', changePercentage: 1.5, inputCostIndex: 110 },
      { cropName: 'Maize', price: 3800, unit: 'per 100kg (GHS)', trend: 'up', changePercentage: 9.2, inputCostIndex: 115 },
      { cropName: 'Rice (Local)', price: 7200, unit: 'per 100kg (GHS)', trend: 'up', changePercentage: 12.0, inputCostIndex: 108 },
      { cropName: 'Cassava', price: 2800, unit: 'per 100kg (GHS)', trend: 'stable', changePercentage: 0.8, inputCostIndex: 95 },
      { cropName: 'Fertilizer (UREA)', price: 6500, unit: 'per 50kg (GHS)', trend: 'up', changePercentage: 14.0, inputCostIndex: 100 },
    ],
    alerts: [
      { id: '1', title: 'Cocoa Swollen Shoot Disease', message: 'CSSD continues to spread in Western and Ashanti regions. Remove infected trees immediately and replant with resistant hybrids.', severity: 'critical', category: 'LAND', timestamp: new Date().toISOString() },
      { id: '2', title: 'Minor Season Rain Forecast', message: 'Ghana Met Agency forecasts near-normal minor season rainfall Jul-Sep 2026 for southern Ghana. Planting windows on track.', severity: 'low', category: 'WEATHER', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: '3', title: 'Cocoa Price Rally', message: 'International cocoa prices remain elevated at $8,950/ton. Take advantage of current premiums if holding quality beans.', severity: 'medium', category: 'FINANCIAL', timestamp: new Date(Date.now() - 7200000).toISOString() },
    ],
    learningModules: [
      { id: '1', title: 'Cocoa Rehabilitation & CSSD Management', instructor: 'Dr. Francis Owusu (CRIG)', thumbnail: 'https://images.unsplash.com/photo-1584345604325-f5091269a0d1?q=80&w=800&fit=crop', lessonsCount: 10, category: 'Resilience', difficulty: 'Advanced', duration: '3h 45m', completed: false, description: 'Identifying CSSD symptoms, removing infected trees, and replanting with tolerant hybrids. Best practices for rehabilitating aged cocoa farms.' },
      { id: '2', title: 'Oil Palm Best Practices for smallholders', instructor: 'Kofi Mensah (OPRI)', thumbnail: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800&fit=crop', lessonsCount: 8, category: 'Economics', difficulty: 'Intermediate', duration: '2h 30m', completed: false, description: 'Maximizing oil palm yields on smallholder plots. Harvest timing, pruning, and integrated pest management.' },
      { id: '3', title: 'Climate-Smart Maize for Transitional Zones', instructor: 'CSIR-SARI Team', thumbnail: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=800&fit=crop', lessonsCount: 6, category: 'Resilience', difficulty: 'Beginner', duration: '1h 30m', completed: false, description: 'Drought-tolerant varieties, Striga management, and conservation agriculture for Ghana transitional zones.' },
    ],
    tasks: [
      { id: '1', text: 'Scout cocoa trees for CSSD — remove infected immediately', completed: false, priority: 'high' },
      { id: '2', text: 'Apply fertilizer to maize — split dose recommended (urea up 14%)', completed: false, priority: 'high' },
      { id: '3', text: 'Prepare minor season rice nursery — planting window Jul-Aug', completed: false, priority: 'normal' },
      { id: '4', text: 'Poultry Gumboro booster scheduled Q3 2026', completed: false, priority: 'normal' },
    ],
    marketplaceListings: [
      { id: '1', type: 'SELL', item: 'Premium Cocoa Beans - 5 Tons (Grade 1)', price: 'GH₵14,500/100kg', location: 'Kumasi, Ghana', contact: 'kwame@cocoaashanti.co', verified: true, status: 'ACTIVE', date: new Date(Date.now() - 86400000).toISOString(), image: 'https://images.unsplash.com/photo-1584345604325-f5091269a0d1?q=80&w=400&auto=format&fit=crop' },
      { id: '2', type: 'BUY', item: 'Tractor Service - 3 Hectares', price: 'GH₵1,200/ha', location: 'Tamale, Ghana', contact: 'kwame@cocoaashanti.co', verified: true, status: 'ACTIVE', date: new Date(Date.now() - 172800000).toISOString() },
    ],
    forumPosts: [
      { id: '1', author: 'Kwame A.', title: 'CSSD spreading in Western region — what are you doing?', content: 'My cocoa farm in Sefwi has lost 15% of trees to CSSD this year. CRIG recommends cutting out but the cost is enormous. Anyone tried the new resistant hybrids?', replies: 24, likes: 95, category: 'General', date: new Date(Date.now() - 86400000).toISOString() },
      { id: '2', author: 'Ama S.', title: 'Oil palm pricing recommendations for 2026 season', content: 'Palm oil prices have stabilized after the Q1 spike. Is now the time to lock in forward contracts or wait for further upside?', replies: 12, likes: 34, category: 'Market', date: new Date(Date.now() - 259200000).toISOString() },
    ],
    chatMessages: [
      { id: '1', channelId: 'general', author: 'Kofi M.', text: 'Rain has been steady in Ashanti region. Cocoa flowering looks good this year — fingers crossed for a strong main crop.', timestamp: new Date(Date.now() - 3600000).toISOString(), avatar: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', isMe: false },
      { id: '2', channelId: 'market', author: 'Akua T.', text: 'Cocoa at GH₵14,500 per bag in Kumasi. International prices still strong. Good time to sell if you have quality beans.', timestamp: new Date(Date.now() - 1800000).toISOString(), avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop', isMe: false },
    ],
    trends: [
      { id: '1', tag: '#CocoaGH2026', volume: '12.4K Posts' },
      { id: '2', tag: '#CSSDAlert', volume: '8.7K Posts' },
      { id: '3', tag: '#OilPalmPrices', volume: '5.1K Posts' },
      { id: '4', tag: '#GhanaAgricTech', volume: '3.9K Posts' },
    ],
    suggestedUsers: [
      { id: 'sf1', name: 'Kwame Asante', role: 'Cocoa Specialist (Ghana)', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=150&h=150&fit=crop', mutual: 22 },
      { id: 'sf2', name: 'Dr. Francis Owusu', role: 'CRIG Agronomist', img: 'https://images.unsplash.com/photo-1627920769842-6887c7df0561?w=150&h=150&fit=crop', mutual: 15 },
    ],
    stories: [
      { id: 'create', name: 'Add Story', img: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', isUser: true },
      { id: '1', name: 'CocoaCo GH', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=150&h=150&fit=crop', hasUpdate: true },
      { id: '2', name: 'OilPalm Assoc', img: 'https://images.unsplash.com/photo-1627920769842-6887c7df0561?w=150&h=150&fit=crop', hasUpdate: true },
    ],
    weatherDefaults: { locationName: 'Kumasi, Ghana', temp: 29, condition: 'Partly Cloudy', humidity: 75, windSpeed: 8, forecast: 'Minor season rains progressing normally. Adequate soil moisture for cocoa and oil palm.', climateRiskIndex: 'Low' },
    dailyWageLocal: 4600,
    dailyWageUSD: 0.37,
    laborCurrencyCode: 'GHS',
  },
  KE: {
    code: 'KE',
    name: 'Kenya',
    flag: '🇰🇪',
    currencyCode: 'KES',
    currencySymbol: 'KSh',
    language: 'en',
    region: 'East Africa',
    climateZone: 'tropical_wet_dry',
    areaUnit: 'ha',
    defaultCrops: [
      { id: '1', name: 'Maize', variety: 'Hybrid H614 (KALRO)', plantingDate: '2026-03-01', harvestDate: '2026-08-15', status: 'Needs Attention', area: 20, imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'Moderate', biodiversityScore: 45 },
      { id: '2', name: 'Tea', variety: 'Purple Tea (TRFK 306/1)', plantingDate: '2024-06-01', harvestDate: '2026-12-31', status: 'Healthy', area: 15, imageUrl: 'https://images.unsplash.com/photo-1563309461-a319263584d7?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'High', biodiversityScore: 65 },
      { id: '3', name: 'French Beans', variety: 'Serengeti (Export)', plantingDate: '2026-05-01', harvestDate: '2026-07-15', status: 'Healthy', area: 5, imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ced72a?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Excellent', waterEfficiency: 'High', biodiversityScore: 78 },
      { id: '4', name: 'Coffee', variety: 'SL28 (Arabica)', plantingDate: '2023-04-01', harvestDate: '2026-12-31', status: 'Healthy', area: 10, imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'Moderate', biodiversityScore: 58 },
    ],
    defaultLivestock: [
      { id: '1', name: 'Zebu Cattle Herd', species: 'Cattle', count: 30, status: 'Healthy', grazingType: 'Rotational', imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=1000&auto=format&fit=crop', notes: 'Boran crossbreeds. Zero-grazing with cut-and-carry system.' },
      { id: '2', name: 'Improved Layer Flock', species: 'Chicken', count: 500, status: 'Healthy', grazingType: 'Feedlot', imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000&auto=format&fit=crop', notes: 'Kenchic layers. Biosecurity protocols in place. Newcastle vaccination Q1 2026.' },
      { id: '3', name: 'Galla Goat Herd', species: 'Goat', count: 45, status: 'Healthy', grazingType: 'Free Range', imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop', notes: 'Galla goat breed for ASAL regions. Drought-hardy dual-purpose.' },
    ],
    marketPrices: [
      { cropName: 'Maize', price: 4200, unit: 'per 90kg bag (KES)', trend: 'up', changePercentage: 7.5, inputCostIndex: 112 },
      { cropName: 'Tea (Made)', price: 320, unit: 'per kg (KES)', trend: 'stable', changePercentage: 2.0, inputCostIndex: 125 },
      { cropName: 'French Beans', price: 85, unit: 'per kg (KES)', trend: 'up', changePercentage: 5.0, inputCostIndex: 140 },
      { cropName: 'Coffee (Cherry)', price: 65, unit: 'per kg (KES)', trend: 'up', changePercentage: 12.0, inputCostIndex: 130 },
      { cropName: 'DAP Fertilizer', price: 6200, unit: 'per 50kg bag (KES)', trend: 'up', changePercentage: 8.0, inputCostIndex: 100 },
    ],
    alerts: [
      { id: '1', title: 'Long Rains Forecast Below Average', message: 'KMD forecasts below-average long rains (Mar-May 2026) for eastern Kenya. ASAL counties at risk — plan supplemental irrigation.', severity: 'high', category: 'WEATHER', timestamp: new Date().toISOString() },
      { id: '2', title: 'Fall Armyworm Alert', message: 'FAW reported in western Kenya maize fields. Scout early-planted crops and deploy push-pull technology.', severity: 'medium', category: 'LAND', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: '3', title: 'Coffee Berry Disease Risk', message: 'Wet conditions in central highlands increase CBD risk on SL28. Apply copper-based fungicide preventatively.', severity: 'medium', category: 'LAND', timestamp: new Date(Date.now() - 7200000).toISOString() },
    ],
    learningModules: [
      { id: '1', title: 'Climate-Smart Farming for ASAL Counties', instructor: 'KALRO Research Team', thumbnail: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800&fit=crop', lessonsCount: 10, category: 'Resilience', difficulty: 'Intermediate', duration: '3h 00m', completed: false, description: 'Drought-tolerant varieties, water harvesting, and conservation agriculture for Kenya arid and semi-arid lands.' },
      { id: '2', title: 'Export-Grade French Bean Production', instructor: 'HCDA Inspector Team', thumbnail: 'https://images.unsplash.com/photo-1599940824399-b87987ced72a?q=80&w=800&fit=crop', lessonsCount: 8, category: 'Economics', difficulty: 'Advanced', duration: '2h 30m', completed: false, description: 'Meeting EU MRL requirements, GlobalGAP certification, and post-harvest handling for premium export beans.' },
      { id: '3', title: 'Coffee Quality Improvement', instructor: 'Coffee Research Institute', thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&fit=crop', lessonsCount: 12, category: 'Economics', difficulty: 'Advanced', duration: '4h 00m', completed: false, description: 'Cherry selection, wet processing, and drying techniques to achieve specialty grade. Market linkage for premium lots.' },
    ],
    tasks: [
      { id: '1', text: 'Scout maize for Fall Armyworm — push-pull intercrop ready', completed: false, priority: 'high' },
      { id: '2', text: 'Apply CBD fungicide to SL28 coffee — wet conditions increase risk', completed: false, priority: 'high' },
      { id: '3', text: 'Prepare French bean export consignment — EU MRL compliance check', completed: false, priority: 'normal' },
    ],
    marketplaceListings: [
      { id: '1', type: 'SELL', item: 'AA Specialty Green Coffee - 2 Tons', price: 'KSh 850/kg', location: 'Nyeri, Kenya', contact: 'farm@kenyacoffee.co', verified: true, status: 'ACTIVE', date: new Date(Date.now() - 86400000).toISOString(), image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=400&auto=format&fit=crop' },
    ],
    forumPosts: [
      { id: '1', author: 'Wanjiku N.', title: 'Tea prices at auction — any improvement this quarter?', content: 'Mombasa tea auction prices have been flat all year. Is anyone shifting to purple tea for the health premium?', replies: 18, likes: 45, category: 'Market', date: new Date(Date.now() - 86400000).toISOString() },
    ],
    chatMessages: [
      { id: '1', channelId: 'general', author: 'James K.', text: 'Long rains have started in Nakuru but lighter than usual. KMD says below average for 2026 — consider drought-tolerant maize varieties.', timestamp: new Date(Date.now() - 3600000).toISOString(), avatar: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', isMe: false },
    ],
    trends: [
      { id: '1', tag: '#KenyaLongRains2026', volume: '9.8K Posts' },
      { id: '2', tag: '#SpecialtyCoffeeKE', volume: '7.2K Posts' },
      { id: '3', tag: '#ASALResilience', volume: '5.4K Posts' },
    ],
    suggestedUsers: [
      { id: 'sf1', name: 'Wanjiku Njeri', role: 'Tea Grower (Kiambu)', img: 'https://images.unsplash.com/photo-1627920769842-6887c7df0561?w=150&h=150&fit=crop', mutual: 12 },
      { id: 'sf2', name: 'Dr. Kipchoge', role: 'KALRO Agronomist', img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop', mutual: 8 },
    ],
    stories: [
      { id: 'create', name: 'Add Story', img: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', isUser: true },
      { id: '1', name: 'KenyaTea', img: 'https://images.unsplash.com/photo-1563309461-a319263584d7?w=150&h=150&fit=crop', hasUpdate: true },
    ],
    weatherDefaults: { locationName: 'Nakuru, Kenya', temp: 24, condition: 'Partly Cloudy', humidity: 65, windSpeed: 12, forecast: 'Long rains below average in 2026. Consider drought-tolerant varieties and supplemental irrigation.', climateRiskIndex: 'Moderate' },
    dailyWageLocal: 600,
    dailyWageUSD: 4.63,
    laborCurrencyCode: 'KES',
  },
  IN: {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    currencyCode: 'INR',
    currencySymbol: '₹',
    language: 'en',
    region: 'South Asia',
    climateZone: 'tropical_wet_dry',
    areaUnit: 'ha',
    defaultCrops: [
      { id: '1', name: 'Rice (Kharif)', variety: 'Pusa Basmati 1121', plantingDate: '2026-06-15', harvestDate: '2026-11-15', status: 'Healthy', area: 25, imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ced72a?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'Moderate', biodiversityScore: 50 },
      { id: '2', name: 'Wheat (Rabi)', variety: 'HD-3226 (ICAR)', plantingDate: '2025-11-15', harvestDate: '2026-04-15', status: 'Harvest Ready', area: 20, imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'High', biodiversityScore: 55 },
      { id: '3', name: 'Cotton', variety: 'Bt Cotton (Bollgard III)', plantingDate: '2026-05-01', harvestDate: '2026-12-31', status: 'Needs Attention', area: 15, imageUrl: 'https://images.unsplash.com/photo-1533230537024-38c3459c9c9b?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Degraded', waterEfficiency: 'Low', biodiversityScore: 28 },
      { id: '4', name: 'Sugarcane', variety: 'Co 0238 (ICAR)', plantingDate: '2026-03-01', harvestDate: '2027-02-28', status: 'Healthy', area: 10, imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'Moderate', biodiversityScore: 42 },
    ],
    defaultLivestock: [
      { id: '1', name: 'Murrah Buffalo Herd', species: 'Cattle', count: 12, status: 'Lactating', grazingType: 'Feedlot', imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=1000&auto=format&fit=crop', notes: 'Murrah buffalo for dairy. Stall-fed with green fodder and concentrate.' },
      { id: '2', name: 'Backyard Poultry', species: 'Chicken', count: 200, status: 'Healthy', grazingType: 'Free Range', imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000&auto=format&fit=crop', notes: 'Dual-purpose birds (Kadaknath cross). Vaccinated for Ranikhet disease.' },
    ],
    marketPrices: [
      { cropName: 'Basmati Rice', price: 4200, unit: 'per quintal (INR)', trend: 'stable', changePercentage: 2.3, inputCostIndex: 105 },
      { cropName: 'Wheat', price: 2275, unit: 'per quintal (INR)', trend: 'stable', changePercentage: 0.5, inputCostIndex: 100 },
      { cropName: 'Cotton', price: 7200, unit: 'per quintal (INR)', trend: 'up', changePercentage: 6.0, inputCostIndex: 115 },
      { cropName: 'Sugarcane', price: 305, unit: 'per quintal (INR)', trend: 'stable', changePercentage: 1.0, inputCostIndex: 95 },
      { cropName: 'DAP Fertilizer', price: 1350, unit: 'per 50kg bag (INR)', trend: 'up', changePercentage: 5.5, inputCostIndex: 100 },
    ],
    alerts: [
      { id: '1', title: 'Monsoon Forecast Normal', message: 'IMD forecasts normal SW monsoon (Jun-Sep 2026) at 98% LPA. El Nino neutral conditions. Favorable for Kharif planting.', severity: 'low', category: 'WEATHER', timestamp: new Date().toISOString() },
      { id: '2', title: 'Pink Bollworm Alert', message: 'Pink bollworm reported early in Bt cotton fields of Maharashtra and Telangana. Refugia compliance critical.', severity: 'high', category: 'LAND', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: '3', title: 'MSP Hike Announced', message: 'Cabinet approves MSP increase for Kharif 2026: Paddy +5%, Cotton +7%. Covers部分 input cost increases.', severity: 'medium', category: 'FINANCIAL', timestamp: new Date(Date.now() - 7200000).toISOString() },
    ],
    learningModules: [
      { id: '1', title: 'Direct Seeded Rice for Water Savings', instructor: 'ICAR-IIRR Team', thumbnail: 'https://images.unsplash.com/photo-1599940824399-b87987ced72a?q=80&w=800&fit=crop', lessonsCount: 8, category: 'Tech', difficulty: 'Intermediate', duration: '2h 00m', completed: false, description: 'DSR technique reduces water use by 30% and labor costs. Suitable for Punjab, Haryana and UP rice-wheat zones.' },
      { id: '2', title: 'Cotton IPM for Pink Bollworm', instructor: 'ICAR-CICR Nagpur', thumbnail: 'https://images.unsplash.com/photo-1533230537024-38c3459c9c9b?q=80&w=800&fit=crop', lessonsCount: 6, category: 'Resilience', difficulty: 'Advanced', duration: '1h 45m', completed: false, description: 'Refugia management, pheromone traps, and biological control for PBW in Bt cotton. Reducing pesticide reliance.' },
    ],
    tasks: [
      { id: '1', text: 'Prepare paddy nursery — monsoon onset expected early June', completed: false, priority: 'high' },
      { id: '2', text: 'Scout Bt cotton for pink bollworm — install pheromone traps', completed: false, priority: 'high' },
      { id: '3', text: 'Wheat harvest — arrange combine harvester and mandi transport', completed: false, priority: 'normal' },
    ],
    marketplaceListings: [
      { id: '1', type: 'SELL', item: 'Basmati Rice PUSA 1121 - 50 Quintals', price: '₹4,200/qtl', location: 'Ludhiana, Punjab', contact: 'farm@punjabrice.in', verified: true, status: 'ACTIVE', date: new Date(Date.now() - 86400000).toISOString() },
    ],
    forumPosts: [
      { id: '1', author: 'Rajinder S.', title: 'DSR vs transplanted rice — water savings worth the yield risk?', content: 'Switching to direct seeded rice this Kharif. ICAR claims 30% water savings but worried about weed pressure. Anyone in Punjab tried it successfully?', replies: 32, likes: 88, category: 'General', date: new Date(Date.now() - 86400000).toISOString() },
    ],
    chatMessages: [
      { id: '1', channelId: 'general', author: 'Priya M.', text: 'IMD monsoon forecast is normal for 2026. Good news for Kharif planting. Start nursery preparations now.', timestamp: new Date(Date.now() - 3600000).toISOString(), avatar: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', isMe: false },
    ],
    trends: [
      { id: '1', tag: '#Monsoon2026', volume: '45K Posts' },
      { id: '2', tag: '#MSPHike', volume: '28K Posts' },
      { id: '3', tag: '#CottonIPM', volume: '12K Posts' },
    ],
    suggestedUsers: [
      { id: 'sf1', name: 'Rajinder Singh', role: 'Rice Farmer (Punjab)', img: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', mutual: 14 },
    ],
    stories: [
      { id: 'create', name: 'Add Story', img: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', isUser: true },
      { id: '1', name: 'PunjabRice', img: 'https://images.unsplash.com/photo-1599940824399-b87987ced72a?w=150&h=150&fit=crop', hasUpdate: true },
    ],
    weatherDefaults: { locationName: 'Ludhiana, India', temp: 38, condition: 'Hot & Dry', humidity: 28, windSpeed: 15, forecast: 'Pre-monsoon heat wave. SW monsoon onset expected early June at normal intensity (98% LPA).', climateRiskIndex: 'Moderate' },
    dailyWageLocal: 450,
    dailyWageUSD: 5.37,
    laborCurrencyCode: 'INR',
  },
  BR: {
    code: 'BR',
    name: 'Brazil',
    flag: '🇧🇷',
    currencyCode: 'BRL',
    currencySymbol: 'R$',
    language: 'pt',
    region: 'South America',
    climateZone: 'tropical_humid',
    areaUnit: 'ha',
    defaultCrops: [
      { id: '1', name: 'Soybeans', variety: 'BMX Potencia RR', plantingDate: '2025-10-15', harvestDate: '2026-03-30', status: 'Harvest Ready', area: 100, imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'High', biodiversityScore: 38 },
      { id: '2', name: 'Sugarcane', variety: 'RB867515 (RIDESA)', plantingDate: '2025-04-01', harvestDate: '2026-12-31', status: 'Healthy', area: 60, imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'Moderate', biodiversityScore: 32 },
      { id: '3', name: 'Coffee (Arabica)', variety: 'Catuaí Vermelho IAC 99', plantingDate: '2023-11-01', harvestDate: '2026-10-31', status: 'Healthy', area: 30, imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'High', biodiversityScore: 55 },
      { id: '4', name: 'Corn (Safrinha)', variety: 'DKB 230 PRO3', plantingDate: '2026-02-01', harvestDate: '2026-07-31', status: 'Needs Attention', area: 50, imageUrl: 'https://images.unsplash.com/photo-1533230537024-38c3459c9c9b?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Degraded', waterEfficiency: 'Low', biodiversityScore: 25 },
    ],
    defaultLivestock: [
      { id: '1', name: 'Nelore Beef Herd', species: 'Cattle', count: 200, status: 'Healthy', grazingType: 'Rotational', imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=1000&auto=format&fit=crop', notes: 'Nelore cattle on Brachiaria pasture. Rotational grazing with supplemental mineral salt.' },
      { id: '2', name: 'Broiler Integration', species: 'Chicken', count: 15000, status: 'Healthy', grazingType: 'Feedlot', imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000&auto=format&fit=crop', notes: 'Contract broiler production. Full biosecurity and automated feed/water systems.' },
    ],
    marketPrices: [
      { cropName: 'Soybeans', price: 142, unit: 'per 60kg bag (BRL)', trend: 'up', changePercentage: 4.0, inputCostIndex: 120 },
      { cropName: 'Coffee (Arabica)', price: 1250, unit: 'per 60kg bag (BRL)', trend: 'up', changePercentage: 15.0, inputCostIndex: 135 },
      { cropName: 'Corn', price: 85, unit: 'per 60kg bag (BRL)', trend: 'down', changePercentage: -3.0, inputCostIndex: 108 },
      { cropName: 'Sugar', price: 162, unit: 'per 60kg bag (BRL)', trend: 'up', changePercentage: 5.0, inputCostIndex: 110 },
      { cropName: 'NPK Fertilizer', price: 320, unit: 'per 50kg bag (BRL)', trend: 'up', changePercentage: 7.0, inputCostIndex: 100 },
    ],
    alerts: [
      { id: '1', title: 'La Nina Watch', message: 'INPE forecasts La Nina conditions developing Q3 2026. May reduce rainfall in southern Brazil — monitor soybean planting windows.', severity: 'medium', category: 'WEATHER', timestamp: new Date().toISOString() },
      { id: '2', title: 'Asian Soybean Rust Alert', message: 'First rust pustules detected in Mato Grosso. Preventive fungicide applications essential — resistance management critical.', severity: 'high', category: 'LAND', timestamp: new Date(Date.now() - 3600000).toISOString() },
    ],
    learningModules: [
      { id: '1', title: 'Soybean Rust Resistance Management', instructor: 'Embrapa Soja Team', thumbnail: 'https://images.unsplash.com/photo-1533230537024-38c3459c9c9b?q=80&w=800&fit=crop', lessonsCount: 10, category: 'Resilience', difficulty: 'Advanced', duration: '3h 30m', completed: false, description: 'Fungicide rotation, resistance monitoring, and integrated management for Asian Soybean Rust in Cerrado regions.' },
      { id: '2', title: 'Precision Agriculture for Sugarcane', instructor: 'RIDEISA/UFV', thumbnail: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=800&fit=crop', lessonsCount: 12, category: 'Tech', difficulty: 'Advanced', duration: '4h 00m', completed: false, description: 'Variable rate application, yield mapping, and soil sampling for sugarcane precision management. Reducing input costs 20%.' },
    ],
    tasks: [
      { id: '1', text: 'Apply preventive rust fungicide — first pustules detected in MT', completed: false, priority: 'high' },
      { id: '2', text: 'Monitor safrinha corn — drought stress risk with La Nina developing', completed: false, priority: 'high' },
      { id: '3', text: 'Coffee harvest logistics — arrange picking crews for Oct start', completed: false, priority: 'normal' },
    ],
    marketplaceListings: [
      { id: '1', type: 'SELL', item: 'Soybeans - 500 Sacks (60kg)', price: 'R$142/sack', location: 'Ribeirão Preto, SP', contact: 'farm@sojabrasil.co.br', verified: true, status: 'ACTIVE', date: new Date(Date.now() - 86400000).toISOString() },
    ],
    forumPosts: [
      { id: '1', author: 'Carlos M.', title: 'Safra 2026/27 soybean varieties — which BMX is performing?', content: 'Trialing new Intacta RR2 Pro varieties this season. Anyone have yield data from Mato Grosso trials?', replies: 42, likes: 156, category: 'General', date: new Date(Date.now() - 86400000).toISOString() },
    ],
    chatMessages: [
      { id: '1', channelId: 'general', author: 'Pedro S.', text: 'Rust pressure increasing in MT. If you have not sprayed preventive, do it now. Early action saves yield.', timestamp: new Date(Date.now() - 3600000).toISOString(), avatar: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', isMe: false },
    ],
    trends: [
      { id: '1', tag: '#Safra2026', volume: '52K Posts' },
      { id: '2', tag: '#FerrugemSoja', volume: '18K Posts' },
      { id: '3', tag: '#CafeArabica', volume: '14K Posts' },
    ],
    suggestedUsers: [
      { id: 'sf1', name: 'Carlos Mendes', role: 'Soybean Farmer (MT)', img: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', mutual: 8 },
    ],
    stories: [
      { id: 'create', name: 'Add Story', img: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', isUser: true },
      { id: '1', name: 'Embrapa', img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=150&h=150&fit=crop', hasUpdate: true },
    ],
    weatherDefaults: { locationName: 'Ribeirão Preto, Brazil', temp: 28, condition: 'Sunny', humidity: 55, windSpeed: 10, forecast: 'Dry season progressing well. La Nina watch — monitor rainfall for second crop (safrinha).', climateRiskIndex: 'Moderate' },
    dailyWageLocal: 130,
    dailyWageUSD: 22.80,
    laborCurrencyCode: 'BRL',
  },
  US: {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    currencyCode: 'USD',
    currencySymbol: '$',
    language: 'en',
    region: 'North America',
    climateZone: 'temperate',
    areaUnit: 'acres',
    defaultCrops: [
      { id: '1', name: 'Corn', variety: 'Pioneer P1197', plantingDate: '2026-04-20', harvestDate: '2026-10-15', status: 'Healthy', area: 500, imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'Moderate', biodiversityScore: 35 },
      { id: '2', name: 'Soybeans', variety: 'Asgrow AG38X6', plantingDate: '2026-05-01', harvestDate: '2026-10-30', status: 'Healthy', area: 400, imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'High', biodiversityScore: 40 },
      { id: '3', name: 'Winter Wheat', variety: 'Syngress SY Monument', plantingDate: '2025-10-01', harvestDate: '2026-07-15', status: 'Harvest Ready', area: 200, imageUrl: 'https://images.unsplash.com/photo-1533230537024-38c3459c9c9b?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'High', biodiversityScore: 48 },
    ],
    defaultLivestock: [
      { id: '1', name: 'Beef Cattle Herd', species: 'Cattle', count: 150, status: 'Healthy', grazingType: 'Rotational', imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=1000&auto=format&fit=crop', notes: 'Angus cross. Rotational grazing on improved pasture. AI breeding program.' },
      { id: '2', name: 'Layer Operation', species: 'Chicken', count: 5000, status: 'Healthy', grazingType: 'Feedlot', imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000&auto=format&fit=crop', notes: 'Cage-free layer barn. Avian influenza biosecurity in effect.' },
    ],
    marketPrices: [
      { cropName: 'Corn', price: 4.85, unit: 'per bushel (USD)', trend: 'down', changePercentage: -5.2, inputCostIndex: 108 },
      { cropName: 'Soybeans', price: 12.40, unit: 'per bushel (USD)', trend: 'stable', changePercentage: 1.5, inputCostIndex: 112 },
      { cropName: 'Wheat', price: 6.20, unit: 'per bushel (USD)', trend: 'up', changePercentage: 3.8, inputCostIndex: 105 },
      { cropName: 'DAP Fertilizer', price: 520, unit: 'per ton (USD)', trend: 'up', changePercentage: 4.5, inputCostIndex: 100 },
    ],
    alerts: [
      { id: '1', title: 'Avian Influenza Biosecurity', message: 'HPAI H5N1 continues to circulate in wild birds 2026. Poultry operations must maintain strict biosecurity — restrict farm access.', severity: 'high', category: 'SYSTEM', timestamp: new Date().toISOString() },
      { id: '2', title: 'Corn Price Pressure', message: 'USDA projects record 2026 corn plantings. Prices under pressure — consider hedging strategies and input cost management.', severity: 'medium', category: 'FINANCIAL', timestamp: new Date(Date.now() - 3600000).toISOString() },
    ],
    learningModules: [
      { id: '1', title: 'Precision Ag for Corn-Soy Rotation', instructor: 'Extension Service (Iowa State)', thumbnail: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=800&fit=crop', lessonsCount: 10, category: 'Tech', difficulty: 'Intermediate', duration: '3h 00m', completed: false, description: 'VRT fertilizer, drone scouting, and yield monitor analysis for Midwest corn-soybean systems.' },
      { id: '2', title: 'Cover Crop Economics', instructor: 'SARE/USDA-NRCS', thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&fit=crop', lessonsCount: 6, category: 'Resilience', difficulty: 'Beginner', duration: '1h 30m', completed: false, description: 'Cost-share programs, soil health benefits, and grazing value of cover crops in row crop systems.' },
    ],
    tasks: [
      { id: '1', text: 'Scout soybeans for sudden death syndrome — warm wet spring conditions', completed: false, priority: 'high' },
      { id: '2', text: 'Winter wheat harvest — arrange custom combine and grain cart', completed: false, priority: 'normal' },
      { id: '3', text: 'Review crop insurance coverage — deadline approaching', completed: false, priority: 'normal' },
    ],
    marketplaceListings: [
      { id: '1', type: 'SELL', item: 'Yellow Corn - 10,000 Bushels', price: '$4.85/bu', location: 'Ames, Iowa', contact: 'farm@iowacorn.us', verified: true, status: 'ACTIVE', date: new Date(Date.now() - 86400000).toISOString() },
    ],
    forumPosts: [
      { id: '1', author: 'Mike J.', title: 'Soybean SDS in central Iowa — early symptoms showing', content: 'Noticing interveinal chlorosis on lower leaves. Warm wet spring is driving SDS pressure. Anyone trying ILEVO seed treatment?', replies: 28, likes: 67, category: 'Pests', date: new Date(Date.now() - 86400000).toISOString() },
    ],
    chatMessages: [
      { id: '1', channelId: 'general', author: 'Sarah B.', text: 'Wheat looking good in NE Iowa. Harvest should be early this year. Custom combiner booked for July 10.', timestamp: new Date(Date.now() - 3600000).toISOString(), avatar: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', isMe: false },
    ],
    trends: [
      { id: '1', tag: '#Plant2026', volume: '34K Posts' },
      { id: '2', tag: '#CropInsurance', volume: '15K Posts' },
      { id: '3', tag: '#CoverCrops', volume: '22K Posts' },
    ],
    suggestedUsers: [
      { id: 'sf1', name: 'Mike Johnson', role: 'Row Crop Farmer (Iowa)', img: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', mutual: 5 },
    ],
    stories: [
      { id: 'create', name: 'Add Story', img: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', isUser: true },
      { id: '1', name: 'IowaFarmBureau', img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=150&h=150&fit=crop', hasUpdate: true },
    ],
    weatherDefaults: { locationName: 'Ames, Iowa', temp: 26, condition: 'Partly Cloudy', humidity: 60, windSpeed: 18, forecast: 'Favorable growing conditions for corn and soybeans. Periodic rain expected. Monitor for SDS in low-lying fields.', climateRiskIndex: 'Low' },
    dailyWageLocal: 120,
    dailyWageUSD: 120,
    laborCurrencyCode: 'USD',
  },
  ET: {
    code: 'ET',
    name: 'Ethiopia',
    flag: '🇪🇹',
    currencyCode: 'ETB',
    currencySymbol: 'Br',
    language: 'en',
    region: 'East Africa',
    climateZone: 'highland',
    areaUnit: 'ha',
    defaultCrops: [
      { id: '1', name: 'Coffee (Arabica)', variety: 'Jimma Local (Wollega)', plantingDate: '2024-06-01', harvestDate: '2026-12-31', status: 'Healthy', area: 8, imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'High', biodiversityScore: 75 },
      { id: '2', name: 'Teff', variety: 'Quncho (DZ-Cr-387)', plantingDate: '2026-07-01', harvestDate: '2026-11-15', status: 'Healthy', area: 5, imageUrl: 'https://images.unsplash.com/photo-1533230537024-38c3459c9c9b?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'Moderate', biodiversityScore: 55 },
      { id: '3', name: 'Maize', variety: 'BH661 (Ambo)', plantingDate: '2026-05-15', harvestDate: '2026-10-30', status: 'Needs Attention', area: 4, imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Degraded', waterEfficiency: 'Low', biodiversityScore: 30 },
    ],
    defaultLivestock: [
      { id: '1', name: 'Local Zebu Herd', species: 'Cattle', count: 25, status: 'Healthy', grazingType: 'Free Range', imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=1000&auto=format&fit=crop', notes: 'Abyssinian zebu. Free grazing with crop residue supplementation.' },
      { id: '2', name: 'Sheep Flock', species: 'Sheep', count: 40, status: 'Healthy', grazingType: 'Free Range', imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop', notes: 'Menz sheep breed. Dual-purpose for meat and wool.' },
    ],
    marketPrices: [
      { cropName: 'Coffee (Green)', price: 4500, unit: 'per quintal (ETB)', trend: 'up', changePercentage: 8.0, inputCostIndex: 115 },
      { cropName: 'Teff', price: 6200, unit: 'per quintal (ETB)', trend: 'up', changePercentage: 15.0, inputCostIndex: 108 },
      { cropName: 'Maize', price: 2800, unit: 'per quintal (ETB)', trend: 'stable', changePercentage: 2.0, inputCostIndex: 100 },
      { cropName: 'DAP Fertilizer', price: 3800, unit: 'per 50kg (ETB)', trend: 'up', changePercentage: 10.0, inputCostIndex: 100 },
    ],
    alerts: [
      { id: '1', title: 'Kiremt Rain Forecast', message: 'NMI forecasts average Kiremt (Jun-Sep 2026) rainfall for most highland areas. Timely meher planting on track.', severity: 'low', category: 'WEATHER', timestamp: new Date().toISOString() },
      { id: '2', title: 'Coffee Berry Disease', message: 'CBD pressure elevated in Jimma zone due to wet conditions. Apply copper-based fungicide. Early detection critical.', severity: 'high', category: 'LAND', timestamp: new Date(Date.now() - 3600000).toISOString() },
    ],
    learningModules: [
      { id: '1', title: 'Coffee Quality & Processing for Premium Markets', instructor: 'JARC Research Team', thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&fit=crop', lessonsCount: 10, category: 'Economics', difficulty: 'Advanced', duration: '3h 30m', completed: false, description: 'Wet and dry processing methods, quality grading, and specialty coffee market access for Ethiopian growers.' },
      { id: '2', title: 'Teff Agronomy for Smallholders', instructor: 'EIAR/Ambo Center', thumbnail: 'https://images.unsplash.com/photo-1533230537024-38c3459c9c9b?q=80&w=800&fit=crop', lessonsCount: 6, category: 'Resilience', difficulty: 'Beginner', duration: '1h 30m', completed: false, description: 'Quncho variety management, sowing rates, and nitrogen top-dressing timing. Increasing teff yields on smallholder plots.' },
    ],
    tasks: [
      { id: '1', text: 'Scout coffee for CBD — apply copper fungicide if wet conditions persist', completed: false, priority: 'high' },
      { id: '2', text: 'Prepare teff land — meher planting window opens July', completed: false, priority: 'normal' },
    ],
    marketplaceListings: [
      { id: '1', type: 'SELL', item: 'Specialty Green Coffee - Washed Yirgacheffe (2 Tons)', price: 'Br 4,800/qtl', location: 'Addis Ababa, Ethiopia', contact: 'farm@ethcoffee.et', verified: true, status: 'ACTIVE', date: new Date(Date.now() - 86400000).toISOString() },
    ],
    forumPosts: [
      { id: '1', author: 'Dawit T.', title: 'Teff yield improvement — what are you doing differently?', content: 'Getting only 12 quintals/hectare on my teff. JARC says Quncho can hit 25+. What is the secret — fertilizer timing or seeding rate?', replies: 22, likes: 58, category: 'General', date: new Date(Date.now() - 86400000).toISOString() },
    ],
    chatMessages: [
      { id: '1', channelId: 'general', author: 'Tigist A.', text: 'Coffee flowering is excellent in Sidama this year. If Kiremt rains hold, we should have a great main crop.', timestamp: new Date(Date.now() - 3600000).toISOString(), avatar: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', isMe: false },
    ],
    trends: [
      { id: '1', tag: '#EthCoffee2026', volume: '8.5K Posts' },
      { id: '2', tag: '#TeffFarming', volume: '4.2K Posts' },
      { id: '3', tag: '#Kiremt2026', volume: '6.1K Posts' },
    ],
    suggestedUsers: [
      { id: 'sf1', name: 'Dawit Tadesse', role: 'Coffee Farmer (Jimma)', img: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', mutual: 6 },
    ],
    stories: [
      { id: 'create', name: 'Add Story', img: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', isUser: true },
      { id: '1', name: 'EthCoffee', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=150&h=150&fit=crop', hasUpdate: true },
    ],
    weatherDefaults: { locationName: 'Jimma, Ethiopia', temp: 22, condition: 'Light Rain', humidity: 78, windSpeed: 6, forecast: 'Kiremt rains progressing normally. Coffee areas receiving adequate moisture. Monitor for CBD in wet zones.', climateRiskIndex: 'Low' },
    dailyWageLocal: 200,
    dailyWageUSD: 1.60,
    laborCurrencyCode: 'ETB',
  },
  SN: {
    code: 'SN',
    name: 'Senegal',
    flag: '🇸🇳',
    currencyCode: 'XOF',
    currencySymbol: 'CFA',
    language: 'fr',
    region: 'West Africa',
    climateZone: 'sahel',
    areaUnit: 'ha',
    defaultCrops: [
      { id: '1', name: 'Groundnut', variety: '55-437 (ISRA)', plantingDate: '2026-06-15', harvestDate: '2026-10-31', status: 'Healthy', area: 20, imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Degraded', waterEfficiency: 'Moderate', biodiversityScore: 45 },
      { id: '2', name: 'Millet', variety: 'Souna 3 (ISRA)', plantingDate: '2026-07-01', harvestDate: '2026-11-15', status: 'Healthy', area: 15, imageUrl: 'https://images.unsplash.com/photo-1533230537024-38c3459c9c9b?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'High', biodiversityScore: 60 },
      { id: '3', name: 'Rice', variety: 'Sahel 108 (AfricaRice)', plantingDate: '2026-07-15', harvestDate: '2026-11-30', status: 'Needs Attention', area: 8, imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ced72a?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'High', biodiversityScore: 50 },
    ],
    defaultLivestock: [
      { id: '1', name: 'Peul Cattle Herd', species: 'Cattle', count: 50, status: 'Healthy', grazingType: 'Free Range', imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=1000&auto=format&fit=crop', notes: 'Zebu Gobra. Transhumance system — dry season migration south.' },
      { id: '2', name: 'Local Goat Herd', species: 'Goat', count: 35, status: 'Healthy', grazingType: 'Free Range', imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop', notes: 'Djallonke goat. Adapted to Sahel conditions.' },
    ],
    marketPrices: [
      { cropName: 'Groundnut', price: 12500, unit: 'per 100kg (XOF)', trend: 'up', changePercentage: 6.0, inputCostIndex: 108 },
      { cropName: 'Millet', price: 9500, unit: 'per 100kg (XOF)', trend: 'stable', changePercentage: 1.5, inputCostIndex: 100 },
      { cropName: 'Rice (Local)', price: 22000, unit: 'per 100kg (XOF)', trend: 'up', changePercentage: 10.0, inputCostIndex: 112 },
      { cropName: 'NPK Fertilizer', price: 17500, unit: 'per 50kg (XOF)', trend: 'up', changePercentage: 8.0, inputCostIndex: 100 },
    ],
    alerts: [
      { id: '1', title: 'Hivernage Forecast', message: 'ANACIM forecasts average hivernage (Jun-Oct 2026) rainfall but with dry spell episodes. Central and northern regions monitor closely.', severity: 'medium', category: 'WEATHER', timestamp: new Date().toISOString() },
      { id: '2', title: 'Groundnut Aflatoxin Risk', message: 'Humid storage conditions increasing aflatoxin risk. Ensure proper drying before storage — groundnut quality standards for export.', severity: 'high', category: 'LAND', timestamp: new Date(Date.now() - 3600000).toISOString() },
    ],
    learningModules: [
      { id: '1', title: 'Groundnut Aflatoxin Prevention', instructor: 'ISRA/CORAF Team', thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&fit=crop', lessonsCount: 8, category: 'Resilience', difficulty: 'Intermediate', duration: '2h 00m', completed: false, description: 'Harvest timing, proper drying, and storage techniques to minimize aflatoxin contamination in groundnut.' },
      { id: '2', title: 'Sahel Irrigation Techniques', instructor: 'AfricaRice Sahel Station', thumbnail: 'https://images.unsplash.com/photo-1563309461-a319263584d7?q=80&w=800&fit=crop', lessonsCount: 10, category: 'Tech', difficulty: 'Intermediate', duration: '3h 00m', completed: false, description: 'Smallholder irrigation options for the Sahel: treadle pumps, California drip systems, and lowland rice management.' },
    ],
    tasks: [
      { id: '1', text: 'Prepare groundnut fields — hivernage planting window June-July', completed: false, priority: 'high' },
      { id: '2', text: 'Ensure rice irrigation system is functional — Sahel station support available', completed: false, priority: 'normal' },
    ],
    marketplaceListings: [
      { id: '1', type: 'SELL', item: 'Groundnut (Decorticated) - 2 Tons', price: 'CFA 12,500/100kg', location: 'Kaolack, Senegal', contact: 'farm@senegalarachide.sn', verified: true, status: 'ACTIVE', date: new Date(Date.now() - 86400000).toISOString() },
    ],
    forumPosts: [
      { id: '1', author: 'Mamadou D.', title: 'Aflatoxin testing results — thoughts on Aflasafe treatment?', content: 'My groundnut tested above permissible limits for aflatoxin. Has anyone used Aflasafe biological control? Does it work in Senegal conditions?', replies: 15, likes: 42, category: 'General', date: new Date(Date.now() - 86400000).toISOString() },
    ],
    chatMessages: [
      { id: '1', channelId: 'general', author: 'Ousmane N.', text: 'Premieres pluies a Kaolack. On peux commencer le semis dacahuete. Attention aux secheresses en juillet selon les previsions.', timestamp: new Date(Date.now() - 3600000).toISOString(), avatar: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', isMe: false },
    ],
    trends: [
      { id: '1', tag: '#Hivernage2026', volume: '6.5K Posts' },
      { id: '2', tag: '#ArachideSN', volume: '3.8K Posts' },
      { id: '3', tag: '#SahelResilience', volume: '5.2K Posts' },
    ],
    suggestedUsers: [
      { id: 'sf1', name: 'Dr. Ousmane Diop', role: 'Livestock Vet (Senegal)', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop', mutual: 10 },
    ],
    stories: [
      { id: 'create', name: 'Add Story', img: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', isUser: true },
      { id: '1', name: 'ISRA Senegal', img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=150&h=150&fit=crop', hasUpdate: true },
    ],
    weatherDefaults: { locationName: 'Kaolack, Senegal', temp: 34, condition: 'Hot & Humid', humidity: 55, windSpeed: 16, forecast: 'Hivernage progressing. Average rainfall forecast but dry spells likely in July. Early groundnut planting recommended.', climateRiskIndex: 'Moderate' },
    dailyWageLocal: 2100,
    dailyWageUSD: 3.50,
    laborCurrencyCode: 'XOF',
  },
  AU: {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    currencyCode: 'AUD',
    currencySymbol: 'A$',
    language: 'en',
    region: 'Oceania',
    climateZone: 'semi_arid',
    areaUnit: 'ha',
    defaultCrops: [
      { id: '1', name: 'Wheat', variety: 'Scepter (AGT)', plantingDate: '2026-05-01', harvestDate: '2026-12-15', status: 'Healthy', area: 500, imageUrl: 'https://images.unsplash.com/photo-1533230537024-38c3459c9c9b?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'Moderate', biodiversityScore: 30 },
      { id: '2', name: 'Barley', variety: 'RGT Planet', plantingDate: '2026-05-15', harvestDate: '2026-12-31', status: 'Healthy', area: 300, imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'High', biodiversityScore: 35 },
      { id: '3', name: 'Canola', variety: '44Y90 (Corteva)', plantingDate: '2026-04-15', harvestDate: '2026-11-30', status: 'Needs Attention', area: 200, imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Degraded', waterEfficiency: 'Low', biodiversityScore: 22 },
    ],
    defaultLivestock: [
      { id: '1', name: 'Merino Sheep Flock', species: 'Sheep', count: 3000, status: 'Healthy', grazingType: 'Rotational', imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop', notes: 'Merino wool flock. Rotational grazing on improved pasture with supplementary feeding in dry periods.' },
      { id: '2', name: 'Beef Cattle Herd', species: 'Cattle', count: 80, status: 'Healthy', grazingType: 'Rotational', imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=1000&auto=format&fit=crop', notes: 'Angus herd. Cell grazing system on native pasture.' },
    ],
    marketPrices: [
      { cropName: 'Wheat (APW)', price: 320, unit: 'per tonne (AUD)', trend: 'down', changePercentage: -4.0, inputCostIndex: 108 },
      { cropName: 'Barley', price: 285, unit: 'per tonne (AUD)', trend: 'stable', changePercentage: 0.5, inputCostIndex: 105 },
      { cropName: 'Canola', price: 720, unit: 'per tonne (AUD)', trend: 'up', changePercentage: 5.0, inputCostIndex: 115 },
      { cropName: 'Urea Fertilizer', price: 750, unit: 'per tonne (AUD)', trend: 'up', changePercentage: 6.0, inputCostIndex: 100 },
    ],
    alerts: [
      { id: '1', title: 'ENSO Neutral Outlook', message: 'BOM forecasts ENSO neutral through 2026. Average winter rainfall expected for southern cropping regions. No strong El Nino or La Nina signal.', severity: 'low', category: 'WEATHER', timestamp: new Date().toISOString() },
      { id: '2', title: 'Mouse Plague Risk', message: 'Mouse numbers building in WA and SA grain regions. Bait early before sowing if monitoring shows >100 mice/ha.', severity: 'medium', category: 'LAND', timestamp: new Date(Date.now() - 3600000).toISOString() },
    ],
    learningModules: [
      { id: '1', title: 'No-Till Farming for Dryland Cropping', instructor: 'GRDC Research Team', thumbnail: 'https://images.unsplash.com/photo-1533230537024-38c3459c9c9b?q=80&w=800&fit=crop', lessonsCount: 8, category: 'Resilience', difficulty: 'Intermediate', duration: '2h 30m', completed: false, description: 'No-till establishment, stubble retention, and controlled traffic farming for Australian dryland systems. Soil health and moisture conservation.' },
      { id: '2', title: 'Grazing Management for Rangelands', instructor: 'MLA/DPIRD Team', thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&fit=crop', lessonsCount: 10, category: 'Resilience', difficulty: 'Advanced', duration: '3h 00m', completed: false, description: 'Cell grazing, stocking rate calculations, and drought management for extensive sheep and cattle operations.' },
    ],
    tasks: [
      { id: '1', text: 'Monitor mouse numbers — bait if exceeding 100/ha threshold', completed: false, priority: 'high' },
      { id: '2', text: 'Canola crop inspection — check for diamondback moth', completed: false, priority: 'normal' },
      { id: '3', text: 'Review grain marketing strategy — APW wheat under pressure', completed: false, priority: 'normal' },
    ],
    marketplaceListings: [
      { id: '1', type: 'SELL', item: 'APW Wheat - 500 Tonnes', price: 'A$320/t', location: 'York, WA', contact: 'farm@wheatbelt.au', verified: true, status: 'ACTIVE', date: new Date(Date.now() - 86400000).toISOString() },
    ],
    forumPosts: [
      { id: '1', author: 'Graham H.', title: 'Mouse baiting — zinc phosphide vs strychnine for 2026 season?', content: 'Mouse numbers climbing in the WA wheatbelt. What is everyone using for bait this year? Cost per hectare comparison?', replies: 35, likes: 78, category: 'Pests', date: new Date(Date.now() - 86400000).toISOString() },
    ],
    chatMessages: [
      { id: '1', channelId: 'general', author: 'Jenny S.', text: 'Good autumn break in WA. Sowing on track for wheat and barley. Canola going in this week.', timestamp: new Date(Date.now() - 3600000).toISOString(), avatar: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', isMe: false },
    ],
    trends: [
      { id: '1', tag: '#AussieGrain2026', volume: '15K Posts' },
      { id: '2', tag: '#MousePlague', volume: '8.5K Posts' },
      { id: '3', tag: '#RegenAgAU', volume: '6.2K Posts' },
    ],
    suggestedUsers: [
      { id: 'sf1', name: 'Graham Hughes', role: 'Grain Farmer (WA)', img: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', mutual: 4 },
    ],
    stories: [
      { id: 'create', name: 'Add Story', img: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', isUser: true },
      { id: '1', name: 'GRDC', img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=150&h=150&fit=crop', hasUpdate: true },
    ],
    weatherDefaults: { locationName: 'York, Western Australia', temp: 18, condition: 'Partly Cloudy', humidity: 50, windSpeed: 20, forecast: 'Autumn break established. ENSO neutral — average winter rainfall expected. Good conditions for crop establishment.', climateRiskIndex: 'Low' },
    dailyWageLocal: 280,
    dailyWageUSD: 184,
    laborCurrencyCode: 'AUD',
  },
  DE: {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    currencyCode: 'EUR',
    currencySymbol: '€',
    language: 'de',
    region: 'Europe',
    climateZone: 'temperate',
    areaUnit: 'ha',
    defaultCrops: [
      { id: '1', name: 'Winter Wheat', variety: 'Julius (KWS)', plantingDate: '2025-10-10', harvestDate: '2026-08-15', status: 'Healthy', area: 80, imageUrl: 'https://images.unsplash.com/photo-1533230537024-38c3459c9c9b?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Excellent', waterEfficiency: 'High', biodiversityScore: 52 },
      { id: '2', name: 'Winter Barley', variety: 'SY Planet', plantingDate: '2025-09-20', harvestDate: '2026-07-31', status: 'Harvest Ready', area: 50, imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'High', biodiversityScore: 48 },
      { id: '3', name: 'Sugar Beet', variety: 'KWS Safari', plantingDate: '2026-03-20', harvestDate: '2026-10-31', status: 'Healthy', area: 30, imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'Moderate', biodiversityScore: 40 },
    ],
    defaultLivestock: [
      { id: '1', name: 'Holstein Dairy Herd', species: 'Cattle', count: 120, status: 'Lactating', grazingType: 'Free Range', imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=1000&auto=format&fit=crop', notes: 'Holstein Friesian dairy. Pasture-based with TMR supplementation. Average 9,500 L/cow/year.' },
      { id: '2', name: 'Schwäbisch-Häll Pigs', species: 'Pig', count: 80, status: 'Healthy', grazingType: 'Feedlot', imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop', notes: 'Swabian-Hall breed, premium pork program. Free-range finishing on straw bedding.' },
    ],
    marketPrices: [
      { cropName: 'Wheat', price: 220, unit: 'per tonne (EUR)', trend: 'stable', changePercentage: 1.0, inputCostIndex: 108 },
      { cropName: 'Barley', price: 205, unit: 'per tonne (EUR)', trend: 'down', changePercentage: -2.5, inputCostIndex: 105 },
      { cropName: 'Sugar Beet', price: 42, unit: 'per tonne (EUR)', trend: 'stable', changePercentage: 0.5, inputCostIndex: 100 },
      { cropName: 'NPK Fertilizer', price: 380, unit: 'per tonne (EUR)', trend: 'up', changePercentage: 3.0, inputCostIndex: 100 },
    ],
    alerts: [
      { id: '1', title: 'Greening Compliance', message: 'Ecological Focus Area (EFA) requirements updated for 2026 CAP. Ensure catch crops and nitrogen-fixing crops planted on EFA hectares.', severity: 'medium', category: 'SYSTEM', timestamp: new Date().toISOString() },
      { id: '2', title: 'Wheat Rust Warning', message: 'Yellow stripe rust reported on susceptible winter wheat varieties in southern Germany. Monitor Julius and RGT Reform crops.', severity: 'high', category: 'LAND', timestamp: new Date(Date.now() - 3600000).toISOString() },
    ],
    learningModules: [
      { id: '1', title: 'CAP 2026 Compliance & Eco-Schemes', instructor: 'Bundesinformation Landwirtschaft', thumbnail: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800&fit=crop', lessonsCount: 8, category: 'Economics', difficulty: 'Intermediate', duration: '2h 30m', completed: false, description: 'Updated CAP eco-scheme requirements, EFA compliance, and green payment eligibility for 2026.' },
      { id: '2', title: 'Precision Dairy Management', instructor: 'DLG Expert Panel', thumbnail: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=800&fit=crop', lessonsCount: 10, category: 'Tech', difficulty: 'Advanced', duration: '3h 00m', completed: false, description: 'Automated milking, health monitoring collars, and feed optimization for European dairy operations.' },
    ],
    tasks: [
      { id: '1', text: 'Scout winter wheat for stripe rust — susceptible varieties at risk', completed: false, priority: 'high' },
      { id: '2', text: 'CAP eco-scheme documentation — EFA compliance check', completed: false, priority: 'normal' },
      { id: '3', text: 'Sugar beet haulm treatment — plan for pre-harvest desiccation', completed: false, priority: 'normal' },
    ],
    marketplaceListings: [
      { id: '1', type: 'SELL', item: 'Milling Wheat E-Grade - 100 Tonnes', price: '€220/t', location: 'Bavaria, Germany', contact: 'hof@bayernwheat.de', verified: true, status: 'ACTIVE', date: new Date(Date.now() - 86400000).toISOString() },
    ],
    forumPosts: [
      { id: '1', author: 'Hans M.', title: 'CAP Eco-Schemes — what are you planting for EFA this year?', content: 'Switching from catch crops to nitrogen-fixing crops for my EFA hectares. Better subsidy payment and soil benefit. What is everyone else doing?', replies: 20, likes: 55, category: 'General', date: new Date(Date.now() - 86400000).toISOString() },
    ],
    chatMessages: [
      { id: '1', channelId: 'general', author: 'Petra K.', text: 'Wheat looking excellent in Bayern. Stripe rust pressure low so far — hope it stays that way. Fungicide T1 applied.', timestamp: new Date(Date.now() - 3600000).toISOString(), avatar: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', isMe: false },
    ],
    trends: [
      { id: '1', tag: '#AgrarDE2026', volume: '9.5K Posts' },
      { id: '2', tag: '#Milchpreis', volume: '6.8K Posts' },
      { id: '3', tag: '#CAPGreening', volume: '4.2K Posts' },
    ],
    suggestedUsers: [
      { id: 'sf1', name: 'Hans Müller', role: 'Arable Farmer (Bayern)', img: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', mutual: 3 },
    ],
    stories: [
      { id: 'create', name: 'Add Story', img: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', isUser: true },
      { id: '1', name: 'DLG Frankfurt', img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=150&h=150&fit=crop', hasUpdate: true },
    ],
    weatherDefaults: { locationName: 'Munich, Bavaria', temp: 20, condition: 'Partly Cloudy', humidity: 62, windSpeed: 14, forecast: 'Mild spring conditions. Adequate soil moisture for winter cereals. Monitor stripe rust in susceptible wheat varieties.', climateRiskIndex: 'Low' },
    dailyWageLocal: 85,
    dailyWageUSD: 93,
    laborCurrencyCode: 'EUR',
  },
  TH: {
    code: 'TH',
    name: 'Thailand',
    flag: '🇹🇭',
    currencyCode: 'THB',
    currencySymbol: '฿',
    language: 'th',
    region: 'Southeast Asia',
    climateZone: 'tropical_humid',
    areaUnit: 'ha',
    defaultCrops: [
      { id: '1', name: 'Rice (Jasmine)', variety: 'KDML 105 (Khao Dawk Mali)', plantingDate: '2026-06-01', harvestDate: '2026-11-30', status: 'Healthy', area: 30, imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ced72a?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'High', biodiversityScore: 60 },
      { id: '2', name: 'Rubber', variety: 'RRIM 600', plantingDate: '2020-05-01', harvestDate: '2026-12-31', status: 'Healthy', area: 20, imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'Moderate', biodiversityScore: 45 },
      { id: '3', name: 'Cassava', variety: 'Rayong 9 (RD 9)', plantingDate: '2026-05-15', harvestDate: '2027-05-15', status: 'Needs Attention', area: 15, imageUrl: 'https://images.unsplash.com/photo-1584345604325-f5091269a0d1?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Degraded', waterEfficiency: 'Low', biodiversityScore: 28 },
    ],
    defaultLivestock: [
      { id: '1', name: 'Buffalo Draft Herd', species: 'Cattle', count: 8, status: 'Healthy', grazingType: 'Free Range', imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=1000&auto=format&fit=crop', notes: 'Swamp buffalo. Traditional paddy draft animals — being replaced by tractors on larger farms.' },
      { id: '2', name: 'Broiler Contract Flock', species: 'Chicken', count: 8000, status: 'Healthy', grazingType: 'Feedlot', imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000&auto=format&fit=crop', notes: 'CP Group contract broilers. 38-day cycle. Full biosecurity.' },
    ],
    marketPrices: [
      { cropName: 'Jasmine Rice', price: 14500, unit: 'per tonne (THB)', trend: 'stable', changePercentage: 1.5, inputCostIndex: 105 },
      { cropName: 'Rubber (RSS3)', price: 62, unit: 'per kg (THB)', trend: 'up', changePercentage: 5.0, inputCostIndex: 110 },
      { cropName: 'Cassava Chip', price: 4200, unit: 'per tonne (THB)', trend: 'up', changePercentage: 8.0, inputCostIndex: 108 },
      { cropName: 'NPK Fertilizer', price: 12500, unit: 'per tonne (THB)', trend: 'up', changePercentage: 4.0, inputCostIndex: 100 },
    ],
    alerts: [
      { id: '1', title: 'Southwest Monsoon Progress', message: 'TMD reports normal SW monsoon onset (mid-May 2026). Main rice season on track. Watch for late-season flooding in Chao Phraya basin.', severity: 'low', category: 'WEATHER', timestamp: new Date().toISOString() },
      { id: '2', title: 'Rubber Price Recovery', message: 'Rubber prices recovering after 2025 slump. RSS3 at THB 62/kg — consider increasing tapping frequency if trees are healthy.', severity: 'medium', category: 'FINANCIAL', timestamp: new Date(Date.now() - 3600000).toISOString() },
    ],
    learningModules: [
      { id: '1', title: 'SRI Rice for Water Conservation', instructor: 'Rice Department Thailand', thumbnail: 'https://images.unsplash.com/photo-1599940824399-b87987ced72a?q=80&w=800&fit=crop', lessonsCount: 8, category: 'Resilience', difficulty: 'Intermediate', duration: '2h 00m', completed: false, description: 'System of Rice Intensification for Thai jasmine rice. Reducing water use 40% while maintaining quality grade.' },
      { id: '2', title: 'Rubber Latex Quality & Tapping Efficiency', instructor: 'RRIT Research Division', thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&fit=crop', lessonsCount: 10, category: 'Economics', difficulty: 'Advanced', duration: '3h 00m', completed: false, description: 'Optimizing tapping panels, rain guarding, and latex preservation for THB/kg margin improvement.' },
    ],
    tasks: [
      { id: '1', text: 'Prepare main rice paddy — monsoon planting window June-July', completed: false, priority: 'high' },
      { id: '2', text: 'Increase rubber tapping frequency — prices recovering', completed: false, priority: 'normal' },
    ],
    marketplaceListings: [
      { id: '1', type: 'SELL', item: 'Jasmine Rice KDML 105 - 10 Tonnes', price: '฿14,500/t', location: 'Surin, Thailand', contact: 'farm@thairice.co.th', verified: true, status: 'ACTIVE', date: new Date(Date.now() - 86400000).toISOString() },
    ],
    forumPosts: [
      { id: '1', author: 'Somchai P.', title: 'SRI rice yields — anyone getting 5 tonnes with less water?', content: 'Switching to SRI on part of my jasmine rice this season. Rice Department claims 40% water savings. Anyone hitting good yields with SRI in NE Thailand?', replies: 16, likes: 38, category: 'General', date: new Date(Date.now() - 86400000).toISOString() },
    ],
    chatMessages: [
      { id: '1', channelId: 'general', author: 'Niran K.', text: 'Monsoon is progressing normally in Isan. Good rainfall this week. Start rice nursery preparation now.', timestamp: new Date(Date.now() - 3600000).toISOString(), avatar: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', isMe: false },
    ],
    trends: [
      { id: '1', tag: '#ThaiRice2026', volume: '11K Posts' },
      { id: '2', tag: '#RubberPrice', volume: '7.5K Posts' },
      { id: '3', tag: '#SRIMethod', volume: '3.2K Posts' },
    ],
    suggestedUsers: [
      { id: 'sf1', name: 'Somchai Phan', role: 'Rice Farmer (Surin)', img: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', mutual: 7 },
    ],
    stories: [
      { id: 'create', name: 'Add Story', img: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', isUser: true },
      { id: '1', name: 'RiceDeptTH', img: 'https://images.unsplash.com/photo-1599940824399-b87987ced72a?w=150&h=150&fit=crop', hasUpdate: true },
    ],
    weatherDefaults: { locationName: 'Surin, Thailand', temp: 33, condition: 'Rainy Season', humidity: 82, windSpeed: 8, forecast: 'SW monsoon established. Normal rainfall for main rice season. Watch for late-season flooding in low-lying paddies.', climateRiskIndex: 'Low' },
    dailyWageLocal: 400,
    dailyWageUSD: 11.60,
    laborCurrencyCode: 'THB',
  },
  MX: {
    code: 'MX',
    name: 'Mexico',
    flag: '🇲🇽',
    currencyCode: 'MXN',
    currencySymbol: 'Mex$',
    language: 'es',
    region: 'Central America',
    climateZone: 'subtropical',
    areaUnit: 'ha',
    defaultCrops: [
      { id: '1', name: 'Maize', variety: 'H-520 (INIFAP)', plantingDate: '2026-05-01', harvestDate: '2026-11-30', status: 'Healthy', area: 30, imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'Moderate', biodiversityScore: 40 },
      { id: '2', name: 'Avocado', variety: 'Hass', plantingDate: '2021-06-01', harvestDate: '2026-12-31', status: 'Healthy', area: 15, imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Good', waterEfficiency: 'High', biodiversityScore: 62 },
      { id: '3', name: 'Coffee (Arabica)', variety: 'Typica (Oro Azteca)', plantingDate: '2022-05-01', harvestDate: '2026-12-31', status: 'Needs Attention', area: 8, imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop', soilHealth: 'Degraded', waterEfficiency: 'Moderate', biodiversityScore: 55 },
    ],
    defaultLivestock: [
      { id: '1', name: 'Brahman Beef Herd', species: 'Cattle', count: 60, status: 'Healthy', grazingType: 'Rotational', imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=1000&auto=format&fit=crop', notes: 'Brahman-cross beef cattle. Rotational grazing on buffelgrass pasture in Veracruz.' },
      { id: '2', name: 'Creole Goat Herd', species: 'Goat', count: 80, status: 'Healthy', grazingType: 'Free Range', imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop', notes: 'Creole goats for meat. Rangeland grazing in semi-arid regions.' },
    ],
    marketPrices: [
      { cropName: 'Maize (White)', price: 6800, unit: 'per tonne (MXN)', trend: 'up', changePercentage: 5.0, inputCostIndex: 110 },
      { cropName: 'Avocado', price: 42000, unit: 'per tonne (MXN)', trend: 'up', changePercentage: 8.0, inputCostIndex: 135 },
      { cropName: 'Coffee (Cherry)', price: 8500, unit: 'per quintal (MXN)', trend: 'up', changePercentage: 12.0, inputCostIndex: 120 },
      { cropName: 'DAP Fertilizer', price: 12500, unit: 'per tonne (MXN)', trend: 'up', changePercentage: 6.0, inputCostIndex: 100 },
    ],
    alerts: [
      { id: '1', title: 'Canicula Forecast', message: 'SMN forecasts mid-summer dry period (canicula) in July-August for central Mexico. Plan supplemental irrigation for avocado and maize.', severity: 'medium', category: 'WEATHER', timestamp: new Date().toISOString() },
      { id: '2', title: 'Coffee Leaf Rust Alert', message: 'Royalty pressure increasing in Veracruz and Chiapas highlands. Apply preventive fungicide — resistant varieties being distributed by INIFAP.', severity: 'high', category: 'LAND', timestamp: new Date(Date.now() - 3600000).toISOString() },
    ],
    learningModules: [
      { id: '1', title: 'Avocado Export Quality & Phytosanitary', instructor: 'INIFAP/CESAVEG Team', thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&fit=crop', lessonsCount: 10, category: 'Economics', difficulty: 'Advanced', duration: '3h 00m', completed: false, description: 'Post-harvest handling, packing standards, and phytosanitary certification for avocado export to US and Asian markets.' },
      { id: '2', title: 'Coffee Leaf Rust Management', instructor: 'INIFAP Coffee Program', thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&fit=crop', lessonsCount: 8, category: 'Resilience', difficulty: 'Intermediate', duration: '2h 30m', completed: false, description: 'Identifying CLR symptoms, fungicide timing, and transitioning to resistant Lempira and Oro Azteca varieties.' },
    ],
    tasks: [
      { id: '1', text: 'Scout coffee for leaf rust — apply preventive fungicide in highland areas', completed: false, priority: 'high' },
      { id: '2', text: 'Prepare avocado irrigation for canicula period (Jul-Aug dry spell)', completed: false, priority: 'high' },
      { id: '3', text: 'Maize FAW scouting — trap monitoring in central states', completed: false, priority: 'normal' },
    ],
    marketplaceListings: [
      { id: '1', type: 'SELL', item: 'Hass Avocado Premium - 5 Tons', price: 'Mex$42,000/t', location: 'Uruapan, Michoac', contact: 'rancho@aguacatemx.com', verified: true, status: 'ACTIVE', date: new Date(Date.now() - 86400000).toISOString() },
    ],
    forumPosts: [
      { id: '1', author: 'Rosa L.', title: 'Avocado water footprint — sustainable irrigation methods?', content: 'Water scarcity in Michoacan is becoming critical. Who is using micro-sprinkler or drip for avocado? Is it worth the investment?', replies: 28, likes: 82, category: 'Equipment', date: new Date(Date.now() - 86400000).toISOString() },
    ],
    chatMessages: [
      { id: '1', channelId: 'general', author: 'Miguel H.', text: 'Lluvias regulares en Veracruz. Buen inicio de temporada para maiz y aguacate. Cuidado con la canicula en julio.', timestamp: new Date(Date.now() - 3600000).toISOString(), avatar: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', isMe: false },
    ],
    trends: [
      { id: '1', tag: '#AguacateMX', volume: '14K Posts' },
      { id: '2', tag: '#CafeMex2026', volume: '7.3K Posts' },
      { id: '3', tag: '#Canicula', volume: '4.5K Posts' },
    ],
    suggestedUsers: [
      { id: 'sf1', name: 'Rosa Lopez', role: 'Avocado Grower (Michoacan)', img: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', mutual: 9 },
    ],
    stories: [
      { id: 'create', name: 'Add Story', img: 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=150&h=150&fit=crop', isUser: true },
      { id: '1', name: 'AvoMex', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=150&h=150&fit=crop', hasUpdate: true },
    ],
    weatherDefaults: { locationName: 'Uruapan, Michoacan', temp: 26, condition: 'Rainy Season', humidity: 70, windSpeed: 10, forecast: 'Regular rainy season. Canicula (mid-summer dry) expected Jul-Aug. Monitor avocado irrigation needs.', climateRiskIndex: 'Moderate' },
    dailyWageLocal: 300,
    dailyWageUSD: 17.65,
    laborCurrencyCode: 'MXN',
  },
};

export const COUNTRY_LIST = Object.values(COUNTRY_REGISTRY).sort((a, b) => a.name.localeCompare(b.name));
