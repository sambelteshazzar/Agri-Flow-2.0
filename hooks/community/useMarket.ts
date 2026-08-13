import { useState, useCallback, useMemo, useRef } from 'react';
import { MarketplaceListing } from '@/types';
import { useFarm } from '@/contexts/FarmContext';

export function useMarket() {
  const { 
    userProfile, isSignedIn, listings,
    addListing, markListingSold,
    showToast, handleAuthRequiredAction
  } = useFarm();

  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [newListing, setNewListing] = useState<Partial<MarketplaceListing>>({ type: 'SELL', item: '', price: '', location: '', contact: '' });
  const [listingImage, setListingImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'SELL' | 'BUY'>('ALL');
  const listingFileRef = useRef<HTMLInputElement>(null);

  const filteredListings = useMemo(() => {
    let result = listings;
    if (typeFilter !== 'ALL') {
      result = result.filter(l => l.type === typeFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(listing => 
        listing.item.toLowerCase().includes(q) ||
        listing.seller?.toLowerCase().includes(q) ||
        listing.location.toLowerCase().includes(q)
      );
    }
    return result;
  }, [listings, searchQuery, typeFilter]);

  const handleFileRead = useCallback((file: File | undefined, callback: (result: string) => void) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.onerror = () => showToast("Failed to read file", "error");
      reader.readAsDataURL(file);
    }
  }, [showToast]);

  const handleListingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListing.item || !newListing.price) {
      showToast("Please provide an item name and price", "error");
      return;
    }
    try {
      await addListing({ ...newListing, seller: userProfile.name, image: listingImage } as any);
      setIsListingModalOpen(false);
      setNewListing({ type: 'SELL', item: '', price: '', location: '', contact: '' });
      setListingImage(null);
    } catch (err) {
      console.error("Failed to create listing", err);
      showToast('Failed to create listing', 'error');
    }
  };

  const handleListingImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileRead(file, setListingImage);
    }
  };

  const handleMarkSold = (id: string) => {
    handleAuthRequiredAction(() => markListingSold(id));
  };

  const handleContactSeller = (item: MarketplaceListing) => {
    const isEmail = item.contact.includes('@');
    if (isEmail) {
      window.open(`mailto:${item.contact}`, '_blank');
    } else {
      navigator.clipboard?.writeText(item.contact)
        .then(() => showToast('Contact copied to clipboard', 'success'))
        .catch(() => showToast(`Contact: ${item.contact}`, 'info'));
    }
  };

  return {
    // State
    isListingModalOpen,
    setIsListingModalOpen,
    newListing,
    setNewListing,
    listingImage,
    setListingImage,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    listingFileRef,
    filteredListings,
    // Actions
    handleFileRead,
    handleListingSubmit,
    handleListingImageChange,
    handleMarkSold,
    handleContactSeller,
  };
}