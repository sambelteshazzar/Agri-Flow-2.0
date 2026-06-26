import { Livestock } from '../types';

export const INITIAL_LIVESTOCK: Livestock[] = [
  {
    id: '1',
    name: 'Fulani Herd Unit A',
    species: 'Cattle',
    count: 85,
    status: 'Healthy',
    grazingType: 'Rotational',
    imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=1000&auto=format&fit=crop',
    notes: 'Transhumance herd. Dry season migration from Sahel zone to southern pasture (Nov-May).'
  },
  {
    id: '2',
    name: 'Free-Range Poultry Flock',
    species: 'Chicken',
    count: 250,
    status: 'Healthy',
    grazingType: 'Free Range',
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000&auto=format&fit=crop',
    notes: 'Newcastle disease vaccination completed Q1 2026. Scavenging system with supplementary feeding.'
  },
  {
    id: '3',
    name: 'Sahel Goat Herd',
    species: 'Goat',
    count: 60,
    status: 'Healthy',
    grazingType: 'Free Range',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop',
    notes: 'Sokoto Red breed. Drought-resistant. Used for meat and manure for soil fertility.'
  }
];
