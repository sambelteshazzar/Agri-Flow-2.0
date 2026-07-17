import React from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { MarketplaceListing, UserProfile } from '@/types';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  newListing: Partial<MarketplaceListing>;
  setNewListing: (listing: Partial<MarketplaceListing>) => void;
  listingImage: string | null;
  setListingImage: (img: string | null) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  listingFileRef: React.RefObject<HTMLInputElement | null>;
  onFileRead: (file: File | undefined, callback: (result: string) => void) => void;
}

const CreateListingModal: React.FC<CreateListingModalProps> = ({
  isOpen, onClose, newListing, setNewListing,
  listingImage, setListingImage, onSubmit, showToast,
  listingFileRef, onFileRead,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-jade-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[var(--bg-card)] w-full max-w-md rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"><X className="w-6 h-6" aria-hidden="true" /></button>
        <div className="mb-6"><h3 className="font-semibold text-2xl text-[var(--text-primary)] font-heading">New Listing</h3><p className="text-[var(--text-secondary)] text-xs mt-1">Marketplace / Create</p></div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-1 bg-[var(--bg-content)] rounded-xl">
            <button type="button" onClick={() => setNewListing({...newListing, type: 'SELL'})} className={`py-3 font-bold text-xs rounded-lg transition-all ${newListing.type === 'SELL' ? 'bg-[var(--bg-card)] text-jade-700 dark:text-jade-400 shadow-sm' : 'text-[var(--text-secondary)]'}`}>SELL ITEM</button>
            <button type="button" onClick={() => setNewListing({...newListing, type: 'BUY'})} className={`py-3 font-bold text-xs rounded-lg transition-all ${newListing.type === 'BUY' ? 'bg-[var(--bg-card)] text-blue-700 dark:text-blue-400 shadow-sm' : 'text-[var(--text-secondary)]'}`}>REQUEST ITEM</button>
          </div>
          <div onClick={() => listingFileRef.current?.click()} className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden ${listingImage ? 'border-jade-500' : 'border-[var(--border-card)] hover:border-[var(--text-tertiary)] hover:bg-[var(--bg-content)]'}`}><input type="file" ref={listingFileRef} accept="image/*" onChange={(e) => onFileRead(e.target.files?.[0], (res) => setListingImage(res))} className="hidden" />{listingImage ? <img src={listingImage} alt="Preview" className="w-full h-full object-cover" /> : <><ImageIcon className="w-8 h-8 text-[var(--text-tertiary)] mb-2" /><span className="text-xs font-semibold text-[var(--text-secondary)]">Upload Item Photo</span></>}</div>
          <div className="space-y-4">
            <input placeholder="Item Name" value={newListing.item} onChange={e => setNewListing({...newListing, item: e.target.value})} className="w-full p-3 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl font-bold outline-none text-[var(--text-primary)] text-sm" required />
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Price" value={newListing.price} onChange={e => setNewListing({...newListing, price: e.target.value})} className="w-full p-3 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl font-bold outline-none text-[var(--text-primary)] text-sm" required />
              <input placeholder="Location" value={newListing.location} onChange={e => setNewListing({...newListing, location: e.target.value})} className="w-full p-3 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl font-bold outline-none text-[var(--text-primary)] text-sm" />
            </div>
            <input placeholder="Contact Info" value={newListing.contact} onChange={e => setNewListing({...newListing, contact: e.target.value})} className="w-full p-3 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl font-bold outline-none text-[var(--text-primary)] text-sm" />
          </div>
          <button className="w-full bg-jade-800 dark:bg-sunburst-500 text-white dark:text-jade-950 py-4 rounded-xl font-semibold hover:opacity-90 shadow-lg active:scale-[0.98] mt-2">Publish Listing</button>
        </form>
      </div>
    </div>
  );
};

export default CreateListingModal;
