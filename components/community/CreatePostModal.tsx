import React from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { UserProfile, ForumPost } from '@/types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  newPost: Partial<ForumPost>;
  setNewPost: (post: Partial<ForumPost>) => void;
  postImage: string | null;
  setPostImage: (img: string | null) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  userProfile: UserProfile;
  postFileRef: React.RefObject<HTMLInputElement | null>;
  onFileRead: (file: File | undefined, callback: (result: string) => void) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen, onClose, newPost, setNewPost,
  postImage, setPostImage, onSubmit, userProfile, postFileRef, onFileRead,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-jade-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[var(--bg-card)] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden scale-100 transition-all">
        <div className="px-6 py-4 border-b border-[var(--border-card)] flex justify-between items-center bg-[var(--bg-content)]">
          <h3 className="font-bold text-[var(--text-primary)] text-lg">Create Post</h3>
          <button onClick={onClose} aria-label="Close" className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] p-1 rounded-full"><X className="w-5 h-5" aria-hidden="true"/></button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="p-6">
            <div className="flex gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-[var(--bg-content)] overflow-hidden"><img src={userProfile.avatar} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/stock/user.svg'; }} /></div>
              <div><span className="font-bold text-sm text-[var(--text-primary)] block">{userProfile.name}</span><select value={newPost.category} onChange={e => setNewPost({...newPost, category: e.target.value as any})} className="text-xs bg-transparent border-none p-0 focus:ring-0 cursor-pointer font-bold text-[var(--text-secondary)]"><option value="General">General</option><option value="Pests">Pests</option><option value="Market">Market</option><option value="Weather">Weather</option><option value="Equipment">Equipment</option></select></div>
            </div>
            <input placeholder="Title (Optional)" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} className="w-full mb-2 text-lg font-bold placeholder-[var(--text-tertiary)] border-none focus:ring-0 p-0 bg-transparent text-[var(--text-primary)]"/>
            <textarea placeholder="What's happening on your farm?" value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} className="w-full h-32 resize-none border-none focus:ring-0 p-0 text-[var(--text-secondary)] placeholder-[var(--text-tertiary)] text-sm bg-transparent" autoFocus/>
            {postImage && <div className="relative mt-2 rounded-xl overflow-hidden bg-[var(--bg-content)] border border-[var(--border-card)]"><img src={postImage} className="w-full h-48 object-cover" /><button type="button" onClick={() => setPostImage(null)} aria-label="Remove image" className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-black/80"><X className="w-4 h-4" aria-hidden="true" /></button></div>}
          </div>
          <div className="px-6 py-4 bg-[var(--bg-content)] border-t border-[var(--border-card)] flex justify-between items-center">
            <div className="flex gap-2">
              <button type="button" onClick={() => postFileRef.current?.click()} aria-label="Attach image" className="p-2 hover:bg-jade-100 text-[var(--text-secondary)] hover:text-jade-600 rounded-full transition-colors"><ImageIcon className="w-5 h-5" aria-hidden="true"/></button>
              <input type="file" ref={postFileRef} accept="image/*" onChange={(e) => onFileRead(e.target.files?.[0], (res) => setPostImage(res))} className="hidden" />
            </div>
            <button type="submit" disabled={!newPost.content} className="bg-jade-800 dark:bg-sunburst-500 text-white dark:text-jade-950 px-6 py-2 rounded-full font-semibold text-xs hover:opacity-90 disabled:opacity-50 transition-all shadow-md active:scale-[0.98]">Post Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
