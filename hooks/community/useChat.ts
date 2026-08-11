import { useState, useCallback, useRef, useEffect } from 'react';
import { CommunityChatMessage } from '@/types';
import { CHANNELS } from '@/constants/community';
import { useFarm } from '@/contexts/FarmContext';

export function useChat() {
  const { 
    userProfile, isSignedIn, chatMessages,
    sendChatMessage,
    showToast, handleAuthRequiredAction
  } = useFarm();

  const [activeChannel, setActiveChannel] = useState('general');
  const [chatInput, setChatInput] = useState('');
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const channelMessages = chatMessages.filter(msg => msg.channelId === activeChannel);

  const TYPING_NAMES = [
    'Mallam Yusuf', 'Fatima M.', 'Ibrahim D.', 'Herdsmann Ali', 
    'Kwame A.', 'Awa D.', 'Dr. Kofi', 'Amina B.', 'Priya S.', 'Thomas M.'
  ];

  const triggerTyping = useCallback(() => {
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    const name = TYPING_NAMES[Math.floor(Math.random() * TYPING_NAMES.length)];
    setTypingUser(name);
    const delay = 1500 + Math.random() * 2000;
    typingTimerRef.current = setTimeout(() => setTypingUser(null), delay);
  }, []);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [channelMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    if (!isSignedIn) {
      showToast('Please sign in to send messages', 'info');
      return;
    }
    const message = {
      channelId: activeChannel,
      author: userProfile.name,
      text: chatInput.trim(),
      avatar: userProfile.avatar,
      isMe: true,
    };
    await sendChatMessage(message);
    setChatInput('');
    triggerTyping();
  };

  const handleChannelChange = (channelId: string) => {
    setActiveChannel(channelId);
    setChatInput('');
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    setTypingUser(null);
  };

  const getRelativeTime = useCallback((timestamp: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Recently';
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  }, []);

  return {
    // State
    activeChannel,
    setActiveChannel,
    chatInput,
    setChatInput,
    typingUser,
    chatEndRef,
    channelMessages,
    CHANNELS,
    // Actions
    getRelativeTime,
    handleSendMessage,
    handleChannelChange,
  };
}