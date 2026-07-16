import { WeatherData, ClimateZone } from '../types';
import { COUNTRY_REGISTRY } from '../constants';

const OWM_API_KEY = import.meta.env.VITE_OWM_API_KEY || '';

interface OWMForecastItem {
  dt: number;
  main: { temp: number; humidity: number };
  weather: { main: string; description: string; id: number }[];
  wind: { speed: number };
}

interface OWMResponse {
  name: string;
  main: { temp: number; humidity: number };
  weather: { main: string; description: string; id: number }[];
  wind: { speed: number };
  coord?: { lat: number; lon: number };
  list?: OWMForecastItem[];
  city?: { name: string };
}

const CLIMATE_CONDITIONS: Record<ClimateZone, { conditions: string[]; riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe'; baseTempRange: [number, number]; baseHumidityRange: [number, number]; baseWindRange: [number, number] }> = {
  sahel: { conditions: ['Dry Spell Advisory', 'Hot and Hazy', 'Sunny', 'Dust Advisory', 'Partly Cloudy'], riskLevel: 'High', baseTempRange: [32, 42], baseHumidityRange: [20, 45], baseWindRange: [12, 28] },
  tropical_humid: { conditions: ['Rainy Season', 'Tropical Showers', 'Overcast', 'Partly Cloudy', 'High Humidity'], riskLevel: 'Moderate', baseTempRange: [26, 34], baseHumidityRange: [70, 95], baseWindRange: [4, 15] },
  tropical_wet_dry: { conditions: ['Rainy Season', 'Shower Expected', 'Partly Cloudy', 'Dry Season', 'Humid Morning'], riskLevel: 'Moderate', baseTempRange: [24, 36], baseHumidityRange: [40, 85], baseWindRange: [5, 18] },
  semi_arid: { conditions: ['Partly Cloudy', 'Dry and Warm', 'Sunny', 'Heat Advisory', 'Low Rainfall'], riskLevel: 'Moderate', baseTempRange: [22, 38], baseHumidityRange: [25, 50], baseWindRange: [10, 25] },
  arid: { conditions: ['Hot and Dry', 'Heat Wave', 'Clear Sky', 'Dust Advisory', 'Sunny'], riskLevel: 'High', baseTempRange: [35, 48], baseHumidityRange: [10, 30], baseWindRange: [8, 22] },
  mediterranean: { conditions: ['Partly Cloudy', 'Sunny', 'Mild and Dry', 'Rain Expected', 'Cool Morning'], riskLevel: 'Low', baseTempRange: [14, 30], baseHumidityRange: [40, 70], baseWindRange: [8, 20] },
  temperate: { conditions: ['Partly Cloudy', 'Overcast', 'Light Rain', 'Sunny', 'Cool and Breezy'], riskLevel: 'Low', baseTempRange: [8, 24], baseHumidityRange: [50, 80], baseWindRange: [8, 22] },
  subtropical: { conditions: ['Partly Cloudy', 'Warm and Humid', 'Rainy Season', 'Thunderstorm Risk', 'Sunny'], riskLevel: 'Moderate', baseTempRange: [20, 34], baseHumidityRange: [50, 85], baseWindRange: [6, 18] },
  highland: { conditions: ['Cool and Clear', 'Partly Cloudy', 'Frost Warning', 'Mild Afternoon', 'Overcast'], riskLevel: 'Moderate', baseTempRange: [8, 22], baseHumidityRange: [40, 75], baseWindRange: [10, 25] },
};

