
import { Crop, Livestock, Task, LearningModule, MarketPrice, MarketplaceListing, ForumPost, ForumReply, LogEntry, CommunityChatMessage, UserProfile, LaborInput, ResourceResult, Story, SocialTrend, SuggestedUser, SystemAlert } from '../types';
import { GUEST_USER } from '../constants';

// --- DATABASE KEYS ---
export const DB_KEYS = {
  CROPS: 'agriflow_crops',
  LIVESTOCK: 'agriflow_livestock',
  TASKS: 'agriflow_tasks',
  LEARNING: 'agriflow_learning',
  MARKET: 'agriflow_market',
  MARKET_TRENDS: 'agriflow_market_trends', // New: Track market trends
  LISTINGS: 'agriflow_listings',
  POSTS: 'agriflow_posts',
  REPLIES: 'agriflow_replies',
  LOGS: 'agriflow_logs',
  CHAT: 'agriflow_chat',
  FOLLOWED_USERS: 'agriflow_followed_users',
  LIKED_POSTS: 'agriflow_liked_posts',
  BOOKMARKED_POSTS: 'agriflow_bookmarked_posts',
  USER_PROFILE: 'agriflow_user_profile',
  LABOR_INPUT: 'agriflow_labor_input',
  RESOURCE_RESULT: 'agriflow_resource_result',
  STORIES: 'agriflow_stories',
  TRENDS: 'agriflow_trends',
  SUGGESTED_USERS: 'agriflow_suggested_users',
  ALERTS: 'agriflow_alerts',
  POLL_VOTED: 'agriflow_poll_voted',
  QUESTIONS: 'agriflow_qa_questions'
};

// --- SIMULATED LATENCY ---
// Optimized: Micro-delay to prevent UI blocking while keeping async contract
const simulateNetworkDelay = async () => {
  // 0-20ms delay is imperceptible but allows the event loop to breathe
  const delay = Math.floor(Math.random() * 20);
  return new Promise(resolve => setTimeout(resolve, delay));
};

class PersistenceService {
  
