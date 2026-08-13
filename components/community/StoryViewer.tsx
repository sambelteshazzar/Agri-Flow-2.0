import React, { useState, useEffect, useRef } from 'react';
import { getStockImage } from '@/utils/stockImages';
import { XCircle, Heart, Send, Users, Eye, MoreVertical, Archive, Video, RotateCcw } from 'lucide-react';
import { UserProfile, Story, StoryViewer as StoryViewerType, StoryHighlight } from '@/types';

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
  
  const [showViewers, setShowViewers] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const isVideo = viewingStory.type === 'video' && viewingStory.videoUrl;

  useEffect(() => {
    if (videoRef.current && isPlaying) {
      videoRef.current.play().catch(() => {});
    }
  }, [isPlaying]);

  const handleVideoEnd = () => {
    setIsPlaying(false);
    // Auto-advance after video ends
    setTimeout(() => onClose(), 1000);
  };

  const mockViewers: StoryViewerType[] = [
    { id: 'v1', name: 'John Farmer', avatar: '/stock/user.svg', viewedAt: '2h ago' },
    { id: 'v2', name: 'Maria Santos', avatar: '/stock/user.svg', viewedAt: '3h ago' },
    { id: 'v3', name: 'Kwame A.', avatar: '/stock/user.svg', viewedAt: '4h ago' },
    { id: 'v4', name: 'Fatima M.', avatar: '/stock/user.svg', viewedAt: '5h ago' },
    { id: 'v5', name: 'Dr. Kofi', avatar: '/stock/user.svg', viewedAt: '6h ago' },
    { id: 'v6', name: 'Ibrahim D.', avatar: '/stock/user.svg', viewedAt: '7h ago' },
  ];

  const mockHighlights: StoryHighlight[] = [
    { id: 'h1', title: 'Planting Season', coverImg: '/stock/crops.svg', storyIds: ['s1', 's2', 's3'], createdAt: '2026-06-01' },
    { id: 'h2', title: 'Harvest Tips', coverImg: '/stock/marketplace.svg', storyIds: ['s4', 's5'], createdAt: '2026-06-15' },
    { id: 'h3', title: 'Livestock Care', coverImg: '/stock/livestock.svg', storyIds: ['s6', 's7', 's8'], createdAt: '2026-07-01' },
  ];

  if (isVideo) {
    return (
      <div className="fixed inset-0 z-full-modal bg-black flex flex-col items-center justify-center animate-fade-in">
        <div className="absolute top-4 left-4 right-4 flex gap-2 z-20">
          <div className="h-1 bg-white/30 rounded-full flex-1 overflow-hidden">
            <div className="h-full bg-white transition-all duration-[50ms] ease-linear" style={{ width: `${storyProgress}%` }}></div>
          </div>
        </div>
        <div className="absolute top-8 left-4 z-20 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden">
            <img src={viewingStory.img} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = getStockImage('user'); }} />
          </div>
          <span className="text-white font-bold text-sm shadow-black drop-shadow-md">{viewingStory.name}</span>
          <span className="text-white/60 text-xs font-medium">2h</span>
        </div>
        <div className="absolute top-8 right-4 z-20 flex items-center gap-2">
          <button onClick={() => setShowViewers(true)} aria-label="Viewers" className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
            <Eye className="w-5 h-5" />
          </button>
          <button onClick={() => setShowHighlights(true)} aria-label="Highlights" className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
            <Archive className="w-5 h-5" />
          </button>
          <button onClick={onClose} aria-label="Close story" className="text-white hover:text-white/80 transition-colors">
            <XCircle className="w-8 h-8" aria-hidden="true" />
          </button>
        </div>
        <div className="w-full h-full max-w-md bg-black relative flex items-center justify-center">
          <video
            ref={videoRef}
            src={viewingStory.videoUrl}
            className="w-full h-full object-contain"
            onEnded={handleVideoEnd}
            onClick={() => setIsPlaying(!isPlaying)}
            playsInline
          />
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex gap-4 items-center">
              <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                {isPlaying ? <RotateCcw className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
              </button>
              <div className="flex-1"></div>
              <button aria-label="React to story" onClick={() => { if (!storyReacted) { setStoryReacted(true); showToast('Reacted with ❤️', 'success'); } }} className={`p-2 hover:bg-white/10 rounded-full transition-colors ${storyReacted ? 'text-red-500' : 'text-white'}`}>
                <Heart className={`w-6 h-6 ${storyReacted ? 'fill-red-500' : ''}`} aria-hidden="true" />
              </button>
              <button onClick={() => setShowViewers(true)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Viewers Modal */}
        {showViewers && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center animate-fade-in" onClick={() => setShowViewers(false)}>
            <div className="bg-white dark:bg-[#12261A] w-full max-w-md rounded-t-3xl p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Viewers ({mockViewers.length})</h3>
                <button onClick={() => setShowViewers(false)} className="p-2 hover:bg-terra-100 dark:hover:bg-[#1E3D2A] rounded-full">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-3">
                {mockViewers.map(viewer => (
                  <div key={viewer.id} className="flex items-center gap-3 p-2 hover:bg-terra-50 dark:hover:bg-[#1E3D2A] rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-[var(--bg-content)] overflow-hidden">
                      <img src={viewer.avatar} className="w-full h-full object-cover" alt={viewer.name} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[var(--text-primary)]">{viewer.name}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{viewer.viewedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Highlights Modal */}
        {showHighlights && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center animate-fade-in" onClick={() => setShowHighlights(false)}>
            <div className="bg-white dark:bg-[#12261A] w-full max-w-md rounded-t-3xl p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Highlights</h3>
                <button onClick={() => setShowHighlights(false)} className="p-2 hover:bg-terra-100 dark:hover:bg-[#1E3D2A] rounded-full">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                {mockHighlights.map(highlight => (
                  <div key={highlight.id} className="flex items-center gap-3 p-3 bg-[var(--bg-content)] rounded-xl hover:bg-terra-50 dark:hover:bg-[#1E3D2A] transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sunburst-400 to-red-500 flex items-center justify-center">
                      <Archive className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[var(--text-primary)]">{highlight.title}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{highlight.storyIds.length} stories</p>
                    </div>
                    <button className="p-2 hover:bg-terra-100 dark:hover:bg-[#1E3D2A] rounded-full">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 bg-jade-600 text-white rounded-xl font-semibold hover:bg-jade-700 transition-colors">
                Create New Highlight
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-full-modal bg-black flex flex-col items-center justify-center animate-fade-in">
      <div className="absolute top-4 left-4 right-4 flex gap-2 z-20"><div className="h-1 bg-white/30 rounded-full flex-1 overflow-hidden"><div className="h-full bg-white transition-all duration-[50ms] ease-linear" style={{ width: `${storyProgress}%` }}></div></div></div>
      <div className="absolute top-8 left-4 z-20 flex items-center gap-3"><div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden"><img src={viewingStory.img} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = getStockImage('user'); }} /></div><span className="text-white font-bold text-sm shadow-black drop-shadow-md">{viewingStory.name}</span><span className="text-white/60 text-xs font-medium">2h</span></div>
      <div className="absolute top-8 right-4 z-20 flex items-center gap-2">
        <button onClick={() => setShowViewers(true)} aria-label="Viewers" className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"><Eye className="w-5 h-5" /></button>
        <button onClick={() => setShowHighlights(true)} aria-label="Highlights" className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"><Archive className="w-5 h-5" /></button>
        <button onClick={onClose} aria-label="Close story" className="text-white hover:text-white/80 transition-colors"><XCircle className="w-8 h-8" aria-hidden="true" /></button>
      </div>
      <div className="w-full h-full max-w-md bg-black relative flex items-center justify-center"><img src={viewingStory.img} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = getStockImage('user'); }} /><div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent"><div className="flex gap-4"><input type="text" placeholder="Send message..." value={storyMessage} onChange={e => setStoryMessage(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && storyMessage.trim()) { sendChatMessage({ channelId: 'general', author: userProfile.name, text: storyMessage.trim(), avatar: userProfile.avatar, isMe: true }); showToast(`Message sent to ${viewingStory.name}`, 'success'); setStoryMessage(''); } }} className="flex-1 bg-transparent border border-white/30 rounded-full px-4 py-2 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white" /><button aria-label="React to story" onClick={() => { if (!storyReacted) { setStoryReacted(true); showToast('Reacted with ❤️', 'success'); } }} className={`p-2 hover:bg-white/10 rounded-full transition-colors ${storyReacted ? 'text-red-500' : 'text-white'}`}><Heart className={`w-6 h-6 ${storyReacted ? 'fill-red-500' : ''}`} aria-hidden="true" /></button></div></div></div>

      {/* Viewers Modal */}
      {showViewers && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center animate-fade-in" onClick={() => setShowViewers(false)}>
          <div className="bg-white dark:bg-[#12261A] w-full max-w-md rounded-t-3xl p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Viewers ({mockViewers.length})</h3>
              <button onClick={() => setShowViewers(false)} className="p-2 hover:bg-terra-100 dark:hover:bg-[#1E3D2A] rounded-full"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-3">
              {mockViewers.map(viewer => (
                <div key={viewer.id} className="flex items-center gap-3 p-2 hover:bg-terra-50 dark:hover:bg-[#1E3D2A] rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-content)] overflow-hidden"><img src={viewer.avatar} className="w-full h-full object-cover" alt={viewer.name} /></div>
                  <div className="flex-1"><p className="font-semibold text-[var(--text-primary)]">{viewer.name}</p><p className="text-xs text-[var(--text-secondary)]">{viewer.viewedAt}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Highlights Modal */}
      {showHighlights && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center animate-fade-in" onClick={() => setShowHighlights(false)}>
          <div className="bg-white dark:bg-[#12261A] w-full max-w-md rounded-t-3xl p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Highlights</h3>
              <button onClick={() => setShowHighlights(false)} className="p-2 hover:bg-terra-100 dark:hover:bg-[#1E3D2A] rounded-full"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              {mockHighlights.map(highlight => (
                <div key={highlight.id} className="flex items-center gap-3 p-3 bg-[var(--bg-content)] rounded-xl hover:bg-terra-50 dark:hover:bg-[#1E3D2A] transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sunburst-400 to-red-500 flex items-center justify-center"><Archive className="w-6 h-6 text-white" /></div>
                  <div className="flex-1"><p className="font-semibold text-[var(--text-primary)]">{highlight.title}</p><p className="text-xs text-[var(--text-secondary)]">{highlight.storyIds.length} stories</p></div>
                  <button className="p-2 hover:bg-terra-100 dark:hover:bg-[#1E3D2A] rounded-full"><MoreVertical className="w-5 h-5" /></button>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 bg-jade-600 text-white rounded-xl font-semibold hover:bg-jade-700 transition-colors">Create New Highlight</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryViewer;