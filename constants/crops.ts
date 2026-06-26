import { Crop } from '../types';

export const INITIAL_CROPS: Crop[] = [
  {
    id: '1',
    name: 'Maize',
    variety: 'Drought-Tol OBA Super 2',
    plantingDate: '2026-05-15',
    harvestDate: '2026-09-30',
    status: 'Needs Attention',
    area: 50,
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=1000&auto=format&fit=crop',
    soilHealth: 'Degraded',
    waterEfficiency: 'Low',
    biodiversityScore: 22
  },
  {
    id: '2',
    name: 'Rice',
    variety: 'NERICA L-34 (Lowland)',
    plantingDate: '2026-06-01',
    harvestDate: '2026-10-15',
    status: 'Healthy',
    area: 30,
    imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ced72a?q=80&w=1000&auto=format&fit=crop',
    soilHealth: 'Good',
    waterEfficiency: 'Moderate',
    biodiversityScore: 55
  },
  {
    id: '3',
    name: 'Cassava',
    variety: 'TMS 30572 (IITA)',
    plantingDate: '2026-04-20',
    harvestDate: '2027-02-28',
    status: 'Healthy',
    area: 25,
    imageUrl: 'https://images.unsplash.com/photo-1584345604325-f5091269a0d1?q=80&w=1000&auto=format&fit=crop',
    soilHealth: 'Good',
    waterEfficiency: 'High',
    biodiversityScore: 68
  },
  {
    id: '4',
    name: 'Cowpea',
    variety: 'SAMPEA 11 (IAR)',
    plantingDate: '2026-07-01',
    harvestDate: '2026-10-01',
    status: 'Healthy',
    area: 15,
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop',
    soilHealth: 'Good',
    waterEfficiency: 'High',
    biodiversityScore: 80
  },
  {
    id: '5',
    name: 'Sorghum',
    variety: 'CSR-01 (ICRISAT)',
    plantingDate: '2026-06-15',
    harvestDate: '2026-10-30',
    status: 'Needs Attention',
    area: 20,
    imageUrl: 'https://images.unsplash.com/photo-1533230537024-38c3459c9c9b?q=80&w=1000&auto=format&fit=crop',
    soilHealth: 'Degraded',
    waterEfficiency: 'Moderate',
    biodiversityScore: 35
  }
];
