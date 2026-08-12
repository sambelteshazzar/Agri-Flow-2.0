
import { Crop, Livestock, Task, LearningModule, MarketPrice, MarketplaceListing, ForumPost, ForumReply, LogEntry, CommunityChatMessage, UserProfile, LaborInput, ResourceResult, Story, SocialTrend, SuggestedUser, SystemAlert, CropExpense, CropIncome, Question, Answer, AppNotification, DirectMessage, DirectMessageItem, MessageReaction } from '../types';
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
  LIKED_QUESTIONS: 'agriflow_liked_questions',
  BOOKMARKED_POSTS: 'agriflow_bookmarked_posts',
  USER_PROFILE: 'agriflow_user_profile',
  LABOR_INPUT: 'agriflow_labor_input',
  RESOURCE_RESULT: 'agriflow_resource_result',
  STORIES: 'agriflow_stories',
  TRENDS: 'agriflow_trends',
  SUGGESTED_USERS: 'agriflow_suggested_users',
  ALERTS: 'agriflow_alerts',
  POLL_VOTED: 'agriflow_poll_voted',
  QUESTIONS: 'agriflow_qa_questions',
  DIRECT_MESSAGES: 'agriflow_direct_messages',
  NOTIFICATIONS: 'agriflow_notifications',
  CROP_EXPENSES: 'agriflow_crop_expenses',
  CROP_INCOMES: 'agriflow_crop_incomes'
};

// --- SIMULATED LATENCY ---
// Optimized: Micro-delay to prevent UI blocking while keeping async contract
const simulateNetworkDelay = async () => {
  // 0-20ms delay is imperceptible but allows the event loop to breathe
  const delay = Math.floor(Math.random() * 20);
  return new Promise(resolve => setTimeout(resolve, delay));
};

class PersistenceService {
  // Tracks the most recent failed write so callers can surface a toast to the
  // user when localStorage quota is exhausted (5MB typical). Previously the
  // setItem boolean was returned but no caller checked it, so saves silently
  // failed forever and the app kept saying "saved".
  private lastWriteFailed = false;

