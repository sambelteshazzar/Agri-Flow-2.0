import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Story } from '@/types';
import { useFarm } from '@/contexts/FarmContext';

export function useStories() {
  const { 
    userProfile, isSignedIn, stories: contextStories,
    sendChatMessage,
    showToast
  } = useFarm();

  const [localStories, setLocalStories] = useState<Story[]>([]);
  const [viewingStory, setViewingStory] = useState<Story | null>(null);
  const [storyMessage, setStoryMessage] = useState('');
  const [storyReacted, setStoryReacted] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [newStoryImage, setNewStoryImage] = useState<string | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const storyFileRef = useRef<HTMLInputElement>(null);
  const prevStoriesRef = useRef<Story[]>([]);

  const allStories = useMemo(() => {
    return [...contextStories, ...localStories.filter(ls => !contextStories.some(cs => cs.id === ls.id))];
  }, [contextStories, localStories]);

  useEffect(() => {
    if (contextStories !== prevStoriesRef.current) {
      prevStoriesRef.current = contextStories;
      setLocalStories(prev => prev.length === 0 ? contextStories : [...contextStories, ...prev.filter(ls => !contextStories.some(cs => cs.id === ls.id))]);
    }
  }, [contextStories]);

  useEffect(() => {
    if (!viewingStory) {
      setStoryProgress(0);
      return;
    }
    setStoryProgress(0);
    const startTime = Date.now();
    const duration = 5000;
    let rafId: number | null = null;
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setStoryProgress(progress);
      if (progress >= 100) {
        setViewingStory(null);
        return;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [viewingStory]);

  const handleFileRead = useCallback((file: File | undefined, callback: (result: string) => void) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.onerror = () => showToast("Failed to read file", "error");
      reader.readAsDataURL(file);
    }
  }, [showToast]);

  const handleStoryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileRead(file, setNewStoryImage);
    }
  };

  const handleStorySubmit = () => {
    if (newStoryImage) {
      setLocalStories(prev => [{id: `story-${Date.now()}`, name: userProfile.name, img: newStoryImage, hasUpdate: true, isUser: true}, ...prev]);
      setIsStoryModalOpen(false);
      setNewStoryImage(null);
      showToast('Story posted', 'success');
    }
  };

  const handleStoryClose = () => {
    setViewingStory(null);
    setStoryMessage('');
    setStoryReacted(false);
  };

  const handleStoryShare = () => {
    // Share story logic
  };

  const handleStoryMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (storyMessage.trim() && viewingStory) {
      sendChatMessage({ sender: userProfile.name, content: storyMessage.trim() });
      showToast(`Message sent to ${viewingStory.name}`, 'success');
      setStoryMessage('');
    }
  };

  const handleStoryReact = () => {
    if (!storyReacted) {
      setStoryReacted(true);
      showToast('Reacted with ❤️', 'success');
    }
  };

  const openStory = (story: Story) => {
    if (story.hasUpdate || story.isUser) {
      setViewingStory(story);
    }
  };

  return {
    // State
    localStories,
    setLocalStories,
    viewingStory,
    setViewingStory,
    storyMessage,
    setStoryMessage,
    storyReacted,
    setStoryReacted,
    isStoryModalOpen,
    setIsStoryModalOpen,
    newStoryImage,
    setNewStoryImage,
    storyProgress,
    storyFileRef,
    allStories,
    // Actions
    handleFileRead,
    handleStoryImageChange,
    handleStorySubmit,
    handleStoryClose,
    handleStoryShare,
    handleStoryMessageSubmit,
    handleStoryReact,
    openStory,
  };
}