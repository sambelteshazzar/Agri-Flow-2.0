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
  }
];

export default CROP_TEMPLATES;
