import React, { useMemo } from 'react';
import { 
  Users, ShoppingBag, TrendingUp, UserPlus, CheckCircle, Plus,
  BarChart2, ChevronRight, Cloud, Bell, DollarSign, Flame, Star, Target, Droplets, Sprout
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
  locationAlerts: LocationAlerts;
  SEASONAL_CHALLENGES: Challenge[];
  FARMER_MATCHES: any[];
  handleFollowUser: (userId: string) => void;
  handleMessageUser: (user: SuggestedUser) => void;
  handleTrendingTopicClick: (tag: string) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  userProfile, isSignedIn, pollData, pollVoted, handlePollVote,
  trends, suggestedUsers, followedUserIds,
  alerts, marketPrices,
  challengeProgress, onJoinChallenge,
  onAuthRequiredAction, showToast, sendChatMessage, navigate,
  setActiveTab, setSearchQuery, toggleFollowUser,
  locationAlerts, SEASONAL_CHALLENGES, FARMER_MATCHES,
  handleFollowUser, handleMessageUser, handleTrendingTopicClick,
}) => {
  // All computed values now come from props
  
  return (
    <div className="flex flex-col gap-6">
      {/* POLL */}
      <div className="bg-jade-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden shrink-0">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-xs flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-sunburst-400"/> Community Poll
            </h4>
          </div>
          <p className="text-sm font-bold mb-4 leading-snug">What's your main strategy for the 2026 dry season?</p>
          <div className="space-y-2">
            {pollData.map((opt) => (
              <button 
                key={opt.id} 
                onClick={() => handlePollVote(opt.id)} 
                disabled={pollVoted !== null} 
                className="w-full relative h-10 rounded-lg overflow-hidden group border border-white/10"
              >
                <div className={`absolute inset-0 bg-white/5 transition-colors ${pollVoted === opt.id ? 'bg-white/10' : ''}`}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-sunburst-500 to-sunburst-600 transition-all duration-1000 ease-out opacity-80" style={{ '--progress': pollVoted ? opt.percent : 0 } as React.CSSProperties}></div>
                <div className="absolute inset-0 flex items-center justify-between px-3">
                  <span className="text-xs font-medium relative z-10 text-white shadow-black drop-shadow-sm">{opt.text}</span>
                  {pollVoted && <span className="text-xs font-bold text-white shadow-black drop-shadow-md animate-fade-in">{opt.percent}%</span>}
                </div>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-jade-400 mt-4 text-center">{pollData.reduce((a,b) => a + b.votes, 0).toLocaleString()} votes • 12h left</p>
        </div>
      </div>

      {/* SEASONAL CHALLENGES */}
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
                    <div className="h-full bg-gradient-to-r from-jade-400 to-jade-500 rounded-full transition-all duration-500" style={{ '--progress': isJoined ? Math.min(ch.progress + 15, 100) : 0 } as React.CSSProperties}></div>
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

      {/* FARMER MATCHES */}
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

      {/* TRENDING TOPICS */}
      <div className="card-surface p-6 shrink-0">
        <h4 className="font-bold text-[var(--text-primary)] text-xs mb-4 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2 text-blue-500"/> Trending Topics
        </h4>
        <div className="space-y-4">
          {trends.map((topic, i) => (
            <div key={i} className="flex justify-between items-center group cursor-pointer" onClick={() => handleTrendingTopicClick(topic.tag)}>
              <div>
                <p className="text-sm font-bold text-[var(--text-secondary)] group-hover:text-blue-600 transition-colors">{topic.tag}</p>
                <p className="text-[10px] text-[var(--text-tertiary)] font-medium">{topic.volume}</p>
              </div>
              <div className="w-6 h-6 rounded-full bg-[var(--bg-content)] flex items-center justify-center text-[var(--text-tertiary)] group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                <ChevronRight className="w-4 h-4"/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WHO TO FOLLOW */}
      <div id="suggested-users-section" className="card-surface p-6 shrink-0">
        <h4 className="font-bold text-[var(--text-primary)] text-xs mb-4 flex items-center">
          <UserPlus className="w-4 h-4 mr-2 text-jade-500"/> Who to follow
        </h4>
        <div className="space-y-5">
          {suggestedUsers.map((person) => (
            <div key={person.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--bg-content)] overflow-hidden">
                  <img src={person.img} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/stock/user.svg'; }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--text-primary)] leading-none hover:underline cursor-pointer" onClick={() => onAuthRequiredAction(() => toggleFollowUser(person.id))}>{person.name}</p>
                  <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{person.role}</p>
                </div>
              </div>
              <button 
                onClick={() => onAuthRequiredAction(() => toggleFollowUser(person.id))} 
                className={`p-1.5 rounded-full transition-colors ${followedUserIds.includes(person.id) ? 'bg-jade-100 text-jade-600' : 'bg-[var(--bg-content)] text-[var(--text-tertiary)] hover:bg-terra-300'}`}
                aria-label={followedUserIds.includes(person.id) ? `Unfollow ${person.name}` : `Follow ${person.name}`}
              >
                {followedUserIds.includes(person.id) ? <CheckCircle className="w-4 h-4"/> : <Plus className="w-4 h-4"/>}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;