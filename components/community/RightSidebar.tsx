import React, { useMemo } from 'react';
import { 
  Users, ShoppingBag, TrendingUp, UserPlus, CheckCircle, Plus, Globe,
  BadgeCheck, Leaf, Tractor, BookOpen, Handshake, BarChart2, ChevronRight,
  Cloud, Bell, DollarSign, Flame, Star, Target, Droplets, Sprout
} from 'lucide-react';
import { UserProfile, SystemAlert, MarketPrice, PollOption, SocialTrend, SuggestedUser } from '@/types';
import { Challenge, LocationAlerts } from './types';

interface RightSidebarProps {
  userProfile: UserProfile;
  isSignedIn: boolean;
  pollData: PollOption[];
  pollVoted: number | null;
  handlePollVote: (id: number) => void;
  trends: SocialTrend[];
  suggestedUsers: SuggestedUser[];
  followedUserIds: string[];
  alerts: SystemAlert[];
  marketPrices: MarketPrice[];
  challengeProgress: Record<string, number>;
  onJoinChallenge: (id: string) => void;
  onAuthRequiredAction: (action: () => void) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  sendChatMessage: (msg: any) => void;
  navigate: (tab: any) => void;
  setActiveTab: (tab: any) => void;
  setSearchQuery: (q: string) => void;
  toggleFollowUser: (id: string) => void;
}

const CHANNELS = [
  { id: 'general', name: 'General', desc: 'Main hub', icon: Globe },
  { id: 'crops', name: 'Crops Talk', desc: 'Planting & Seeds', icon: Leaf },
  { id: 'livestock', name: 'Livestock', desc: 'Herd health', icon: BadgeCheck },
  { id: 'equipment', name: 'Equipment', desc: 'Repairs & Sharing', icon: Tractor },
  { id: 'market-watch', name: 'Market Watch', desc: 'Prices & Trends', icon: TrendingUp },
  { id: 'knowledge', name: 'Knowledge Base', desc: 'Q&A & Tips', icon: BookOpen },
  { id: 'co-ops', name: 'Co-ops', desc: 'Organize & Buy', icon: Handshake },
];

const RightSidebar: React.FC<RightSidebarProps> = ({
  userProfile, isSignedIn, pollData, pollVoted, handlePollVote,
  trends, suggestedUsers, followedUserIds,
  alerts, marketPrices,
  challengeProgress, onJoinChallenge,
  onAuthRequiredAction, showToast, sendChatMessage, navigate,
  setActiveTab, setSearchQuery, toggleFollowUser,
}) => {
  const locationAlerts: LocationAlerts = useMemo(() => {
    const weatherAlerts = alerts.filter(a => a.category === 'WEATHER').slice(0, 2);
    const priceAlerts = marketPrices
      .filter(p => Math.abs(p.changePercentage) >= 5)
      .slice(0, 3)
      .map(p => ({
        id: `price-${p.cropName}`,
        title: `${p.cropName} Price ${p.trend === 'up' ? 'Surge' : 'Drop'}`,
        message: `${p.cropName} is ${p.trend === 'up' ? 'up' : 'down'} ${Math.abs(p.changePercentage).toFixed(1)}% this week`,
        severity: Math.abs(p.changePercentage) >= 10 ? 'high' as const : 'medium' as const
      }));
    return { weather: weatherAlerts, prices: priceAlerts };
  }, [alerts, marketPrices]);

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
                  <button onClick={() => onAuthRequiredAction(() => onJoinChallenge(ch.id))} className="ml-auto text-[10px] font-bold text-jade-600 dark:text-jade-400 hover:underline">Join</button>
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
              <img src={fm.avatar || '/stock/user.svg'} className="w-full h-full object-cover" alt={fm.name} />
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

  return (
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
                      <div className="w-9 h-9 rounded-full bg-[var(--bg-content)] overflow-hidden"><img src={person.img} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/stock/user.svg'; }} /></div>
                       <div><p className="text-sm font-bold text-[var(--text-primary)] leading-none hover:underline cursor-pointer" onClick={() => onAuthRequiredAction(() => toggleFollowUser(person.id))}>{person.name}</p><p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{person.role}</p></div>
                   </div>
                   <button onClick={() => onAuthRequiredAction(() => toggleFollowUser(person.id))} className={`p-1.5 rounded-full transition-colors ${followedUserIds.includes(person.id) ? 'bg-jade-100 text-jade-600' : 'bg-[var(--bg-content)] text-[var(--text-tertiary)] hover:bg-terra-300'}`}>{followedUserIds.includes(person.id) ? <CheckCircle className="w-4 h-4"/> : <Plus className="w-4 h-4"/>}</button>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default RightSidebar;
