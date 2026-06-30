import getCropImage from './getCropImage';

const CROP_TEMPLATES = [
  {
    name: 'Maize',
    variety: 'Drought-Tol OBA Super 2',
    plantingDate: '2026-05-15',
    harvestDate: '2026-09-30',
    status: 'Healthy' as const,
    area: 50,
    imageUrl: getCropImage('Maize'),
    soilHealth: 'Degraded' as const,
    waterEfficiency: 'Low' as const,
    biodiversityScore: 22
  },
  {
    name: 'Rice',
    variety: 'NERICA L-34 (Lowland)',
    plantingDate: '2026-06-01',
    harvestDate: '2026-10-15',
    status: 'Healthy' as const,
    area: 30,
    imageUrl: getCropImage('Rice'),
    soilHealth: 'Good' as const,
    waterEfficiency: 'Moderate' as const,
    biodiversityScore: 55
  },
  {
    name: 'Millet',
    variety: 'SOSAT-C88 (ICRISAT)',
    plantingDate: '2026-06-15',
    harvestDate: '2026-10-30',
    status: 'Healthy' as const,
    area: 20,
    imageUrl: getCropImage('Millet'),
    soilHealth: 'Excellent' as const,
    waterEfficiency: 'High' as const,
    biodiversityScore: 40
  },
  {
    name: 'Cassava',
    variety: 'TMS 30572 (IITA)',
    plantingDate: '2026-04-01',
    harvestDate: '2027-01-15',
    status: 'Healthy' as const,
    area: 25,
    imageUrl: getCropImage('Cassava'),
    soilHealth: 'Degraded' as const,
    waterEfficiency: 'High' as const,
    biodiversityScore: 30
  },
  {
    name: 'Yam',
    variety: 'Dioscorea rotundata (White Yam)',
    plantingDate: '2026-03-15',
    harvestDate: '2026-11-30',
    status: 'Healthy' as const,
    area: 15,
    imageUrl: getCropImage('Yam'),
    soilHealth: 'Good' as const,
    waterEfficiency: 'Moderate' as const,
    biodiversityScore: 45
  },
  {
    name: 'Sorghum',
    variety: 'CSR-03 (ICRISAT)',
    plantingDate: '2026-06-01',
    harvestDate: '2026-10-15',
    status: 'Healthy' as const,
    area: 35,
    imageUrl: getCropImage('Sorghum'),
    soilHealth: 'Degraded' as const,
    waterEfficiency: 'High' as const,
    biodiversityScore: 35
  },
  {
    name: 'Groundnut',
    variety: 'SAMNUT 24 (IITA)',
    plantingDate: '2026-06-15',
    harvestDate: '2026-10-01',
    status: 'Healthy' as const,
    area: 20,
    imageUrl: getCropImage('Groundnut'),
    soilHealth: 'Good' as const,
    waterEfficiency: 'Moderate' as const,
    biodiversityScore: 60
  },
  {
    name: 'Cowpea',
    variety: 'IT89KD-374 (IITA)',
    plantingDate: '2026-07-01',
    harvestDate: '2026-09-30',
    status: 'Healthy' as const,
    area: 15,
    imageUrl: getCropImage('Cowpea'),
    soilHealth: 'Good' as const,
    waterEfficiency: 'High' as const,
    biodiversityScore: 65
  }
];

export default CROP_TEMPLATES;
