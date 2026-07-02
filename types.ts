
export enum NavigationTab {
  DASHBOARD = 'DASHBOARD',
  CROPS = 'CROPS',
  LIVESTOCK = 'LIVESTOCK',
  MARKET = 'MARKET',
  EDUCATION = 'EDUCATION',
  NEWS = 'NEWS',
  AI_ADVISOR = 'AI_ADVISOR',
  CALCULATOR = 'CALCULATOR',
  COMMUNITY = 'COMMUNITY',
  LABOR = 'LABOR',
  CALENDAR = 'CALENDAR',
  SETTINGS = 'SETTINGS'
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface UserLocation {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  timestamp: number | null;
}

export type AreaUnit = 'ha' | 'acres';

export type FarmType = 'crop' | 'livestock' | 'mixed' | 'aquaculture' | 'horticulture';

export type ClimateZone =
  | 'sahel'
  | 'tropical_humid'
  | 'tropical_wet_dry'
  | 'semi_arid'
  | 'arid'
  | 'mediterranean'
  | 'temperate'
  | 'subtropical'
  | 'highland';

export interface UserProfile {
  name: string;
  role: string;
  farmName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  countryCode: string;
  currencyCode: string;
  currencySymbol: string;
  language: string;
  region: string;
  farmType: FarmType;
  areaUnit: AreaUnit;
  climateZone: ClimateZone;
  phoneNumber: string;
  location: string;
}

export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  currencyCode: string;
  currencySymbol: string;
  language: string;
  region: string;
  climateZone: ClimateZone;
  areaUnit: AreaUnit;
  defaultCrops: Crop[];
  defaultLivestock: Livestock[];
  marketPrices: MarketPrice[];
  alerts: SystemAlert[];
  learningModules: LearningModule[];
  tasks: Task[];
  marketplaceListings: MarketplaceListing[];
  forumPosts: ForumPost[];
  chatMessages: CommunityChatMessage[];
  trends: SocialTrend[];
  suggestedUsers: SuggestedUser[];
  stories: Story[];
  weatherDefaults: Partial<WeatherData>;
  dailyWageLocal: number;
  dailyWageUSD: number;
  laborCurrencyCode: string;
}

export interface WeatherData {
  locationName: string; 
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: string;
  climateRiskIndex: 'Low' | 'Moderate' | 'High' | 'Severe';
}

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'FINANCIAL' | 'LAND' | 'WEATHER' | 'SYSTEM';
  timestamp: string;
}

export interface Crop {
  id: string;
  name: string;
  variety: string;
  plantingDate: string;
  harvestDate: string;
  status: 'Healthy' | 'Needs Attention' | 'Critical' | 'Harvest Ready';
  area: number; // in acres
  imageUrl?: string;
  soilHealth: 'Excellent' | 'Good' | 'Degraded' | 'Unknown';
  waterEfficiency: 'High' | 'Moderate' | 'Low';
  biodiversityScore: number;
}

export interface Livestock {
  id: string;
  name: string;
  species: 'Cattle' | 'Goat' | 'Sheep' | 'Chicken' | 'Pig' | 'Other';
  count: number;
  status: 'Healthy' | 'Sick' | 'Quarantined' | 'Lactating';
  grazingType: 'Rotational' | 'Free Range' | 'Feedlot';
  imageUrl?: string;
  notes: string;
}

export interface LearningModule {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  lessonsCount: number;
  category: 'Resilience' | 'Economics' | 'Regenerative' | 'Tech';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  completed: boolean;
  description: string;
  videoId: string;
  progress: number;
  completedLessons: number[];
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: 'Market' | 'Tech' | 'Policy' | 'Climate';
  source: string;
  timeAgo: string;
  url?: string;
  isSimulated?: boolean;
}

export interface MarketPrice {
  cropName: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  changePercentage: number;
  inputCostIndex: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  timestamp: Date;
  isRegenerativeAnalysis?: boolean;
  isSimulated?: boolean;
  sources?: { title: string; uri: string }[];
}

export interface ChartDataPoint {
  name: string;
  value: number;
  cost: number;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'normal' | 'high';
}

export interface MarketplaceListing {
  id: string;
  type: 'SELL' | 'BUY';
  item: string;
  price: string;
  location: string;
  contact: string;
  seller?: string;
  verified: boolean;
  status: 'ACTIVE' | 'SOLD'; 
  date: string;
  image?: string;
}

export interface ForumPost {
  id: string;
  author: string;
  title: string;
  category: 'Pests' | 'Equipment' | 'Market' | 'General';
  content: string;
  replies: number;
  likes: number;
  date: string;
  image?: string;
}

export interface ForumReply {
  id: string;
  postId: string;
  author: string;
  content: string;
  date: string;
}

export interface LogEntry {
  id: string;
  referenceId: string;
  category: 'CROP' | 'LIVESTOCK';
  date: string;
  note: string;
  type: 'Observation' | 'Action' | 'Harvest' | 'Treatment' | 'Input';
}

export interface CommunityChatMessage {
  id: string;
  channelId: string;
  author: string;
  text: string;
  timestamp: string;
  avatar?: string;
  isMe: boolean;
}

export interface Story {
  id: string;
  name: string;
  img: string;
  isUser?: boolean;
  hasUpdate?: boolean;
}

export interface SocialTrend {
  id: string;
  tag: string;
  volume: string;
}

export interface SuggestedUser {
  id: string;
  name: string;
  role: string;
  img: string;
  mutual: number;
}

export interface PollOption {
   id: number;
   text: string;
   percent: number;
   votes: number;
}

export interface LaborInput {
  farmSizeHa: number;
  mainCrop: string;
  secondaryCrop: string;
  livestockCount: number;
  season: 'dry' | 'rainy';
  mechanization: 'none' | 'partial' | 'full';
  familyWorkers: number;
  irrigationType: 'rainfed' | 'manual' | 'pump';
}

export interface LaborResult {
  totalWorkers: number;
  familyWorkers: number;
  hiredWorkers: number;
  peakWorkers: number;
  monthlyBreakdown: { month: string; workers: number; activity: string }[];
  costEstimate: { category: string; amount: number }[];
  totalMonthlyCost: number;
  recommendations: string[];
}

export interface FertilizerInput {
  targetN: number;
  fertType: number;
  area: number;
}

export interface IrrigationInput {
  cropFactor: number;
  et0: number;
  efficiency: number;
  area: number;
}

export interface CropExpense {
  id: string;
  cropId: string;
  category: 'Seeds' | 'Fertilizer' | 'Labor' | 'Irrigation' | 'Equipment' | 'Pesticide' | 'Transport' | 'Other';
  description: string;
  amount: number;
  date: string;
}

export interface CropIncome {
  id: string;
  cropId: string;
  type: 'Harvest Sale' | 'Subsidy' | 'Insurance Payout' | 'Processing' | 'Other';
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  date: string;
}

export interface ResourceResult {
  mode: 'FERTILIZER' | 'IRRIGATION';
  fertilizerKg: number;
  irrigationLitersPerDay: number;
  savedAt: string;
}
