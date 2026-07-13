import type { MarketPrice } from '../types';

// Alpha Vantage commodity symbols
const ALPHA_VANTAGE_SYMBOLS: Record<string, { symbol: string; name: string; unit: string }> = {
  'Maize': { symbol: 'CORN', name: 'Maize', unit: 'USD/bushel' },
  'Rice': { symbol: 'RICE', name: 'Rice', unit: 'USD/cwt' },
  'Wheat': { symbol: 'WHEAT', name: 'Wheat', unit: 'USD/bushel' },
  'Soybeans': { symbol: 'SOYB', name: 'Soybeans', unit: 'USD/bushel' },
  'Coffee': { symbol: 'COFFEE', name: 'Coffee', unit: 'USD/lb' },
  'Cocoa': { symbol: 'COCOA', name: 'Cocoa', unit: 'USD/MT' },
  'Sugar': { symbol: 'SUGAR', name: 'Sugar', unit: 'USD/lb' },
  'Cotton': { symbol: 'COTTON', name: 'Cotton', unit: 'USD/lb' },
  'Palm Oil': { symbol: 'PALM', name: 'Palm Oil', unit: 'USD/MT' },
};

const CACHE_KEY = 'alphavantage_market_cache';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getCache(): Map<string, { data: MarketPrice[]; timestamp: number }> {
  if (typeof window === 'undefined') return new Map();
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return new Map(Object.entries(parsed));
    }
  } catch {}
  return new Map();
}

function setCache(key: string, data: MarketPrice[]): void {
  if (typeof window === 'undefined') return;
  try {
    const cache = getCache();
    cache.set(key, { data, timestamp: Date.now() });
    localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(cache)));
  } catch {}
}

export function isAlphaVantageConfigured(): boolean {
  return !!(import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || '');
}

async function fetchFromAlphaVantage(symbol: string): Promise<{ price: number; unit: string } | null> {
  const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
  if (!apiKey) return null;

  // Use GLOBAL_QUOTE endpoint for commodities
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = await response.json();
    const quote = data['Global Quote'];
    if (!quote || !quote['05. price']) return null;
    
    const price = parseFloat(quote['05. price']);
    return { price, unit: 'USD' };
  } catch {
    return null;
  }
}

export async function fetchRealMarketPrices(): Promise<MarketPrice[]> {
  const cache = getCache();
  const cached = cache.get('latest');
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  if (!isAlphaVantageConfigured()) return [];

  const results: MarketPrice[] = [];
  
  // Fetch for each commodity we care about
  for (const [name, info] of Object.entries(ALPHA_VANTAGE_SYMBOLS)) {
    try {
      const result = await fetchFromAlphaVantage(info.symbol);
      if (result) {
        results.push({
          cropName: info.name,
          price: result.price,
          unit: info.unit,
          trend: 'stable',
          changePercentage: 0,
        });
      }
      // Rate limit: 5 requests/minute for free tier
      await new Promise(r => setTimeout(r, 12000));
    } catch {
      continue;
    }
  }

  if (results.length > 0) {
    setCache('latest', results);
  }

  return results;
}