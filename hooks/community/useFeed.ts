import { useState, useCallback, useRef, useEffect } from 'react';
import { ForumPost, ForumReply } from '@/types';
import { useFarm } from '@/contexts/FarmContext';

export function useFeed() {
  const { 
    userProfile, isSignedIn, posts, likedPostIds, bookmarkedPostIds,
    addPost, deletePost, getPostReplies, addPostReply, likePost, toggleBookmark,
    showToast, handleAuthRequiredAction
  } = useFarm();

  const [searchQuery, setSearchQuery] = useState('');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newPost, setNewPost] = useState<Partial<ForumPost>>({ title: '', category: 'General', author: userProfile.name, content: '' });
  const [postImage, setPostImage] = useState<string | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [activePostReplies, setActivePostReplies] = useState<ForumReply[]>([]);
  const [replyInput, setReplyInput] = useState('');
  const postFileRef = useRef<HTMLInputElement>(null);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRelativeTime = useCallback((dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  }, []);

  const handleFileRead = useCallback((file: File | undefined, callback: (result: string) => void) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.onerror = () => showToast("Failed to read file", "error");
      reader.readAsDataURL(file);
    }
  }, [showToast]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.content) return;
    await addPost({ 
      ...newPost, 
      title: newPost.title || newPost.content.substring(0, 30)+'...', 
      author: userProfile.name, 
      image: postImage 
    } as any);
    setIsPostModalOpen(false);
    setNewPost({ title: '', category: 'General', author: userProfile.name, content: '' });
    setPostImage(null);
  };

  const handlePostImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileRead(file, setPostImage);
    }
  };

  const handleDeletePost = (postId: string) => {
    handleAuthRequiredAction(() => deletePost(postId));
  };

  const handleReportPost = (postId: string) => {
    showToast("Post reported to moderators", "info");
  };

  const handlePostOptions = (post: ForumPost) => {
    if (post.author === userProfile.name) {
      handleDeletePost(post.id);
    } else {
      handleReportPost(post.id);
    }
  };

  const handleExpandPost = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  useEffect(() => {
    if (expandedPostId) {
      getPostReplies(expandedPostId).then(setActivePostReplies).catch(() => showToast("Failed to load comments", "error"));
    }
  }, [expandedPostId, getPostReplies, showToast]);

  const handleReplySubmit = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!replyInput.trim()) return;
    try {
      const res = await addPostReply(postId, replyInput);
      setActivePostReplies(res);
      setReplyInput('');
    } catch (err) {
      console.error(err);
      showToast('Failed to add reply', 'error');
    }
  };

  const handleLike = (postId: string) => {
    handleAuthRequiredAction(() => likePost(postId));
  };

  const handleBookmark = (postId: string) => {
    handleAuthRequiredAction(() => toggleBookmark(postId));
  };

  const handleShare = (post: ForumPost) => {
    const text = `${post.title} - ${post.content.slice(0, 100)}`;
    navigator.clipboard?.writeText(text)
      .then(() => showToast("Link copied to clipboard!", "success"))
      .catch(() => showToast("Share link copied!", "success"));
  };

  const handleCreateStory = () => {
    // This will be handled by useStories hook
  };

  return {
    // State
    searchQuery,
    setSearchQuery,
    isPostModalOpen,
    setIsPostModalOpen,
    newPost,
    setNewPost,
    postImage,
    setPostImage,
    expandedPostId,
    setExpandedPostId,
    activePostReplies,
    setActivePostReplies,
    replyInput,
    setReplyInput,
    postFileRef,
    filteredPosts,
    // Actions
    getRelativeTime,
    handleFileRead,
    handlePostSubmit,
    handlePostImageChange,
    handlePostOptions,
    handleExpandPost,
    handleReplySubmit,
    handleLike,
    handleBookmark,
    handleShare,
  };
}