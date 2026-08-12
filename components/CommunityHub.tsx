import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import { CommunityTab, LocationAlerts } from './community/types';
import { CHANNELS } from '../constants/community';
import { useLocationAlerts } from '../hooks/useLocationAlerts';
import { useCommunity } from '../contexts/CommunityContext';
import { useFeed } from '../hooks/community/useFeed';
import { useQA } from '../hooks/community/useQA';
import { useMarket } from '../hooks/community/useMarket';
import { useChat } from '../hooks/community/useChat';
import { useStories } from '../hooks/community/useStories';
import { useSidebar } from '../hooks/community/useSidebar';
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
    listings, posts, chatMessages, stories: contextStories, trends, suggestedUsers, followedUserIds, likedPostIds, bookmarkedPostIds,
    questions, likedQuestionIds,
    addListing, markListingSold, addPost, deletePost, updatePost, getPostReplies, addPostReply, likePost, toggleBookmark,
    sendChatMessage, toggleFollowUser,
    // Q&A
    addQuestion, addAnswer, toggleQuestionLike, toggleAnswerAccepted,
    showToast, weather, alerts, marketPrices,
    pollData, pollVoted, handlePollVote,
    navigate
  } = useFarm();

  const community = useCommunity();

  const [showIntro, setShowIntro] = useState(() => !localStorage.getItem('agriflow_community_intro_dismissed'));
  const [activeTab, setActiveTab] = useState<CommunityTab>('FEED');
  const [avatarError, setAvatarError] = useState(false);
  const [introBgError, setIntroBgError] = useState(false);

  // Use hooks
  const feed = useFeed();
  const qa = useQA();
  const market = useMarket();
  const chat = useChat();
  const stories = useStories();
  const sidebar = useSidebar();

  const locationAlerts = useLocationAlerts(alerts, marketPrices);

  const filteredQuestions = useMemo(() => {
    let result = questions;
    if (qa.qaCategoryFilter !== 'ALL') {
      result = result.filter(q => q.category === qa.qaCategoryFilter);
    }
    if (qa.qaSearchQuery) {
      const q = qa.qaSearchQuery.toLowerCase();
      result = result.filter(quest => 
        quest.title.toLowerCase().includes(q) || 
        quest.body.toLowerCase().includes(q) || 
        quest.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [questions, qa.qaSearchQuery, qa.qaCategoryFilter]);

  const tabConfig: { key: CommunityTab; label: string; icon: React.ElementType; color: string; desktopLabel: string }[] = [
    { key: 'FEED', label: 'Feed', icon: LayoutGrid, color: 'field', desktopLabel: 'Global Feed' },
    { key: 'GROUPS', label: 'Groups', icon: Users2, color: 'field', desktopLabel: 'Discussion Groups' },
    { key: 'MARKET', label: 'Market', icon: ShoppingBag, color: 'green', desktopLabel: 'Marketplace' },
    { key: 'QA', label: 'Q&A', icon: HelpCircle, color: 'harvest', desktopLabel: 'Q&A Hub' },
  ];

  return (
    <div className="h-full w-full relative overflow-hidden bg-[var(--bg-app)]">
      {/* INTRO OVERLAY */}
      {showIntro && (
        <IntroOverlay 
          onDismiss={() => {
            localStorage.setItem('agriflow_community_intro_dismissed', 'true');
            setShowIntro(false);
          }}
        />
      )}

      {/* MOBILE TABS */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-jade-950/95 backdrop-blur-xl border-t border-terra-200/50 dark:border-jade-800/50 safe-area-bottom shadow-[0_-4px_20px_rgba(58,39,25,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col">
          <div className="flex items-center justify-around h-12 px-2">
            {tabConfig.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all rounded-xl ${
                    isActive ? 'text-jade-600 dark:text-jade-400' : 'text-terra-400 dark:text-jade-500'
                  }`}
                >
                  <div className={`relative p-1.5 rounded-xl transition-all ${isActive ? 'bg-jade-50 dark:bg-jade-900/30' : ''}`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                    {isActive && <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-jade-500 shadow-sm shadow-jade-500/50" />}
                  </div>
                  <span className={`text-[10px] font-medium ${isActive ? 'text-jade-600 dark:text-jade-400 font-semibold' : ''}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex h-full w-full overflow-hidden">
        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative md:pb-0">
          {/* TOP HEADER */}
          <header className="h-16 bg-white/80 dark:bg-[#12261A]/80 backdrop-blur-xl border-b border-terra-200/60 dark:border-[#1E5A47]/60 shrink-0 flex items-center justify-between px-4 md:px-8 z-20 transition-colors">
            <div className="flex items-center">
              <button
                onClick={() => setActiveTab('FEED')}
                className="md:hidden p-2 text-terra-600 dark:text-[#7BA896] hover:bg-terra-100 dark:hover:bg-[#163D2F] rounded-xl mr-3 focus:outline-none"
                aria-label="Open Navigation Menu"
              >
                <Hash className="w-6 h-6" aria-hidden="true" />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-primary-dynamic tracking-tight font-heading">
                  {tabConfig.find(t => t.key === activeTab)?.desktopLabel || 'Community'}
                </h1>
                <p className="text-[10px] md:text-xs text-jade-600 dark:text-jade-400 font-medium hidden md:block">
                  Connect, learn, and grow together
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terra-400 dark:text-jade-500" />
                <input
                  type="text"
                  value={community.searchQuery}
                  onChange={e => community.setSearchQuery(e.target.value)}
                  placeholder="Search community..."
                  className="w-64 md:w-80 pl-10 pr-4 py-2 bg-terra-50 dark:bg-[#163D2F] border border-terra-200 dark:border-[#1E5A47] rounded-xl text-sm focus:outline-none focus:border-jade-500 transition-colors"
                />
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <main className="flex-1 overflow-auto p-4 md:p-8 bg-content dark:bg-[#0A1A0F] transition-colors custom-scrollbar">
            <div className="max-w-7xl mx-auto h-full animate-page-enter">
              <div className="flex h-full gap-8">
                {/* LEFT CONTENT */}
                <div className="flex-1 min-w-0">
                  {activeTab === 'FEED' && (
                    <FeedTab
                      userProfile={userProfile}
                      isSignedIn={isSignedIn}
                      posts={feed.filteredPosts}
                      likedPostIds={likedPostIds}
                      bookmarkedPostIds={bookmarkedPostIds}
                      expandedPostId={community.expandedPostId}
                      setExpandedPostId={community.setExpandedPostId}
                      activePostReplies={community.activePostReplies}
                      setActivePostReplies={community.setActivePostReplies}
                      replyInput={community.replyInput}
                      setReplyInput={community.setReplyInput}
                      newPost={community.newPost}
                      setNewPost={community.setNewPost}
                      postImage={community.postImage}
                      setPostImage={community.setPostImage}
                      isPostModalOpen={community.isPostModalOpen}
                      setIsPostModalOpen={community.setIsPostModalOpen}
                      onLikePost={feed.handleLike}
                      onBookmarkPost={feed.handleBookmark}
                      onSharePost={feed.handleShare}
                      onDeletePost={feed.handleDeletePost}
                      onReportPost={feed.handleReportPost}
                      onExpandPost={feed.handleExpandPost}
                      onReplySubmit={feed.handleReplySubmit}
                      getRelativeTime={feed.getRelativeTime}
                      handleFileRead={feed.handleFileRead}
                      postFileRef={community.postFileRef}
                      handlePostSubmit={feed.handlePostSubmit}
                      handlePostImageChange={feed.handlePostImageChange}
                      searchQuery={community.searchQuery}
                      setSearchQuery={community.setSearchQuery}
                      handleAuthRequiredAction={useFarm().handleAuthRequiredAction}
                      onCreateStory={() => stories.setIsStoryModalOpen(true)}
                      handlePostOptions={feed.handlePostOptions}
                      handleEditPost={feed.handleEditPost}
                      updatePost={updatePost}
                    />
                  )}

                  {activeTab === 'GROUPS' && (
                    <ChatTab
                      channels={chat.CHANNELS}
                      activeChannel={chat.activeChannel}
                      setActiveChannel={chat.handleChannelChange}
                      chatMessages={chat.channelMessages}
                      chatInput={chat.chatInput}
                      setChatInput={chat.setChatInput}
                      userProfile={userProfile}
                      onSendChatMessage={async (msg) => {
                        await sendChatMessage(msg);
                        chat.triggerTyping();
                      }}
                      chatEndRef={chat.chatEndRef}
                      typingUser={chat.typingUser}
                      getRelativeTime={chat.getRelativeTime}
                      handleAuthRequiredAction={useFarm().handleAuthRequiredAction}
                    />
                  )}

                  {activeTab === 'MARKET' && (
                    <MarketTab
                      userProfile={userProfile}
                      isSignedIn={isSignedIn}
                      listings={market.filteredListings}
                      searchQuery={market.searchQuery}
                      setSearchQuery={market.setSearchQuery}
                      typeFilter={market.typeFilter}
                      setTypeFilter={market.setTypeFilter}
                      isListingModalOpen={market.isListingModalOpen}
                      setIsListingModalOpen={market.setIsListingModalOpen}
                      newListing={market.newListing}
                      setNewListing={market.setNewListing}
                      listingImage={market.listingImage}
                      setListingImage={market.setListingImage}
                      onListingSubmit={market.handleListingSubmit}
                      onListingImageChange={market.handleListingImageChange}
                      onMarkSold={market.handleMarkSold}
                      onContactSeller={market.handleContactSeller}
                      handleAuthRequiredAction={useFarm().handleAuthRequiredAction}
                      listingFileRef={market.listingFileRef}
                    />
                  )}

                  {activeTab === 'QA' && (
                    <QATab
                      questions={questions}
                      filteredQuestions={filteredQuestions}
                      expandedQuestionId={qa.expandedQuestionId}
                      setExpandedQuestionId={qa.setExpandedQuestionId}
                      newAnswer={qa.newAnswer}
                      setNewAnswer={qa.setNewAnswer}
                      isSignedIn={isSignedIn}
                      userProfile={userProfile}
                      qaSearchQuery={qa.qaSearchQuery}
                      setQaSearchQuery={qa.setQaSearchQuery}
                      qaCategoryFilter={qa.qaCategoryFilter}
                      setQaCategoryFilter={qa.setQaCategoryFilter}
                      onLikeQuestion={qa.handleLikeQuestion}
                      onAcceptAnswer={qa.handleAcceptAnswer}
                      onAnswerSubmit={qa.handleAnswerSubmit}
                      setIsQuestionModalOpen={qa.setIsQuestionModalOpen}
                      handleAuthRequiredAction={useFarm().handleAuthRequiredAction}
                      getRelativeTime={qa.getRelativeTime}
                      QA_CATEGORIES={qa.QA_CATEGORIES}
                      newQuestion={qa.newQuestion}
                      setNewQuestion={qa.setNewQuestion}
                      isQuestionModalOpen={qa.isQuestionModalOpen}
                      handleQuestionSubmit={qa.handleQuestionSubmit}
                    />
                  )}
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="hidden lg:block w-80 flex-shrink-0">
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
                    challengeProgress={sidebar.challengeProgress}
                    onJoinChallenge={sidebar.handleJoinChallenge}
                    onAuthRequiredAction={sidebar.handleAuthRequiredAction}
                    showToast={showToast}
                    sendChatMessage={sendChatMessage}
                    navigate={navigate}
                    setActiveTab={setActiveTab}
                    setSearchQuery={community.setSearchQuery}
                    toggleFollowUser={toggleFollowUser}
                    locationAlerts={sidebar.locationAlerts}
                    SEASONAL_CHALLENGES={sidebar.SEASONAL_CHALLENGES}
                    FARMER_MATCHES={sidebar.FARMER_MATCHES}
                    handleFollowUser={sidebar.handleFollowUser}
                    handleMessageUser={sidebar.handleMessageUser}
                    handleTrendingTopicClick={sidebar.handleTrendingTopicClick}
                  />
                </div>
              </div>
            </div>
          </main>

          {/* MODALS */}
          {community.isPostModalOpen && (
            <CreatePostModal
              isOpen={community.isPostModalOpen}
              onClose={() => { community.setIsPostModalOpen(false); community.setEditingPostId(null); }}
              onSubmit={feed.handlePostSubmit}
              newPost={community.newPost}
              setNewPost={community.setNewPost}
              postImage={community.postImage}
              setPostImage={community.setPostImage}
              handleImageChange={feed.handlePostImageChange}
              postFileRef={community.postFileRef}
              editPostId={community.editingPostId}
              onUpdatePost={updatePost}
            />
          )}

          {community.isListingModalOpen && (
            <CreateListingModal
              isOpen={community.isListingModalOpen}
              onClose={() => community.setIsListingModalOpen(false)}
              onSubmit={market.handleListingSubmit}
              newListing={market.newListing}
              setNewListing={market.setNewListing}
              listingImage={market.listingImage}
              setListingImage={market.setListingImage}
              handleImageChange={market.handleListingImageChange}
              listingFileRef={market.listingFileRef}
            />
          )}

          {qa.isQuestionModalOpen && (
            <AskQuestionModal
              isOpen={qa.isQuestionModalOpen}
              onClose={() => qa.setIsQuestionModalOpen(false)}
              onSubmit={qa.handleQuestionSubmit}
              newQuestion={qa.newQuestion}
              setNewQuestion={qa.setNewQuestion}
              QA_CATEGORIES={qa.QA_CATEGORIES}
            />
          )}

          {community.isStoryModalOpen && (
            <CreateStoryModal
              isOpen={community.isStoryModalOpen}
              onClose={() => community.setIsStoryModalOpen(false)}
              onSubmit={stories.handleStorySubmit}
              newStoryImage={community.newStoryImage}
              setNewStoryImage={community.setNewStoryImage}
              handleImageChange={stories.handleStoryImageChange}
              storyFileRef={community.storyFileRef}
            />
          )}

          {stories.viewingStory && (
            <StoryViewer
              viewingStory={stories.viewingStory}
              storyProgress={stories.storyProgress}
              storyMessage={stories.storyMessage}
              setStoryMessage={stories.setStoryMessage}
              storyReacted={stories.storyReacted}
              setStoryReacted={stories.setStoryReacted}
              onClose={stories.handleStoryClose}
              sendChatMessage={sendChatMessage}
              userProfile={userProfile}
              showToast={showToast}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityHub;