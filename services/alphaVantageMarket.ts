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

// Module-level in-flight promise so two concurrent refreshes don't both hit
// the rate-limited API.
let inflightFetch: Promise<MarketPrice[]> | null = null;

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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const quote = data['Global Quote'];
    if (!quote || !quote['05. price']) return null;
    
    const price = parseFloat(quote['05. price']);
    return { price, unit: 'USD' };
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      console.warn(`Alpha Vantage request timeout for ${symbol}`);
    }
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

  // In-flight dedupe: if a fetch is already running, await it instead of
  // starting a second one (which would hit the API rate limit instantly).
  if (inflightFetch) return inflightFetch;

  inflightFetch = (async () => {
    const results: MarketPrice[] = [];

    // Free Alpha Vantage tier is 5 req/min. We split the ~9 symbols into two
    // batches of 5 (with one overlap allowed) and run each batch in parallel.
    // Total wall time: ~12s + 60s = 72s in the worst case (was 96s serial),
    // and concurrent calls inside a batch don't trip the per-minute cap.
    const symbols = Object.entries(ALPHA_VANTAGE_SYMBOLS);
    const BATCH_SIZE = 5;
    const runBatch = async (batch: typeof symbols): Promise<MarketPrice[]> => {
      const settled = await Promise.all(
        batch.map(async ([name, info]): Promise<MarketPrice | null> => {
          try {
            const result = await fetchFromAlphaVantage(info.symbol);
            if (result) {
              return {
                cropName: info.name,
                price: result.price,
                unit: info.unit,
                trend: 'stable',
                changePercentage: 0,
                inputCostIndex: 100,
              } satisfies MarketPrice;
            }
          } catch {
            // swallow — handled by returning null, filtered below
          }
          return null;
        })
      );
      return settled.filter((r): r is MarketPrice => r !== null);
    };

    for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
      const batch = symbols.slice(i, i + BATCH_SIZE);
      const batchResults = await runBatch(batch);
      results.push(...batchResults);
      // If there's a next batch, wait ~60s to respect the 5 req/min cap.
      if (i + BATCH_SIZE < symbols.length) {
        await new Promise(r => setTimeout(r, 60000));
      }
    }

    if (results.length > 0) {
      setCache('latest', results);
    }

    return results;
  })().finally(() => {
    inflightFetch = null;
  });

  return inflightFetch;
}