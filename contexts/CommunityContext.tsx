import React, { createContext, useContext, useState, useCallback, useMemo, useRef, ReactNode } from 'react';
import { useFarm } from '@/contexts/FarmContext';

interface CommunityContextType {
  // Shared state
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  // Modals
  isPostModalOpen: boolean;
  setIsPostModalOpen: (v: boolean) => void;
  isListingModalOpen: boolean;
  setIsListingModalOpen: (v: boolean) => void;
  isQuestionModalOpen: boolean;
  setIsQuestionModalOpen: (v: boolean) => void;
  isStoryModalOpen: boolean;
  setIsStoryModalOpen: (v: boolean) => void;
  
  // Story state
  viewingStory: any;
  setViewingStory: (s: any) => void;
  storyMessage: string;
  setStoryMessage: (s: string) => void;
  storyReacted: boolean;
  setStoryReacted: (v: boolean) => void;
  storyProgress: number;
  setStoryProgress: (v: number) => void;
  newStoryImage: string | null;
  setNewStoryImage: (s: string | null) => void;
  localStories: any[];
  setLocalStories: (s: any[]) => void;
  
  // Chat state
  activeChannel: string;
  setActiveChannel: (c: string) => void;
  chatInput: string;
  setChatInput: (c: string) => void;
  
  // QA state
  qaSearchQuery: string;
  setQaSearchQuery: (q: string) => void;
  qaCategoryFilter: string;
  setQaCategoryFilter: (c: string) => void;
  expandedQuestionId: string | null;
  setExpandedQuestionId: (id: string | null) => void;
  newQuestion: { title: string; body: string; category: string };
  setNewQuestion: (q: { title: string; body: string; category: string }) => void;
  newAnswer: string;
  setNewAnswer: (a: string) => void;
  
  // Feed state
  expandedPostId: string | null;
  setExpandedPostId: (id: string | null) => void;
  activePostReplies: any[];
  setActivePostReplies: (r: any[]) => void;
  replyInput: string;
  setReplyInput: (r: string) => void;
  newPost: any;
  setNewPost: (p: any) => void;
  postImage: string | null;
  setPostImage: (p: string | null) => void;
  
  // Market state
  newListing: any;
  setNewListing: (l: any) => void;
  listingImage: string | null;
  setListingImage: (l: string | null) => void;
  typeFilter: 'ALL' | 'SELL' | 'BUY';
  setTypeFilter: (t: 'ALL' | 'SELL' | 'BUY') => void;
  
  // Sidebar state
  challengeProgress: Record<string, number>;
  setChallengeProgress: (c: Record<string, number>) => void;
  
  // Refs
  storyFileRef: React.RefObject<HTMLInputElement | null>;
  postFileRef: React.RefObject<HTMLInputElement | null>;
  listingFileRef: React.RefObject<HTMLInputElement | null>;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export function CommunityProvider({ children }: { children: ReactNode }) {
  const { userProfile } = useFarm();

  // Shared state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  
  // Story state
  const [viewingStory, setViewingStory] = useState<any>(null);
  const [storyMessage, setStoryMessage] = useState('');
  const [storyReacted, setStoryReacted] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);
  const [newStoryImage, setNewStoryImage] = useState<string | null>(null);
  const [localStories, setLocalStories] = useState<any[]>([]);
  
  // Chat state
  const [activeChannel, setActiveChannel] = useState('general');
  const [chatInput, setChatInput] = useState('');
  
  // QA state
  const [qaSearchQuery, setQaSearchQuery] = useState('');
  const [qaCategoryFilter, setQaCategoryFilter] = useState('ALL');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState({ title: '', body: '', category: 'General' });
  const [newAnswer, setNewAnswer] = useState('');
  
  // Feed state
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [activePostReplies, setActivePostReplies] = useState<any[]>([]);
  const [replyInput, setReplyInput] = useState('');
  const [newPost, setNewPost] = useState({ title: '', category: 'General', author: userProfile?.name || '', content: '' });
  const [postImage, setPostImage] = useState<string | null>(null);
  
  // Market state
  const [newListing, setNewListing] = useState({ type: 'SELL', item: '', price: '', location: '', contact: '' });
  const [listingImage, setListingImage] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'SELL' | 'BUY'>('ALL');
  
  // Sidebar state
  const [challengeProgress, setChallengeProgress] = useState<Record<string, number>>({});
  
  // Refs
  const storyFileRef = useRef<HTMLInputElement | null>(null);
  const postFileRef = useRef<HTMLInputElement | null>(null);
  const listingFileRef = useRef<HTMLInputElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const value = useMemo(() => ({
    // Shared
    searchQuery,
    setSearchQuery,
    // Modals
    isPostModalOpen,
    setIsPostModalOpen,
    isListingModalOpen,
    setIsListingModalOpen,
    isQuestionModalOpen,
    setIsQuestionModalOpen,
    isStoryModalOpen,
    setIsStoryModalOpen,
    // Story
    viewingStory,
    setViewingStory,
    storyMessage,
    setStoryMessage,
    storyReacted,
    setStoryReacted,
    storyProgress,
    setStoryProgress,
    newStoryImage,
    setNewStoryImage,
    localStories,
    setLocalStories,
    // Chat
    activeChannel,
    setActiveChannel,
    chatInput,
    setChatInput,
    // QA
    qaSearchQuery,
    setQaSearchQuery,
    qaCategoryFilter,
    setQaCategoryFilter,
    expandedQuestionId,
    setExpandedQuestionId,
    newQuestion,
    setNewQuestion,
    newAnswer,
    setNewAnswer,
    // Feed
    expandedPostId,
    setExpandedPostId,
    activePostReplies,
    setActivePostReplies,
    replyInput,
    setReplyInput,
    newPost,
    setNewPost,
    postImage,
    setPostImage,
    // Market
    newListing,
    setNewListing,
    listingImage,
    setListingImage,
    typeFilter,
    setTypeFilter,
    // Sidebar
    challengeProgress,
    setChallengeProgress,
    // Refs
    storyFileRef,
    postFileRef,
    listingFileRef,
    chatEndRef,
  }), [
    searchQuery,
    isPostModalOpen, isListingModalOpen, isQuestionModalOpen, isStoryModalOpen,
    viewingStory, storyMessage, storyReacted, storyProgress, newStoryImage, localStories,
    activeChannel, chatInput,
    qaSearchQuery, qaCategoryFilter, expandedQuestionId, newQuestion, newAnswer,
    expandedPostId, activePostReplies, replyInput, newPost, postImage,
    newListing, listingImage, typeFilter,
    challengeProgress,
  ]);

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
}