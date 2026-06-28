import type { AIProvider, CountryContext, FarmingAdviceResult } from './AIProvider';
import { WeatherData, Crop, NewsArticle } from '../../types';
import { COUNTRY_REGISTRY } from '../../constants';

const VITE_NVIDIA_KEY = import.meta.env.VITE_NVIDIA_API_KEY || '';

const TEXT_MODEL = 'nvidia/llama-3.3-nemotron-super-49b-v1';
const VISION_MODEL = 'microsoft/phi-4-multimodal-instruct';
const API_BASE = 'https://integrate.api.nvidia.com/v1';

const CACHE_TTL_MS = 1000 * 60 * 15;
interface CacheEntry<T = any> { data: T; timestamp: number; }
const responseCache = new Map<string, CacheEntry>();

function setCache(key: string, data: any): void {
  responseCache.set(key, { data, timestamp: Date.now() });
}

function getCache(key: string): any | undefined {
  const entry = responseCache.get(key);
  if (!entry) return undefined;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    responseCache.delete(key);
    return undefined;
  }
  return entry.data;
}

const FALLBACK_NEWS: NewsArticle[] = [
  { id: 'fb-1', title: 'FAO Reports April 2026 International Maize, Rice and Wheat Prices All Increased', summary: 'The FAO Food Price Index shows cereal prices rising for the third consecutive month, driven by supply concerns and currency effects in West Africa.', category: 'Market', source: 'FAO GIEWS', timeAgo: '2h ago', url: '#' },
  { id: 'fb-2', title: 'IITA Releases Improved Drought-Tolerant Maize Variety for Sahel 2026 Season', summary: 'OBA Super 2 delivers 18% higher yields under moisture stress compared to previous releases. Targeted at northern Nigerian and Sahelian growers.', category: 'Tech', source: 'IITA Ibadan', timeAgo: '5h ago', url: '#' },
  { id: 'fb-3', title: 'Nigeria Minimum Wage Increase Boosts Farm Labor Costs Across North', summary: 'The ₦70,000/month minimum wage has increased labor costs for medium-scale farms. Some growers shift to more mechanized operations.', category: 'Policy', source: 'NBS Nigeria', timeAgo: '8h ago', url: '#' },
  { id: 'fb-4', title: 'PRESASS 2026 Forecast: Average Sahel Rainfall but Severe Dry Spells Likely', summary: 'The seasonal forecast predicts overall normal rainfall Jun-Sep, but warns of severe dry spells in northern Nigeria and the Sahel strip.', category: 'Climate', source: 'ACMAD/PRESASS', timeAgo: '12h ago', url: '#' },
  { id: 'fb-5', title: 'Ghana Cocoa Output Declines for 4th Consecutive Year', summary: 'Cocoa production in Ghana continues to fall, with 2025/26 output well below historical averages. Swollen Shoot Disease and aging farms cited as key factors.', category: 'Market', source: 'Ghana Statistical Services', timeAgo: '1d ago', url: '#' },
  { id: 'fb-6', title: 'Fertilizer (UREA) Prices Surge 12.5% in Nigerian Markets', summary: 'Naira depreciation and global input cost pressures push urea to ₦28,000 per 50kg bag. Farmers urged to optimize application rates and consider split dosing.', category: 'Market', source: 'AgriFlow Market Watch', timeAgo: '1d ago', url: '#' },
];

const FALLBACK_INTEL = `• Maize prices up 8.2% MoM in Kano market, driven by lean season supply tightness.
• PRESASS forecasts severe dry spells in northern Nigeria Jun-Aug 2026.
• Fall Armyworm moth counts elevated — scout maize whorls immediately.`;

const FALLBACK_TASKS = [
  "Check soil moisture in northern sorghum fields before planting.",
  "Scout maize whorls for Fall Armyworm — pheromone traps showing elevated counts.",
  "Order split-dose urea application — prices up 12.5%, optimize usage."
];

const FALLBACK_ADVICE: FarmingAdviceResult = {
  text: "Based on current Sahel conditions, I recommend focusing on water management given the dry spell forecast and input cost pressures. \n\n1. Split Fertilizer Dosing: Apply urea in two smaller doses to reduce waste and cost — prices are up 12.5% MoM.\n2. Irrigation Timing: Water pre-dawn to maximize absorption and minimize evaporation in 36°C+ conditions.\n3. FAW Scouting: Check maize whorls daily for Fall Armyworm signs; early intervention saves the crop.",
  sources: []
};

