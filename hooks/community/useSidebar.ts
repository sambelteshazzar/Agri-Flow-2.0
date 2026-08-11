import { useState, useCallback, useMemo } from 'react';
import { Challenge, LocationAlerts } from '@/components/community/types';
import { SystemAlert, MarketPrice, PollOption, SocialTrend, SuggestedUser, UserProfile } from '@/types';
import { useLocationAlerts } from '../../hooks/useLocationAlerts';
import { useFarm } from '@/contexts/FarmContext';
import { Target, Droplets, Sprout, DollarSign } from 'lucide-react';

export function useSidebar() {
  const { 
    userProfile, pollData, pollVoted, handlePollVote,
    trends, suggestedUsers, followedUserIds,
    alerts, marketPrices,
    toggleFollowUser, sendChatMessage, navigate,
    showToast, handleAuthRequiredAction
  } = useFarm();

  const [challengeProgress, setChallengeProgress] = useState<Record<string, number>>({});

  const locationAlerts = useLocationAlerts(alerts, marketPrices);

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

  const handleJoinChallenge = (id: string) => {
    if (challengeProgress[id] !== undefined) return;
    setChallengeProgress(prev => ({ ...prev, [id]: 10 }));
    showToast('Joined challenge! Check back for progress.', 'success');
  };

  const handleTrendingTopicClick = (tag: string) => {
    navigate('FEED');
    // The search query will be set by the parent
  };

  const handleFollowUser = (userId: string) => {
    handleAuthRequiredAction(() => toggleFollowUser(userId));
  };

  const handleMessageUser = (user: SuggestedUser) => {
    handleAuthRequiredAction(() => {
      sendChatMessage({
        channelId: 'general',
        author: userProfile.name,
        text: `Hi ${user.name}!`,
        avatar: userProfile.avatar,
        isMe: true,
      });
      showToast(`Message sent to ${user.name}`, 'success');
    });
  };

  return {
    // State
    challengeProgress,
    setChallengeProgress,
    locationAlerts,
    SEASONAL_CHALLENGES,
    FARMER_MATCHES,
    // Actions
    handleJoinChallenge,
    handleTrendingTopicClick,
    handleFollowUser,
    handleMessageUser,
  };
}