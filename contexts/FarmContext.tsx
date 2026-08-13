
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo, useRef } from 'react';
import { Crop, MarketPrice, Task, Livestock, LearningModule, LogEntry, MarketplaceListing, ForumPost, ForumReply, CommunityChatMessage, UserLocation, WeatherData, Story, SocialTrend, SuggestedUser, UserProfile, SystemAlert, NewsArticle, ToastMessage, PollOption, NavigationTab, LaborInput, ResourceResult, CropExpense, CropIncome, OnboardingData, Question, Answer, AppNotification } from '../types';
import { CropService } from '../services/cropService';
import { LivestockService } from '../services/livestockService';
import { MarketService } from '../services/marketService';
import { LogService } from '../services/logService';
import { CommunityService } from '../services/communityService';
import { WeatherService } from '../services/weatherService';
import { FinancialService } from '../services/financialService';
import { fetchAgNews, CountryContext } from '../services/geminiService';
import { db, DB_KEYS } from '../services/persistence';
import { MOCK_WEATHER, GUEST_USER, COUNTRY_REGISTRY } from '../constants';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

interface FarmContextType {
  userProfile: UserProfile;
  isSignedIn: boolean;
  alerts: SystemAlert[];
  
  // Navigation
  currentView: NavigationTab;
  navigate: (view: NavigationTab) => void;

  // Theme
  theme: 'light' | 'dark' | 'high-contrast';
  toggleTheme: () => void;
  setThemeMode: (mode: 'light' | 'dark' | 'high-contrast') => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  crops: Crop[];
  livestock: Livestock[];
  tasks: Task[];
  marketPrices: MarketPrice[];
  learningModules: LearningModule[];
  newsArticles: NewsArticle[];
  isLoadingNews: boolean;
  listings: MarketplaceListing[];
  posts: ForumPost[];
  chatMessages: CommunityChatMessage[];
  userLocation: UserLocation;
  weather: WeatherData;
  // Social Data
  stories: Story[];
  trends: SocialTrend[];
  suggestedUsers: SuggestedUser[];
  followedUserIds: string[];
  likedPostIds: string[];
  bookmarkedPostIds: string[];
  // Q&A Data
  questions: Question[];
  likedQuestionIds: string[];
  // Notifications
  notifications: AppNotification[];
  unreadNotificationCount: number;
  
  // Poll Data
  pollData: PollOption[];
  pollVoted: number | null;
  handlePollVote: (id: number) => void;

  // Auth Methods
  login: (data: OnboardingData) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  resetApp: () => void;

  addCrop: (crop: Omit<Crop, 'id'>) => Promise<void>;
  deleteCrop: (id: string) => Promise<void>;
  updateCropStatus: (id: string, status: Crop['status']) => Promise<void>;
  updateCrop: (id: string, data: Partial<Omit<Crop, 'id'>>) => Promise<void>;
  addLivestock: (animal: Omit<Livestock, 'id'>) => Promise<void>;
  deleteLivestock: (id: string) => Promise<void>;
  updateLivestockStatus: (id: string, status: Livestock['status']) => Promise<void>;
  updateLivestock: (id: string, data: Partial<Omit<Livestock, 'id'>>) => Promise<void>;
  toggleTask: (id: string) => void;
  addTask: (text: string) => void;
  completeModule: (id: string) => void;
  updateModuleProgress: (id: string, progress: number, completedLesson?: number) => void;
  refreshMarketPrices: () => Promise<void>;
  refreshNews: () => Promise<void>;
  refreshLocation: () => void;
  refreshWeather: () => Promise<void>;
  dismissAllAlerts: () => void;

  // Auth helper: gates an action behind sign-in. If signed in, runs the
  // action; if not, surfaces a toast prompting sign-in. Used by the
  // community hooks so they don't crash trying to call a non-existent
  // function — every like/post/reply used to throw silently.
  handleAuthRequiredAction: (action: () => void | Promise<void>) => void;
  
  // Logs
  addActivityLog: (log: Omit<LogEntry, 'id'>) => Promise<void>;
  getLogsByRef: (refId: string) => Promise<LogEntry[]>;

