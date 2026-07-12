import { getStockImage } from '@/utils/stockImages';

export default function getCropImage(cropName: string): string {
  return getStockImage(cropName);
}