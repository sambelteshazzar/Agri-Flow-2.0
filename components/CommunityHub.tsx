import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Users, ShoppingBag, Search, CheckCircle, MapPin, Plus, X, Send, Hash, 
  ThumbsUp, Share2, MoreHorizontal, Image as ImageIcon, Heart, MessageCircle, TrendingUp,
  UserPlus, Globe, BadgeCheck, Camera, Bell, ChevronRight, Settings,
  Calendar, BarChart2, Zap, XCircle, Leaf, PackageSearch, ArrowRight, LayoutGrid, Users2,
  HelpCircle, Award, Target, Handshake, Cloud, DollarSign, Flame, BookOpen, Sparkles,
  ChevronDown, Eye, Star, Shield, Wheat, TreePine, Droplets, Sun, Snowflake, Bug,
  Sprout, Tractor, CircleDot
} from 'lucide-react';
import { useFarm } from '../contexts/FarmContext';
import { MarketplaceListing, ForumPost, ForumReply, Story, NavigationTab } from '../types';
import { Question, CommunityTab, INITIAL_QUESTIONS, LocationAlerts } from './community/types';
import IntroOverlay from './community/IntroOverlay';
import RightSidebar from './community/RightSidebar';
import FeedTab from './community/FeedTab';
import MarketTab from './community/MarketTab';
import ChatTab from './community/ChatTab';
import QATab from './community/QATab';
import CreatePostModal from './community/CreatePostModal';
import CreateListingModal from './community/CreateListingModal';
import AskQuestionModal from './community/AskQuestionModal';
import StoryViewer from './community/StoryViewer';
import CreateStoryModal from './community/CreateStoryModal';

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

  const locationAlerts: LocationAlerts = useMemo(() => {
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

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.content) {
      await addPost({ ...newPost, title: newPost.title || newPost.content.substring(0, 30)+'...', author: userProfile.name, image: postImage } as any);
      setIsPostModalOpen(false);
      setNewPost({ title: '', category: 'General', author: userProfile.name, content: '' });
      setPostImage(null);
    }
  };

  const handleListingSubmit = async (e: React.FormEvent) => {
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
    }
  };

  const handleContactSeller = (item: MarketplaceListing) => {
    const isEmail = item.contact.includes('@');
    if (isEmail) {
      window.open(`mailto:${item.contact}`, '_blank');
    } else {
      navigator.clipboard?.writeText(item.contact).then(() => showToast('Contact copied to clipboard', 'success')).catch(() => showToast(`Contact: ${item.contact}`, 'info'));
    }
  };

  const handleStoryClose = () => {
    setViewingStory(null);
    setStoryMessage('');
    setStoryReacted(false);
  };

  const handleStoryShare = () => {
    if (newStoryImage) {
      setLocalStories(prev => [{id: `story-${Date.now()}`, name: userProfile.name, img: newStoryImage, hasUpdate: true, isUser: false}, ...prev]);
      setIsStoryModalOpen(false);
      setNewStoryImage(null);
      showToast('Story posted', 'success');
    }
  };

  const tabConfig: { key: CommunityTab; label: string; icon: React.ElementType; color: string; desktopLabel: string }[] = [
    { key: 'FEED', label: 'Feed', icon: LayoutGrid, color: 'field', desktopLabel: 'Global Feed' },
    { key: 'GROUPS', label: 'Groups', icon: Users2, color: 'field', desktopLabel: 'Discussion Groups' },
    { key: 'MARKET', label: 'Market', icon: ShoppingBag, color: 'green', desktopLabel: 'Marketplace' },
    { key: 'QA', label: 'Q&A', icon: HelpCircle, color: 'harvest', desktopLabel: 'Q&A Hub' },
  ];

  return (
    <div className="h-full w-full relative overflow-hidden bg-[var(--bg-app)]">
      {showIntro && <IntroOverlay showIntro={showIntro} onDismiss={() => { setShowIntro(false); localStorage.setItem('agriflow_community_intro_dismissed', '1'); }} introBgError={introBgError} setIntroBgError={setIntroBgError} />}

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
              {activeTab === 'FEED' && (
                <FeedTab
                  localStories={localStories}
                  viewingStory={viewingStory}
                  setViewingStory={setViewingStory}
                  setIsStoryModalOpen={setIsStoryModalOpen}
                  posts={posts}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  expandedPostId={expandedPostId}
                  setExpandedPostId={setExpandedPostId}
                  activePostReplies={activePostReplies}
                  replyInput={replyInput}
                  setReplyInput={setReplyInput}
                  likedPostIds={likedPostIds}
                  userProfile={userProfile}
                  isSignedIn={isSignedIn}
                  avatarError={avatarError}
                  setAvatarError={setAvatarError}
                  likePost={likePost}
                  addPostReply={addPostReply}
                  setActivePostReplies={setActivePostReplies}
                  showToast={showToast}
                  deletePost={deletePost}
                  handleAuthRequiredAction={handleAuthRequiredAction}
                  setIsPostModalOpen={setIsPostModalOpen}
                  getRelativeTime={getRelativeTime}
                  locationAlerts={locationAlerts}
                  mobileRightSidebar={<RightSidebar userProfile={userProfile} isSignedIn={isSignedIn} pollData={pollData} pollVoted={pollVoted} handlePollVote={handlePollVote} trends={trends} suggestedUsers={suggestedUsers} followedUserIds={followedUserIds} alerts={alerts} marketPrices={marketPrices} challengeProgress={challengeProgress} onJoinChallenge={handleJoinChallenge} onAuthRequiredAction={handleAuthRequiredAction} showToast={showToast} sendChatMessage={sendChatMessage} navigate={navigate} setActiveTab={setActiveTab} setSearchQuery={setSearchQuery} toggleFollowUser={toggleFollowUser} />}
                />
              )}

              {activeTab === 'MARKET' && (
                <MarketTab
                  listings={listings}
                  userProfile={userProfile}
                  onAuthRequiredAction={handleAuthRequiredAction}
                  onMarkSold={markListingSold}
                  setIsListingModalOpen={setIsListingModalOpen}
                  onContactSeller={handleContactSeller}
                  getRelativeTime={getRelativeTime}
                  showToast={showToast}
                />
              )}

              {activeTab === 'GROUPS' && (
                <ChatTab
                  channels={CHANNELS}
                  activeChannel={activeChannel}
                  setActiveChannel={setActiveChannel}
                  chatMessages={chatMessages}
                  chatInput={chatInput}
                  setChatInput={setChatInput}
                  userProfile={userProfile}
                  onSendChatMessage={sendChatMessage}
                  chatEndRef={chatEndRef}
                />
              )}

              {activeTab === 'QA' && (
                <QATab
                  questions={questions}
                  filteredQuestions={filteredQuestions}
                  expandedQuestionId={expandedQuestionId}
                  setExpandedQuestionId={setExpandedQuestionId}
                  newAnswer={newAnswer}
                  setNewAnswer={setNewAnswer}
                  isSignedIn={isSignedIn}
                  userProfile={userProfile}
                  qaSearchQuery={qaSearchQuery}
                  setQaSearchQuery={setQaSearchQuery}
                  onLikeQuestion={handleLikeQuestion}
                  onAcceptAnswer={handleAcceptAnswer}
                  onAnswerSubmit={handleAnswerSubmit}
                  setIsQuestionModalOpen={setIsQuestionModalOpen}
                  handleAuthRequiredAction={handleAuthRequiredAction}
                  getRelativeTime={getRelativeTime}
                />
              )}
           </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-6 overflow-y-auto custom-scrollbar h-full">
          <RightSidebar
            userProfile={userProfile}
            isSignedIn={isSignedIn}
            pollData={pollData}
            pollVoted={pollVoted}
            handlePollVote={handlePollVote}
            trends={trends}
            suggestedUsers={suggestedUsers}
            followedUserIds={followedUserIds}
            alerts={alerts}
            marketPrices={marketPrices}
            challengeProgress={challengeProgress}
            onJoinChallenge={handleJoinChallenge}
            onAuthRequiredAction={handleAuthRequiredAction}
            showToast={showToast}
            sendChatMessage={sendChatMessage}
            navigate={navigate}
            setActiveTab={setActiveTab}
            setSearchQuery={setSearchQuery}
            toggleFollowUser={toggleFollowUser}
          />
        </div>
      </div>

      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => { setIsPostModalOpen(false); setPostImage(null); }}
        newPost={newPost}
        setNewPost={setNewPost}
        postImage={postImage}
        setPostImage={setPostImage}
        onSubmit={handlePostSubmit}
        userProfile={userProfile}
        postFileRef={postFileRef}
        onFileRead={handleFileRead}
      />

      <CreateListingModal
        isOpen={isListingModalOpen}
        onClose={() => { setIsListingModalOpen(false); setListingImage(null); }}
        newListing={newListing}
        setNewListing={setNewListing}
        listingImage={listingImage}
        setListingImage={setListingImage}
        onSubmit={handleListingSubmit}
        showToast={showToast}
        listingFileRef={listingFileRef}
        onFileRead={handleFileRead}
      />

      <AskQuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => { setIsQuestionModalOpen(false); setNewQuestion({ title: '', body: '', category: 'General' }); }}
        newQuestion={newQuestion}
        setNewQuestion={setNewQuestion}
        onSubmit={handleQuestionSubmit}
      />

      <StoryViewer
        viewingStory={viewingStory}
        storyProgress={storyProgress}
        storyMessage={storyMessage}
        setStoryMessage={setStoryMessage}
        storyReacted={storyReacted}
        setStoryReacted={setStoryReacted}
        onClose={handleStoryClose}
        sendChatMessage={sendChatMessage}
        userProfile={userProfile}
        showToast={showToast}
      />

      <CreateStoryModal
        isOpen={isStoryModalOpen}
        onClose={() => { setIsStoryModalOpen(false); setNewStoryImage(null); }}
        newStoryImage={newStoryImage}
        setNewStoryImage={setNewStoryImage}
        onShare={handleStoryShare}
        storyFileRef={storyFileRef}
        onFileRead={handleFileRead}
      />

    </div>
  );
};

export default CommunityHub;
