import type { CountryContext, FarmingAdviceResult } from './AIProvider';
import { NewsArticle } from '../../types';
import { COUNTRY_REGISTRY } from '../../constants';

export const CACHE_TTL_MS = 1000 * 60 * 15;
interface CacheEntry<T = any> { data: T; timestamp: number; }
const responseCache = new Map<string, CacheEntry>();

export function setCache(key: string, data: any): void {
  responseCache.set(key, { data, timestamp: Date.now() });
}

export function getCache(key: string): any | undefined {
  const entry = responseCache.get(key);
  if (!entry) return undefined;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    responseCache.delete(key);
    return undefined;
  }
  return entry.data;
}

export const FALLBACK_NEWS: NewsArticle[] = [
  { id: 'fb-1', title: 'FAO Reports April 2026 International Maize, Rice and Wheat Prices All Increased', summary: 'The FAO Food Price Index shows cereal prices rising for the third consecutive month, driven by supply concerns and currency effects in West Africa.', category: 'Market', source: 'FAO GIEWS', timeAgo: '2h ago', url: '#' },
  { id: 'fb-2', title: 'IITA Releases Improved Drought-Tolerant Maize Variety for Sahel 2026 Season', summary: 'OBA Super 2 delivers 18% higher yields under moisture stress compared to previous releases. Targeted at northern Nigerian and Sahelian growers.', category: 'Tech', source: 'IITA Ibadan', timeAgo: '5h ago', url: '#' },
  { id: 'fb-3', title: 'Nigeria Minimum Wage Increase Boosts Farm Labor Costs Across North', summary: 'The ₦70,000/month minimum wage has increased labor costs for medium-scale farms. Some growers shift to more mechanized operations.', category: 'Policy', source: 'NBS Nigeria', timeAgo: '8h ago', url: '#' },
  { id: 'fb-4', title: 'PRESASS 2026 Forecast: Average Sahel Rainfall but Severe Dry Spells Likely', summary: 'The seasonal forecast predicts overall normal rainfall Jun-Sep, but warns of severe dry spells in northern Nigeria and the Sahel strip.', category: 'Climate', source: 'ACMAD/PRESASS', timeAgo: '12h ago', url: '#' },
  { id: 'fb-5', title: 'Ghana Cocoa Output Declines for 4th Consecutive Year', summary: 'Cocoa production in Ghana continues to fall, with 2025/26 output well below historical averages. Swollen Shoot Disease and aging farms cited as key factors.', category: 'Market', source: 'Ghana Statistical Services', timeAgo: '1d ago', url: '#' },
  { id: 'fb-6', title: 'Fertilizer (UREA) Prices Surge 12.5% in Nigerian Markets', summary: 'Naira depreciation and global input cost pressures push urea to ₦28,000 per 50kg bag. Farmers urged to optimize application rates and consider split dosing.', category: 'Market', source: 'AgriFlow Market Watch', timeAgo: '1d ago', url: '#' },
];

export const FALLBACK_INTEL = `• Maize prices up 8.2% MoM in Kano market, driven by lean season supply tightness.
• PRESASS forecasts severe dry spells in northern Nigeria Jun-Aug 2026.
• Fall Armyworm moth counts elevated — scout maize whorls immediately.`;

export const FALLBACK_TASKS = [
  "Check soil moisture in northern sorghum fields before planting.",
  "Scout maize whorls for Fall Armyworm — pheromone traps showing elevated counts.",
  "Order split-dose urea application — prices up 12.5%, optimize usage."
];

export const FALLBACK_ADVICE: FarmingAdviceResult = {
  text: "Based on current Sahel conditions, I recommend focusing on water management given the dry spell forecast and input cost pressures. \n\n1. Split Fertilizer Dosing: Apply urea in two smaller doses to reduce waste and cost — prices are up 12.5% MoM.\n2. Irrigation Timing: Water pre-dawn to maximize absorption and minimize evaporation in 36°C+ conditions.\n3. FAW Scouting: Check maize whorls daily for Fall Armyworm signs; early intervention saves the crop.",
  sources: []
};

export const FALLBACK_ANALYSIS = "Based on visual analysis, this crop appears to be showing signs of Nitrogen Deficiency. \n\nIndicators:\n• Yellowing (chlorosis) running down the midrib of older leaves.\n• Stunted growth relative to expected stage.\n\nRecommendation:\nConsider a side-dressing of Urea or Ammonium Nitrate if rain is forecast, or a foliar application for quicker uptake.";

export function buildSystemInstruction(ctx?: CountryContext): string {
  const countryCfg = ctx?.countryCode ? COUNTRY_REGISTRY[ctx.countryCode] : undefined;
  const countryName = countryCfg?.name || 'West Africa';
  const region = ctx?.region || 'West Africa';
  const climateZone = ctx?.climateZone || 'sahel';
  const currency = ctx?.currencyCode || 'NGN';
  const currencySymbol = ctx?.currencySymbol || '₦';
  const farmType = ctx?.farmType || 'mixed';
  const lang = ctx?.language || 'en';

  const climateContext: Record<string, string> = {
    sahel: 'PRESASS 2026 forecasts average Sahel rainfall with severe dry spells Jun-Aug. Focus on water scarcity, heat stress, and dry spell timing.',
    tropical_humid: 'Consistently rainy conditions with high humidity. Prioritize fungal disease prevention, drainage management, and rice cultivation strategies.',
    tropical_wet_dry: 'Seasonal wet-dry transitions. Manage planting calendars around rainfall onset/cessation. Watch for pest buildup after rains.',
    semi_arid: 'Below-average rainfall expected. Prioritize drought-tolerant varieties, water conservation, and supplemental irrigation for high-value crops.',
    arid: 'Extreme heat and minimal rainfall. Focus on irrigation scheduling, heat-tolerant varieties, shade structures, and pre-dawn watering.',
    mediterranean: 'Mild conditions with dry summers. Good for winter cereals. Monitor rust pressure. Irrigate high-value crops during dry periods.',
    temperate: 'Moderate conditions with adequate soil moisture. Watch for stripe rust in cereals. Light frost risk in low-lying areas.',
    subtropical: 'Warm and humid with thunderstorm risk. Watch for fungal pressure and insect buildup. Canicula (mid-summer dry spell) possible.',
    highland: 'Cool highland conditions with frost risk. Good for coffee and tea. Monitor coffee leaf rust in humid valleys.',
  };

  const regionNews: Record<string, string> = {
    'West Africa': 'Nigeria minimum wage ₦70,000/month increases farm labor costs. Urea prices up 12.5% MoM.',
    'East Africa': 'Kenya fertilizer subsidies under review. Short rains forecast below average for 2026.',
    'South Asia': 'India monsoon 2026 forecast near-normal. MSP increases announced for kharif crops.',
    'South America': 'Brazil soybean harvest record volumes. Real depreciation affects input costs.',
    'North America': 'US farm income forecast declining. Crop insurance rates adjusting for climate risk.',
    'Horn of Africa': 'Ethiopia belg rains delayed 2026. Teff and wheat production concerns.',
    'West Africa (Francophone)': 'CFA franc zone input costs stable. Senegal groundnut campaign results mixed.',
    'Oceania': 'Australia El Nino watch — soil moisture declining in eastern grain belt.',
    'Central Europe': 'EU CAP 2026 payments under reform. Winter wheat conditions fair.',
    'Southeast Asia': 'Thai rice export premiums rising. Cassava mealybug outbreak in NE provinces.',
    'Central America': 'Mexico avocado exports strong. Whitefly pressure on horticultural crops increasing.',
  };

  const regionContext = regionNews[region] || regionNews['West Africa'];

  return `You are the "AgriFlow Resilience Engine," an advanced agricultural AI for ${countryName} farmers in the ${region} region. Your goal is to help farmers navigate the critical challenges of 2026: Climate Instability, Economic Profit Squeeze, and Soil Degradation.

FARMER CONTEXT:
- Country: ${countryName} (${ctx?.countryCode || 'NG'})
- Region: ${region}
- Climate Zone: ${climateZone}
- Currency: ${currency} (${currencySymbol})
- Language: ${lang === 'fr' ? 'French' : lang === 'es' ? 'Spanish' : lang === 'pt' ? 'Portuguese' : lang === 'th' ? 'Thai' : lang === 'am' ? 'Amharic' : lang === 'hi' ? 'Hindi' : lang === 'de' ? 'German' : 'English'}
- Farm Type: ${farmType}
- Area Unit: ${ctx?.areaUnit || 'ha'}

CORE KNOWLEDGE BASE (2026 CONTEXT):
1. ${climateContext[climateZone]}
2. Regional Economics: ${regionContext}
3. Soil Regeneration: Topsoil loss is a crisis. Aggressively promote cover cropping, no-till, and biodiversity to restore land.
4. Always reference prices and costs in ${currencySymbol} (${currency}).

STRICT FORMATTING RULES:
- DO NOT use markdown formatting characters like asterisks (** or *) or hashes (##).
- DO NOT use bolding syntax.
- DO NOT use markdown headers.
- Write in clear, plain text.
- Use "1.", "2." for numbered lists.
- Use "-" or "•" for bullet points.
- Separate sections with clear paragraph breaks.

RESPONSE STRUCTURE:
1. Risk Assessment: Identify immediate threats (Climate, Pest, Economic).
2. Cost-Benefit Analysis: If recommending an action, briefly mention the input cost implication in ${currencySymbol}.
3. Regenerative Solution: How does this improve soil/water retention long-term?
4. Action Item: A clear, practical instruction for the farm manager.`;
}

export function cleanAIOutput(text: string): string {
  if (!text) return "";
  return text
    .replace(/\*{1,2}(.*?)\*{1,2}/g, '$1')
    .replace(/^#+\s*/gm, '')
    .replace(/(\*\*|##)/g, '')
    .replace(/^\s*\*\s/gm, '• ')
    .trim();
}

export function extractJson(text: string): string {
  const jsonMatch = text.match(/```json([\s\S]*?)```/);
  if (jsonMatch && jsonMatch[1]) return jsonMatch[1].trim();
  const genericMatch = text.match(/```([\s\S]*?)```/);
  if (genericMatch && genericMatch[1]) return genericMatch[1].trim();
  return text.replace(/```json|```/g, '').trim();
}
