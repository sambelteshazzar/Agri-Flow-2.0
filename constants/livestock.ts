import { Livestock } from '../types';

export const INITIAL_LIVESTOCK: Livestock[] = [
  {
    id: '1',
    name: 'Fulani Herd Unit A',
    species: 'Cattle',
    count: 85,
    status: 'Healthy',
    grazingType: 'Rotational',
    imageUrl: '/stock/cattle.svg',
    notes: 'Transhumance herd. Dry season migration from Sahel zone to southern pasture (Nov-May).'
  },
  {
    id: '2',
    name: 'Free-Range Poultry Flock',
    species: 'Chicken',
    count: 250,
    status: 'Healthy',
    grazingType: 'Free Range',
    imageUrl: '/stock/chicken.svg',
    notes: 'Newcastle disease vaccination completed Q1 2026. Scavenging system with supplementary feeding.'
  },
  {
    id: '3',
    name: 'Sahel Goat Herd',
    species: 'Goat',
    count: 60,
    status: 'Healthy',
    grazingType: 'Free Range',
    imageUrl: '/stock/goat.svg',
    notes: 'Sokoto Red breed. Drought-resistant. Used for meat and manure for soil fertility.'
  }
];
