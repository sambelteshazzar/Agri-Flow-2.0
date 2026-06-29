import React from 'react';
import { XCircle, Heart, Send } from 'lucide-react';
import { UserProfile, Story } from '@/types';

interface StoryViewerProps {
  viewingStory: Story | null;
  storyProgress: number;
  storyMessage: string;
  setStoryMessage: (v: string) => void;
  storyReacted: boolean;
  setStoryReacted: (v: boolean) => void;
  onClose: () => void;
  sendChatMessage: (msg: any) => void;
  userProfile: UserProfile;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  viewingStory, storyProgress, storyMessage, setStoryMessage,
  storyReacted, setStoryReacted, onClose, sendChatMessage, userProfile, showToast,
}) => {
  if (!viewingStory) return null;
  return (
    <div className="fixed inset-0 z-full-modal bg-black flex flex-col items-center justify-center animate-fade-in">
      <div className="absolute top-4 left-4 right-4 flex gap-2 z-20"><div className="h-1 bg-white/30 rounded-full flex-1 overflow-hidden"><div className="h-full bg-white transition-all duration-[50ms] ease-linear" style={{ width: `${storyProgress}%` }}></div></div></div>
      <div className="absolute top-8 left-4 z-20 flex items-center gap-3"><div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden"><img src={viewingStory.img} className="w-full h-full object-cover" /></div><span className="text-white font-bold text-sm shadow-black drop-shadow-md">{viewingStory.name}</span><span className="text-white/60 text-xs font-medium">2h</span></div>
      <button onClick={onClose} aria-label="Close story" className="absolute top-8 right-4 z-20 text-white hover:text-white/80 transition-colors"><XCircle className="w-8 h-8" aria-hidden="true" /></button>
      <div className="w-full h-full max-w-md bg-black relative flex items-center justify-center"><img src={viewingStory.img} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1595211877493-41a4e65eda99?w=800&q=80'; }} /><div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent"><div className="flex gap-4"><input type="text" placeholder="Send message..." value={storyMessage} onChange={e => setStoryMessage(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && storyMessage.trim()) { sendChatMessage({ sender: userProfile.name, content: storyMessage.trim() }); showToast(`Message sent to ${viewingStory.name}`, 'success'); setStoryMessage(''); } }} className="flex-1 bg-transparent border border-white/30 rounded-full px-4 py-2 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white" /><button aria-label="React to story" onClick={() => { if (!storyReacted) { setStoryReacted(true); showToast('Reacted with ❤️', 'success'); } }} className={`p-2 hover:bg-white/10 rounded-full transition-colors ${storyReacted ? 'text-red-500' : 'text-white'}`}><Heart className={`w-6 h-6 ${storyReacted ? 'fill-red-500' : ''}`} aria-hidden="true" /></button></div></div></div>
    </div>
  );
};

export default StoryViewer;
