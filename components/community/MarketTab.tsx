import React from 'react';
import { Plus, MapPin } from 'lucide-react';
import { MarketplaceListing, UserProfile } from '@/types';

interface MarketTabProps {
  listings: MarketplaceListing[];
  userProfile: UserProfile;
  onAuthRequiredAction: (action: () => void) => void;
  onMarkSold: (id: string) => void;
  setIsListingModalOpen: (v: boolean) => void;
  onContactSeller: (item: MarketplaceListing) => void;
  getRelativeTime: (dateString: string) => string;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

const MarketTab: React.FC<MarketTabProps> = ({
  listings, userProfile, onAuthRequiredAction, onMarkSold,
  setIsListingModalOpen, onContactSeller, getRelativeTime, showToast,
}) => (
  <div className="pt-4 lg:pt-0">
     <div className="flex justify-between items-end mb-6 px-1">
        <div>
           <h3 className="text-2xl font-semibold text-[var(--text-primary)] font-heading">Marketplace</h3>
           <p className="text-[var(--text-secondary)] text-xs font-semibold mt-1">Buy, Sell & Trade Equipment</p>
        </div>
         <button onClick={() => onAuthRequiredAction(() => setIsListingModalOpen(true))} className="bg-jade-600 hover:bg-jade-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow-lg flex items-center gap-2 transition-transform active:scale-95"><Plus className="w-4 h-4"/> New Listing</button>
     </div>
     
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listings.map(item => (
            <div key={item.id} className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-card)] overflow-hidden hover:border-jade-500 transition-all group flex flex-col">
                            <div className="h-48 bg-[var(--bg-content)] relative overflow-hidden">
                               <img src={item.image || 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=800&fit=crop'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.item} onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=800&fit=crop'; }} />
                                <div className="absolute top-3 right-3"><span className={`px-3 py-1 rounded-lg text-[10px] font-semibold shadow-md ${item.status === 'SOLD' ? 'bg-[var(--text-tertiary)] text-white' : item.type === 'SELL' ? 'bg-jade-500 text-white' : 'bg-blue-500 text-white'}`}>{item.status === 'SOLD' ? 'SOLD' : item.type}</span></div>
                                {item.status === 'SOLD' && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="text-white font-black text-xl tracking-wide rotate-[-15deg] border-2 border-white px-4 py-1">SOLD</span></div>}
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                               <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-bold text-[var(--text-primary)] text-lg line-clamp-1">{item.item}</h4>
                                </div>
                               <p className="text-2xl font-black text-[var(--text-primary)] mb-2 font-heading">{item.price}</p>
                               <div className="flex items-center text-xs text-[var(--text-secondary)] mb-4"><MapPin className="w-3 h-3 mr-1"/> {item.location}</div>
                                <div className="mt-auto pt-4 border-t border-[var(--border-card)] flex justify-between items-center">
                                   <span className="text-[10px] font-semibold text-[var(--text-tertiary)]">{item.status === 'SOLD' ? 'Sold' : getRelativeTime(item.date)}</span>
                                   {item.status === 'SOLD' ? (<span className="text-xs font-semibold text-[var(--text-tertiary)] line-through">Sold</span>) : item.seller === userProfile.name ? (
                                     <button onClick={() => onAuthRequiredAction(() => onMarkSold(item.id))} className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline">Mark Sold</button>
                                   ) : (
                                      <button onClick={() => onContactSeller(item)} className="text-xs font-semibold text-jade-600 dark:text-jade-400 hover:underline">Contact Seller</button>
                                   )}
                                </div>
                            </div>
                         </div>
        ))}
     </div>
  </div>
);

export default MarketTab;