  getLastWriteFailed(): boolean { return this.lastWriteFailed; }
  clearLastWriteFailed(): void { this.lastWriteFailed = false; }

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
      this.lastWriteFailed = false;
      return true;
    } catch (error) {
      // Storage full (QuotaExceeded) or disabled (private mode). Flag so the
      // UI layer can warn the user instead of pretending the save succeeded.
      this.lastWriteFailed = true;
      console.error(`[DB Write Error] Key: ${key}`, error);
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
      imageUrl: crop.imageUrl || '/stock/crops.svg',
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
      imageUrl: animal.imageUrl || '/stock/livestock.svg',
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
    return modules.map(m => {
      // Migration: fix empty videoId based on thumbnail/content
      let videoId = m.videoId;
      if (!videoId || videoId === '') {
        if (m.thumbnail?.includes('cocoa') || m.title.toLowerCase().includes('cocoa') || m.title.toLowerCase().includes('coffee')) {
          videoId = '6S6PJ8W1gbM';
        } else if (m.thumbnail?.includes('maize') || m.title.toLowerCase().includes('maize') || m.title.toLowerCase().includes('corn')) {
          videoId = 'h2P5z2Q3yJ0';
        } else if (m.thumbnail?.includes('rice') || m.title.toLowerCase().includes('rice') || m.title.toLowerCase().includes('sri')) {
          videoId = '1s5o7s3y_wY';
        } else if (m.thumbnail?.includes('oil-palm') || m.title.toLowerCase().includes('oil palm')) {
          videoId = 'p4mEjL6y6Vk';
        } else if (m.thumbnail?.includes('groundnut') || m.title.toLowerCase().includes('groundnut') || m.title.toLowerCase().includes('aflatoxin')) {
          videoId = '3VfJxKq3wJ0';
        } else if (m.thumbnail?.includes('vegetable') || m.title.toLowerCase().includes('french bean') || m.title.toLowerCase().includes('vegetable')) {
          videoId = 'p4mEjL6y6Vk';
        } else if (m.thumbnail?.includes('cattle') || m.title.toLowerCase().includes('grazing') || m.title.toLowerCase().includes('dairy') || m.title.toLowerCase().includes('rangeland')) {
          videoId = '6S6PJ8W1gbM';
        } else if (m.thumbnail?.includes('millet') || m.title.toLowerCase().includes('sahel') || m.title.toLowerCase().includes('climate-smart') || m.title.toLowerCase().includes('dryland')) {
          videoId = 'h2P5z2Q3yJ0';
        } else if (m.thumbnail?.includes('marketplace') || m.title.toLowerCase().includes('finance') || m.title.toLowerCase().includes('economics') || m.title.toLowerCase().includes('market') || m.title.toLowerCase().includes('export')) {
          videoId = 'p4mEjL6y6Vk';
        } else if (m.thumbnail?.includes('crop-default') || m.thumbnail?.includes('drone') || m.title.toLowerCase().includes('precision') || m.title.toLowerCase().includes('tech') || m.title.toLowerCase().includes('drone')) {
          videoId = 'G9K7z9JcQj8';
        } else {
          videoId = 'h2P5z2Q3yJ0'; // default
        }
      }
      return {
        ...m,
        instructor: m.instructor || 'AgriFlow Expert',
        thumbnail: m.thumbnail || '/stock/crop-default.svg',
        lessonsCount: m.lessonsCount || 5,
        description: m.description || 'Professional agricultural training module.',
        videoId,
      };
    });
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

  async getLikedQuestionIds(): Promise<string[]> {
    return this.getItem<string[]>(DB_KEYS.LIKED_QUESTIONS, []);
  }

  async saveLikedQuestionIds(ids: string[]): Promise<void> {
    this.setItem(DB_KEYS.LIKED_QUESTIONS, ids);
  }

  // 17. NOTIFICATIONS
  async getNotifications(userId: string): Promise<AppNotification[]> {
    const allNotifications = this.getItem<AppNotification[]>(DB_KEYS.NOTIFICATIONS, []);
    return allNotifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async saveNotifications(notifications: AppNotification[]): Promise<void> {
    this.setItem(DB_KEYS.NOTIFICATIONS, notifications);
  }

  async addNotification(notification: AppNotification): Promise<void> {
    const allNotifications = this.getItem<AppNotification[]>(DB_KEYS.NOTIFICATIONS, []);
    allNotifications.unshift(notification);
    this.setItem(DB_KEYS.NOTIFICATIONS, allNotifications);
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    const allNotifications = this.getItem<AppNotification[]>(DB_KEYS.NOTIFICATIONS, []);
    const updated = allNotifications.map(n => n.id === notificationId ? { ...n, read: true } : n);
    this.setItem(DB_KEYS.NOTIFICATIONS, updated);
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    const allNotifications = this.getItem<AppNotification[]>(DB_KEYS.NOTIFICATIONS, []);
    const updated = allNotifications.map(n => n.userId === userId ? { ...n, read: true } : n);
    this.setItem(DB_KEYS.NOTIFICATIONS, updated);
  }

  // 18. Q&A QUESTIONS
  async getQuestions(): Promise<Question[]> {
    return this.getItem<Question[]>(DB_KEYS.QUESTIONS, []);
  }

  async saveQuestions(questions: Question[]): Promise<void> {
    this.setItem(DB_KEYS.QUESTIONS, questions);
  }

  // 18. CROP EXPENSES
  async getCropExpenses(): Promise<CropExpense[]> {
    return this.getItem<CropExpense[]>(DB_KEYS.CROP_EXPENSES, []);
  }

  async saveCropExpenses(expenses: CropExpense[]): Promise<void> {
    this.setItem(DB_KEYS.CROP_EXPENSES, expenses);
  }

  // 19. CROP INCOMES
  async getCropIncomes(): Promise<CropIncome[]> {
    return this.getItem<CropIncome[]>(DB_KEYS.CROP_INCOMES, []);
  }

  async saveCropIncomes(incomes: CropIncome[]): Promise<void> {
    this.setItem(DB_KEYS.CROP_INCOMES, incomes);
  }

  // 20. DIRECT MESSAGES
  async getDirectMessages(userId: string): Promise<DirectMessage[]> {
    const allDms = this.getItem<DirectMessage[]>(DB_KEYS.DIRECT_MESSAGES, []);
    return allDms.filter(dm => dm.participants.includes(userId));
  }

  async saveDirectMessages(dms: DirectMessage[]): Promise<void> {
    this.setItem(DB_KEYS.DIRECT_MESSAGES, dms);
  }
}

export const db = new PersistenceService();
