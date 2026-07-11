import { SystemAlert, WeatherData } from '../types';

export const INITIAL_ALERTS: SystemAlert[] = [
  {
    id: '1',
    title: 'Input Cost Spike',
    message: 'Fertilizer (UREA) prices up 12.5% MoM across West African markets. Re-evaluate application rates for maize plots — cereal inflation remains elevated in Q1 2026.',
    severity: 'high',
    category: 'FINANCIAL',
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Severe Dry Spell Warning',
    message: 'PRESASS 2026 forecasts severe dry spells across the Sahel and Guinea savanna Jun-Aug. Delayed onset and shorter rainy season expected — plan supplemental irrigation.',
    severity: 'critical',
    category: 'WEATHER',
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '3',
    title: 'Food Insecurity Alert',
    message: 'CILSS projects over 30 million West Africans acutely food insecure (CH Phase 3+, Jun-Aug 2026 lean season). Sahel and northern savanna zones most at risk — plan accordingly.',
    severity: 'high',
    category: 'LAND',
    timestamp: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: '4',
    title: 'Cereal Production Below Average',
    message: 'West Africa 2024 cereal output estimated 3% below five-year average. Dry spells, floods and Fall Armyworm outbreaks affected yields across the region.',
    severity: 'medium',
    category: 'SYSTEM',
    timestamp: new Date(Date.now() - 10800000).toISOString()
  }
];

export const MOCK_WEATHER: WeatherData = {
  locationName: 'West African Savanna',
  temp: 34,
  condition: 'Dry Spell Advisory',
  humidity: 35,
  windSpeed: 20,
  forecast: 'PRESASS 2026 forecasts average to above-average Sahel and Savanna rainfall Jun-Sep, but severe dry spells likely in the Sahel belt (Jun-Aug). Delayed onset in northern regions.',
  climateRiskIndex: 'High'
};
