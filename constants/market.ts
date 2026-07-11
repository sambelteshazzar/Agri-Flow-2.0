import { MarketPrice } from '../types';

// NOTE: The `unit` string is rendered verbatim in MarketAnalytics. The currency symbol
// injected here is fallback text only — MarketAnalytics prepends userProfile.currencySymbol
// at render time (see components/MarketAnalytics.tsx). The "(local)" tag communicates that
// the price is denominated in the active user's currency regardless of country.
export const MARKET_PRICES: MarketPrice[] = [
  { cropName: 'Maize', price: 28500, unit: 'per 100kg (local)', trend: 'up', changePercentage: 8.2, inputCostIndex: 115 },
  { cropName: 'Rice (Local)', price: 52000, unit: 'per 100kg (local)', trend: 'up', changePercentage: 15.0, inputCostIndex: 108 },
  { cropName: 'Cassava', price: 18500, unit: 'per 100kg (local)', trend: 'stable', changePercentage: 1.2, inputCostIndex: 95 },
  { cropName: 'Sorghum', price: 22000, unit: 'per 100kg (local)', trend: 'up', changePercentage: 10.5, inputCostIndex: 110 },
  { cropName: 'Millet', price: 20000, unit: 'per 100kg (local)', trend: 'up', changePercentage: 12.0, inputCostIndex: 108 },
  { cropName: 'Cocoa', price: 8950, unit: 'per tonne (USD)', trend: 'up', changePercentage: 4.2, inputCostIndex: 130 },
  { cropName: 'Cowpea', price: 35000, unit: 'per 100kg (local)', trend: 'down', changePercentage: -3.5, inputCostIndex: 100 },
  { cropName: 'Groundnut', price: 42000, unit: 'per 100kg (local)', trend: 'stable', changePercentage: 0.8, inputCostIndex: 105 },
  { cropName: 'Yam', price: 45000, unit: 'per 100kg (local)', trend: 'up', changePercentage: 5.5, inputCostIndex: 98 },
  { cropName: 'Fertilizer (UREA)', price: 28000, unit: 'per 50kg (local)', trend: 'up', changePercentage: 12.5, inputCostIndex: 100 },
];
