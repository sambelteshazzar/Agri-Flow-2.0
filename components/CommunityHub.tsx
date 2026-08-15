import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  ShoppingBag,
  Hash,
  LayoutGrid, Users2,
  HelpCircle,
  Users,
  MessageSquare,
  Sparkles,
  Shield,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { useFarm } from '../contexts/FarmContext';
import { NavigationTab } from '../types';
import { CommunityTab } from './community/types';
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
    listings, posts, trends, suggestedUsers, followedUserIds, likedPostIds, bookmarkedPostIds,
    questions,
    deletePost, updatePost, addPostReply, likePost, toggleBookmark,
    sendChatMessage, toggleFollowUser,
    addQuestion, addAnswer, toggleQuestionLike, toggleAnswerAccepted,
    showToast, alerts, marketPrices,
    pollData, pollVoted, handlePollVote,
    navigate,
    handleAuthRequiredAction,
  } = useFarm();

  const community = useCommunity();

  const [showIntro, setShowIntro] = useState(() => !localStorage.getItem('agriflow_community_intro_dismissed'));
  const [activeTab, setActiveTab] = useState<CommunityTab>('FEED');

  // Use hooks — each owns its slice of state and actions
  const feed = useFeed();
  const qa = useQA();
  const market = useMarket();
  const chat = useChat();
  const stories = useStories();
  const sidebar = useSidebar();

  // Mobile-only inline preview of the right sidebar (the desktop sidebar is
  // rendered separately below). FeedTab injects this ReactNode under the
  // "Create Post" widget so mobile users see polls/challenges inline.
  const mobileRightSidebar = (
    <div className="lg:hidden">
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
        onAuthRequiredAction={handleAuthRequiredAction}
        showToast={showToast}
        sendChatMessage={sendChatMessage}
        navigate={navigate}
        setActiveTab={(tab: CommunityTab) => setActiveTab(tab)}
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
  );

  const tabConfig: { key: CommunityTab; label: string; icon: React.ElementType; color: string; desktopLabel: string }[] = [
    { key: 'FEED', label: 'Feed', icon: LayoutGrid, color: 'field', desktopLabel: 'Global Feed' },
    { key: 'GROUPS', label: 'Groups', icon: Users2, color: 'field', desktopLabel: 'Discussion Groups' },
    { key: 'MARKET', label: 'Market', icon: ShoppingBag, color: 'green', desktopLabel: 'Marketplace' },
    { key: 'QA', label: 'Q&A', icon: HelpCircle, color: 'harvest', desktopLabel: 'Q&A Hub' },
  ];

  // Login preview shown when not signed in
  const LoginPreview: React.FC = () => (
    <div className="flex flex-col h-full items-center justify-center px-6 text-center bg-[var(--bg-app)]">
      <div className="max-w-2xl mx-auto space-y-8 animate-page-enter">
        {/* Logo & Brand */}
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-jade-500 to-sunburst-500 flex items-center justify-center shadow-xl shadow-jade-500/25">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-[var(--text-primary)] tracking-tight">
            Join the Farming Community
          </h1>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
            Connect with fellow farmers, share insights, ask questions, and grow together.
            The community is where knowledge meets experience.
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {[
            { icon: MessageSquare, title: 'Discussion Feed', desc: 'Share crop updates, ask questions, and get advice from farmers worldwide' },
            { icon: Users, title: 'Groups & Chat', desc: 'Join regional groups, crop-specific discussions, and direct message peers' },
            { icon: ShoppingBag, title: 'Marketplace', desc: 'Buy and sell equipment, seeds, produce, and livestock locally' },
            { icon: HelpCircle, title: 'Q&A Hub', desc: 'Post technical questions and get verified answers from experts' },
            { icon: Sparkles, title: 'Stories & Polls', desc: 'Daily farming stories, seasonal challenges, and community polls' },
            { icon: Shield, title: 'Verified Profiles', desc: 'Connect with verified farmers and agricultural extension officers' },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-4 card-surface rounded-2xl border border-[var(--border-card)] hover:border-jade-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-jade-50 dark:bg-jade-900/30 flex items-center justify-center shrink-0">
                <item.icon className="w-6 h-6 text-jade-600 dark:text-jade-400" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => handleAuthRequiredAction(() => navigate(NavigationTab.SETTINGS))}
            className="group flex items-center justify-center gap-2 px-8 py-3.5 bg-jade-600 hover:bg-jade-700 text-white rounded-xl font-semibold text-base shadow-lg shadow-jade-500/25 transition-all active:scale-[0.98]"
          >
            <Lock className="w-5 h-5" />
            Sign In to Join
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => handleAuthRequiredAction(() => navigate(NavigationTab.SETTINGS))}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[var(--bg-card)] hover:bg-[var(--bg-content)] text-[var(--text-primary)] border border-[var(--border-card)] rounded-xl font-semibold text-base transition-all active:scale-[0.98]"
          >
            <Users className="w-5 h-5" />
            Create Account
          </button>
        </div>

        <p className="text-sm text-[var(--text-tertiary)]">
          By joining, you agree to our Community Guidelines and Terms of Service.
        </p>
      </div>
    </div>
  );

  return (
    <div className="h-full w-full relative overflow-hidden bg-[var(--bg-app)]">
      {/* INTRO OVERLAY */}
      {showIntro && (
        <IntroOverlay
          showIntro={showIntro}
          onDismiss={() => {
            localStorage.setItem('agriflow_community_intro_dismissed', 'true');
            setShowIntro(false);
          }}
        />
      )}

      {/* MOBILE TABS - only show when signed in */}
      {isSignedIn && (
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
      )}

      <div className="flex h-full w-full overflow-hidden">
        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative md:pb-0">
          {/* TOP HEADER */}
          <header className="h-16 bg-white/80 dark:bg-[#12261A]/80 backdrop-blur-xl border-b border-terra-200/60 dark:border-[#1E5A47]/60 shrink-0 flex items-center justify-between px-4 md:px-8 z-20 transition-colors">
            <div className="flex items-center">
              {isSignedIn && (
                <button
                  onClick={() => setActiveTab('FEED')}
                  className="md:hidden p-2 text-terra-600 dark:text-[#7BA896] hover:bg-terra-100 dark:hover:bg-[#163D2F] rounded-xl mr-3 focus:outline-none"
                  aria-label="Open Navigation Menu"
                >
                  <Hash className="w-6 h-6" aria-hidden="true" />
                </button>
              )}
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-primary-dynamic tracking-tight font-heading">
                  {isSignedIn 
                    ? (tabConfig.find(t => t.key === activeTab)?.desktopLabel || 'Community')
                    : 'Community'
                  }
                </h1>
                <p className="text-[10px] md:text-xs text-jade-600 dark:text-jade-400 font-medium hidden md:block">
                  {isSignedIn ? 'Connect, learn, and grow together' : 'Join farmers worldwide to share, learn, and grow'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-5">
              {isSignedIn && (
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
              )}
            </div>
          </header>

          {/* CONTENT */}
          <main className="flex-1 overflow-auto p-4 md:p-8 bg-content dark:bg-[#0A1A0F] transition-colors custom-scrollbar">
            <div className="max-w-7xl mx-auto h-full animate-page-enter">
              {isSignedIn ? (
                <div className="flex h-full gap-8">
                  {/* LEFT CONTENT */}
                  <div className="flex-1 min-w-0">
                    {activeTab === 'FEED' && (
                      <FeedTab
                        localStories={stories.allStories}
                        viewingStory={stories.viewingStory}
                        setViewingStory={stories.setViewingStory}
                        setIsStoryModalOpen={stories.setIsStoryModalOpen}
                        posts={feed.filteredPosts}
                        searchQuery={community.searchQuery}
                        setSearchQuery={feed.setSearchQuery}
                        expandedPostId={feed.expandedPostId}
                        setExpandedPostId={feed.setExpandedPostId}
                        activePostReplies={feed.activePostReplies}
                        replyInput={feed.replyInput}
                        setReplyInput={feed.setReplyInput}
                        likedPostIds={likedPostIds}
                        bookmarkedPostIds={bookmarkedPostIds}
                        userProfile={userProfile}
                        isSignedIn={isSignedIn}
                        avatarError={false}
                        setAvatarError={() => {}}
                        likePost={feed.handleLike}
                        toggleBookmark={feed.handleBookmark}
                        addPostReply={addPostReply}
                        setActivePostReplies={feed.setActivePostReplies}
                        showToast={showToast}
                        deletePost={(id: string) => { handleAuthRequiredAction(() => deletePost(id)); }}
                        updatePost={updatePost}
                        handleAuthRequiredAction={handleAuthRequiredAction}
                        setIsPostModalOpen={feed.setIsPostModalOpen}
                        getRelativeTime={feed.getRelativeTime}
                        locationAlerts={sidebar.locationAlerts}
                        mobileRightSidebar={mobileRightSidebar}
                        handlePostOptions={feed.handlePostOptions}
                        handleEditPost={feed.handleEditPost}
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
                        onSendChatMessage={sendChatMessage}
                        chatEndRef={chat.chatEndRef}
                      />
                    )}

                    {activeTab === 'MARKET' && (
                      <MarketTab
                        listings={market.filteredListings}
                        userProfile={userProfile}
                        onAuthRequiredAction={handleAuthRequiredAction}
                        onMarkSold={market.handleMarkSold}
                        setIsListingModalOpen={market.setIsListingModalOpen}
                        onContactSeller={market.handleContactSeller}
                        getRelativeTime={feed.getRelativeTime}
                        showToast={showToast}
                      />
                    )}

                    {activeTab === 'QA' && (
                      <QATab
                        questions={questions}
                        filteredQuestions={qa.filteredQuestions}
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
                        handleAuthRequiredAction={handleAuthRequiredAction}
                        getRelativeTime={qa.getRelativeTime}
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
                      onAuthRequiredAction={handleAuthRequiredAction}
                      showToast={showToast}
                      sendChatMessage={sendChatMessage}
                      navigate={navigate}
                      setActiveTab={(tab: CommunityTab) => setActiveTab(tab)}
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
              ) : (
                <LoginPreview />
              )}
            </div>
          </main>

          {/* MODALS - only render when signed in */}
          {isSignedIn && (
            <>
              {feed.isPostModalOpen && (
                <CreatePostModal
                  isOpen={feed.isPostModalOpen}
                  onClose={() => { feed.setIsPostModalOpen(false); community.setEditingPostId(null); }}
                  newPost={feed.newPost}
                  setNewPost={feed.setNewPost}
                  postImage={feed.postImage}
                  setPostImage={feed.setPostImage}
                  onSubmit={feed.handlePostSubmit}
                  userProfile={userProfile}
                  postFileRef={feed.postFileRef}
                  onFileRead={feed.handleFileRead}
                  editPostId={community.editingPostId ?? undefined}
                  onUpdatePost={updatePost}
                />
              )}

              {market.isListingModalOpen && (
                <CreateListingModal
                  isOpen={market.isListingModalOpen}
                  onClose={() => market.setIsListingModalOpen(false)}
                  newListing={market.newListing}
                  setNewListing={market.setNewListing}
                  listingImage={market.listingImage}
                  setListingImage={market.setListingImage}
                  onSubmit={market.handleListingSubmit}
                  showToast={showToast}
                  listingFileRef={market.listingFileRef}
                  onFileRead={market.handleFileRead}
                />
              )}

              {qa.isQuestionModalOpen && (
                <AskQuestionModal
                  isOpen={qa.isQuestionModalOpen}
                  onClose={() => qa.setIsQuestionModalOpen(false)}
                  newQuestion={qa.newQuestion}
                  setNewQuestion={qa.setNewQuestion}
                  onSubmit={qa.handleQuestionSubmit}
                />
              )}

              {stories.isStoryModalOpen && (
                <CreateStoryModal
                  isOpen={stories.isStoryModalOpen}
                  onClose={() => stories.setIsStoryModalOpen(false)}
                  newStoryImage={stories.newStoryImage}
                  setNewStoryImage={stories.setNewStoryImage}
                  onShare={stories.handleStorySubmit}
                  storyFileRef={stories.storyFileRef}
                  onFileRead={stories.handleFileRead}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityHub;