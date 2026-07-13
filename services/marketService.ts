import { db } from './persistence';
import { MarketPrice } from '../types';
import { MARKET_PRICES } from '../constants';
import { fetchRealMarketPrices, isAlphaVantageConfigured } from './alphaVantageMarket';

export class MarketService {
  static async getAll(): Promise<MarketPrice[]> {
    return await db.getMarketPrices();
  }

  static async replaceAll(prices: MarketPrice[]): Promise<MarketPrice[]> {
    await db.saveMarketPrices(prices);
    return prices;
  }

  static async refreshPrices(): Promise<MarketPrice[]> {
    let currentPrices = await db.getMarketPrices();
    const currentTrends = await db.getMarketTrends();
    
    // Migration: Add missing default crops if they don't exist in current storage
    const existingNames = new Set(currentPrices.map(p => p.cropName));
    const missingDefaults = MARKET_PRICES.filter(p => !existingNames.has(p.cropName));
    
    if (missingDefaults.length > 0) {
      currentPrices = [...currentPrices, ...missingDefaults];
    }

    // If Alpha Vantage is configured, try to fetch real prices
    if (isAlphaVantageConfigured()) {
      try {
        const realPrices = await fetchRealMarketPrices();
        if (realPrices.length > 0) {
          // Merge real prices with existing data
          for (const realPrice of realPrices) {
            const idx = currentPrices.findIndex(p => p.cropName === realPrice.cropName);
            if (idx >= 0) {
              const oldPrice = currentPrices[idx].price;
              const changePct = ((realPrice.price - oldPrice) / oldPrice) * 100;
              currentPrices[idx] = {
                ...currentPrices[idx],
                price: realPrice.price,
                unit: realPrice.unit,
                trend: changePct > 0.5 ? 'up' : changePct < -0.5 ? 'down' : 'stable',
                changePercentage: Number(changePct.toFixed(1)),
              };
            } else {
              currentPrices.push({ ...realPrice, trend: 'stable', changePercentage: 0 });
            }
          }
          await db.saveMarketPrices(currentPrices);
          return currentPrices;
        }
      } catch (e) {
        console.warn('Alpha Vantage fetch failed, falling back to simulation:', e);
      }
    }

    // Fallback: simulated price updates
    const updatedPrices = currentPrices.map(item => {
      if (!currentTrends[item.cropName] || currentTrends[item.cropName].duration <= 0) {
        const rand = Math.random();
        let direction: 'UP' | 'DOWN' | 'STABLE' = 'STABLE';
        if (rand > 0.6) direction = 'UP';
        else if (rand < 0.4) direction = 'DOWN';
        
        currentTrends[item.cropName] = {
          direction,
          duration: Math.floor(Math.random() * 5) + 3
        };
      }

      const trend = currentTrends[item.cropName];
      let trendBias = 0;
      if (trend.direction === 'UP') trendBias = 0.03;
      if (trend.direction === 'DOWN') trendBias = -0.03;

      const volatility = 0.02;
      const noise = (Math.random() * volatility * 2) - volatility;

      const totalChangePercent = trendBias + noise;
      const newPrice = Math.max(0.5, Number((item.price * (1 + totalChangePercent)).toFixed(2)));

      let displayTrend: 'up' | 'down' | 'stable' = 'stable';
      if (totalChangePercent > 0.005) displayTrend = 'up';
      else if (totalChangePercent < -0.005) displayTrend = 'down';

      trend.duration -= 1;

      return { 
        ...item, 
        price: newPrice, 
        trend: displayTrend, 
        changePercentage: Number((totalChangePercent * 100).toFixed(1))
      };
    });

    await db.saveMarketPrices(updatedPrices);
    await db.saveMarketTrends(currentTrends);

    return updatedPrices;
  }
}