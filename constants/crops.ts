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
    imageUrl: '/stock/maize.svg',
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
    imageUrl: '/stock/rice.svg',
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
    imageUrl: '/stock/cassava.svg',
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
    imageUrl: '/stock/cowpea.svg',
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
    imageUrl: '/stock/sorghum.svg',
    soilHealth: 'Degraded',
    waterEfficiency: 'Moderate',
    biodiversityScore: 35
  }
];
