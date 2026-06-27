import React from 'react';
import { X, Camera } from 'lucide-react';
import { UserProfile } from '@/types';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  newStoryImage: string | null;
  setNewStoryImage: (img: string | null) => void;
  onShare: () => void;
  storyFileRef: React.RefObject<HTMLInputElement>;
  onFileRead: (file: File | undefined, callback: (result: string) => void) => void;
}

const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  isOpen, onClose, newStoryImage, setNewStoryImage, onShare, storyFileRef, onFileRead,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-jade-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[var(--bg-card)] w-full max-w-sm rounded-2xl shadow-2xl p-6 relative flex flex-col items-center text-center">
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"><X className="w-6 h-6" aria-hidden="true" /></button>
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Add to Story</h3>
        <div onClick={() => storyFileRef.current?.click()} className="w-full h-64 bg-[var(--bg-content)] rounded-xl border-2 border-dashed border-[var(--border-card)] flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--bg-content)] transition-colors overflow-hidden relative mt-4"><input type="file" accept="image/*" ref={storyFileRef} onChange={(e) => onFileRead(e.target.files?.[0], (res) => setNewStoryImage(res))} className="hidden" />{newStoryImage ? <img src={newStoryImage} className="w-full h-full object-cover" /> : <><Camera className="w-10 h-10 text-[var(--text-tertiary)] mb-2" /><span className="text-xs font-semibold text-[var(--text-secondary)]">Tap to Upload</span></>}</div>
        <button onClick={onShare} disabled={!newStoryImage} className="w-full mt-6 py-3 bg-blue-600 disabled:bg-terra-300 text-white rounded-xl font-semibold text-xs shadow-lg">Share</button>
      </div>
    </div>
  );
};

export default CreateStoryModal;
