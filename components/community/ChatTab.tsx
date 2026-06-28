import React, { useState, useEffect, useCallback } from 'react';
import { Send, Hash } from 'lucide-react';
import { ChatMessage, UserProfile } from '@/types';

const TYPING_NAMES = ['Adebayo F.', 'Chioma M.', 'Kwame A.', 'Fatima Z.', 'Jean-Pierre D.'];

interface ChatTabProps {
  channels: { id: string; name: string; desc: string; icon: React.ElementType }[];
  activeChannel: string;
  setActiveChannel: (id: string) => void;
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (v: string) => void;
  userProfile: UserProfile;
  onSendChatMessage: (msg: any) => void;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

const TypingIndicator: React.FC<{ name: string }> = ({ name }) => (
  <div className="flex items-center gap-2 px-2 py-1.5 animate-fade-in-up">
    <span className="text-[10px] font-semibold text-[var(--text-tertiary)]">{name} is typing</span>
    <span className="flex gap-0.5">
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-tertiary)] animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-tertiary)] animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-tertiary)] animate-bounce" style={{ animationDelay: '300ms' }} />
    </span>
  </div>
);

const ChatTab: React.FC<ChatTabProps> = ({
  channels, activeChannel, setActiveChannel,
  chatMessages, chatInput, setChatInput,
  userProfile, onSendChatMessage, chatEndRef,
}) => {
  const [typingUser, setTypingUser] = useState<string | null>(null);

  const triggerTyping = useCallback(() => {
    const name = TYPING_NAMES[Math.floor(Math.random() * TYPING_NAMES.length)];
    setTypingUser(name);
    const delay = 1500 + Math.random() * 2000;
    const timer = setTimeout(() => setTypingUser(null), delay);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      onSendChatMessage({ channelId: activeChannel, author: userProfile.name, text: chatInput, isMe: true, avatar: userProfile.avatar });
      setChatInput('');
      const cleanup = triggerTyping();
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      return cleanup;
    }
  };

  return (
  <div className="card-surface h-full flex flex-col overflow-hidden mt-4 lg:mt-0">
    <div className="flex h-full">
      <div className="w-20 lg:w-64 border-r border-[var(--border-card)] bg-[var(--bg-content)] flex flex-col">
        {channels.map(ch => {
          const Icon = ch.icon;
          return (
            <button key={ch.id} onClick={() => setActiveChannel(ch.id)} className={`p-4 lg:px-6 lg:py-4 flex items-center gap-3 transition-colors ${activeChannel === ch.id ? 'bg-[var(--bg-card)] border-l-4 border-sunburst-500 shadow-sm' : 'hover:bg-[var(--bg-content)]'}`}>
              <div className={`p-2 rounded-xl shrink-0 ${activeChannel === ch.id ? 'bg-sunburst-50 dark:bg-sunburst-500/20 text-sunburst-700 dark:text-sunburst-300' : 'bg-[var(--bg-content)] text-[var(--text-secondary)]'}`}><Icon className="w-5 h-5"/></div>
              <div className="hidden lg:block text-left"><div className="font-bold text-sm text-[var(--text-primary)]">{ch.name}</div><div className="text-[10px] text-[var(--text-secondary)] truncate">{ch.desc}</div></div>
            </button>
          );
        })}
      </div>
      <div className="flex-1 flex flex-col bg-[var(--bg-content)]/50">
        <div className="p-4 border-b border-[var(--border-card)] bg-[var(--bg-card)] flex justify-between items-center shadow-sm z-10">
          <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2"><Hash className="w-4 h-4 text-[var(--text-tertiary)]"/> {channels.find(c => c.id === activeChannel)?.name}</h3>
          <span className="text-xs text-jade-500 font-bold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-jade-500 animate-pulse"></span> Live</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.filter(m => m.channelId === activeChannel).map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''} animate-fade-in-up`}>
              <div className="w-8 h-8 rounded-full bg-[var(--bg-content)] overflow-hidden shrink-0"><img src={msg.avatar} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${msg.author}`; }} /></div>
              <div className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm ${msg.isMe ? 'bg-sunburst-500 text-jade-950 rounded-tr-none font-medium' : 'bg-[var(--bg-card)] text-[var(--text-secondary)] rounded-tl-none border border-[var(--border-card)]'}`}>
                {!msg.isMe && <div className="text-[10px] font-semibold text-[var(--text-tertiary)] mb-1">{msg.author}</div>}
                {msg.text}
              </div>
            </div>
          ))}
          {typingUser && <TypingIndicator name={typingUser} />}
          <div ref={chatEndRef}></div>
        </div>
        <form onSubmit={handleSubmit} className="p-3 bg-[var(--bg-card)] border-t border-[var(--border-card)] flex gap-2">
          <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type a message..." className="flex-1 bg-[var(--bg-content)] border-transparent focus:border-sunburst-500 focus:bg-[var(--bg-card)] rounded-xl px-4 py-2.5 text-sm transition-all focus:outline-none" />
          <button type="submit" aria-label="Send message" className="bg-jade-800 dark:bg-sunburst-500 text-white dark:text-jade-950 p-2.5 rounded-xl shadow-md hover:scale-105 transition-transform"><Send className="w-5 h-5" aria-hidden="true"/></button>
        </form>
      </div>
    </div>
  </div>
  );
};

export default ChatTab;