  // --- CORE STORAGE METHODS ---

  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`[DB Read Error] Key: ${key}`, error);
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[DB Write Error] Key: ${key}`, error);
      // In a real app, we might trigger a 'Storage Full' UI alert here
      return false;
    }
  }

  // --- GENERIC ID GENERATOR ---
  generateId(prefix: string = 'id'): string {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000).toString(16)}`;
  }

  // --- SPECIFIC ENTITY OPERATIONS ---

  // 1. CROPS
  async getCrops(): Promise<Crop[]> {
    await simulateNetworkDelay();
    const raw = this.getItem<any[]>(DB_KEYS.CROPS, []);
    return raw.map(crop => ({
      ...crop,
      soilHealth: crop.soilHealth || 'Unknown',
      waterEfficiency: crop.waterEfficiency || 'Moderate',
      biodiversityScore: typeof crop.biodiversityScore === 'number' ? crop.biodiversityScore : 50,
      status: crop.status || 'Healthy',
      imageUrl: crop.imageUrl || `https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop`,
      name: crop.name || 'Unnamed Crop',
      variety: crop.variety || 'Unknown Variety',
      area: Number(crop.area) || 0
    }));
  }

  async saveCrops(crops: Crop[]): Promise<void> {
    await simulateNetworkDelay();
    this.setItem(DB_KEYS.CROPS, crops);
  }

  // 2. LIVESTOCK
  async getLivestock(): Promise<Livestock[]> {
    await simulateNetworkDelay();
    const raw = this.getItem<any[]>(DB_KEYS.LIVESTOCK, []);
    return raw.map(animal => ({
      ...animal,
      grazingType: animal.grazingType || 'Rotational',
      status: animal.status || 'Healthy',
      imageUrl: animal.imageUrl || `https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=1000&auto=format&fit=crop`,
      name: animal.name || 'Unnamed Herd',
      count: Number(animal.count) || 0
    }));
  }

  async saveLivestock(livestock: Livestock[]): Promise<void> {
    await simulateNetworkDelay();
    this.setItem(DB_KEYS.LIVESTOCK, livestock);
  }

  // 3. TASKS
  async getTasks(): Promise<Task[]> {
    return this.getItem<Task[]>(DB_KEYS.TASKS, []).map(t => ({
      ...t,
      priority: t.priority || 'normal'
    }));
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    this.setItem(DB_KEYS.TASKS, tasks); // Instant save for UI responsiveness on checkboxes
  }

  // 4. EDUCATION
  async getModules(): Promise<LearningModule[]> {
    const modules = this.getItem<LearningModule[]>(DB_KEYS.LEARNING, []);
    return modules.map(m => ({
      ...m,
      instructor: m.instructor || 'AgriFlow Expert',
      thumbnail: m.thumbnail || 'https://images.unsplash.com/photo-1625246333195-00305256a836?q=80&w=800',
      lessonsCount: m.lessonsCount || 5,
      description: m.description || 'Professional agricultural training module.'
    }));
  }

  async saveModules(modules: LearningModule[]): Promise<void> {
    this.setItem(DB_KEYS.LEARNING, modules);
  }

  // 5. MARKET DATA & TRENDS
  async getMarketPrices(): Promise<MarketPrice[]> {
    return this.getItem<MarketPrice[]>(DB_KEYS.MARKET, []);
  }

  async saveMarketPrices(prices: MarketPrice[]): Promise<void> {
    this.setItem(DB_KEYS.MARKET, prices);
  }

  async getMarketTrends(): Promise<Record<string, { direction: 'UP' | 'DOWN' | 'STABLE', duration: number }>> {
    return this.getItem(DB_KEYS.MARKET_TRENDS, {});
  }

  async saveMarketTrends(trends: Record<string, any>): Promise<void> {
    this.setItem(DB_KEYS.MARKET_TRENDS, trends);
  }

  // 6. MARKETPLACE LISTINGS
  async getListings(): Promise<MarketplaceListing[]> {
    await simulateNetworkDelay();
    const raw = this.getItem<any[]>(DB_KEYS.LISTINGS, []);
    return raw.map(l => ({
      ...l,
      status: l.status || 'ACTIVE',
      date: l.date || new Date().toISOString()
    }));
  }

  async saveListings(listings: MarketplaceListing[]): Promise<void> {
    await simulateNetworkDelay();
    this.setItem(DB_KEYS.LISTINGS, listings);
  }

  // 7. FORUM POSTS
  async getPosts(): Promise<ForumPost[]> {
    await simulateNetworkDelay();
    const raw = this.getItem<any[]>(DB_KEYS.POSTS, []);
    return raw.map(p => ({
      ...p,
      content: p.content || '',
      likes: p.likes || 0,
      date: p.date || new Date().toISOString()
    }));
  }

  async savePosts(posts: ForumPost[]): Promise<void> {
    await simulateNetworkDelay();
    this.setItem(DB_KEYS.POSTS, posts);
  }

  async getReplies(postId: string): Promise<ForumReply[]> {
    await simulateNetworkDelay();
    const allReplies = this.getItem<ForumReply[]>(DB_KEYS.REPLIES, []);
    return allReplies.filter(r => r.postId === postId).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async addReply(reply: ForumReply): Promise<void> {
    await simulateNetworkDelay();
    const allReplies = this.getItem<ForumReply[]>(DB_KEYS.REPLIES, []);
    this.setItem(DB_KEYS.REPLIES, [...allReplies, reply]);
  }

  async getAllReplies(): Promise<ForumReply[]> {
    return this.getItem<ForumReply[]>(DB_KEYS.REPLIES, []);
  }

  async saveReplies(replies: ForumReply[]): Promise<void> {
    this.setItem(DB_KEYS.REPLIES, replies);
  }

  // 8. SOCIAL INTERACTIONS
  async getLikedPostIds(): Promise<string[]> {
    return this.getItem<string[]>(DB_KEYS.LIKED_POSTS, []);
  }

  async saveLikedPostIds(ids: string[]): Promise<void> {
    this.setItem(DB_KEYS.LIKED_POSTS, ids);
  }

  async getBookmarkedPostIds(): Promise<string[]> {
    return this.getItem<string[]>(DB_KEYS.BOOKMARKED_POSTS, []);
  }

  async saveBookmarkedPostIds(ids: string[]): Promise<void> {
    this.setItem(DB_KEYS.BOOKMARKED_POSTS, ids);
  }

  async getFollowedUserIds(): Promise<string[]> {
    return this.getItem<string[]>(DB_KEYS.FOLLOWED_USERS, []);
  }

  async saveFollowedUserIds(ids: string[]): Promise<void> {
    this.setItem(DB_KEYS.FOLLOWED_USERS, ids);
  }

  // 9. LOGS
  async getLogs(): Promise<LogEntry[]> {
    return this.getItem<LogEntry[]>(DB_KEYS.LOGS, []);
  }

  async saveLogs(logs: LogEntry[]): Promise<void> {
    this.setItem(DB_KEYS.LOGS, logs);
  }

  // 10. CHAT
  async getChatMessages(): Promise<CommunityChatMessage[]> {
    return this.getItem<CommunityChatMessage[]>(DB_KEYS.CHAT, []);
  }

  async saveChatMessages(messages: CommunityChatMessage[]): Promise<void> {
    this.setItem(DB_KEYS.CHAT, messages);
  }

  // 11. USER PROFILE
  async getUserProfile(): Promise<UserProfile> {
    return this.getItem<UserProfile>(DB_KEYS.USER_PROFILE, GUEST_USER);
  }

  async saveUserProfile(profile: UserProfile): Promise<void> {
    this.setItem(DB_KEYS.USER_PROFILE, profile);
  }

  async getLaborInput(): Promise<LaborInput | null> {
    return this.getItem<LaborInput | null>(DB_KEYS.LABOR_INPUT, null);
  }

  async saveLaborInput(input: LaborInput): Promise<void> {
    this.setItem(DB_KEYS.LABOR_INPUT, input);
  }

  async getResourceResult(): Promise<ResourceResult | null> {
    return this.getItem<ResourceResult | null>(DB_KEYS.RESOURCE_RESULT, null);
  }

  async saveResourceResult(result: ResourceResult): Promise<void> {
    this.setItem(DB_KEYS.RESOURCE_RESULT, result);
  }

  // 12. STORIES
  async getStories(): Promise<Story[]> {
    return this.getItem<Story[]>(DB_KEYS.STORIES, []);
  }

  async saveStories(stories: Story[]): Promise<void> {
    this.setItem(DB_KEYS.STORIES, stories);
  }

  // 13. TRENDS
  async getTrends(): Promise<SocialTrend[]> {
    return this.getItem<SocialTrend[]>(DB_KEYS.TRENDS, []);
  }

  async saveTrends(trends: SocialTrend[]): Promise<void> {
    this.setItem(DB_KEYS.TRENDS, trends);
  }

  // 14. SUGGESTED USERS
  async getSuggestedUsers(): Promise<SuggestedUser[]> {
    return this.getItem<SuggestedUser[]>(DB_KEYS.SUGGESTED_USERS, []);
  }

  async saveSuggestedUsers(users: SuggestedUser[]): Promise<void> {
    this.setItem(DB_KEYS.SUGGESTED_USERS, users);
  }

  // 15. ALERTS
  async getAlerts(): Promise<SystemAlert[]> {
    return this.getItem<SystemAlert[]>(DB_KEYS.ALERTS, []);
  }

  async saveAlerts(alerts: SystemAlert[]): Promise<void> {
    this.setItem(DB_KEYS.ALERTS, alerts);
  }

  // 16. POLL VOTED
  async getPollVoted(): Promise<number | null> {
    return this.getItem<number | null>(DB_KEYS.POLL_VOTED, null);
  }

  async savePollVoted(voted: number | null): Promise<void> {
    this.setItem(DB_KEYS.POLL_VOTED, voted);
  }

  // 17. Q&A QUESTIONS
  async getQuestions(): Promise<any[]> {
    return this.getItem<any[]>(DB_KEYS.QUESTIONS, []);
  }

  async saveQuestions(questions: any[]): Promise<void> {
    this.setItem(DB_KEYS.QUESTIONS, questions);
  }
}

export const db = new PersistenceService();