const FALLBACK_ANALYSIS = "Based on visual analysis, this crop appears to be showing signs of Nitrogen Deficiency. \n\nIndicators:\n• Yellowing (chlorosis) running down the midrib of older leaves.\n• Stunted growth relative to expected stage.\n\nRecommendation:\nConsider a side-dressing of Urea or Ammonium Nitrate if rain is forecast, or a foliar application for quicker uptake.";

function cleanAIOutput(text: string): string {
  if (!text) return "";
  return text
    .replace(/\*{1,2}(.*?)\*{1,2}/g, '$1')
    .replace(/^#+\s*/gm, '')
    .replace(/(\*\*|##)/g, '')
    .replace(/^\s*\*\s/gm, '• ')
    .trim();
}

function extractJson(text: string): string {
  const jsonMatch = text.match(/```json([\s\S]*?)```/);
  if (jsonMatch && jsonMatch[1]) return jsonMatch[1].trim();
  const genericMatch = text.match(/```([\s\S]*?)```/);
  if (genericMatch && genericMatch[1]) return genericMatch[1].trim();
  return text.replace(/```json|```/g, '').trim();
}

function buildSystemInstruction(ctx?: CountryContext): string {
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

async function nvidiaChatCompletion(
  messages: Array<{ role: string; content: string | any[] }>,
  model: string = TEXT_MODEL,
  temperature: number = 0.4
): Promise<string> {
  const response = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${VITE_NVIDIA_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`NVIDIA API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

async function nvidiaVisionCompletion(
  base64Image: string,
  prompt: string,
  systemInstruction: string,
  temperature: number = 0.4
): Promise<string> {
  const mimeTypeMatch = base64Image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
  const imageUrl = mimeTypeMatch ? base64Image : `data:image/jpeg;base64,${base64Image}`;

  const messages: Array<{ role: string; content: string | any[] }> = [
    { role: 'system', content: systemInstruction },
    {
      role: 'user',
      content: [
        { type: 'image_url', image_url: { url: imageUrl } },
        { type: 'text', text: prompt }
      ]
    }
  ];

  return nvidiaChatCompletion(messages, VISION_MODEL, temperature);
}

export class NvidiaNIMProvider implements AIProvider {
  isConfigured(): boolean {
    return !!VITE_NVIDIA_KEY;
  }

  async getFarmingAdvice(prompt: string, countryCtx?: CountryContext): Promise<FarmingAdviceResult> {
    if (!VITE_NVIDIA_KEY) {
      await new Promise(r => setTimeout(r, 1500));
      return FALLBACK_ADVICE;
    }

    const cacheKey = `ADVICE_NV_${prompt.trim().toLowerCase()}_${countryCtx?.countryCode || 'default'}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;

    try {
      const messages = [
        { role: 'system', content: buildSystemInstruction(countryCtx) },
        { role: 'user', content: prompt }
      ];

      const rawText = await nvidiaChatCompletion(messages, TEXT_MODEL, 0.4);
      const result: FarmingAdviceResult = {
        text: cleanAIOutput(rawText || "I couldn't generate a response at this time."),
      };

      setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error("NVIDIA AI Text Error (Falling back):", error);
      return FALLBACK_ADVICE;
    }
  }

  async fetchAgNews(countryCtx?: CountryContext): Promise<NewsArticle[]> {
    if (!VITE_NVIDIA_KEY) {
      await new Promise(r => setTimeout(r, 1000));
      return FALLBACK_NEWS;
    }

    const cacheKey = `GLOBAL_AG_NEWS_NV_${countryCtx?.countryCode || 'default'}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;

    const region = countryCtx?.region || 'global';
    const countryName = countryCtx?.countryCode ? (COUNTRY_REGISTRY[countryCtx.countryCode]?.name || '') : '';
    const regionPrompt = countryName ? `Focus especially on ${countryName} and ${region} agriculture, but also include significant global stories.` : 'Focus on the latest significant global agriculture news.';

    const prompt = `Find the 8 latest significant agriculture news headlines from the last 24 hours.
${regionPrompt}
Cover Commodities (Crop Prices), AgTech (New innovations), Climate (Weather impacts on farming), and Policy (Trade/Subsidies).

Return ONLY a valid JSON array. Each item must have: title, summary, category (one of: Market, Tech, Policy, Climate), source, timeAgo, url.`;

    try {
      const messages = [
        { role: 'system', content: 'You are an agricultural news aggregator. Always respond with valid JSON only, no markdown formatting.' },
        { role: 'user', content: prompt }
      ];

      const rawText = await nvidiaChatCompletion(messages, TEXT_MODEL, 0.3);
      const jsonStr = extractJson(rawText || '[]');
      const articles = JSON.parse(jsonStr);

      const result = articles.map((a: any, i: number) => ({
        ...a,
        id: `news-nv-${Date.now()}-${i}`
      }));

      setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error("NVIDIA News Fetch Error (Falling back):", error);
      return FALLBACK_NEWS;
    }
  }

  async getLiveAgriIntel(countryCtx?: CountryContext): Promise<string> {
    if (!VITE_NVIDIA_KEY) {
      await new Promise(r => setTimeout(r, 800));
      return FALLBACK_INTEL;
    }

    const cacheKey = `LIVE_INTEL_SUMMARY_NV_${countryCtx?.countryCode || 'default'}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;

    const region = countryCtx ? `${COUNTRY_REGISTRY[countryCtx.countryCode]?.name || countryCtx.region}, ${countryCtx.region}` : 'global';
    const prompt = `What are the 3 most critical agricultural news headlines right now regarding climate events, pest outbreaks, or major commodity price shifts in ${region}? Be concise, 1 sentence per headline.`;

    try {
      const messages = [
        { role: 'system', content: buildSystemInstruction(countryCtx) },
        { role: 'user', content: prompt }
      ];

      const rawText = await nvidiaChatCompletion(messages, TEXT_MODEL, 0.3);
      const cleanText = cleanAIOutput(rawText || "Market intelligence systems offline.");
      setCache(cacheKey, cleanText);
      return cleanText;
    } catch (error) {
      console.error("NVIDIA Intel Fetch Error (Falling back):", error);
      return FALLBACK_INTEL;
    }
  }

  async generateDailyTasks(weather: WeatherData, crops: Crop[], countryCtx?: CountryContext): Promise<string> {
    if (!VITE_NVIDIA_KEY) {
      await new Promise(r => setTimeout(r, 1200));
      return JSON.stringify(FALLBACK_TASKS);
    }

    const cropNames = crops.map(c => `${c.name} (${c.status})`).join(', ');
    const regionInfo = countryCtx ? `Region: ${COUNTRY_REGISTRY[countryCtx.countryCode]?.name || countryCtx.region}, Climate: ${countryCtx.climateZone}` : '';

    const prompt = `Context:
Current Weather: ${weather.temp}°C, Condition: ${weather.condition}, Wind: ${weather.windSpeed}km/h, Forecast: ${weather.forecast}.
${regionInfo}
Active Plots: ${cropNames}.

Task:
Generate 3 high-priority, specific farming tasks for today based on this context.
Focus on risk mitigation and yield protection.

Format:
Return ONLY a valid JSON array of strings. Do not include markdown formatting or "json" tags.`;

    try {
      const messages = [
        { role: 'system', content: buildSystemInstruction(countryCtx) },
        { role: 'user', content: prompt }
      ];

      const rawText = await nvidiaChatCompletion(messages, TEXT_MODEL, 0.3);
      return extractJson(rawText || '[]');
    } catch (error) {
      console.error("NVIDIA AI Task Generation Error (Falling back):", error);
      return JSON.stringify(FALLBACK_TASKS);
    }
  }

  async analyzeCropImage(base64Image: string, userPrompt: string, countryCtx?: CountryContext): Promise<string> {
    if (!VITE_NVIDIA_KEY) {
      await new Promise(r => setTimeout(r, 2000));
      return FALLBACK_ANALYSIS;
    }

    try {
      const enhancedPrompt = `
Analyze this image acting as a Resilience Agronomist.
User Context: ${userPrompt || "Assess for disease, nutrient deficiency, or soil health indicators."}

Look for:
1. Early signs of disease (Monoculture fragility risk).
2. Soil compaction or degradation symptoms.
3. Water stress indicators.

Provide a diagnosis that balances biological treatment with economic reality.`;

      const systemInstruction = buildSystemInstruction(countryCtx);
      const rawText = await nvidiaVisionCompletion(base64Image, enhancedPrompt, systemInstruction);
      return cleanAIOutput(rawText || "I analyzed the image but couldn't generate a specific diagnosis.");
    } catch (error) {
      console.error("NVIDIA Vision Error (Falling back):", error);
      return FALLBACK_ANALYSIS;
    }
  }

  getLiveClient(): null {
    return null;
  }
}
