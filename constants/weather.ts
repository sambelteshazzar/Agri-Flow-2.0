import { SystemAlert, WeatherData } from '../types';

export const INITIAL_ALERTS: SystemAlert[] = [
  {
    id: '1',
    title: 'Input Cost Spike',
    message: 'Fertilizer (UREA) prices up 12.5% MoM. Re-evaluate application rates for maize plots — NBS reports food inflation at 22.8% (Q1 2026, rebased CPI).',
    severity: 'high',
    category: 'FINANCIAL',
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Severe Dry Spell Warning',
    message: 'Nigerian Met Agency forecasts severe dry spell in northern regions Jun-Aug 2026. Delayed onset and shorter rainy season expected in NE and North-Central zones.',
    severity: 'critical',
    category: 'WEATHER',
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '3',
    title: 'Food Insecurity Alert',
    message: '33.2 million Nigerians projected acutely food insecure (CH Phase 3+, Jun-Aug 2026 lean season). Northeast and Northwest zones most at risk — plan accordingly.',
    severity: 'high',
    category: 'LAND',
    timestamp: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: '4',
    title: 'Cereal Production Below Average',
    message: 'Nigeria 2024 cereal output estimated at 28.5M tonnes — 3% below five-year average. Dry spells, floods and pest outbreaks affected yields across the country.',
    severity: 'medium',
    category: 'SYSTEM',
    timestamp: new Date(Date.now() - 10800000).toISOString()
  }
];

export const MOCK_WEATHER: WeatherData = {
  locationName: 'Kano Station, Nigeria',
  temp: 36,
  condition: 'Dry Spell Advisory',
  humidity: 32,
  windSpeed: 22,
  forecast: 'PRESASS forecasts average to above-average Sahel rainfall Jun-Sep 2026, but severe dry spells likely in northern Nigeria (Jun-Aug). Delayed onset in North-Central zone.',
  climateRiskIndex: 'High'
};
