import { MarketplaceListing, ForumPost, CommunityChatMessage, Story, SocialTrend, SuggestedUser } from '../types';

export const INITIAL_LISTINGS: MarketplaceListing[] = [
  {
    id: '1',
    type: 'SELL',
    item: 'Local Rice - 50 Bags (100kg)',
    price: '₦52,000/bag',
    location: 'Kano, Nigeria',
    contact: 'adebayo@greensahel.com',
    seller: 'Adebayo O.',
    verified: true,
    status: 'ACTIVE',
    date: new Date(Date.now() - 86400000).toISOString(),
    image: '/stock/rice.svg'
  },
  {
    id: '2',
    type: 'BUY',
    item: 'Tractor Ploughing Service - 5 Hectares',
    price: '₦45,000/ha',
    location: 'Kaduna, Nigeria',
    contact: 'adebayo@greensahel.com',
    seller: 'Ibrahim D.',
    verified: true,
    status: 'ACTIVE',
    date: new Date(Date.now() - 172800000).toISOString(),
    image: '/stock/marketplace.svg'
  },
  {
    id: '3',
    type: 'SELL',
    item: 'Cocoa Beans - Premium Grade (2 Tons)',
    price: '$8,950/ton',
    location: 'Kumasi, Ghana',
    contact: 'kwame@cocoak.Asante.co',
    seller: 'Kwame A.',
    verified: true,
    status: 'ACTIVE',
    date: new Date(Date.now() - 259200000).toISOString(),
    image: '/stock/cassava.svg'
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
    image: '/stock/cowpea.svg'
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
    image: '/stock/sorghum.svg'
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
    image: '/stock/marketplace.svg'
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
    image: '/stock/cassava.svg'
  },
];

export const INITIAL_CHAT_MESSAGES: CommunityChatMessage[] = [
  { id: '1', channelId: 'general', author: 'Mallam Yusuf', text: 'Rain started in Katsina yesterday but very light. NiMet says we may get a dry spell in July — keep irrigation ready.', timestamp: new Date(Date.now() - 3600000).toISOString(), avatar: '/stock/user.svg', isMe: false },
  { id: '2', channelId: 'general', author: 'Fatima M.', text: 'Thanks Yusuf! My cowpea is already in the ground. Should I consider replanting if the rains fail in July?', timestamp: new Date(Date.now() - 1800000).toISOString(), avatar: '/stock/user.svg', isMe: false },
  { id: '3', channelId: 'market', author: 'Ibrahim D.', text: 'Maize prices up 8% in Kano market this week. Fertilizer costs still climbing — urea at ₦28,000 per 50kg bag.', timestamp: new Date(Date.now() - 900000).toISOString(), avatar: '/stock/user.svg', isMe: false },
  { id: '4', channelId: 'livestock', author: 'Herdsmann Ali', text: 'Moving cattle south early this year — Sahel pasture already thinning. Who else is doing early transhumance?', timestamp: new Date(Date.now() - 4000000).toISOString(), avatar: '/stock/user.svg', isMe: false },
  { id: '5', channelId: 'general', author: 'Kwame A.', text: 'Minor rains started in Kumasi last week. Soil moisture good for the cocoa rehabilitation — hope the dry spell skips us this year.', timestamp: new Date(Date.now() - 2400000).toISOString(), avatar: '/stock/user.svg', isMe: false },
  { id: '6', channelId: 'market', author: 'Awa D.', text: 'Millet prices stable in Dakar market this week but the CILSS dry spell advisory is keeping buyers cautious.', timestamp: new Date(Date.now() - 1500000).toISOString(), avatar: '/stock/user.svg', isMe: false },
];

export const INITIAL_STORIES: Story[] = [
  { id: 'create', name: 'Add Story', img: '/stock/user.svg', isUser: true },
  { id: '1', name: 'SahelGrowers', img: '/stock/user.svg', hasUpdate: true },
  { id: '2', name: 'CocoaCo GH', img: '/stock/user.svg', hasUpdate: true },
  { id: '3', name: 'Vet Dr. Amadou', img: '/stock/user.svg', hasUpdate: false },
  { id: '4', name: 'AgriMach NG', img: '/stock/user.svg', hasUpdate: true },
];

export const INITIAL_TRENDS: SocialTrend[] = [
  { id: '1', tag: '#SahelRain2026', volume: '18.7K Posts' },
  { id: '2', tag: '#FoodSecurityWA', volume: '14.3K Posts' },
  { id: '3', tag: '#DrySpellAlert', volume: '9.5K Posts' },
  { id: '4', tag: '#CocoaPrices', volume: '6.8K Posts' },
  { id: '5', tag: '#AgriTechWestAfrica', volume: '4.2K Posts' },
];

export const INITIAL_SUGGESTED_USERS: SuggestedUser[] = [
  { id: 'sf1', name: "Amina Bello", role: "Rice Agronomist (IITA)", img: "/stock/user.svg", mutual: 24 },
  { id: 'sf2', name: "Kwame Asante", role: "Cocoa Specialist (Ghana)", img: "/stock/user.svg", mutual: 18 },
  { id: 'sf3', name: "Dr. Ousmane Diop", role: "Livestock Vet (Senegal)", img: "/stock/user.svg", mutual: 31 }
];
