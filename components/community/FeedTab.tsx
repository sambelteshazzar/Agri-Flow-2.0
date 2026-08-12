import React from 'react';
import { Avatar } from '@/utils/avatar';
import { getStockImage } from '@/utils/stockImages';
import { parseContent, renderParsedContent, ParsedContent } from '@/utils/parseContent';
import {
  Search, Plus, Image as ImageIcon, Camera, Heart, MessageCircle, Share2,
  Send, MoreHorizontal, Award, Shield, Cloud, Bell, DollarSign, TrendingUp, Bookmark,
  ChevronRight, Reply
} from 'lucide-react';
import { UserProfile, ForumPost, ForumReply, Story } from '@/types';
import { LocationAlerts } from './types';

interface FeedTabProps {
  localStories: Story[];
  viewingStory: Story | null;
  setViewingStory: (s: Story | null) => void;
  setIsStoryModalOpen: (v: boolean) => void;
  posts: ForumPost[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  expandedPostId: string | null;
  setExpandedPostId: (id: string | null) => void;
  activePostReplies: (ForumReply & { children?: (ForumReply & { children?: any[] })[] })[];
  replyInput: string;
  setReplyInput: (v: string) => void;
  likedPostIds: string[];
  bookmarkedPostIds: string[];
  userProfile: UserProfile;
  isSignedIn: boolean;
  avatarError: boolean;
  setAvatarError: (v: boolean) => void;
  likePost: (id: string) => void;
  toggleBookmark: (id: string) => void;
  addPostReply: (postId: string, content: string, parentReplyId?: string) => Promise<ForumReply[]>;
  setActivePostReplies: (replies: (ForumReply & { children?: any[] })[]) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  deletePost: (id: string) => void;
  updatePost: (id: string, updates: Partial<Omit<ForumPost, 'id' | 'replies' | 'likes' | 'date'>>) => Promise<void>;
  handleAuthRequiredAction: (action: () => void) => void;
  setIsPostModalOpen: (v: boolean) => void;
  getRelativeTime: (dateString: string) => string;
  locationAlerts: LocationAlerts;
  mobileRightSidebar: React.ReactNode;
  handlePostOptions: (post: ForumPost) => void;
  handleEditPost: (post: ForumPost) => void;
}

const ReplyTree: React.FC<{ 
  replies: (ForumReply & { children?: (ForumReply & { children?: any[] })[] })[];
  postId: string;
  addPostReply: (postId: string, content: string, parentReplyId?: string) => Promise<ForumReply[]>;
  setActivePostReplies: (replies: (ForumReply & { children?: any[] })[]) => void;
  replyInput: string;
  setReplyInput: (v: string) => void;
  getRelativeTime: (dateString: string) => string;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  isSignedIn: boolean;
  userProfile: UserProfile;
  handleAuthRequiredAction: (action: () => void) => void;
  depth?: number;
}> = ({ 
  replies, postId, addPostReply, setActivePostReplies, 
  replyInput, setReplyInput, getRelativeTime, showToast, 
  isSignedIn, userProfile, handleAuthRequiredAction, depth = 0 
}) => (
  <div className={`space-y-3 ${depth > 0 ? 'ml-8 border-l border-[var(--border-card)] pl-4' : ''}`}>
    {replies.map(reply => (
      <div key={reply.id}>
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--bg-content)] overflow-hidden shrink-0"><Avatar name={reply.author} size={32} /></div>
          <div className="flex-1 bg-[var(--bg-card)] p-3 rounded-2xl rounded-tl-none border border-[var(--border-card)] shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1">{reply.author} {reply.id.charCodeAt(reply.id.length - 1) % 3 === 0 && <Shield className="w-3 h-3 text-amber-500" />}</span>
              <span className="text-[10px] text-[var(--text-tertiary)]">{getRelativeTime(reply.date)}</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">{renderParsedContent(parseContent(reply.content))}</p>
            {isSignedIn && (
              <button 
                onClick={() => setReplyInput(`@${reply.author} `)} 
                className="mt-2 text-xs text-jade-600 dark:text-jade-400 hover:underline flex items-center gap-1"
              >
                <Reply className="w-3 h-3" /> Reply
              </button>
            )}
          </div>
        </div>
        {reply.children && reply.children.length > 0 && (
          <ReplyTree 
            replies={reply.children} 
            postId={postId}
            addPostReply={addPostReply}
            setActivePostReplies={setActivePostReplies}
            replyInput={replyInput}
            setReplyInput={setReplyInput}
            getRelativeTime={getRelativeTime}
            showToast={showToast}
            isSignedIn={isSignedIn}
            userProfile={userProfile}
            handleAuthRequiredAction={handleAuthRequiredAction}
            depth={depth + 1}
          />
        )}
      </div>
    ))}
  </div>
);

