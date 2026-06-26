import { MarketPrice } from '../types';

export const MARKET_PRICES: MarketPrice[] = [
  { cropName: 'Maize', price: 28500, unit: 'per 100kg (NGN)', trend: 'up', changePercentage: 8.2, inputCostIndex: 115 },
  { cropName: 'Rice (Local)', price: 52000, unit: 'per 100kg (NGN)', trend: 'up', changePercentage: 15.0, inputCostIndex: 108 },
  { cropName: 'Cassava', price: 18500, unit: 'per 100kg (NGN)', trend: 'stable', changePercentage: 1.2, inputCostIndex: 95 },
  { cropName: 'Sorghum', price: 22000, unit: 'per 100kg (NGN)', trend: 'up', changePercentage: 10.5, inputCostIndex: 110 },
  { cropName: 'Millet', price: 20000, unit: 'per 100kg (NGN)', trend: 'up', changePercentage: 12.0, inputCostIndex: 108 },
  { cropName: 'Cocoa', price: 8950, unit: 'per ton (USD)', trend: 'up', changePercentage: 4.2, inputCostIndex: 130 },
  { cropName: 'Cowpea', price: 35000, unit: 'per 100kg (NGN)', trend: 'down', changePercentage: -3.5, inputCostIndex: 100 },
  { cropName: 'Groundnut', price: 42000, unit: 'per 100kg (NGN)', trend: 'stable', changePercentage: 0.8, inputCostIndex: 105 },
  { cropName: 'Yam', price: 45000, unit: 'per 100kg (NGN)', trend: 'up', changePercentage: 5.5, inputCostIndex: 98 },
  { cropName: 'Fertilizer (UREA)', price: 28000, unit: 'per 50kg (NGN)', trend: 'up', changePercentage: 12.5, inputCostIndex: 100 },
];
