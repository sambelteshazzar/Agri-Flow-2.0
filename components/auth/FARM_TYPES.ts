import { Wheat, Tractor, Sprout } from 'lucide-react';

const FARM_TYPES = [
  { value: 'crop', label: 'Crops', icon: Wheat, desc: 'Grains, vegetables, cash crops' },
  { value: 'livestock', label: 'Livestock', icon: Tractor, desc: 'Cattle, goats, poultry' },
  { value: 'mixed', label: 'Mixed', icon: Sprout, desc: 'Both crops & livestock' },
] as const;

export default FARM_TYPES;