  // Community
  addListing: (listing: Omit<MarketplaceListing, 'id' | 'verified' | 'status' | 'date'>) => Promise<void>;
  markListingSold: (id: string) => Promise<void>;
  addPost: (post: Omit<ForumPost, 'id' | 'replies' | 'likes' | 'date'>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  updatePost: (id: string, updates: Partial<Omit<ForumPost, 'id' | 'replies' | 'likes' | 'date'>>) => Promise<void>;
  getPostReplies: (postId: string) => Promise<ForumReply[]>;
  getNestedReplies: (postId: string) => Promise<ForumReply[]>;
  addPostReply: (postId: string, content: string, parentReplyId?: string) => Promise<ForumReply[]>;
  likePost: (postId: string) => Promise<void>;
  toggleBookmark: (postId: string) => Promise<void>;
  sendChatMessage: (message: Omit<CommunityChatMessage, 'id' | 'timestamp'>) => Promise<void>;
  toggleFollowUser: (userId: string) => Promise<void>;
  // Q&A Methods
  addQuestion: (question: Omit<Question, 'id' | 'answers' | 'likes' | 'solved' | 'date'>) => Promise<void>;
  addAnswer: (questionId: string, answer: Omit<Answer, 'id' | 'likes' | 'accepted' | 'date'>) => Promise<void>;
  toggleQuestionLike: (questionId: string) => Promise<void>;
  toggleAnswerAccepted: (questionId: string, answerId: string) => Promise<void>;
  // Notification Methods
  getNotifications: () => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  
  dismissAlert: (id: string) => void;

  laborInput: LaborInput | null;
  resourceResult: ResourceResult | null;
  saveLaborInput: (input: LaborInput) => Promise<void>;
  saveResourceResult: (result: ResourceResult) => Promise<void>;

  // Financial
  cropExpenses: CropExpense[];
  cropIncomes: CropIncome[];
  addCropExpense: (expense: Omit<CropExpense, 'id'>) => Promise<void>;
  deleteCropExpense: (id: string) => Promise<void>;
  updateCropExpense: (id: string, data: Partial<Omit<CropExpense, 'id' | 'cropId'>>) => Promise<void>;
  addCropIncome: (income: Omit<CropIncome, 'id'>) => Promise<void>;
  deleteCropIncome: (id: string) => Promise<void>;
  updateCropIncome: (id: string, data: Partial<Omit<CropIncome, 'id' | 'cropId'>>) => Promise<void>;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- State ---
  const [userProfile, setUserProfile] = useState<UserProfile>(GUEST_USER);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('agriflow_is_signed_in') === 'true';
    } catch { return false; }
  });
  const [alerts, setAlerts] = useState<SystemAlert[]>(() => {
    const saved = localStorage.getItem(DB_KEYS.ALERTS);
    if (saved) { try { return JSON.parse(saved); } catch { return []; } }
    return [];
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [laborInput, setLaborInput] = useState<LaborInput | null>(null);
  const [resourceResult, setResourceResult] = useState<ResourceResult | null>(null);
  const [cropExpenses, setCropExpenses] = useState<CropExpense[]>([]);
  const [cropIncomes, setCropIncomes] = useState<CropIncome[]>([]);
  
  const VIEW_HASH: Record<NavigationTab, string> = {
    [NavigationTab.DASHBOARD]: 'dashboard',
    [NavigationTab.CROPS]: 'crops',
    [NavigationTab.LIVESTOCK]: 'livestock',
    [NavigationTab.MARKET]: 'market',
    [NavigationTab.NEWS]: 'news',
    [NavigationTab.AI_ADVISOR]: 'ai',
    [NavigationTab.CALCULATOR]: 'calculators',
    [NavigationTab.EDUCATION]: 'education',
    [NavigationTab.COMMUNITY]: 'community',
    [NavigationTab.LABOR]: 'labor',
    [NavigationTab.CALENDAR]: 'calendar',
    [NavigationTab.SETTINGS]: 'settings',
  };

  const HASH_TO_VIEW: Record<string, NavigationTab> = Object.fromEntries(
    Object.entries(VIEW_HASH).map(([k, v]) => [v, k as NavigationTab])
  );

  const [currentView, setCurrentView] = useState<NavigationTab>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      const view = HASH_TO_VIEW[hash];
      if (view) return view;
    }
    return NavigationTab.DASHBOARD;
  });

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark' | 'high-contrast'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('agriflow_theme') as 'light' | 'dark' | 'high-contrast';
      if (savedTheme && ['light', 'dark', 'high-contrast'].includes(savedTheme)) {
        return savedTheme;
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'high-contrast');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'high-contrast') {
      root.classList.add('dark', 'high-contrast');
    }
    localStorage.setItem('agriflow_theme', theme);
  }, [theme]);

  const [crops, setCrops] = useState<Crop[]>([]);
  const [livestock, setLivestock] = useState<Livestock[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [learningModules, setLearningModules] = useState<LearningModule[]>([]);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [chatMessages, setChatMessages] = useState<CommunityChatMessage[]>([]);
  
  // Social State
  const [stories, setStories] = useState<Story[]>([]);
  const [trends, setTrends] = useState<SocialTrend[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [followedUserIds, setFollowedUserIds] = useState<string[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<string[]>([]);
  // Q&A State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [likedQuestionIds, setLikedQuestionIds] = useState<string[]>([]);
  // Notification State
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  // Poll State (Persisted in session)
  const [pollData, setPollData] = useState<PollOption[]>([
    { id: 1, text: 'Switching to Drought Seeds', percent: 45, votes: 558 },
    { id: 2, text: 'Increasing Irrigation', percent: 30, votes: 372 },
    { id: 3, text: 'Reducing Acreage', percent: 25, votes: 310 },
  ]);
  const [pollVoted, setPollVoted] = useState<number | null>(() => {
    const saved = localStorage.getItem(DB_KEYS.POLL_VOTED);
    if (saved) { try { return JSON.parse(saved); } catch { return null; } }
    return null;
  });

  // Location & Weather State
  const [userLocation, setUserLocation] = useState<UserLocation>({
    latitude: null,
    longitude: null,
    error: null,
    timestamp: null
  });
  const [weather, setWeather] = useState<WeatherData>(MOCK_WEATHER);

  // --- Initialization ---
  useEffect(() => {
    const loadData = async () => {
      try {
const [
          loadedCrops, 
          loadedLivestock, 
          loadedTasks, 
          loadedModules, 
          loadedPrices, 
          loadedListings, 
          loadedPosts, 
          loadedChats, 
          loadedStories, 
          loadedTrends, 
          loadedSuggested, 
          loadedFollows, 
          loadedLikes,
          loadedBookmarks,
          loadedQuestions,
          loadedLikedQuestions,
          loadedNotifications,
          loadedProfile,
           loadedLaborInput,
           loadedResourceResult,
           loadedExpenses,
           loadedIncomes
        ] = await Promise.all([
          CropService.getAll(),
          LivestockService.getAll(),
          db.getTasks(),
          db.getModules(),
          MarketService.getAll(),
          CommunityService.getListings(),
          CommunityService.getPosts(),
          CommunityService.getChatMessages(),
          CommunityService.getStories(),
          CommunityService.getTrends(),
          CommunityService.getSuggestedUsers(),
          CommunityService.getFollowedUserIds(),
          CommunityService.getLikedPostIds(),
          CommunityService.getBookmarkedPostIds(),
          CommunityService.getQuestions(),
          CommunityService.getLikedQuestionIds(),
          CommunityService.getNotifications(userProfile.name),
          db.getUserProfile(),
          db.getLaborInput(),
           db.getResourceResult(),
           FinancialService.getAllExpenses(),
           FinancialService.getAllIncomes()
        ]);

        setCrops(loadedCrops);
        setLivestock(loadedLivestock);
        setTasks(loadedTasks);
        setLearningModules(loadedModules);
        setMarketPrices(loadedPrices);
        setListings(loadedListings);
        setPosts(loadedPosts);
        setChatMessages(loadedChats);
        setStories(loadedStories);
        setTrends(loadedTrends);
        setSuggestedUsers(loadedSuggested);
        setFollowedUserIds(loadedFollows);
        setLikedPostIds(loadedLikes);
        setBookmarkedPostIds(loadedBookmarks);
        setQuestions(loadedQuestions);
        setLikedQuestionIds(loadedLikedQuestions);
        setNotifications(loadedNotifications);
        setUnreadNotificationCount(loadedNotifications.filter(n => !n.read).length);
        if (loadedLaborInput) setLaborInput(loadedLaborInput);
        if (loadedResourceResult) setResourceResult(loadedResourceResult);
        setCropExpenses(loadedExpenses);
        setCropIncomes(loadedIncomes);
        
        if (loadedProfile && loadedProfile.name !== GUEST_USER.name) {
           setUserProfile(loadedProfile);
           setIsSignedIn(true);
        }
      } catch (error) {
        console.error("Failed to load farm data:", error);
      }
    };
    loadData();
    refreshLocation();

    // Cross-tab sync: when localStorage changes in another tab, reload the
    // affected slice of state. We do NOT call window.location.reload() — that
    // would wipe in-progress form state across all tabs.
    const onStorage = async (e: StorageEvent) => {
      if (!e.key || !e.key.startsWith('agriflow_') || e.newValue === e.oldValue) return;
      try {
        // Selectively refresh only the affected slice of state.
        if (e.key === DB_KEYS.CROPS) setCrops(await CropService.getAll());
        else if (e.key === DB_KEYS.LIVESTOCK) setLivestock(await LivestockService.getAll());
        else if (e.key === DB_KEYS.TASKS) {
          const t = await db.getTasks(); setTasks(t);
        } else if (e.key === DB_KEYS.LEARNING) {
          const m = await db.getModules(); setLearningModules(m);
        } else if (e.key === DB_KEYS.POSTS) setPosts(await CommunityService.getPosts());
        else if (e.key === DB_KEYS.LISTINGS) setListings(await CommunityService.getListings());
        else if (e.key === DB_KEYS.CHAT) setChatMessages(await CommunityService.getChatMessages());
        else if (e.key === DB_KEYS.ALERTS) {
          const parsed = e.newValue ? JSON.parse(e.newValue) : []; setAlerts(parsed);
        } else if (e.key === DB_KEYS.USER_PROFILE) {
          const p = await db.getUserProfile(); if (p && p.name !== GUEST_USER.name) setUserProfile(p);
        }
      } catch (syncErr) {
        console.warn('[FarmContext] Cross-tab sync error for', e.key, syncErr);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const VALID_TABS = new Set(Object.values(NavigationTab));

  const navigate = useCallback((view: NavigationTab) => {
    if (!VALID_TABS.has(view)) {
      console.warn(`[AgriFlow] Invalid navigation target: "${view}", defaulting to DASHBOARD`);
      view = NavigationTab.DASHBOARD;
    }
    setCurrentView(view);
    const hash = VIEW_HASH[view] || 'dashboard';
    if (window.location.hash.replace('#', '') !== hash) {
      window.history.pushState(null, '', `#${hash}`);
    }
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const hash = window.location.hash.replace('#', '');
      const view = HASH_TO_VIEW[hash];
      if (view) setCurrentView(view);
      else setCurrentView(NavigationTab.DASHBOARD);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const hash = VIEW_HASH[currentView] || 'dashboard';
    if (window.location.hash.replace('#', '') !== hash) {
      window.history.replaceState(null, '', `#${hash}`);
    }
  }, [currentView]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'high-contrast';
      return 'light';
    });
  }, []);

  const setThemeMode = useCallback((mode: 'light' | 'dark' | 'high-contrast') => {
    setTheme(mode);
  }, []);

  // Toast Logic
  const toastTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    const timer = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      toastTimersRef.current.delete(id);
    }, 4000);
    toastTimersRef.current.set(id, timer);
  }, []);

  const removeToast = useCallback((id: string) => {
    const timer = toastTimersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      toastTimersRef.current.delete(id);
    }
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    return () => {
      toastTimersRef.current.forEach(timer => clearTimeout(timer));
      toastTimersRef.current.clear();
    };
  }, []);

  // Poll Logic
  const handlePollVote = useCallback((optionId: number) => {
    setPollVoted(prev => {
      if (prev !== null) return prev;
      setPollData(data => {
        const updated = data.map(opt => {
          if (opt.id === optionId) {
            return { ...opt, votes: opt.votes + 1 };
          }
          return opt;
        });
        const totalVotes = updated.reduce((acc, curr) => acc + curr.votes, 0);
        return updated.map(opt => ({
          ...opt,
          percent: Math.round((opt.votes / totalVotes) * 100)
        }));
      });
      showToast('Vote submitted', 'success');
      db.savePollVoted(optionId);
      return optionId;
    });
  }, [showToast]);

  // --- Auth Logic ---
  const login = useCallback(async (data: OnboardingData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const countryCfg = COUNTRY_REGISTRY[data.countryCode];
      if (!countryCfg) {
        showToast('Country not supported. Please select a valid country.', 'error');
        return;
      }

      const newProfile: UserProfile = {
        ...GUEST_USER,
        name: data.name,
        farmName: data.farmName,
        countryCode: countryCfg.code,
        currencyCode: countryCfg.currencyCode,
        currencySymbol: countryCfg.currencySymbol,
        language: countryCfg.language,
        region: countryCfg.region,
        farmType: data.farmType,
        areaUnit: data.areaUnit,
        climateZone: countryCfg.climateZone,
        phoneNumber: data.phoneNumber,
        location: data.location,
      };

      // SECURITY/CONSISTENCY: Persist ALL new state to localStorage BEFORE
      // setting React state / flags. This way, if a save throws (quota etc.),
      // we don't leave the app in a half-signed-in state with empty localStorage
      // that would render a blank dashboard after refresh.
      try {
        await db.saveUserProfile(newProfile);
        await CropService.replaceAll(countryCfg.defaultCrops);
        await LivestockService.replaceAll(countryCfg.defaultLivestock);
        await MarketService.replaceAll(countryCfg.marketPrices);
        await CommunityService.replaceAllListings(countryCfg.marketplaceListings);
        await CommunityService.replaceAllPosts(countryCfg.forumPosts);
        await CommunityService.replaceAllChatMessages(countryCfg.chatMessages);
        db.saveTasks(countryCfg.tasks);
        db.saveModules(countryCfg.learningModules);
        await db.saveAlerts(countryCfg.alerts);
        await db.saveTrends(countryCfg.trends);
        await db.saveSuggestedUsers(countryCfg.suggestedUsers);
        await db.saveStories(countryCfg.stories);
      } catch (dbErr) {
        console.warn('[FarmContext] Critical DB save failed during login:', dbErr);
        showToast('Could not save your farm data. Sign-in aborted.', 'error');
        return;
      }

      // Only after persistence succeeds, update in-memory state and flags.
      setUserProfile(newProfile);
      setIsSignedIn(true);
      localStorage.setItem('agriflow_is_signed_in', 'true');

      setCrops(countryCfg.defaultCrops);
      setLivestock(countryCfg.defaultLivestock);
      setMarketPrices(countryCfg.marketPrices);
      setAlerts(countryCfg.alerts);
      setLearningModules(countryCfg.learningModules);
      setTasks(countryCfg.tasks);
      setListings(countryCfg.marketplaceListings);
      setPosts(countryCfg.forumPosts);
      setChatMessages(countryCfg.chatMessages);
      setTrends(countryCfg.trends);
      setSuggestedUsers(countryCfg.suggestedUsers);
      setStories(countryCfg.stories);

      if (countryCfg.weatherDefaults) {
        setWeather(prev => ({ ...prev, ...countryCfg.weatherDefaults! }));
      }

      showToast(`Welcome, ${newProfile.name}! Your ${countryCfg.name} dashboard is ready.`, 'success');
    } catch (err) {
      console.error('[FarmContext] Login error:', err);
      showToast('Login failed. Please try again.', 'error');
      throw err;
    }
  }, [showToast]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Normalize the same way the sign-up form does: trim + lowercase email.
      const normalizedEmail = email.trim().toLowerCase();
      const storedCreds = localStorage.getItem('agriflow_credentials');
      if (!storedCreds) {
        console.warn('[AgriFlow] signIn: no stored credentials in localStorage');
        throw new Error('Invalid email or password.');
      }
      const creds = JSON.parse(storedCreds);
      const storedEmail = (creds.email ?? '').toLowerCase();
      const emailMatch = storedEmail === normalizedEmail;
      const hash = await hashPassword(password);
      const passMatch = creds.passwordHash === hash;
      if (!emailMatch || !passMatch) {
        console.warn('[AgriFlow] signIn mismatch:', {
          emailMatch,
          passMatch,
          storedEmailPrefix: storedEmail.slice(0, 3) + '…',
          inputEmailPrefix: normalizedEmail.slice(0, 3) + '…',
        });
        throw new Error('Invalid email or password.');
      }
      const savedProfile = await db.getUserProfile();
      if (savedProfile && savedProfile.name !== GUEST_USER.name) {
        setUserProfile(savedProfile);
      }
      setIsSignedIn(true);
      localStorage.setItem('agriflow_is_signed_in', 'true');
      showToast(`Welcome back, ${savedProfile?.name || 'Farmer'}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Sign in failed. Please try again.', 'error');
      throw err;
    }
  }, [showToast]);

  const logout = useCallback(() => {
    Object.values(DB_KEYS).forEach(key => localStorage.removeItem(key));
    localStorage.removeItem('agriflow_theme');
    localStorage.removeItem('agriflow_is_signed_in');
    localStorage.removeItem('agriflow_credentials');
    setUserProfile(GUEST_USER);
    setIsSignedIn(false);
    setCrops([]);
    setLivestock([]);
    setTasks([]);
    setLearningModules([]);
    setMarketPrices([]);
    setListings([]);
    setPosts([]);
    setChatMessages([]);
    setStories([]);
    setTrends([]);
    setSuggestedUsers([]);
    setFollowedUserIds([]);
    setLikedPostIds([]);
    setBookmarkedPostIds([]);
    setAlerts([]);
    setNewsArticles([]);
    setPollData([
      { id: 1, text: 'Switching to Drought Seeds', percent: 45, votes: 558 },
      { id: 2, text: 'Increasing Irrigation', percent: 30, votes: 372 },
      { id: 3, text: 'Reducing Acreage', percent: 25, votes: 310 },
    ]);
    setPollVoted(null);
    setLaborInput(null);
    setResourceResult(null);
    setCropExpenses([]);
    setCropIncomes([]);
    showToast('Signed out successfully', 'info');
  }, [showToast]);

  const updateUserProfile = useCallback(async (updates: Partial<UserProfile>) => {
    let newProfile: UserProfile | null = null;
    setUserProfile(prev => {
      newProfile = { ...prev, ...updates };
      return newProfile;
    });
    if (newProfile) await db.saveUserProfile(newProfile);
    showToast('Profile updated', 'success');
  }, [showToast]);

  const saveLaborInputAction = useCallback(async (input: LaborInput) => {
    setLaborInput(input);
    try { await db.saveLaborInput(input); } catch { showToast('Could not save labor data', 'warning'); }
  }, [showToast]);

  const saveResourceResultAction = useCallback(async (result: ResourceResult) => {
    setResourceResult(result);
    try { await db.saveResourceResult(result); } catch { showToast('Could not save resource data', 'warning'); }
  }, [showToast]);

  // --- Financial Actions ---
  const addCropExpense = useCallback(async (data: Omit<CropExpense, 'id'>) => {
    try {
      const updated = await FinancialService.addExpense(data);
      setCropExpenses(updated);
      showToast('Expense recorded', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to record expense', 'error');
    }
  }, [showToast]);

  const deleteCropExpense = useCallback(async (id: string) => {
    try {
      const updated = await FinancialService.deleteExpense(id);
      setCropExpenses(updated);
      showToast('Expense removed', 'info');
    } catch (e) {
      console.error(e);
    }
  }, [showToast]);

  const updateCropExpense = useCallback(async (id: string, data: Partial<Omit<CropExpense, 'id' | 'cropId'>>) => {
    try {
      const updated = await FinancialService.updateExpense(id, data);
      setCropExpenses(updated);
      showToast('Expense updated', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to update expense', 'error');
    }
  }, [showToast]);

  const addCropIncome = useCallback(async (data: Omit<CropIncome, 'id'>) => {
    try {
      const updated = await FinancialService.addIncome(data);
      setCropIncomes(updated);
      showToast('Income recorded', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to record income', 'error');
    }
  }, [showToast]);

  const deleteCropIncome = useCallback(async (id: string) => {
    try {
      const updated = await FinancialService.deleteIncome(id);
      setCropIncomes(updated);
      showToast('Income removed', 'info');
    } catch (e) {
      console.error(e);
    }
  }, [showToast]);

  const updateCropIncome = useCallback(async (id: string, data: Partial<Omit<CropIncome, 'id' | 'cropId'>>) => {
    try {
      const updated = await FinancialService.updateIncome(id, data);
      setCropIncomes(updated);
      showToast('Income updated', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to update income', 'error');
    }
  }, [showToast]);

  const resetApp = useCallback(() => {
    Object.values(DB_KEYS).forEach(key => localStorage.removeItem(key));
    localStorage.removeItem('agriflow_theme');
    localStorage.removeItem('agriflow_is_signed_in');
    localStorage.removeItem('agriflow_credentials');
    window.location.reload();
  }, []);

  // --- Location Logic ---
  const refreshLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setUserLocation(prev => ({ ...prev, error: "Geolocation not supported by browser" }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          timestamp: position.timestamp
        });
      },
      (error) => {
        let errorMessage = "Unknown location error";
        switch(error.code) {
          case error.PERMISSION_DENIED: errorMessage = "Location permission denied"; break;
          case error.POSITION_UNAVAILABLE: errorMessage = "Location unavailable"; break;
          case error.TIMEOUT: errorMessage = "Location request timed out"; break;
        }
        setUserLocation(prev => ({ ...prev, error: errorMessage }));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }, []);

  // --- Weather Logic ---
  // Fetch fresh weather for the current location (or country fallback) and
  // update state. Exposed as `refreshWeather` so the UI can offer a manual
  // "refresh" button instead of relying on geolocation events alone —
  // which previously left the dashboard stuck on MOCK_WEATHER forever.
  const refreshWeather = useCallback(async () => {
    if (userLocation.latitude && userLocation.longitude) {
      try {
        const localWeather = await WeatherService.getLocalWeather(
          userLocation.latitude,
          userLocation.longitude,
          userProfile.countryCode || undefined
        );
        setWeather(localWeather);
        return;
      } catch (e) {
        console.error("Failed to refresh local weather, falling back to region weather", e);
      }
    }
    // No location (or fetch failed): fall back to region-based simulated
    // weather so the widget always shows something fresh rather than the
    // static MOCK_WEATHER constant.
    try {
      const fallback = await WeatherService.getLocalWeather(0, 0, userProfile.countryCode || undefined);
      setWeather(fallback);
    } catch (e) {
      console.error("Region weather fallback also failed", e);
    }
  }, [userLocation.latitude, userLocation.longitude, userProfile.countryCode]);

  // --- Weather Update Effect ---
  // Fires when location or country changes. refreshWeather now contains the
  // full logic (including the region fallback), so this effect just defers
  // to it. Keeps the old [userLocation, userProfile.countryCode] dep array
  // semantics so existing callers see weather update when they grant
  // geolocation permission.
  useEffect(() => {
    refreshWeather();
  }, [refreshWeather]);

  // --- Auth-gated action helper ---
  // Used by every community hook (useFeed, useChat, useMarket, useQA,
  // useSidebar) to wrap actions that require sign-in. Previously those
  // hooks destructured a non-existent `handleAuthRequiredAction` from
  // useFarm() and got `undefined`, so every like/reply/follow threw
  // "TypeError: handleAuthRequiredAction is not a function" silently.
  const handleAuthRequiredAction = useCallback((action: () => void | Promise<void>) => {
    if (isSignedIn) {
      try {
        const result = action();
        if (result && typeof (result as Promise<void>).then === 'function') {
          (result as Promise<void>).catch(err => console.error('[AgriFlow] Auth-required action failed:', err));
        }
      } catch (err) {
        console.error('[AgriFlow] Auth-required action failed:', err);
      }
    } else {
      showToast('Please sign in to perform this action.', 'info');
    }
  }, [isSignedIn, showToast]);

  // --- Crop Actions ---
  const addCrop = useCallback(async (cropData: Omit<Crop, 'id'>) => {
    try {
      const updated = await CropService.add(cropData);
      setCrops(updated);
      showToast('Crop plot registered', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to add crop', 'error');
    }
  }, [showToast]);

  const deleteCrop = useCallback(async (id: string) => {
    try {
      const [updatedCrops, updatedExpenses, updatedIncomes] = await Promise.all([
        CropService.delete(id),
        FinancialService.deleteExpensesByCrop(id),
        FinancialService.deleteIncomesByCrop(id)
      ]);
      setCrops(updatedCrops);
      setCropExpenses(updatedExpenses);
      setCropIncomes(updatedIncomes);
      showToast('Crop plot removed', 'info');
    } catch (e) {
      console.error(e);
    }
  }, [showToast]);

  const updateCropStatus = useCallback(async (id: string, status: Crop['status']) => {
    try {
      const updated = await CropService.updateStatus(id, status);
      setCrops(updated);
      showToast(`Status updated to ${status}`, 'success');
    } catch (e) {
      console.error("Failed to update status", e);
    }
  }, [showToast]);

  const updateCrop = useCallback(async (id: string, data: Partial<Omit<Crop, 'id'>>) => {
    try {
      const updated = await CropService.update(id, data);
      setCrops(updated);
      showToast('Plot updated', 'success');
    } catch (e) {
      console.error("Failed to update crop", e);
      showToast('Failed to update plot', 'error');
    }
  }, [showToast]);

  // --- Livestock Actions ---
  const addLivestock = useCallback(async (animalData: Omit<Livestock, 'id'>) => {
    try {
      const updated = await LivestockService.add(animalData);
      setLivestock(updated);
      showToast('Herd unit registered', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to add livestock', 'error');
    }
  }, [showToast]);

  const deleteLivestock = useCallback(async (id: string) => {
    try {
      const updated = await LivestockService.delete(id);
      setLivestock(updated);
      showToast('Herd unit removed', 'info');
    } catch (e) {
      console.error(e);
    }
  }, [showToast]);

  const updateLivestockStatus = useCallback(async (id: string, status: Livestock['status']) => {
    try {
      const updated = await LivestockService.updateHealth(id, status);
      setLivestock(updated);
      showToast(`Herd status updated to ${status}`, 'success');
    } catch (e) {
      console.error("Failed to update livestock status", e);
    }
  }, [showToast]);

  const updateLivestock = useCallback(async (id: string, data: Partial<Omit<Livestock, 'id'>>) => {
    try {
      const updated = await LivestockService.update(id, data);
      setLivestock(updated);
      showToast('Herd updated', 'success');
    } catch (e) {
      console.error("Failed to update livestock", e);
      showToast('Failed to update herd', 'error');
    }
  }, [showToast]);

  // --- Task Actions ---
  const taskSaveRef = useRef(false);
  const moduleSaveRef = useRef(false);

  const flushTasks = useRef<NodeJS.Timeout | null>(null);
  const flushModules = useRef<NodeJS.Timeout | null>(null);

  const toggleTask = useCallback((id: string) => {
    let snap: Task[] | null = null;
    setTasks(prevTasks => {
      snap = prevTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      return snap;
    });
    if (snap && !taskSaveRef.current) {
      taskSaveRef.current = true;
      if (flushTasks.current) clearTimeout(flushTasks.current);
      flushTasks.current = setTimeout(() => {
        setTasks(current => { db.saveTasks(current); return current; });
        taskSaveRef.current = false;
      }, 100);
    }
  }, []);

  const addTask = useCallback((text: string) => {
    const newId = db.generateId('task');
    setTasks(prevTasks => {
      const newTask: Task = { id: newId, text, completed: false, priority: 'normal' };
      const updated = [newTask, ...prevTasks];
      db.saveTasks(updated);
      return updated;
    });
    showToast('New task added', 'success');
  }, [showToast]);

  // --- Education Actions ---
  const completeModule = useCallback((id: string) => {
    setLearningModules(prevModules => {
      const updated = prevModules.map(m => m.id === id ? { ...m, completed: true, progress: 100 } : m);
      if (!moduleSaveRef.current) {
        moduleSaveRef.current = true;
        if (flushModules.current) clearTimeout(flushModules.current);
        flushModules.current = setTimeout(() => {
          setLearningModules(current => { db.saveModules(current); return current; });
          moduleSaveRef.current = false;
        }, 100);
      }
      return updated;
    });
    showToast('Course completed! Certificate saved.', 'success');
  }, [showToast]);

  const updateModuleProgress = useCallback((id: string, progress: number, completedLesson?: number) => {
    setLearningModules(prevModules => {
      const updated = prevModules.map(m => {
        if (m.id === id) {
          const newCompletedLessons = completedLesson !== undefined && !m.completedLessons.includes(completedLesson)
            ? [...m.completedLessons, completedLesson]
            : m.completedLessons;
          const newProgress = Math.max(progress, Math.round((newCompletedLessons.length / m.lessonsCount) * 100));
          return { 
            ...m, 
            progress: Math.min(newProgress, 100),
            completedLessons: newCompletedLessons,
            completed: newProgress >= 100
          };
        }
        return m;
      });
      if (!moduleSaveRef.current) {
        moduleSaveRef.current = true;
        if (flushModules.current) clearTimeout(flushModules.current);
        flushModules.current = setTimeout(() => {
          setLearningModules(current => { db.saveModules(current); return current; });
          moduleSaveRef.current = false;
        }, 100);
      }
      return updated;
    });
  }, []);

  // --- Market Actions ---
  const refreshMarketPrices = useCallback(async () => {
    try {
      const updated = await MarketService.refreshPrices();
      setMarketPrices(updated);
      showToast('Market prices updated', 'success');
    } catch (e) {
      console.error("Market update failed", e);
      showToast('Failed to fetch prices', 'error');
    }
  }, [showToast]);

  // --- News Actions ---
  const refreshNews = useCallback(async () => {
    setIsLoadingNews(true);
    try {
      const countryCtx: CountryContext | undefined = userProfile.countryCode ? {
        countryCode: userProfile.countryCode,
        region: userProfile.region || '',
        climateZone: userProfile.climateZone || 'temperate',
        currencyCode: userProfile.currencyCode || 'USD',
        currencySymbol: userProfile.currencySymbol || '$',
        language: userProfile.language || 'en',
        farmType: userProfile.farmType || 'mixed',
        areaUnit: userProfile.areaUnit || 'ha',
      } : undefined;
      const articles = await fetchAgNews(countryCtx);
      setNewsArticles(articles);
    } catch (e) {
      console.error("News fetch failed", e);
      showToast('Failed to fetch news', 'error');
    } finally {
      setIsLoadingNews(false);
    }
  }, [showToast, userProfile.countryCode, userProfile.region, userProfile.climateZone, userProfile.currencyCode, userProfile.currencySymbol, userProfile.language, userProfile.farmType, userProfile.areaUnit]);

  // --- Log Actions ---
  const addActivityLog = useCallback(async (log: Omit<LogEntry, 'id'>) => {
    try {
      await LogService.add(log);
      showToast('Activity log saved', 'success');
    } catch (e) {
      console.error("Failed to add log", e);
      throw e; 
    }
  }, [showToast]);

  const getLogsByRef = useCallback(async (refId: string) => {
    return await LogService.getByReference(refId);
  }, []);

  // --- Community Actions ---
  const addListing = useCallback(async (listing: Omit<MarketplaceListing, 'id' | 'verified' | 'status' | 'date'>) => {
    try {
      const updated = await CommunityService.addListing(listing);
      setListings(updated);
      showToast('Listing published to Marketplace', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to create listing', 'error');
    }
  }, [showToast]);

  const markListingSold = useCallback(async (id: string) => {
    try {
      const updated = await CommunityService.markListingAsSold(id);
      setListings(updated);
      showToast('Listing marked as sold', 'success');
    } catch (e) {
      console.error(e);
    }
  }, [showToast]);

  const addPost = useCallback(async (post: Omit<ForumPost, 'id' | 'replies' | 'likes' | 'date'>) => {
    try {
      const updated = await CommunityService.addPost(post);
      setPosts(updated);
      showToast('Post shared with community', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to post', 'error');
    }
  }, [showToast]);

  const deletePost = useCallback(async (id: string) => {
    try {
      const updated = await CommunityService.deletePost(id);
      setPosts(updated);
      showToast('Post deleted', 'info');
    } catch (e) {
      console.error(e);
      showToast('Failed to delete post', 'error');
    }
  }, [showToast]);

  const updatePost = useCallback(async (id: string, updates: Partial<Omit<ForumPost, 'id' | 'replies' | 'likes' | 'date'>>) => {
    try {
      const updated = await CommunityService.updatePost(id, updates);
      setPosts(updated);
      showToast('Post updated', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to update post', 'error');
    }
  }, [showToast]);

  const getPostReplies = useCallback(async (postId: string) => {
    return await CommunityService.getPostReplies(postId);
  }, []);

  const getNestedReplies = useCallback(async (postId: string) => {
    return await CommunityService.getNestedReplies(postId);
  }, []);

  const addPostReply = useCallback(async (postId: string, content: string, parentReplyId?: string) => {
    const replies = await CommunityService.addReply(postId, content, userProfile.name, parentReplyId);
    const updatedPosts = await CommunityService.getPosts(); // sync counts
    setPosts(updatedPosts);
    showToast('Reply added', 'success');
    return replies;
  }, [userProfile, showToast]);

  const likePost = useCallback(async (postId: string) => {
    try {
      const { posts: updatedPosts, likedIds: updatedLikedIds } = await CommunityService.toggleLike(postId);
      setPosts(updatedPosts);
      setLikedPostIds(updatedLikedIds);
    } catch (e) {
      console.error("Failed to like post", e);
    }
  }, []);

  const toggleBookmark = useCallback(async (postId: string) => {
    try {
      const updated = await CommunityService.toggleBookmark(postId);
      setBookmarkedPostIds(updated);
    } catch (e) {
      console.error("Failed to toggle bookmark", e);
    }
  }, []);

  const sendChatMessage = useCallback(async (message: Omit<CommunityChatMessage, 'id' | 'timestamp'>) => {
    try {
      const updated = await CommunityService.sendMessage(message);
      setChatMessages(updated);
    } catch (e) {
      console.error("Failed to send message", e);
    }
  }, []);

  // --- Social Actions ---
  const toggleFollowUser = useCallback(async (userId: string) => {
    try {
      const updated = await CommunityService.toggleFollowUser(userId);
      setFollowedUserIds(updated);
      const isFollowing = updated.includes(userId);
      showToast(isFollowing ? 'Following user' : 'Unfollowed user', 'info');
    } catch (e) {
      console.error("Failed to toggle follow", e);
    }
  }, [showToast]);

  // --- Q&A Actions ---
  const addQuestion = useCallback(async (question: Omit<Question, 'id' | 'answers' | 'likes' | 'solved' | 'date'>) => {
    try {
      const updated = await CommunityService.addQuestion(question);
      setQuestions(updated);
      showToast('Question posted to Q&A', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to post question', 'error');
    }
  }, [showToast]);

  const addAnswer = useCallback(async (questionId: string, answer: Omit<Answer, 'id' | 'likes' | 'accepted' | 'date'>) => {
    try {
      const updated = await CommunityService.addAnswer(questionId, answer);
      setQuestions(updated);
      showToast('Answer added', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to add answer', 'error');
    }
  }, [showToast]);

  const toggleQuestionLike = useCallback(async (questionId: string) => {
    try {
      const { questions: updatedQuestions, likedIds: updatedLikedIds } = await CommunityService.toggleQuestionLike(questionId);
      setQuestions(updatedQuestions);
      setLikedQuestionIds(updatedLikedIds);
    } catch (e) {
      console.error("Failed to like question", e);
    }
  }, []);

  const toggleAnswerAccepted = useCallback(async (questionId: string, answerId: string) => {
    try {
      const updated = await CommunityService.toggleAnswerAccepted(questionId, answerId);
      setQuestions(updated);
      showToast('Answer marked as accepted', 'success');
    } catch (e) {
      console.error("Failed to accept answer", e);
      showToast('Failed to accept answer', 'error');
    }
  }, [showToast]);

  const getNotifications = useCallback(async () => {
    if (!isSignedIn) return;
    try {
      const loadedNotifications = await CommunityService.getNotifications(userProfile.name);
      setNotifications(loadedNotifications);
      setUnreadNotificationCount(loadedNotifications.filter(n => !n.read).length);
    } catch (e) {
      console.error("Failed to load notifications", e);
    }
  }, [isSignedIn, userProfile]);

  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    try {
      await CommunityService.markNotificationAsRead(notificationId);
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
      setUnreadNotificationCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error("Failed to mark notification as read", e);
    }
  }, []);

  const markAllNotificationsAsRead = useCallback(async () => {
    if (!isSignedIn) return;
    try {
      await CommunityService.markAllNotificationsAsRead(userProfile.name);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadNotificationCount(0);
    } catch (e) {
      console.error("Failed to mark all notifications as read", e);
    }
  }, [isSignedIn, userProfile]);

  const dismissAlert = useCallback((id: string) => {
    setAlerts(prev => {
      const updated = prev.filter(a => a.id !== id);
      db.saveAlerts(updated);
      return updated;
    });
  }, []);

  const dismissAllAlerts = useCallback(() => {
    setAlerts([]);
    db.saveAlerts([]);
  }, []);

  const contextValue = useMemo(() => ({
    userProfile, isSignedIn, alerts,
    theme, toggleTheme, setThemeMode, currentView, navigate,
    toasts, showToast, removeToast,
    crops, livestock, tasks, marketPrices, learningModules, newsArticles, isLoadingNews, listings, posts, chatMessages, userLocation, weather,
    stories, trends, suggestedUsers, followedUserIds, likedPostIds, bookmarkedPostIds,
    questions, likedQuestionIds,
    notifications, unreadNotificationCount,
    pollData, pollVoted, handlePollVote,
    login, signIn, logout, updateUserProfile, resetApp,
    addCrop, deleteCrop, updateCropStatus, updateCrop, addLivestock, deleteLivestock, updateLivestockStatus, updateLivestock, toggleTask, addTask, completeModule, updateModuleProgress, 
    refreshMarketPrices, refreshNews, refreshLocation, refreshWeather,
    addActivityLog, getLogsByRef, 
    addListing, markListingSold, 
    addPost, deletePost, updatePost, getPostReplies, getNestedReplies, addPostReply, likePost, toggleBookmark,
    sendChatMessage, toggleFollowUser, dismissAlert, dismissAllAlerts,
    handleAuthRequiredAction,
    // Q&A
    addQuestion, addAnswer, toggleQuestionLike, toggleAnswerAccepted,
    // Notifications
    getNotifications, markNotificationAsRead, markAllNotificationsAsRead,
    laborInput, resourceResult, saveLaborInput: saveLaborInputAction, saveResourceResult: saveResourceResultAction,
    cropExpenses, cropIncomes, addCropExpense, deleteCropExpense, updateCropExpense, addCropIncome, deleteCropIncome, updateCropIncome
  }), [
    userProfile, isSignedIn, alerts,
    theme, toggleTheme, setThemeMode, currentView, navigate,
    toasts, showToast, removeToast,
    crops, livestock, tasks, marketPrices, learningModules, newsArticles, isLoadingNews, listings, posts, chatMessages, userLocation, weather,
    stories, trends, suggestedUsers, followedUserIds, likedPostIds, bookmarkedPostIds,
    questions, likedQuestionIds,
    pollData, pollVoted, handlePollVote,
    login, signIn, logout, updateUserProfile, resetApp,
    addCrop, deleteCrop, updateCropStatus, updateCrop, addLivestock, deleteLivestock, updateLivestockStatus, updateLivestock, toggleTask, addTask, completeModule, updateModuleProgress,
    refreshMarketPrices, refreshNews, refreshLocation, refreshWeather,
    addActivityLog, getLogsByRef, 
    addListing, markListingSold, 
    addPost, deletePost, updatePost, getPostReplies, getNestedReplies, addPostReply, likePost, toggleBookmark,
    sendChatMessage, toggleFollowUser, dismissAlert, dismissAllAlerts,
    handleAuthRequiredAction,
    addQuestion, addAnswer, toggleQuestionLike, toggleAnswerAccepted,
    // Notifications
    getNotifications, markNotificationAsRead, markAllNotificationsAsRead,
    laborInput, resourceResult, saveLaborInputAction, saveResourceResultAction,
    cropExpenses, cropIncomes, addCropExpense, deleteCropExpense, updateCropExpense, addCropIncome, deleteCropIncome, updateCropIncome
  ]);

  return (
    <FarmContext.Provider value={contextValue}>
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (context === undefined) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};