const FeedTab: React.FC<FeedTabProps> = ({
  localStories, viewingStory, setViewingStory, setIsStoryModalOpen,
  posts, searchQuery, setSearchQuery, expandedPostId, setExpandedPostId,
  activePostReplies, replyInput, setReplyInput, likedPostIds, bookmarkedPostIds,
  userProfile, isSignedIn, avatarError, setAvatarError,
  likePost, toggleBookmark, addPostReply, setActivePostReplies,
  showToast, deletePost, updatePost, handleAuthRequiredAction,
  setIsPostModalOpen, getRelativeTime, locationAlerts,
  mobileRightSidebar, handlePostOptions, handleEditPost,
}) => (
  <div className="space-y-6 pt-4 lg:pt-0">
     {/* Location Alerts */}
     {(locationAlerts.weather.length > 0 || locationAlerts.prices.length > 0) && (
       <div className="space-y-3 px-1">
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
     )}

      {/* Stories Row */}
      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar px-1">
         {localStories.map(story => (
           <div key={story.id} onClick={() => story.isUser ? setIsStoryModalOpen(true) : setViewingStory(story)} className="flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0 min-w-[70px]">
              <div className={`w-16 h-16 rounded-full p-[3px] transition-transform duration-200 group-hover:scale-105 ${story.isUser ? 'border-2 border-dashed border-[var(--text-tertiary)] dark:border-[var(--text-tertiary)]' : (story.hasUpdate ? 'bg-gradient-to-tr from-sunburst-400 to-red-500' : 'bg-[var(--bg-content)]')}`}>
                 <div className="w-full h-full rounded-full border-2 border-white dark:border-[var(--bg-card)] overflow-hidden bg-[var(--bg-content)] relative">
                    {story.isUser && <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-content)]"><Plus className="w-6 h-6 text-[var(--text-tertiary)]"/></div>}
                    <img src={story.img} alt={story.name} className={`w-full h-full object-cover ${story.isUser ? 'opacity-50' : ''}`} onError={(e) => { e.currentTarget.src = getStockImage('user'); }} />
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
               <Avatar name={userProfile.name} size={40} />
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
        {mobileRightSidebar}
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
                          <Avatar name={post.author} size={44} />
                       </div>
                      <div>
                         <h4 className="font-bold text-[var(--text-primary)] text-sm flex items-center gap-1">{post.author} {parseInt(post.id) % 3 === 0 && <Award className="w-3.5 h-3.5 text-amber-500" />}</h4>
                         <p className="text-xs text-[var(--text-secondary)] font-medium">{post.category} • {getRelativeTime(post.date)}</p>
                      </div>
                   </div>
                    <button onClick={() => handlePostOptions(post)} className="text-[var(--text-tertiary)] hover:bg-[var(--bg-content)] p-2 rounded-full" aria-label="Post options"><MoreHorizontal className="w-5 h-5"/></button>
                </div>
                
                <h5 className="font-bold text-[var(--text-primary)] mb-2">{post.title}</h5>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                  {renderParsedContent(parseContent(post.content))}
                </p>
                
                {(post.image || (parseInt(post.id) % 2 === 0)) && (
                  <div className="mb-4 rounded-2xl overflow-hidden h-64 bg-[var(--bg-content)] relative">
                     <img src={post.image || getStockImage('marketplace')} className="w-full h-full object-cover" alt="Content" onError={(e) => { e.currentTarget.src = getStockImage('marketplace'); }} />
                  </div>
                )}

<div className="flex justify-between items-center text-xs text-[var(--text-secondary)] font-semibold organic-divider pt-4 mt-2">
                    <div className="flex gap-4">
                        <button onClick={() => likePost(post.id)} className={`flex items-center gap-1.5 hover:text-red-500 transition-colors ${likedPostIds.includes(post.id) ? 'text-red-500' : ''}`} aria-label={`Like post (${post.likes} likes)`}><Heart className={`w-4 h-4 ${likedPostIds.includes(post.id) ? 'fill-current' : ''}`}/> {post.likes} Likes</button>
                        <button onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)} className="flex items-center gap-1.5 hover:text-blue-500 transition-colors" aria-label={`View comments (${post.replies} comments)`}><MessageCircle className="w-4 h-4"/> {post.replies} Comments</button>
                        <button onClick={() => handleAuthRequiredAction(() => toggleBookmark(post.id))} className={`flex items-center gap-1.5 hover:text-amber-500 transition-colors ${bookmarkedPostIds.includes(post.id) ? 'text-amber-600' : ''}`} aria-label="Bookmark post"><Bookmark className={`w-4 h-4 ${bookmarkedPostIds.includes(post.id) ? 'fill-current' : ''}`}/> Save</button>
                    </div>
                      <button onClick={() => { const text = `${post.title} - ${post.content.slice(0, 100)}`; navigator.clipboard?.writeText(text).then(() => showToast("Link copied to clipboard!", "success")).catch(() => showToast("Share link copied!", "success")); }} className="flex items-center gap-1.5 hover:text-jade-500 transition-colors" aria-label="Share post"><Share2 className="w-4 h-4"/> Share</button>
                </div>
             </div>
             
{expandedPostId === post.id && (
                <div className="bg-[var(--bg-content)] p-5 border-t border-[var(--border-card)]">
                   <div className="space-y-4 mb-4 max-h-60 overflow-y-auto custom-scrollbar">
                      <ReplyTree
                        replies={activePostReplies}
                        postId={post.id}
                        addPostReply={addPostReply}
                        setActivePostReplies={setActivePostReplies}
                        replyInput={replyInput}
                        setReplyInput={setReplyInput}
                        getRelativeTime={getRelativeTime}
                        showToast={showToast}
                        isSignedIn={isSignedIn}
                        userProfile={userProfile}
                        handleAuthRequiredAction={handleAuthRequiredAction}
                      />
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
);

export default FeedTab;
