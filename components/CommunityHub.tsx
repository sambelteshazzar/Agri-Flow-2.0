import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Users, ShoppingBag, MessageSquare, Search, CheckCircle, MapPin, Plus, X, Send, Hash, 
  ThumbsUp, Share2, MoreHorizontal, Image as ImageIcon, Heart, MessageCircle, TrendingUp,
  UserPlus, Globe, BadgeCheck, Camera, Bell, ChevronRight, Settings,
  Calendar, BarChart2, Zap, XCircle, Leaf, PackageSearch, ArrowRight, LayoutGrid, Users2,
  HelpCircle, Award, Target, Handshake, Cloud, DollarSign, Flame, BookOpen, Sparkles,
  ChevronDown, Eye, Star, Shield, Wheat, TreePine, Droplets, Sun, Snowflake, Bug,
  Sprout, Tractor, CircleDot
} from 'lucide-react';
import { useFarm } from '../contexts/FarmContext';
import { MarketplaceListing, ForumPost, ForumReply, Story, NavigationTab } from '../types';

interface Question {
  id: string;
  author: string;
  authorAvatar?: string;
  title: string;
  body: string;
  category: string;
  answers: Answer[];
  likes: number;
  solved: boolean;
  date: string;
}

interface Answer {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  isExpert: boolean;
  accepted: boolean;
  likes: number;
  date: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  crop: string;
  xp: number;
  participants: number;
  daysLeft: number;
  progress: number;
  icon: React.ElementType;
}

type CommunityTab = 'FEED' | 'GROUPS' | 'MARKET' | 'QA';

const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q1',
    author: 'Amara Okafor',
    title: 'How do you prevent fall armyworm in maize during early vegetative stage?',
    body: 'My maize is 3 weeks old and I noticed early signs of fall armyworm. What preventive measures work best at this stage before it spreads?',
    category: 'Pests',
    answers: [
      { id: 'a1', author: 'Dr. Kofi Mensah', content: 'Push-pull technology works very well — plant Desmodium between maize rows and Napier grass as a border. The Desmodium repels the moths while Napier attracts them away.', isExpert: true, accepted: true, likes: 24, date: '2026-06-10' },
      { id: 'a2', author: 'Fatima Abdullahi', content: 'I use neem oil spray at 5ml per liter of water. Apply early morning every 3 days. Worked well last season on my 2-hectare farm.', isExpert: false, accepted: false, likes: 12, date: '2026-06-11' }
    ],
    likes: 45,
    solved: true,
    date: '2026-06-09'
  },
  {
    id: 'q2',
    author: 'Rajesh Kumar',
    title: 'Best drip irrigation setup for small-scale tomato farming under 0.5 acres?',
    body: 'I want to switch from flood irrigation to drip for my tomato plot. Budget is tight — what is the most cost-effective setup for less than half an acre?',
    category: 'Equipment',
    answers: [
      { id: 'a3', author: 'Priya Sharma', content: 'Gravel-packed drip kits from local cooperatives cost around $40-60 for 0.5 acres. They last 3-5 seasons with proper maintenance.', isExpert: false, accepted: false, likes: 8, date: '2026-06-12' }
    ],
    likes: 22,
    solved: false,
    date: '2026-06-12'
  },
  {
    id: 'q3',
    author: 'Maria Santos',
    title: 'When should I apply the second dose of nitrogen for irrigated wheat?',
    body: 'First dose was at sowing. Crop is now at tillering stage. Should I wait for jointing or apply now? Soil is clay loam.',
    category: 'Crops',
    answers: [],
    likes: 15,
    solved: false,
    date: '2026-06-13'
  },
  {
    id: 'q4',
    author: 'Thomas Mwangi',
    title: 'How to improve milk yield during dry season feed shortage?',
    body: 'My crossbred cows drop from 12L to 6L per day during the dry season. What supplementary feeding strategies are cost-effective?',
    category: 'Livestock',
    answers: [
      { id: 'a4', author: 'Prof. Amina Bakari', content: 'Prepare silage from excess wet-season forage. Add molasses-based urea blocks as cheap protein supplement. Consistently get 9-10L even in dry months.', isExpert: true, accepted: false, likes: 18, date: '2026-06-13' }
    ],
    likes: 31,
    solved: false,
    date: '2026-06-13'
  }
];

