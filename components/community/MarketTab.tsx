import React, { useState, useMemo } from 'react';
import { getStockImage } from '@/utils/stockImages';
import { Plus, MapPin, Search, ShoppingBag, ArrowRightLeft } from 'lucide-react';
import { MarketplaceListing, UserProfile } from '@/types';

type ListingFilter = 'ALL' | 'SELL' | 'BUY';

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

const FILTER_OPTIONS: { key: ListingFilter; label: string; icon: React.ElementType }[] = [
  { key: 'ALL', label: 'All', icon: ShoppingBag },
  { key: 'SELL', label: 'For Sale', icon: ArrowRightLeft },
  { key: 'BUY', label: 'Wanted', icon: Plus },
];

const MarketTab: React.FC<MarketTabProps> = ({
  listings, userProfile, onAuthRequiredAction, onMarkSold,
  setIsListingModalOpen, onContactSeller, getRelativeTime, showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ListingFilter>('ALL');

  const filteredListings = useMemo(() => {
    let result = listings;
    if (typeFilter !== 'ALL') {
      result = result.filter(item => item.type === typeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.item.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        (item.seller ?? '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [listings, typeFilter, searchQuery]);

  return (
    <div className="pt-4 lg:pt-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1 mb-4">
        <div>
          <h3 className="text-2xl font-semibold text-[var(--text-primary)] font-heading">Marketplace</h3>
          <p className="text-[var(--text-secondary)] text-xs font-semibold mt-1">Buy, Sell & Trade Equipment</p>
        </div>
        <button onClick={() => onAuthRequiredAction(() => setIsListingModalOpen(true))} className="bg-jade-600 hover:bg-jade-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow-lg flex items-center gap-2 transition-transform active:scale-95 shrink-0"><Plus className="w-4 h-4"/> New Listing</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 px-1 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search listings, locations, sellers..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl text-sm focus:outline-none focus:border-sunburst-500"
          />
        </div>
        <div className="flex gap-2 shrink-0">
          {FILTER_OPTIONS.map(opt => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.key}
                onClick={() => setTypeFilter(opt.key)}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  typeFilter === opt.key
                    ? 'bg-jade-600 text-white shadow-sm'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-card)] hover:border-jade-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {filteredListings.length === 0 ? (
        <div className="text-center py-16 px-4">
          <ShoppingBag className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-3" />
          <p className="text-sm font-semibold text-[var(--text-secondary)]">
            {searchQuery || typeFilter !== 'ALL' ? 'No listings match your search' : 'No listings yet'}
          </p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">
            {searchQuery || typeFilter !== 'ALL' ? 'Try adjusting your filters' : 'Be the first to post one!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredListings.map(item => (
            <div key={item.id} className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-card)] overflow-hidden hover:border-jade-500 transition-all group flex flex-col">
              <div className="h-48 bg-[var(--bg-content)] relative overflow-hidden">
                <img src={item.image || getStockImage('marketplace')} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.item} onError={(e) => { e.currentTarget.src = getStockImage('marketplace'); }} />
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
      )}

      {(searchQuery || typeFilter !== 'ALL') && listings.length > 0 && (
        <p className="text-center text-[10px] text-[var(--text-tertiary)] mt-4 font-semibold">
          Showing {filteredListings.length} of {listings.length} listings
        </p>
      )}
    </div>
  );
};

export default MarketTab;
