import { useMemo } from 'react';
import { SystemAlert, MarketPrice } from '../types';
import { LocationAlerts } from '../components/community/types';

export function useLocationAlerts(alerts: SystemAlert[], marketPrices: MarketPrice[]): LocationAlerts {
  return useMemo(() => {
    const weatherAlerts = alerts.filter(a => a.category === 'WEATHER').slice(0, 2);
    const priceAlerts = marketPrices
      .filter(p => Math.abs(p.changePercentage) >= 5)
      .slice(0, 3)
      .map(p => ({
        id: `price-${p.cropName}`,
        title: `${p.cropName} Price ${p.trend === 'up' ? 'Surge' : 'Drop'}`,
        message: `${p.cropName} is ${p.trend === 'up' ? 'up' : 'down'} ${Math.abs(p.changePercentage).toFixed(1)}% this week`,
        severity: Math.abs(p.changePercentage) >= 10 ? 'high' : 'medium' as 'high' | 'medium'
      }));
    return { weather: weatherAlerts, prices: priceAlerts };
  }, [alerts, marketPrices]);
}