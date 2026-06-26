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
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ced72a?q=80&w=400&auto=format&fit=crop'
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
    image: 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?w=400&fit=crop'
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