const FORECASTS: Record<ClimateZone, string[]> = {
  sahel: [
    'PRESASS forecasts average to above-average Sahel rainfall Jun-Sep 2026, but severe dry spells likely in northern regions. Delayed onset expected.',
    'Hot and dry conditions persisting. Monitor soil moisture and increase irrigation frequency for young transplants.',
    'Harmattan dust haze reducing visibility. Livestock respiratory risk — provide shelter and clean water.',
  ],
  tropical_humid: [
    'Rainy season established. Regular rainfall expected — ensure drainage channels clear. Monitor for fungal pressure.',
    'High humidity and warm temperatures. Watch for fungal diseases on susceptible crops. Good conditions for rice.',
    'Intermittent showers expected. Delay fertilizer application to avoid runoff.',
  ],
  tropical_wet_dry: [
    'Seasonal transition period. Variable rainfall expected. Monitor soil moisture and adjust irrigation accordingly.',
    'Rainy season progressing normally. Good conditions for main crop planting. Watch for pest buildup after rains.',
    'Dry season conditions possible. Conserve water for critical growth stages.',
  ],
  semi_arid: [
    'Below-average rainfall expected. Prioritize drought-tolerant varieties and water conservation measures.',
    'Warm days, cool nights. Good conditions for grain filling. Monitor stored soil moisture.',
    'Low rainfall period. Consider supplemental irrigation for high-value crops.',
  ],
  arid: [
    'Extreme heat warning. Provide shade for livestock and increase watering frequency. Avoid midday field work.',
    'Persistent dry conditions. Rely on irrigation scheduling — apply water pre-dawn to reduce evaporation.',
    'Hot and dry. Minimal rainfall expected. Focus on heat-tolerant crop varieties.',
  ],
  mediterranean: [
    'Mild conditions with occasional rain. Good for winter cereal development. Monitor for rust pressure.',
    'Dry period expected. Irrigate high-value crops. Cool nights helping grain quality.',
    'Moderate temperatures. Adequate soil moisture. Low disease pressure — apply preventive sprays before rain.',
  ],
  temperate: [
    'Mild spring conditions. Adequate soil moisture for cereal crops. Monitor for stripe rust in susceptible varieties.',
    'Cool and damp. Watch for fungal diseases on winter wheat. Field operations possible between showers.',
    'Light frost risk in low-lying areas overnight. Protect sensitive horticultural crops.',
  ],
  subtropical: [
    'Warm and humid. Good growing conditions. Watch for fungal pressure and insect buildup.',
    'Rainy period with thunderstorm risk. Ensure drainage is adequate. Delay sprays to avoid wash-off.',
    'Canicula (mid-summer dry spell) possible. Prepare supplemental irrigation for fruit trees and maize.',
  ],
  highland: [
    'Cool highland conditions. Frost risk in early morning — cover sensitive crops. Good conditions for coffee and tea.',
    'Mild daytime temperatures. Monitor for coffee leaf rust in humid valleys. Regular rainfall expected.',
    'Temperature fluctuations expected. Protect young seedlings from cold nights. Good irrigation window.',
  ],
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateRegionWeather(climateZone: ClimateZone, defaults: Partial<WeatherData>): WeatherData {
  const now = new Date();
  const hour = now.getHours();
  const daySeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const rng = seededRandom(daySeed + hour);

  const climate = CLIMATE_CONDITIONS[climateZone];
  const forecastOptions = FORECASTS[climateZone] || FORECASTS.temperate;

  const [minT, maxT] = climate.baseTempRange;
  const temp = defaults.temp ?? Math.round(minT + rng() * (maxT - minT));
  const [minH, maxH] = climate.baseHumidityRange;
  const humidity = defaults.humidity ?? Math.round(minH + rng() * (maxH - minH));
  const [minW, maxW] = climate.baseWindRange;
  const windSpeed = defaults.windSpeed ?? Math.round(minW + rng() * (maxW - minW));

  const condition = defaults.condition ?? climate.conditions[Math.floor(rng() * climate.conditions.length)];
  const riskLevel = defaults.climateRiskIndex ?? (rng() < 0.3 ? climate.riskLevel : rng() < 0.6 ? 'Moderate' : 'Low');
  const forecast = defaults.forecast ?? forecastOptions[Math.floor(rng() * forecastOptions.length)];
  const locationName = defaults.locationName ?? climateZone;

  return { locationName, temp, condition, humidity, windSpeed, forecast, climateRiskIndex: riskLevel };
}

export class WeatherService {
  static async getLocalWeather(lat: number, lon: number, countryCode?: string): Promise<WeatherData> {
    if (OWM_API_KEY) {
      try {
        const current = await WeatherService.fetchOWMCurrent(lat, lon);
        if (current) return current;
      } catch (e) {
        console.warn('OWM current weather failed, falling back:', e);
      }
    }

    const countryCfg = countryCode ? COUNTRY_REGISTRY[countryCode] : undefined;
    const climateZone = countryCfg?.climateZone ?? 'temperate';
    const defaults = countryCfg?.weatherDefaults ?? {};

    await new Promise(resolve => setTimeout(resolve, 400));
    return generateRegionWeather(climateZone, defaults);
  }

  static async fetchOWMCurrent(lat: number, lon: number): Promise<WeatherData | null> {
    if (!OWM_API_KEY) return null;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OWM_API_KEY}`;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!res.ok) return null;

      const data: OWMResponse = await res.json();
    const condition = data.weather?.[0]?.main ?? 'Partly Cloudy';
    const weatherId = data.weather?.[0]?.id ?? 800;
    const temp = Math.round(data.main?.temp ?? 20);
    const humidity = data.main?.humidity ?? 50;
    const windSpeed = Math.round((data.wind?.speed ?? 5) * 3.6);

    let riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';
    if (temp > 40 || weatherId < 300) riskLevel = 'Severe';
    else if (temp > 35 || weatherId < 600) riskLevel = 'High';
    else if (weatherId < 700 || humidity > 85) riskLevel = 'Moderate';

    let forecast: string;
    switch (true) {
      case weatherId < 300: forecast = 'Severe thunderstorm warning. Secure livestock and equipment. Avoid field operations.'; break;
      case weatherId < 400: forecast = 'Rain expected. Delay pesticide and fertilizer application to prevent wash-off.'; break;
      case weatherId < 600: forecast = 'Showers likely. Monitor drainage and adjust field schedules accordingly.'; break;
      case weatherId < 700: forecast = 'Low visibility conditions. Fog may affect morning spraying operations.'; break;
      case temp > 35: forecast = 'Extreme heat. Increase irrigation frequency. Provide shade for livestock.'; break;
      case temp > 28: forecast = 'Warm conditions. Monitor for heat stress in young plants and livestock.'; break;
      default: forecast = 'Moderate conditions. Good window for field operations and crop scouting.'; break;
    }

    return {
      locationName: data.name || `Field at ${lat.toFixed(2)}, ${lon.toFixed(2)}`,
      temp,
      condition,
      humidity,
      windSpeed,
      forecast,
      climateRiskIndex: riskLevel,
    };
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      console.warn('OWM request timeout');
    }
    return null;
  }
}
}