const CommunityHub: React.FC = () => {
  const { 
    userProfile, isSignedIn,
    listings, posts, chatMessages, stories: contextStories, trends, suggestedUsers, followedUserIds, likedPostIds,
    addListing, markListingSold, addPost, deletePost, getPostReplies, addPostReply, likePost,
    sendChatMessage, toggleFollowUser,
    showToast, weather, alerts, marketPrices,
    pollData, pollVoted, handlePollVote,
    navigate
  } = useFarm();
  
  const [showIntro, setShowIntro] = useState(() => !localStorage.getItem('agriflow_community_intro_dismissed'));
  const [activeTab, setActiveTab] = useState<CommunityTab>('FEED');

  const [localStories, setLocalStories] = useState<Story[]>([]);
  const [viewingStory, setViewingStory] = useState<Story | null>(null);
  const [storyMessage, setStoryMessage] = useState('');
  const [storyReacted, setStoryReacted] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [newStoryImage, setNewStoryImage] = useState<string | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newPost, setNewPost] = useState<Partial<ForumPost>>({ title: '', category: 'General', author: userProfile.name, content: '' });
  const [postImage, setPostImage] = useState<string | null>(null);
  const [newListing, setNewListing] = useState<Partial<MarketplaceListing>>({ type: 'SELL', item: '', price: '', location: '', contact: '' });
  const [listingImage, setListingImage] = useState<string | null>(null);
  const [activeChannel, setActiveChannel] = useState('general');
  const [chatInput, setChatInput] = useState('');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [activePostReplies, setActivePostReplies] = useState<ForumReply[]>([]);
  const [replyInput, setReplyInput] = useState('');

  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState({ title: '', body: '', category: 'General' });
  const [newAnswer, setNewAnswer] = useState('');
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [qaSearchQuery, setQaSearchQuery] = useState('');
  const [challengeProgress, setChallengeProgress] = useState<Record<string, number>>({});
  
  const [avatarError, setAvatarError] = useState(false);
  const [introBgError, setIntroBgError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const storyTimerRef = useRef<any>(null);
  const storyFileRef = useRef<HTMLInputElement>(null);
  const postFileRef = useRef<HTMLInputElement>(null);
  const listingFileRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const CHANNELS = [
    { id: 'general', name: 'General', desc: 'Main hub', icon: Globe },
    { id: 'crops', name: 'Crops Talk', desc: 'Planting & Seeds', icon: Leaf },
    { id: 'livestock', name: 'Livestock', desc: 'Herd health', icon: BadgeCheck },
    { id: 'equipment', name: 'Equipment', desc: 'Repairs & Sharing', icon: Tractor },
    { id: 'market-watch', name: 'Market Watch', desc: 'Prices & Trends', icon: TrendingUp },
    { id: 'knowledge', name: 'Knowledge Base', desc: 'Q&A & Tips', icon: BookOpen },
    { id: 'co-ops', name: 'Co-ops', desc: 'Organize & Buy', icon: Handshake },
  ];

  const SEASONAL_CHALLENGES: Challenge[] = useMemo(() => [
    { id: 'ch1', title: 'Zero-Waste Harvest', description: 'Process 90% of your harvest with zero post-harvest loss', crop: 'All', xp: 250, participants: 342, daysLeft: 18, progress: challengeProgress['ch1'] ?? 0, icon: Target },
    { id: 'ch2', title: 'Water Saver Week', description: 'Reduce irrigation by 20% using mulch and timing', crop: 'Vegetables', xp: 150, participants: 128, daysLeft: 5, progress: challengeProgress['ch2'] ?? 0, icon: Droplets },
    { id: 'ch3', title: 'Soil Builder Challenge', description: 'Add organic matter to 3 field sections this month', crop: 'Grains', xp: 200, participants: 89, daysLeft: 22, progress: challengeProgress['ch3'] ?? 0, icon: Sprout },
    { id: 'ch4', title: 'Market Maximizer', description: 'Sell produce at above-average regional price', crop: 'All', xp: 300, participants: 567, daysLeft: 30, progress: challengeProgress['ch4'] ?? 0, icon: DollarSign },
  ], [challengeProgress]);

  const FARMER_MATCHES = useMemo(() => {
    const country = userProfile?.countryCode || '';
    return [
      { id: 'fm1', name: 'Grace Adeyemi', location: 'Lagos, Nigeria', match: 94, crops: ['Maize', 'Cassava'], role: 'Crop Farmer', avatar: '' },
      { id: 'fm2', name: 'Nkechi Obi', location: 'Enugu, Nigeria', match: 87, crops: ['Rice', 'Yam'], role: 'Mixed Farmer', avatar: '' },
      { id: 'fm3', name: 'Emeka Nwosu', location: 'Abuja, Nigeria', match: 81, crops: ['Maize', 'Sorghum'], role: 'Grain Farmer', avatar: '' },
    ].filter(() => country === 'NG' || country === '').concat(
      country !== 'NG' && country !== '' ? [
        { id: 'fm1b', name: 'Nearby Farmer', location: userProfile.countryCode ? `Region ${userProfile.countryCode}` : 'Your Region', match: 85, crops: ['Local Crops'], role: 'Farmer', avatar: '' },
        { id: 'fm2b', name: 'Regional Grower', location: userProfile.countryCode ? `Region ${userProfile.countryCode}` : 'Your Region', match: 78, crops: ['Seasonal Crops'], role: 'Producer', avatar: '' },
      ] : []
    );
  }, [userProfile?.countryCode]);

  const locationAlerts = useMemo(() => {
    const weatherAlerts = alerts.filter(a => a.category === 'WEATHER').slice(0, 2);
    const priceAlerts = marketPrices
      .filter(p => Math.abs(p.changePercentage) >= 5)
      .slice(0, 3)
      .map(p => ({
        id: `price-${p.cropName}`,
        title: `${p.cropName} Price ${p.trend === 'up' ? 'Surge' : 'Drop'}`,
        message: `${p.cropName} is ${p.trend === 'up' ? 'up' : 'down'} ${Math.abs(p.changePercentage).toFixed(1)}% this week`,
        severity: Math.abs(p.changePercentage) >= 10 ? 'high' : 'medium' as 'high' | 'medium'
      }));
    return { weather: weatherAlerts, prices: priceAlerts };
  }, [alerts, marketPrices]);

  const filteredQuestions = useMemo(() => {
    if (!qaSearchQuery) return questions;
    const q = qaSearchQuery.toLowerCase();
    return questions.filter(quest => 
      quest.title.toLowerCase().includes(q) || 
      quest.body.toLowerCase().includes(q) || 
      quest.category.toLowerCase().includes(q)
    );
  }, [questions, qaSearchQuery]);

  const prevStoriesRef = useRef<Story[]>([]);
  useEffect(() => {
    if (contextStories !== prevStoriesRef.current) {
      prevStoriesRef.current = contextStories;
      setLocalStories(prev => prev.length === 0 ? contextStories : [...contextStories, ...prev.filter(ls => !contextStories.some(cs => cs.id === ls.id))]);
    }
  }, [contextStories]);

  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (activeTab === 'GROUPS') {
      scrollTimerRef.current = setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
    return () => { if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current); };
  }, [chatMessages, activeTab, activeChannel]);

  useEffect(() => {
    if (expandedPostId) getPostReplies(expandedPostId).then(setActivePostReplies).catch(() => showToast("Failed to load comments", "error"));
  }, [expandedPostId, getPostReplies, showToast]);

  useEffect(() => {
    if (viewingStory) {
      setStoryProgress(0);
      const startTime = Date.now();
      const duration = 5000; 
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, (elapsed / duration) * 100);
        setStoryProgress(progress);
        if (progress >= 100) setViewingStory(null);
      }, 50);
      storyTimerRef.current = interval;
      return () => clearInterval(interval);
    } else {
      setStoryProgress(0);
    }
  }, [viewingStory]);

  const handleAuthRequiredAction = (action: () => void) => {
    if (isSignedIn) action();
    else showToast('Please sign in to perform this action', 'info');
  };

  const handleFileRead = (file: File | undefined, callback: (result: string) => void) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.onerror = () => showToast("Failed to read file", "error");
      reader.readAsDataURL(file);
    }
  };

  const getRelativeTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const handleQuestionSubmit = () => {
    if (!newQuestion.title.trim()) return;
    const q: Question = {
      id: `q-${Date.now()}`,
      author: userProfile.name,
      title: newQuestion.title,
      body: newQuestion.body,
      category: newQuestion.category,
      answers: [],
      likes: 0,
      solved: false,
      date: new Date().toISOString()
    };
    setQuestions(prev => [q, ...prev]);
    setNewQuestion({ title: '', body: '', category: 'General' });
    setIsQuestionModalOpen(false);
    showToast('Question posted', 'success');
  };

  const handleAnswerSubmit = (questionId: string) => {
    if (!newAnswer.trim()) return;
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q;
      return { ...q, answers: [...q.answers, { id: `a-${Date.now()}`, author: userProfile.name, content: newAnswer, isExpert: false, accepted: false, likes: 0, date: new Date().toISOString() }] };
    }));
    setNewAnswer('');
    showToast('Answer posted', 'success');
  };

  const handleLikeQuestion = (questionId: string) => {
    setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, likes: q.likes + 1 } : q));
  };

  const handleAcceptAnswer = (questionId: string, answerId: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q;
      return { ...q, solved: true, answers: q.answers.map(a => ({ ...a, accepted: a.id === answerId })) };
    }));
    showToast('Answer accepted', 'success');
  };

  const handleJoinChallenge = (id: string) => {
    if (challengeProgress[id] !== undefined) return;
    setChallengeProgress(prev => ({ ...prev, [id]: 10 }));
    showToast('Joined challenge! Check back for progress.', 'success');
  };

  const IntroOverlay = () => (
    <div className={`absolute inset-0 z-50 bg-jade-950 flex flex-col items-center justify-center text-center p-6 transition-opacity duration-700 ${!showIntro ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      <div className="absolute inset-0 opacity-40">
        {!introBgError ? (
          <img 
            src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=2000&auto=format&fit=crop" 
            alt="Community Background" 
            className="w-full h-full object-cover"
            onError={() => setIntroBgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-jade-800/40 via-jade-900 to-jade-950"></div>
        )}
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-jade-950 via-jade-950/80 to-transparent"></div>
      
      <div className="relative z-10 max-w-3xl animate-fade-in-up">
        <div className="flex justify-center mb-6">
           <div className="bg-jade-500/20 p-4 rounded-full backdrop-blur-md border border-jade-500/30">
               <Globe className="w-12 h-12 text-jade-400" />
           </div>
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 font-heading">
           Agri-<span className="text-transparent bg-clip-text bg-gradient-to-r from-jade-400 to-sunburst-400">Connect</span>
        </h1>
        <p className="text-lg md:text-xl text-jade-300 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
          Connect with thousands of growers, trade equipment in the marketplace, and share real-time insights to build a more resilient future.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
           <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
               <ShoppingBag className="w-8 h-8 text-sunburst-400 mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Marketplace</h3>
              <p className="text-jade-400 text-sm">Buy, sell, and trade equipment and harvest directly.</p>
           </div>
           <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
              <HelpCircle className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Q&A Hub</h3>
              <p className="text-jade-400 text-sm">Ask questions, get expert answers, and share your knowledge.</p>
           </div>
           <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
               <Zap className="w-8 h-8 text-jade-400 mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Live Intel</h3>
              <p className="text-jade-400 text-sm">Real-time alerts on prices, pests, and weather.</p>
           </div>
        </div>

        <button 
          onClick={() => { setShowIntro(false); localStorage.setItem('agriflow_community_intro_dismissed', '1'); }}
          className="group relative px-10 py-4 bg-sunburst-50 text-jade-950 font-semibold rounded-full hover:bg-sunburst-100 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(34,197,94,0.4)] flex items-center gap-3 mx-auto"
        >
          Enter Community
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );

  const renderLocationAlerts = () => (
    <div className="space-y-3">
      {locationAlerts.weather.map(a => (
        <div key={a.id} className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-start gap-3">
          <Cloud className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-amber-900 dark:text-amber-200">{a.title}</p>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5 line-clamp-2">{a.message}</p>
          </div>
          <Bell className="w-4 h-4 text-amber-400 shrink-0" />
        </div>
      ))}
      {locationAlerts.prices.map(p => (
        <div key={p.id} className={`border rounded-2xl p-4 flex items-start gap-3 ${p.severity === 'high' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' : 'bg-jade-50 dark:bg-jade-950/20 border-jade-200 dark:border-jade-800'}`}>
          <DollarSign className={`w-5 h-5 shrink-0 mt-0.5 ${p.severity === 'high' ? 'text-red-500' : 'text-jade-500'}`} />
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-bold ${p.severity === 'high' ? 'text-red-900 dark:text-red-200' : 'text-jade-900 dark:text-jade-200'}`}>{p.title}</p>
            <p className={`text-xs mt-0.5 ${p.severity === 'high' ? 'text-red-700 dark:text-red-300' : 'text-jade-700 dark:text-jade-300'}`}>{p.message}</p>
          </div>
          <TrendingUp className={`w-4 h-4 shrink-0 ${p.severity === 'high' ? 'text-red-400' : 'text-jade-400'}`} />
        </div>
      ))}
    </div>
  );

  const renderSeasonalChallenges = () => (
    <div className="card-surface p-6 shrink-0">
      <h4 className="font-bold text-[var(--text-primary)] text-xs mb-4 flex items-center gap-2">
        <Flame className="w-4 h-4 text-orange-500" /> Seasonal Challenges
      </h4>
      <div className="space-y-4">
        {SEASONAL_CHALLENGES.map(ch => {
          const Icon = ch.icon;
          const isJoined = challengeProgress[ch.id] !== undefined;
          return (
            <div key={ch.id} className="group">
              <div className="flex items-start gap-3 mb-2">
                <div className={`p-2 rounded-xl shrink-0 ${isJoined ? 'bg-jade-100 text-jade-600 dark:bg-jade-900/30 dark:text-jade-400' : 'bg-[var(--bg-content)] text-[var(--text-secondary)]'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-[var(--text-primary)] line-clamp-1">{ch.title}</h5>
                  <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 line-clamp-2">{ch.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-9">
                <div className="flex-1 bg-[var(--bg-content)] rounded-full h-1.5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-jade-400 to-jade-500 rounded-full transition-all duration-500" style={{ width: `${isJoined ? Math.min(ch.progress + 15, 100) : 0}%` }} />
                </div>
                <span className="text-[10px] text-[var(--text-tertiary)] font-semibold shrink-0">{isJoined ? `${Math.min(ch.progress + 15, 100)}%` : `${ch.participants} in`}</span>
              </div>
              <div className="flex items-center gap-2 ml-9 mt-1.5">
                <span className="text-[9px] text-[var(--text-tertiary)] font-medium flex items-center gap-0.5"><Star className="w-3 h-3 text-sunburst-500" /> {ch.xp} XP</span>
                <span className="text-[9px] text-[var(--text-tertiary)]">•</span>
                <span className="text-[9px] text-[var(--text-tertiary)] font-medium">{ch.daysLeft}d left</span>
                {!isJoined && (
                  <button onClick={() => handleAuthRequiredAction(() => handleJoinChallenge(ch.id))} className="ml-auto text-[10px] font-bold text-jade-600 dark:text-jade-400 hover:underline">Join</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderFarmerMatches = () => (
    <div className="card-surface p-6 shrink-0">
      <h4 className="font-bold text-[var(--text-primary)] text-xs mb-4 flex items-center gap-2">
        <Users className="w-4 h-4 text-indigo-500" /> Farmer Matches
      </h4>
      <div className="space-y-4">
        {FARMER_MATCHES.slice(0, 3).map(fm => (
          <div key={fm.id} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--bg-content)] overflow-hidden shrink-0">
              <img src={fm.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(fm.name)}&background=random`} className="w-full h-full object-cover" alt={fm.name} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[var(--text-primary)] truncate">{fm.name}</p>
              <p className="text-[10px] text-[var(--text-secondary)] truncate">{fm.location}</p>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <span className="text-[10px] font-bold text-jade-600 dark:text-jade-400">{fm.match}%</span>
              <span className="text-[9px] text-[var(--text-tertiary)]">match</span>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => document.getElementById('suggested-users-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full mt-4 py-2 text-[10px] font-bold text-jade-600 dark:text-jade-400 hover:bg-jade-50 dark:hover:bg-jade-900/20 rounded-xl transition-colors flex items-center justify-center gap-1">
        Find More Farmers <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );

  const renderRightSidebarContent = () => (
    <div className="flex flex-col gap-6">
       <div className="bg-jade-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden shrink-0">
          <div className="relative z-10">
             <div className="flex items-center justify-between mb-4"><h4 className="font-bold text-xs flex items-center gap-2"><BarChart2 className="w-4 h-4 text-sunburst-400"/> Community Poll</h4></div>
             <p className="text-sm font-bold mb-4 leading-snug">What's your main strategy for the 2026 dry season?</p>
             <div className="space-y-2">
                {pollData.map((opt) => (
                   <button key={opt.id} onClick={() => handlePollVote(opt.id)} disabled={pollVoted !== null} className="w-full relative h-10 rounded-lg overflow-hidden group border border-white/10">
                      <div className={`absolute inset-0 bg-white/5 transition-colors ${pollVoted === opt.id ? 'bg-white/10' : ''}`}></div>
                                             <div className="absolute inset-0 bg-gradient-to-r from-sunburst-500 to-sunburst-600 transition-all duration-1000 ease-out opacity-80" style={{ width: pollVoted ? `${opt.percent}%` : '0%' }}></div>
                      <div className="absolute inset-0 flex items-center justify-between px-3"><span className="text-xs font-medium relative z-10 text-white shadow-black drop-shadow-sm">{opt.text}</span>{pollVoted && <span className="text-xs font-bold text-white shadow-black drop-shadow-md animate-fade-in">{opt.percent}%</span>}</div>
                   </button>
                ))}
             </div>
             <p className="text-[10px] text-jade-400 mt-4 text-center">{pollData.reduce((a,b) => a + b.votes, 0).toLocaleString()} votes • 12h left</p>
          </div>
       </div>

       {renderSeasonalChallenges()}

       {renderFarmerMatches()}

       <div className="card-surface p-6 shrink-0">
          <h4 className="font-bold text-[var(--text-primary)] text-xs mb-4 flex items-center"><TrendingUp className="w-4 h-4 mr-2 text-blue-500"/> Trending Topics</h4>
          <div className="space-y-4">
             {trends.map((topic, i) => (
                <div key={i} className="flex justify-between items-center group cursor-pointer" onClick={() => { setActiveTab('FEED'); setSearchQuery(topic.tag.replace('#', '')); }}>
                  <div><p className="text-sm font-bold text-[var(--text-secondary)] group-hover:text-blue-600 transition-colors">{topic.tag}</p><p className="text-[10px] text-[var(--text-tertiary)] font-medium">{topic.volume}</p></div>
                  <div className="w-6 h-6 rounded-full bg-[var(--bg-content)] flex items-center justify-center text-[var(--text-tertiary)] group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors"><ChevronRight className="w-4 h-4"/></div>
               </div>
             ))}
          </div>
       </div>

        <div id="suggested-users-section" className="card-surface p-6 shrink-0">
           <h4 className="font-bold text-[var(--text-primary)] text-xs mb-4 flex items-center"><UserPlus className="w-4 h-4 mr-2 text-jade-500"/> Who to follow</h4>
          <div className="space-y-5">
             {suggestedUsers.map((person) => (
                <div key={person.id} className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--bg-content)] overflow-hidden"><img src={person.img} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}`; }} /></div>
                       <div><p className="text-sm font-bold text-[var(--text-primary)] leading-none hover:underline cursor-pointer" onClick={() => handleAuthRequiredAction(() => toggleFollowUser(person.id))}>{person.name}</p><p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{person.role}</p></div>
                   </div>
                   <button onClick={() => handleAuthRequiredAction(() => toggleFollowUser(person.id))} className={`p-1.5 rounded-full transition-colors ${followedUserIds.includes(person.id) ? 'bg-jade-100 text-jade-600' : 'bg-[var(--bg-content)] text-[var(--text-tertiary)] hover:bg-terra-300'}`}>{followedUserIds.includes(person.id) ? <CheckCircle className="w-4 h-4"/> : <Plus className="w-4 h-4"/>}</button>
                </div>
             ))}
          </div>
       </div>
    </div>
  );

  const tabConfig: { key: CommunityTab; label: string; icon: React.ElementType; color: string; desktopLabel: string }[] = [
    { key: 'FEED', label: 'Feed', icon: LayoutGrid, color: 'field', desktopLabel: 'Global Feed' },
    { key: 'GROUPS', label: 'Groups', icon: Users2, color: 'field', desktopLabel: 'Discussion Groups' },
    { key: 'MARKET', label: 'Market', icon: ShoppingBag, color: 'green', desktopLabel: 'Marketplace' },
    { key: 'QA', label: 'Q&A', icon: HelpCircle, color: 'harvest', desktopLabel: 'Q&A Hub' },
  ];

  return (
    <div className="h-full w-full relative overflow-hidden bg-[var(--bg-app)]">
      {showIntro && <IntroOverlay />}

      <div className="h-full flex flex-col lg:grid lg:grid-cols-12 gap-6 p-4 lg:p-6 overflow-y-hidden">
        
        {/* LEFT SIDEBAR */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-6 overflow-y-auto custom-scrollbar h-full">
           {/* Profile Card */}
           <div className="card-surface overflow-hidden relative group">
              <div className="h-24 bg-gradient-to-r from-jade-800 to-jade-950 relative">
                 {isSignedIn && (
                   <button 
                     onClick={() => navigate(NavigationTab.SETTINGS)} 
                     className="absolute top-3 right-3 p-1.5 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors backdrop-blur-md z-10"
                     title="Settings"
                   >
                     <Settings className="w-4 h-4"/>
                   </button>
                 )}
              </div>
              <div className="px-6 pb-6 -mt-12 relative z-10">
                 <div className="w-24 h-24 rounded-full border-4 border-white dark:border-[var(--bg-card)] shadow-md bg-[var(--bg-content)] overflow-hidden mx-auto mb-4 relative">
                    {!avatarError && userProfile?.avatar ? (
                      <img 
                        src={userProfile.avatar} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                        onError={() => setAvatarError(true)} 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-terra-300 dark:bg-[var(--bg-content)] text-[var(--text-secondary)] dark:text-[var(--text-secondary)] font-black text-3xl">
                        {(userProfile?.name || 'G').charAt(0).toUpperCase()}
                      </div>
                    )}
                 </div>
                 <div className="text-center">
                    <h3 className="font-black text-[var(--text-primary)] text-xl flex items-center justify-center gap-1.5">
                      {userProfile?.name || 'Guest'} {isSignedIn && <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-100" />}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] font-semibold mb-4">
                      {userProfile?.role || 'Visitor'} • {userProfile?.farmName || 'Unregistered'}
                    </p>
                    <div className="grid grid-cols-3 gap-2 border-t border-[var(--border-card)] pt-4">
                       <div className="text-center"><span className="block font-black text-[var(--text-primary)] text-lg">{userProfile?.posts ?? 0}</span><span className="text-[10px] text-[var(--text-tertiary)] font-semibold">Posts</span></div>
                       <div className="text-center border-l border-r border-[var(--border-card)]"><span className="block font-black text-[var(--text-primary)] text-lg">{userProfile?.followers ?? 0}</span><span className="text-[10px] text-[var(--text-tertiary)] font-semibold">Fans</span></div>
                       <div className="text-center"><span className="block font-black text-[var(--text-primary)] text-lg">{userProfile?.following ?? 0}</span><span className="text-[10px] text-[var(--text-tertiary)] font-semibold">Following</span></div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Navigation Menu */}
           <div className="card-surface p-2">
              <nav className="space-y-1">
                 {tabConfig.map(tab => {
                   const Icon = tab.icon;
                   return (
                     <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === tab.key ? 'bg-[var(--bg-content)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-content)]'}`}>
                       <Icon className={`w-5 h-5 ${activeTab === tab.key ? `text-${tab.color}-500` : ''}`} /> {tab.desktopLabel}
                     </button>
                   );
                 })}
              </nav>
           </div>

           {/* Start a Co-op Card */}
           <div className="bg-gradient-to-br from-jade-50 to-jade-100 dark:from-jade-950/30 dark:to-jade-900/20 rounded-3xl shadow-sm border border-jade-200 dark:border-jade-800/40 p-6">
               <div className="flex items-center gap-3 mb-3">
                  <div className="bg-jade-100 dark:bg-jade-900/40 p-2.5 rounded-xl">
                     <Handshake className="w-5 h-5 text-jade-600 dark:text-jade-400" />
                  </div>
                  <div>
                     <h4 className="font-bold text-jade-900 dark:text-jade-200 text-sm">Start a Co-op</h4>
                     <p className="text-[10px] text-jade-600 dark:text-jade-400 font-medium">Pool resources with nearby farmers</p>
                  </div>
               </div>
               <p className="text-xs text-jade-700 dark:text-jade-300 mb-4 leading-relaxed">Buy inputs in bulk, share equipment costs, and negotiate better prices together.</p>
                <button onClick={() => handleAuthRequiredAction(() => { sendChatMessage({ sender: userProfile.name, content: `[Cooperative Formation] ${userProfile.name} is starting a new cooperative! Reply here to join.` }); showToast('Cooperative formation announced in community chat!', 'success'); })} className="w-full py-2.5 bg-jade-600 hover:bg-jade-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2">
                 <Users className="w-4 h-4" /> Create Cooperative
              </button>
           </div>

           {/* Upcoming Events Mini */}
           <div className="card-surface p-6">
              <div className="flex justify-between items-center mb-4">
                 <h4 className="font-semibold text-[var(--text-primary)] text-xs">Upcoming Events</h4>
              </div>
              <div className="space-y-4">
                 {[
                   { id: 1, title: 'Soil Regeneration Webinar', date: 'OCT 24', time: '2:00 PM EST', type: 'Online' },
                   { id: 2, title: 'Regional Machinery Auction', date: 'NOV 02', time: '9:00 AM CST', type: 'In-Person' },
                   { id: 3, title: 'Co-op Annual Meeting', date: 'NOV 15', time: '10:00 AM', type: 'Hybrid' },
                 ].map(evt => (
                     <div key={evt.id} className="flex gap-3 group cursor-pointer" onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(evt.title + ' agriculture farming 2026')}`, '_blank', 'noopener,noreferrer')}>
                       <div className="bg-[var(--bg-content)] rounded-xl p-2.5 flex flex-col items-center justify-center min-w-[50px] border border-[var(--border-card)]">
                          <span className="text-[9px] font-semibold text-red-500">{evt.date.split(' ')[0]}</span>
                          <span className="text-lg font-black text-[var(--text-primary)] leading-none">{evt.date.split(' ')[1]}</span>
                       </div>
                       <div className="flex-1">
                          <h5 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-blue-500 transition-colors line-clamp-2">{evt.title}</h5>
                          <p className="text-[10px] text-[var(--text-secondary)] mt-1">{evt.time} • {evt.type}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
         </div>

        {/* CENTER COLUMN */}
        <div className="flex-1 lg:col-span-6 flex flex-col overflow-hidden h-full rounded-t-3xl lg:rounded-3xl bg-white/50 dark:bg-[var(--bg-card)]/50 lg:bg-transparent">
           
           {/* Mobile Tabs */}
           <div className="lg:hidden flex bg-[var(--bg-card)] border-b border-[var(--border-card)] sticky top-0 z-20 shrink-0">
              {tabConfig.map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex-1 py-4 text-xs font-semibold border-b-2 ${activeTab === tab.key ? `border-${tab.color}-500 text-${tab.color}-600 dark:text-${tab.color}-400` : 'border-transparent text-[var(--text-secondary)]'}`}>{tab.label}</button>
              ))}
           </div>

           <div className="flex-1 overflow-y-auto custom-scrollbar p-0 lg:pr-2 pb-20">
              
              {/* === FEED VIEW === */}
              {activeTab === 'FEED' && (
                <div className="space-y-6 pt-4 lg:pt-0">
                   {/* Location Alerts */}
                   {(locationAlerts.weather.length > 0 || locationAlerts.prices.length > 0) && (
                     <div className="px-1">{renderLocationAlerts()}</div>
                   )}

                    {/* Stories Row */}
                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar px-1">
                       {localStories.map(story => (
                         <div key={story.id} onClick={() => story.isUser ? setIsStoryModalOpen(true) : setViewingStory(story)} className="flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0 min-w-[70px]">
                            <div className={`w-16 h-16 rounded-full p-[3px] transition-transform duration-200 group-hover:scale-105 ${story.isUser ? 'border-2 border-dashed border-[var(--text-tertiary)] dark:border-[var(--text-tertiary)]' : (story.hasUpdate ? 'bg-gradient-to-tr from-sunburst-400 to-red-500' : 'bg-[var(--bg-content)]')}`}>
                               <div className="w-full h-full rounded-full border-2 border-white dark:border-[var(--bg-card)] overflow-hidden bg-[var(--bg-content)] relative">
                                  {story.isUser && <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-content)]"><Plus className="w-6 h-6 text-[var(--text-tertiary)]"/></div>}
                                  <img src={story.img} alt={story.name} className={`w-full h-full object-cover ${story.isUser ? 'opacity-50' : ''}`} onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(story.name)}&background=random`; }} />
                               </div>
                            </div>
                            <span className="text-[10px] font-bold text-[var(--text-secondary)] truncate w-full text-center">{story.name}</span>
                         </div>
                       ))}
                    </div>

                    {/* Feed Search */}
                    <div className="relative px-1">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                       <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search posts..." className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl text-sm focus:outline-none focus:border-sunburst-500" />
                    </div>

                   {/* Create Post Widget */}
                   <div className="card-surface p-5">
                      <div className="flex gap-4 mb-4">
                         <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--bg-content)]">
                            {!avatarError ? <img src={userProfile.avatar} className="w-full h-full object-cover" alt="User" onError={() => setAvatarError(true)} /> : <div className="w-full h-full bg-terra-300 flex items-center justify-center font-bold text-[var(--text-secondary)]">{userProfile.name.charAt(0)}</div>}
                         </div>
                         <div onClick={() => handleAuthRequiredAction(() => setIsPostModalOpen(true))} className="flex-1 bg-[var(--bg-content)] border border-[var(--border-card)] rounded-2xl px-4 py-3 text-[var(--text-secondary)] text-sm font-medium cursor-pointer hover:bg-[var(--bg-content)] transition-colors">
                           Share insights, asking prices, or crop updates...
                         </div>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                         <div className="flex gap-2">
                             <button onClick={() => setIsPostModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-[var(--bg-content)] text-[var(--text-secondary)] text-xs font-semibold transition-colors"><ImageIcon className="w-4 h-4 text-jade-500"/> Photo</button>
                            <button onClick={() => setIsPostModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-[var(--bg-content)] text-[var(--text-secondary)] text-xs font-semibold transition-colors"><Camera className="w-4 h-4 text-blue-500"/> Video</button>
                         </div>
                         <button onClick={() => setIsPostModalOpen(true)} className="bg-jade-800 dark:bg-sunburst-500 text-white dark:text-jade-950 px-5 py-2 rounded-xl font-semibold text-xs shadow-lg active:scale-[0.98] transition-all">Post</button>
                      </div>
                   </div>

                   {/* MOBILE: Right Sidebar Content Injected Here */}
                   <div className="lg:hidden block">
                      {renderRightSidebarContent()}
                   </div>

                    {/* Posts Feed */}
                    <div className="space-y-6">
                       {posts
                         .filter(post => !searchQuery || post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.content.toLowerCase().includes(searchQuery.toLowerCase()) || post.author.toLowerCase().includes(searchQuery.toLowerCase()))
                         .map(post => (
                        <div key={post.id} className="card-surface overflow-hidden hover:shadow-md transition-shadow">
                           <div className="p-5">
                              <div className="flex justify-between items-start mb-4">
                                 <div className="flex gap-3">
                                    <div className="w-11 h-11 rounded-full bg-[var(--bg-content)] overflow-hidden">
                                       <img src={post.author === userProfile.name ? (avatarError ? `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name)}` : userProfile.avatar) : `https://i.pravatar.cc/150?u=${post.author}`} className="w-full h-full object-cover" alt="Author" onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=random`; }} />
                                    </div>
                                    <div>
                                       <h4 className="font-bold text-[var(--text-primary)] text-sm flex items-center gap-1">{post.author} {parseInt(post.id) % 3 === 0 && <Award className="w-3.5 h-3.5 text-amber-500" />}</h4>
                                       <p className="text-xs text-[var(--text-secondary)] font-medium">{post.category} • {getRelativeTime(post.date)}</p>
                                    </div>
                                 </div>
                                  <button onClick={() => { if (post.author === userProfile.name) { deletePost(post.id); } else { showToast("Post reported to moderators", "info"); } }} className="text-[var(--text-tertiary)] hover:bg-[var(--bg-content)] p-2 rounded-full"><MoreHorizontal className="w-5 h-5"/></button>
                              </div>
                              
                              <h5 className="font-bold text-[var(--text-primary)] mb-2">{post.title}</h5>
                              <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>
                              
                              {(post.image || (parseInt(post.id) % 2 === 0)) && (
                                <div className="mb-4 rounded-2xl overflow-hidden h-64 bg-[var(--bg-content)] relative">
                                   <img src={post.image || `https://images.unsplash.com/photo-1625246333195-00305256a836?q=80&w=800&fit=crop`} className="w-full h-full object-cover" alt="Content" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&fit=crop'; }} />
                                </div>
                              )}

                              <div className="flex justify-between items-center text-xs text-[var(--text-secondary)] font-semibold organic-divider pt-4 mt-2">
                                 <div className="flex gap-4">
                                    <button onClick={() => likePost(post.id)} className={`flex items-center gap-1.5 hover:text-red-500 transition-colors ${likedPostIds.includes(post.id) ? 'text-red-500' : ''}`}><Heart className={`w-4 h-4 ${likedPostIds.includes(post.id) ? 'fill-current' : ''}`}/> {post.likes} Likes</button>
                                    <button onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)} className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"><MessageCircle className="w-4 h-4"/> {post.replies} Comments</button>
                                 </div>
                                   <button onClick={() => { const text = `${post.title} - ${post.content.slice(0, 100)}`; navigator.clipboard?.writeText(text).then(() => showToast("Link copied to clipboard!", "success")).catch(() => showToast("Share link copied!", "success")); }} className="flex items-center gap-1.5 hover:text-jade-500 transition-colors"><Share2 className="w-4 h-4"/> Share</button>
                              </div>
                           </div>
                           
                           {expandedPostId === post.id && (
                              <div className="bg-[var(--bg-content)] p-5 border-t border-[var(--border-card)]">
                                 <div className="space-y-4 mb-4 max-h-60 overflow-y-auto custom-scrollbar">
                                    {activePostReplies.map(reply => (
                                       <div key={reply.id} className="flex gap-3">
                                          <div className="w-8 h-8 rounded-full bg-[var(--bg-content)] overflow-hidden shrink-0"><img src={`https://i.pravatar.cc/150?u=${reply.author}`} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.author)}&background=random`; }} /></div>
                                          <div className="flex-1 bg-[var(--bg-card)] p-3 rounded-2xl rounded-tl-none border border-[var(--border-card)] shadow-sm">
                                             <div className="flex justify-between items-center mb-1"><span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1">{reply.author} {reply.id.charCodeAt(reply.id.length - 1) % 3 === 0 && <Shield className="w-3 h-3 text-amber-500" />}</span><span className="text-[10px] text-[var(--text-tertiary)]">{getRelativeTime(reply.date)}</span></div>
                                             <p className="text-sm text-[var(--text-secondary)]">{reply.content}</p>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                                 {isSignedIn && (
                                   <form onSubmit={async (e) => { 
                                      e.preventDefault(); 
                                      if(replyInput.trim()) { 
                                        try {
                                          const res = await addPostReply(post.id, replyInput); 
                                          setActivePostReplies(res); 
                                          setReplyInput(''); 
                                        } catch (err) {
                                          showToast("Failed to post reply. Please try again.", "error");
                                        }
                                      } 
                                   }} className="flex gap-2">
                                      <input value={replyInput} onChange={e => setReplyInput(e.target.value)} className="flex-1 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-full px-4 py-2 text-sm focus:outline-none focus:border-jade-500" placeholder="Write a reply..." />
                                      <button type="submit" className="bg-jade-600 text-white p-2 rounded-full hover:bg-jade-700"><Send className="w-4 h-4" /></button>
                                   </form>
                                 )}
                              </div>
                           )}
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* === MARKET VIEW === */}
              {activeTab === 'MARKET' && (
                <div className="pt-4 lg:pt-0">
                   <div className="flex justify-between items-end mb-6 px-1">
                      <div>
                         <h3 className="text-2xl font-semibold text-[var(--text-primary)] font-heading">Marketplace</h3>
                         <p className="text-[var(--text-secondary)] text-xs font-semibold mt-1">Buy, Sell & Trade Equipment</p>
                      </div>
                       <button onClick={() => handleAuthRequiredAction(() => setIsListingModalOpen(true))} className="bg-jade-600 hover:bg-jade-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow-lg flex items-center gap-2 transition-transform active:scale-95"><Plus className="w-4 h-4"/> New Listing</button>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {listings.map(item => (
                          <div key={item.id} className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-card)] overflow-hidden hover:border-jade-500 transition-all group flex flex-col">
                            <div className="h-48 bg-[var(--bg-content)] relative overflow-hidden">
                               <img src={item.image || 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=800&fit=crop'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.item} onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=800&fit=crop'; }} />
                                <div className="absolute top-3 right-3"><span className={`px-3 py-1 rounded-lg text-[10px] font-semibold shadow-md ${item.status === 'SOLD' ? 'bg-[var(--text-tertiary)] text-white' : item.type === 'SELL' ? 'bg-jade-500 text-white' : 'bg-blue-500 text-white'}`}>{item.status === 'SOLD' ? 'SOLD' : item.type}</span></div>
                                {item.status === 'SOLD' && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="text-white font-black text-xl tracking-wide rotate-[-15deg] border-2 border-white px-4 py-1">SOLD</span></div>}
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                               <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-bold text-[var(--text-primary)] text-lg line-clamp-1">{item.item}</h4>
                                </div>
                               <p className="text-2xl font-black text-[var(--text-primary)] mb-2 font-heading">{item.price}</p>
                               <div className="flex items-center text-xs text-[var(--text-secondary)] mb-4"><MapPin className="w-3 h-3 mr-1"/> {item.location}</div>
                                <div className="mt-auto pt-4 border-t border-[var(--border-card)] flex justify-between items-center">
                                   <span className="text-[10px] font-semibold text-[var(--text-tertiary)]">{item.status === 'SOLD' ? 'Sold' : getRelativeTime(item.date)}</span>
                                   {item.status === 'SOLD' ? (<span className="text-xs font-semibold text-[var(--text-tertiary)] line-through">Sold</span>) : item.seller === userProfile.name ? (
                                     <button onClick={() => handleAuthRequiredAction(() => markListingSold(item.id))} className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline">Mark Sold</button>
                                   ) : (
                                      <button onClick={() => { const isEmail = item.contact.includes('@'); if (isEmail) { window.open(`mailto:${item.contact}`, '_blank'); } else { navigator.clipboard?.writeText(item.contact).then(() => showToast('Contact copied to clipboard', 'success')).catch(() => showToast(`Contact: ${item.contact}`, 'info')); } }} className="text-xs font-semibold text-jade-600 dark:text-jade-400 hover:underline">Contact Seller</button>
                                   )}
                                </div>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
              )}

              {/* === GROUPS VIEW === */}
              {activeTab === 'GROUPS' && (
                 <div className="card-surface h-full flex flex-col overflow-hidden mt-4 lg:mt-0">
                    <div className="flex h-full">
                       <div className="w-20 lg:w-64 border-r border-[var(--border-card)] bg-[var(--bg-content)] flex flex-col">
                          {CHANNELS.map(ch => (
                             <button key={ch.id} onClick={() => setActiveChannel(ch.id)} className={`p-4 lg:px-6 lg:py-4 flex items-center gap-3 transition-colors ${activeChannel === ch.id ? 'bg-[var(--bg-card)] border-l-4 border-sunburst-500 shadow-sm' : 'hover:bg-[var(--bg-content)]'}`}>
                                <div className={`p-2 rounded-xl shrink-0 ${activeChannel === ch.id ? 'bg-sunburst-50 dark:bg-sunburst-500/20 text-sunburst-700 dark:text-sunburst-300' : 'bg-[var(--bg-content)] text-[var(--text-secondary)]'}`}><ch.icon className="w-5 h-5"/></div>
                                <div className="hidden lg:block text-left"><div className="font-bold text-sm text-[var(--text-primary)]">{ch.name}</div><div className="text-[10px] text-[var(--text-secondary)] truncate">{ch.desc}</div></div>
                             </button>
                          ))}
                       </div>
                       <div className="flex-1 flex flex-col bg-[var(--bg-content)]/50">
                          <div className="p-4 border-b border-[var(--border-card)] bg-[var(--bg-card)] flex justify-between items-center shadow-sm z-10">
                             <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2"><Hash className="w-4 h-4 text-[var(--text-tertiary)]"/> {CHANNELS.find(c => c.id === activeChannel)?.name}</h3>
                              <span className="text-xs text-jade-500 font-bold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-jade-500 animate-pulse"></span> Live</span>
                          </div>
                          <div className="flex-1 overflow-y-auto p-4 space-y-4">
                             {chatMessages.filter(m => m.channelId === activeChannel).map(msg => (
                                <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''} animate-fade-in-up`}>
                                   <div className="w-8 h-8 rounded-full bg-[var(--bg-content)] overflow-hidden shrink-0"><img src={msg.avatar} className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = `https://ui-avatars.com/api/?name=${msg.author}`} /></div>
                                   <div className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm ${msg.isMe ? 'bg-sunburst-500 text-jade-950 rounded-tr-none font-medium' : 'bg-[var(--bg-card)] text-[var(--text-secondary)] rounded-tl-none border border-[var(--border-card)]'}`}>
                                      {!msg.isMe && <div className="text-[10px] font-semibold text-[var(--text-tertiary)] mb-1">{msg.author}</div>}
                                      {msg.text}
                                   </div>
                                </div>
                             ))}
                             <div ref={chatEndRef}></div>
                          </div>
                          <form onSubmit={(e) => { e.preventDefault(); if(chatInput.trim()) { sendChatMessage({ channelId: activeChannel, author: userProfile.name, text: chatInput, isMe: true, avatar: userProfile.avatar }); setChatInput(''); setTimeout(() => chatEndRef.current?.scrollIntoView(), 100); } }} className="p-3 bg-[var(--bg-card)] border-t border-[var(--border-card)] flex gap-2">
                             <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type a message..." className="flex-1 bg-[var(--bg-content)] border-transparent focus:border-sunburst-500 focus:bg-[var(--bg-card)] rounded-xl px-4 py-2.5 text-sm transition-all focus:outline-none" />
                             <button type="submit" aria-label="Send message" className="bg-jade-800 dark:bg-sunburst-500 text-white dark:text-jade-950 p-2.5 rounded-xl shadow-md hover:scale-105 transition-transform"><Send className="w-5 h-5" aria-hidden="true"/></button>
                          </form>
                       </div>
                    </div>
                 </div>
              )}

              {/* === Q&A VIEW === */}
              {activeTab === 'QA' && (
                <div className="pt-4 lg:pt-0 space-y-6">
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
                      <div>
                         <h3 className="text-2xl font-semibold text-[var(--text-primary)] font-heading">Q&A Hub</h3>
                         <p className="text-[var(--text-secondary)] text-xs font-semibold mt-1">Ask questions, get expert answers, share knowledge</p>
                      </div>
                      <div className="flex gap-3">
                         <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                            <input value={qaSearchQuery} onChange={e => setQaSearchQuery(e.target.value)} placeholder="Search questions..." className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl text-sm focus:outline-none focus:border-sunburst-500" />
                         </div>
                         <button onClick={() => handleAuthRequiredAction(() => setIsQuestionModalOpen(true))} className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow-lg flex items-center gap-2 transition-transform active:scale-95 shrink-0"><HelpCircle className="w-4 h-4"/> Ask</button>
                      </div>
                   </div>

                   {/* Quick stat badges */}
                   <div className="flex gap-3 px-1 overflow-x-auto no-scrollbar">
                       <div className="bg-jade-50 dark:bg-jade-950/20 border border-jade-200 dark:border-jade-800 rounded-xl px-4 py-2 flex items-center gap-2 shrink-0">
                          <CheckCircle className="w-4 h-4 text-jade-600" />
                          <span className="text-xs font-bold text-jade-800 dark:text-jade-200">{questions.filter(q => q.solved).length} Solved</span>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-2 flex items-center gap-2 shrink-0">
                         <HelpCircle className="w-4 h-4 text-amber-600" />
                         <span className="text-xs font-bold text-amber-800 dark:text-amber-200">{questions.filter(q => !q.solved).length} Open</span>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-2 flex items-center gap-2 shrink-0">
                         <Shield className="w-4 h-4 text-blue-600" />
                         <span className="text-xs font-bold text-blue-800 dark:text-blue-200">{questions.reduce((c, q) => c + q.answers.filter(a => a.isExpert).length, 0)} Expert Answers</span>
                      </div>
                   </div>

                   {/* Questions list */}
                   <div className="space-y-4">
                      {filteredQuestions.map(q => (
                        <div key={q.id} className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-card)] overflow-hidden hover:shadow-md transition-shadow">
                           <div className="p-5">
                              <div className="flex items-start gap-4">
                                 {/* Vote column */}
                                 <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                                     <button onClick={() => handleLikeQuestion(q.id)} aria-label="Upvote question" className="p-1 hover:bg-jade-50 dark:hover:bg-jade-900/20 rounded-lg transition-colors">
                                        <ThumbsUp className={`w-5 h-5 ${q.likes > 0 ? 'text-jade-500' : 'text-[var(--text-tertiary)]'}`} />
                                    </button>
                                    <span className="text-sm font-bold text-[var(--text-secondary)]">{q.likes}</span>
                                 </div>

                                 {/* Content */}
                                 <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                       {q.solved && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-jade-100 dark:bg-jade-900/30 text-jade-700 dark:text-jade-300 rounded-md text-[10px] font-bold"><CheckCircle className="w-3 h-3" /> Solved</span>}
                                       <span className="px-2 py-0.5 bg-[var(--bg-content)] text-[var(--text-secondary)] rounded-md text-[10px] font-semibold">{q.category}</span>
                                    </div>
                                    <h4 className="font-bold text-[var(--text-primary)] text-[15px] leading-snug mb-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors" onClick={() => setExpandedQuestionId(expandedQuestionId === q.id ? null : q.id)}>{q.title}</h4>
                                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">{q.body}</p>
                                    <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
                                       <span className="font-medium">{q.author}</span>
                                       <span>•</span>
                                       <span>{q.answers.length} answer{q.answers.length !== 1 ? 's' : ''}</span>
                                       <span>•</span>
                                       <span>{getRelativeTime(q.date)}</span>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           {/* Expanded answers */}
                           {expandedQuestionId === q.id && (
                             <div className="bg-[var(--bg-content)] border-t border-[var(--border-card)] p-5 space-y-4">
                                {q.answers.length > 0 && <h5 className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-2"><MessageCircle className="w-4 h-4" /> {q.answers.length} Answer{q.answers.length !== 1 ? 's' : ''}</h5>}
                                {q.answers.map(a => (
                                  <div key={a.id} className={`flex gap-3 p-4 rounded-xl ${a.accepted ? 'bg-jade-50 dark:bg-jade-950/20 border border-jade-200 dark:border-jade-800' : 'bg-[var(--bg-card)] border border-[var(--border-card)]'}`}>
                                     <div className="w-8 h-8 rounded-full bg-[var(--bg-content)] overflow-hidden shrink-0">
                                        <img src={a.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.author)}&background=random`} className="w-full h-full object-cover" alt={a.author} />
                                     </div>
                                     <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                           <span className="text-xs font-bold text-[var(--text-primary)]">{a.author}</span>
                                           {a.isExpert && <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded text-[9px] font-bold"><Shield className="w-3 h-3" /> Expert</span>}
                                           {a.accepted && <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-jade-100 dark:bg-jade-900/30 text-jade-700 dark:text-jade-300 rounded text-[9px] font-bold"><CheckCircle className="w-3 h-3" /> Accepted</span>}
                                           <span className="text-[10px] text-[var(--text-tertiary)] ml-auto">{getRelativeTime(a.date)}</span>
                                        </div>
                                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{a.content}</p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <button className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)] hover:text-jade-600 font-semibold transition-colors"><ThumbsUp className="w-3 h-3" /> {a.likes}</button>
                                           {!q.solved && isSignedIn && q.author === userProfile.name && !a.accepted && (
                                              <button onClick={() => handleAcceptAnswer(q.id, a.id)} className="flex items-center gap-1 text-[10px] text-jade-600 dark:text-jade-400 hover:underline font-bold"><CheckCircle className="w-3 h-3" /> Accept</button>
                                           )}
                                        </div>
                                     </div>
                                  </div>
                                ))}
                                {q.answers.length === 0 && <p className="text-sm text-[var(--text-tertiary)] text-center py-4">No answers yet. Be the first to help!</p>}

                                {/* Add answer */}
                                {isSignedIn && (
                                  <form onSubmit={(e) => { e.preventDefault(); handleAnswerSubmit(q.id); }} className="flex gap-2 mt-2">
                                     <input value={newAnswer} onChange={e => setNewAnswer(e.target.value)} className="flex-1 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sunburst-500" placeholder="Write your answer..." />
                                     <button type="submit" className="bg-amber-600 text-white px-4 py-2.5 rounded-xl font-semibold text-xs hover:bg-amber-700 transition-colors shrink-0">Answer</button>
                                  </form>
                                )}
                             </div>
                           )}
                        </div>
                      ))}
                      {filteredQuestions.length === 0 && (
                        <div className="text-center py-12">
                           <HelpCircle className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-3" />
                           <p className="text-[var(--text-tertiary)] font-semibold">No questions found</p>
                           <p className="text-[var(--text-tertiary)] text-sm">Try a different search or ask a new question</p>
                        </div>
                      )}
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-6 overflow-y-auto custom-scrollbar h-full">
           {renderRightSidebarContent()}
        </div>
      </div>

      {/* CREATE POST MODAL */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-jade-950/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-[var(--bg-card)] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden scale-100 transition-all">
             <div className="px-6 py-4 border-b border-[var(--border-card)] flex justify-between items-center bg-[var(--bg-content)]">
                <h3 className="font-bold text-[var(--text-primary)] text-lg">Create Post</h3>
                <button onClick={() => { setIsPostModalOpen(false); setPostImage(null); }} aria-label="Close" className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] p-1 rounded-full"><X className="w-5 h-5" aria-hidden="true"/></button>
             </div>
             <form onSubmit={async (e) => { e.preventDefault(); if (newPost.content) { await addPost({ ...newPost, title: newPost.title || newPost.content.substring(0, 30)+'...', author: userProfile.name, image: postImage } as any); setIsPostModalOpen(false); setNewPost({ title: '', category: 'General', author: userProfile.name, content: '' }); setPostImage(null); } }}>
               <div className="p-6">
                  <div className="flex gap-4 mb-4">
                     <div className="w-10 h-10 rounded-full bg-[var(--bg-content)] overflow-hidden"><img src={userProfile.avatar} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name)}&background=random`; }} /></div>
                     <div><span className="font-bold text-sm text-[var(--text-primary)] block">{userProfile.name}</span><select value={newPost.category} onChange={e => setNewPost({...newPost, category: e.target.value as any})} className="text-xs bg-transparent border-none p-0 focus:ring-0 cursor-pointer font-bold text-[var(--text-secondary)]"><option value="General">General</option><option value="Pests">Pests</option><option value="Market">Market</option><option value="Weather">Weather</option><option value="Equipment">Equipment</option></select></div>
                  </div>
                  <input placeholder="Title (Optional)" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} className="w-full mb-2 text-lg font-bold placeholder-[var(--text-tertiary)] border-none focus:ring-0 p-0 bg-transparent text-[var(--text-primary)]"/>
                  <textarea placeholder="What's happening on your farm?" value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} className="w-full h-32 resize-none border-none focus:ring-0 p-0 text-[var(--text-secondary)] placeholder-[var(--text-tertiary)] text-sm bg-transparent" autoFocus/>
                  {postImage && <div className="relative mt-2 rounded-xl overflow-hidden bg-[var(--bg-content)] border border-[var(--border-card)]"><img src={postImage} className="w-full h-48 object-cover" /><button type="button" onClick={() => setPostImage(null)} aria-label="Remove image" className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-black/80"><X className="w-4 h-4" aria-hidden="true" /></button></div>}
               </div>
               <div className="px-6 py-4 bg-[var(--bg-content)] border-t border-[var(--border-card)] flex justify-between items-center">
                  <div className="flex gap-2">
                      <button type="button" onClick={() => postFileRef.current?.click()} aria-label="Attach image" className="p-2 hover:bg-jade-100 text-[var(--text-secondary)] hover:text-jade-600 rounded-full transition-colors"><ImageIcon className="w-5 h-5" aria-hidden="true"/></button>
                     <input type="file" ref={postFileRef} accept="image/*" onChange={(e) => handleFileRead(e.target.files?.[0], (res) => setPostImage(res))} className="hidden" />
                  </div>
                  <button type="submit" disabled={!newPost.content} className="bg-jade-800 dark:bg-sunburst-500 text-white dark:text-jade-950 px-6 py-2 rounded-full font-semibold text-xs hover:opacity-90 disabled:opacity-50 transition-all shadow-md active:scale-[0.98]">Post Update</button>
               </div>
             </form>
           </div>
        </div>
      )}

      {/* CREATE LISTING MODAL */}
      {isListingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-jade-950/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-[var(--bg-card)] w-full max-w-md rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
             <button onClick={() => { setIsListingModalOpen(false); setListingImage(null); }} aria-label="Close" className="absolute top-4 right-4 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"><X className="w-6 h-6" aria-hidden="true" /></button>
             <div className="mb-6"><h3 className="font-semibold text-2xl text-[var(--text-primary)] font-heading">New Listing</h3><p className="text-[var(--text-secondary)] text-xs mt-1">Marketplace / Create</p></div>
             <form onSubmit={async (e) => { 
                e.preventDefault(); 
                if (!newListing.item || !newListing.price) {
                  showToast("Please provide an item name and price", "error");
                  return;
                }
                try {
                  await addListing({ ...newListing, seller: userProfile.name, image: listingImage } as any); 
                  setIsListingModalOpen(false); 
                  setNewListing({ type: 'SELL', item: '', price: '', location: '', contact: '' }); 
                  setListingImage(null); 
                } catch (err) {
                  // Context handles generic error toast
                }
             }} className="space-y-4">
               <div className="grid grid-cols-2 gap-4 p-1 bg-[var(--bg-content)] rounded-xl">
                   <button type="button" onClick={() => setNewListing({...newListing, type: 'SELL'})} className={`py-3 font-bold text-xs rounded-lg transition-all ${newListing.type === 'SELL' ? 'bg-[var(--bg-card)] text-jade-700 dark:text-jade-400 shadow-sm' : 'text-[var(--text-secondary)]'}`}>SELL ITEM</button>
                  <button type="button" onClick={() => setNewListing({...newListing, type: 'BUY'})} className={`py-3 font-bold text-xs rounded-lg transition-all ${newListing.type === 'BUY' ? 'bg-[var(--bg-card)] text-blue-700 dark:text-blue-400 shadow-sm' : 'text-[var(--text-secondary)]'}`}>REQUEST ITEM</button>
               </div>
               <div onClick={() => listingFileRef.current?.click()} className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden ${listingImage ? 'border-jade-500' : 'border-[var(--border-card)] hover:border-[var(--text-tertiary)] hover:bg-[var(--bg-content)]'}`}><input type="file" ref={listingFileRef} accept="image/*" onChange={(e) => handleFileRead(e.target.files?.[0], (res) => setListingImage(res))} className="hidden" />{listingImage ? <img src={listingImage} alt="Preview" className="w-full h-full object-cover" /> : <><ImageIcon className="w-8 h-8 text-[var(--text-tertiary)] mb-2" /><span className="text-xs font-semibold text-[var(--text-secondary)]">Upload Item Photo</span></>}</div>
               <div className="space-y-4">
                  <input placeholder="Item Name" value={newListing.item} onChange={e => setNewListing({...newListing, item: e.target.value})} className="w-full p-3 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl font-bold outline-none text-[var(--text-primary)] text-sm" required />
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Price" value={newListing.price} onChange={e => setNewListing({...newListing, price: e.target.value})} className="w-full p-3 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl font-bold outline-none text-[var(--text-primary)] text-sm" required />
                    <input placeholder="Location" value={newListing.location} onChange={e => setNewListing({...newListing, location: e.target.value})} className="w-full p-3 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl font-bold outline-none text-[var(--text-primary)] text-sm" />
                  </div>
                  <input placeholder="Contact Info" value={newListing.contact} onChange={e => setNewListing({...newListing, contact: e.target.value})} className="w-full p-3 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl font-bold outline-none text-[var(--text-primary)] text-sm" />
               </div>
               <button className="w-full bg-jade-800 dark:bg-sunburst-500 text-white dark:text-jade-950 py-4 rounded-xl font-semibold hover:opacity-90 shadow-lg active:scale-[0.98] mt-2">Publish Listing</button>
             </form>
           </div>
        </div>
      )}

      {/* ASK QUESTION MODAL */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-jade-950/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-[var(--bg-card)] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
             <div className="px-6 py-4 border-b border-[var(--border-card)] flex justify-between items-center bg-amber-50 dark:bg-amber-950/20">
                <h3 className="font-bold text-amber-900 dark:text-amber-200 text-lg flex items-center gap-2"><HelpCircle className="w-5 h-5" /> Ask a Question</h3>
                <button onClick={() => { setIsQuestionModalOpen(false); setNewQuestion({ title: '', body: '', category: 'General' }); }} aria-label="Close" className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] p-1 rounded-full"><X className="w-5 h-5" aria-hidden="true"/></button>
             </div>
             <div className="p-6 space-y-4">
                <div>
                   <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5">Category</label>
                   <select value={newQuestion.category} onChange={e => setNewQuestion({...newQuestion, category: e.target.value})} className="w-full p-3 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl font-semibold outline-none text-[var(--text-primary)] text-sm">
                      <option value="General">General</option>
                      <option value="Crops">Crops</option>
                      <option value="Pests">Pests</option>
                      <option value="Livestock">Livestock</option>
                      <option value="Equipment">Equipment</option>
                      <option value="Soil">Soil & Fertilizer</option>
                      <option value="Market">Market & Prices</option>
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5">Question</label>
                   <input placeholder="e.g. How do you prevent fall armyworm in maize?" value={newQuestion.title} onChange={e => setNewQuestion({...newQuestion, title: e.target.value})} className="w-full p-3 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl font-bold outline-none text-[var(--text-primary)] text-sm" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5">Details</label>
                   <textarea placeholder="Provide more context about your question..." value={newQuestion.body} onChange={e => setNewQuestion({...newQuestion, body: e.target.value})} className="w-full h-28 p-3 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl font-medium outline-none text-[var(--text-primary)] text-sm resize-none" />
                </div>
             </div>
             <div className="px-6 py-4 bg-[var(--bg-content)] border-t border-[var(--border-card)] flex justify-end gap-3">
                <button onClick={() => { setIsQuestionModalOpen(false); setNewQuestion({ title: '', body: '', category: 'General' }); }} className="px-5 py-2.5 rounded-xl font-semibold text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-content)] transition-colors">Cancel</button>
                <button onClick={handleQuestionSubmit} disabled={!newQuestion.title.trim()} className="bg-amber-600 text-white px-6 py-2.5 rounded-xl font-semibold text-xs hover:bg-amber-700 disabled:opacity-50 transition-all shadow-md flex items-center gap-2"><Sparkles className="w-4 h-4" /> Post Question</button>
             </div>
           </div>
        </div>
      )}

      {/* STORY VIEWER */}
      {viewingStory && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-fade-in">
           <div className="absolute top-4 left-4 right-4 flex gap-2 z-20"><div className="h-1 bg-white/30 rounded-full flex-1 overflow-hidden"><div className="h-full bg-white transition-all duration-[50ms] ease-linear" style={{ width: `${storyProgress}%` }}></div></div></div>
           <div className="absolute top-8 left-4 z-20 flex items-center gap-3"><div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden"><img src={viewingStory.img} className="w-full h-full object-cover" /></div><span className="text-white font-bold text-sm shadow-black drop-shadow-md">{viewingStory.name}</span><span className="text-white/60 text-xs font-medium">2h</span></div>
           <button onClick={() => { setViewingStory(null); setStoryMessage(''); setStoryReacted(false); }} aria-label="Close story" className="absolute top-8 right-4 z-20 text-white hover:text-white/80 transition-colors"><XCircle className="w-8 h-8" aria-hidden="true" /></button>
            <div className="w-full h-full max-w-md bg-black relative flex items-center justify-center"><img src={viewingStory.img} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=800&q=80'; }} /><div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent"><div className="flex gap-4"><input type="text" placeholder="Send message..." value={storyMessage} onChange={e => setStoryMessage(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && storyMessage.trim()) { sendChatMessage({ sender: userProfile.name, content: storyMessage.trim() }); showToast(`Message sent to ${viewingStory.name}`, 'success'); setStoryMessage(''); } }} className="flex-1 bg-transparent border border-white/30 rounded-full px-4 py-2 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white" /><button aria-label="React to story" onClick={() => { if (!storyReacted) { setStoryReacted(true); showToast('Reacted with ❤️', 'success'); } }} className={`p-2 hover:bg-white/10 rounded-full transition-colors ${storyReacted ? 'text-red-500' : 'text-white'}`}><Heart className={`w-6 h-6 ${storyReacted ? 'fill-red-500' : ''}`} aria-hidden="true" /></button></div></div></div>
        </div>
      )}

      {/* CREATE STORY MODAL */}
      {isStoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-jade-950/80 backdrop-blur-md animate-fade-in">
           <div className="bg-[var(--bg-card)] w-full max-w-sm rounded-2xl shadow-2xl p-6 relative flex flex-col items-center text-center">
              <button onClick={() => { setIsStoryModalOpen(false); setNewStoryImage(null); }} aria-label="Close" className="absolute top-4 right-4 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"><X className="w-6 h-6" aria-hidden="true" /></button>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Add to Story</h3>
              <div onClick={() => storyFileRef.current?.click()} className="w-full h-64 bg-[var(--bg-content)] rounded-xl border-2 border-dashed border-[var(--border-card)] flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--bg-content)] transition-colors overflow-hidden relative mt-4"><input type="file" accept="image/*" ref={storyFileRef} onChange={(e) => handleFileRead(e.target.files?.[0], (res) => setNewStoryImage(res))} className="hidden" />{newStoryImage ? <img src={newStoryImage} className="w-full h-full object-cover" /> : <><Camera className="w-10 h-10 text-[var(--text-tertiary)] mb-2" /><span className="text-xs font-semibold text-[var(--text-secondary)]">Tap to Upload</span></>}</div>
              <button onClick={() => { if(newStoryImage) { setLocalStories(prev => [{id: `story-${Date.now()}`, name: userProfile.name, img: newStoryImage!, hasUpdate: true, isUser: false}, ...prev]); setIsStoryModalOpen(false); setNewStoryImage(null); showToast('Story posted', 'success'); } }} disabled={!newStoryImage} className="w-full mt-6 py-3 bg-blue-600 disabled:bg-terra-300 text-white rounded-xl font-semibold text-xs shadow-lg">Share</button>
           </div>
        </div>
      )}

    </div>
  );
};

export default CommunityHub;
