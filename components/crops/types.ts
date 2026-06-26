import { Crop } from '@/types';

export interface Suggestion {
  cropId: string;
  cropName: string;
  suggestedStatus: Crop['status'];
  reason: string;
  type: 'HARVEST' | 'HEALTH';
}
