
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { WeatherData, Crop, Task, NewsArticle, ClimateZone } from '../types';
import { COUNTRY_REGISTRY } from '../constants';

export interface CountryContext {
  countryCode: string;
  region: string;
  climateZone: ClimateZone;
  currencyCode: string;
  currencySymbol: string;
  language: string;
  farmType: string;
  areaUnit: string;
}

// Lazy AI Client — constructor throws in browser if apiKey is null
let _ai: InstanceType<typeof GoogleGenAI> | null = null;
const VITE_GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const getAI = () => {
  if (!_ai && VITE_GEMINI_KEY) {
    _ai = new GoogleGenAI({ apiKey: VITE_GEMINI_KEY });
  }
  return _ai;
};

// --- SIMPLE IN-MEMORY CACHE WITH TTL ---
const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes
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

// --- FALLBACK DATA (SIMULATION LAYER) ---
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

const FALLBACK_ADVICE = {
  text: "Based on current Sahel conditions, I recommend focusing on water management given the dry spell forecast and input cost pressures. \n\n1. **Split Fertilizer Dosing**: Apply urea in two smaller doses to reduce waste and cost — prices are up 12.5% MoM.\n2. **Irrigation Timing**: Water pre-dawn to maximize absorption and minimize evaporation in 36°C+ conditions.\n3. **FAW Scouting**: Check maize whorls daily for Fall Armyworm signs; early intervention saves the crop.",
  sources: []
};

const FALLBACK_ANALYSIS = "Based on visual analysis, this crop appears to be showing signs of **Nitrogen Deficiency**. \n\n**Indicators:**\n• Yellowing (chlorosis) running down the midrib of older leaves.\n• Stunted growth relative to expected stage.\n\n**Recommendation:**\nConsider a side-dressing of Urea or Ammonium Nitrate if rain is forecast, or a foliar application for quicker uptake.";

/**
 * REGENERATIVE AGRICULTURE & 2026 RESILIENCE SYSTEM INSTRUCTION
 */
function buildSystemInstruction(ctx?: CountryContext): string {
  const countryCfg = ctx?.countryCode ? COUNTRY_REGISTRY[ctx.countryCode] : undefined;
  const countryName = countryCfg?.name || 'West Africa';
  const region = ctx?.region || 'West Africa';
  const climateZone = ctx?.climateZone || 'sahel';
  const currency = ctx?.currencyCode || 'NGN';
  const currencySymbol = ctx?.currencySymbol || '₦';
  const farmType = ctx?.farmType || 'mixed';
  const lang = ctx?.language || 'en';

  const climateContext: Record<ClimateZone, string> = {
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

/**
 * Helper to strip markdown artifacts if the model ignores strict instructions.
 */
const cleanAIOutput = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/\*{1,2}(.*?)\*{1,2}/g, '$1') // Remove bold/italic
    .replace(/^#+\s*/gm, '') // Remove headers
    .replace(/(\*\*|##)/g, '') // Remove lingering symbols
    .replace(/^\s*\*\s/gm, '• ') // Standardize bullets
    .trim();
};

/**
 * Robust JSON Extractor
 * Attempts to find a JSON block between markdown fences first.
 * If not found, attempts to clean the string of markdown code syntax.
 */
const extractJson = (text: string): string => {
  // 1. Try extracting content between ```json and ```
  const jsonMatch = text.match(/```json([\s\S]*?)```/);
  if (jsonMatch && jsonMatch[1]) {
    return jsonMatch[1].trim();
  }
  
  // 2. Try extracting content between generic ``` and ```
  const genericMatch = text.match(/```([\s\S]*?)```/);
  if (genericMatch && genericMatch[1]) {
    return genericMatch[1].trim();
  }

  // 3. Fallback: Clean markers and return the whole text
  return text.replace(/```json|```/g, '').trim();
};

/**
 * Sends a text prompt to the AI with the Resenerative persona and Search Grounding.
 */
export const isAIConfigured = (): boolean => !!VITE_GEMINI_KEY;

export const getFarmingAdvice = async (prompt: string, countryCtx?: CountryContext): Promise<{ text: string; sources?: { title: string; uri: string }[] }> => {
  if (!VITE_GEMINI_KEY) {
    await new Promise(r => setTimeout(r, 1500));
    return FALLBACK_ADVICE;
  }
  
  const cacheKey = `ADVICE_${prompt.trim().toLowerCase()}_${countryCtx?.countryCode || 'default'}`;
  const cached = getCache(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response: GenerateContentResponse = await getAI()?.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: buildSystemInstruction(countryCtx),
        temperature: 0.4,
        tools: [{ googleSearch: {} }] 
      }
    });
    
    let sources: { title: string; uri: string }[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      sources = response.candidates[0].groundingMetadata.groundingChunks
        .filter((chunk: any) => chunk.web)
        .map((chunk: any) => ({
          title: chunk.web.title,
          uri: chunk.web.uri
        }));
    }

    const rawText = response.text || "I couldn't generate a response at this time.";
    const result = {
      text: cleanAIOutput(rawText),
      sources: sources.length > 0 ? sources : undefined
    };

    setCache(cacheKey, result);
    return result;

  } catch (error) {
    console.error("AI Text Error (Falling back):", error);
    return FALLBACK_ADVICE;
  }
};

/**
 * Fetches structured real-time global agriculture news.
 */
export const fetchAgNews = async (countryCtx?: CountryContext): Promise<NewsArticle[]> => {
  if (!VITE_GEMINI_KEY) {
    await new Promise(r => setTimeout(r, 1000));
    return FALLBACK_NEWS;
  }

  const cacheKey = `GLOBAL_AG_NEWS_${countryCtx?.countryCode || 'default'}`;
  const cached = getCache(cacheKey);
  if (cached) {
    return cached;
  }

  const region = countryCtx?.region || 'global';
  const countryName = countryCtx?.countryCode ? (COUNTRY_REGISTRY[countryCtx.countryCode]?.name || '') : '';
  const regionPrompt = countryName ? `Focus especially on ${countryName} and ${region} agriculture, but also include significant global stories.` : 'Focus on the latest significant global agriculture news.';

  const prompt = `
    Find the 8 latest significant agriculture news headlines from the last 24 hours.
    ${regionPrompt}
    Cover Commodities (Crop Prices), AgTech (New innovations), Climate (Weather impacts on farming), and Policy (Trade/Subsidies).
  `;

  try {
    const response = await getAI()?.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              category: { type: Type.STRING, enum: ["Market", "Tech", "Policy", "Climate"] },
              source: { type: Type.STRING },
              timeAgo: { type: Type.STRING },
              url: { type: Type.STRING }
            },
            required: ["title", "summary", "category", "source", "timeAgo"]
          }
        }
      }
    });

    const jsonStr = extractJson(response.text || "[]");
    const articles = JSON.parse(jsonStr);
    
    const result = articles.map((a: any, i: number) => ({
      ...a,
      id: `news-${Date.now()}-${i}`
    }));

    setCache(cacheKey, result);
    return result;

  } catch (error) {
    console.error("News Fetch Error (Falling back):", error);
    return FALLBACK_NEWS;
  }
};

/**
 * Fetches real-time agricultural intelligence summaries.
 */
export const getLiveAgriIntel = async (countryCtx?: CountryContext): Promise<string> => {
  if (!VITE_GEMINI_KEY) {
    await new Promise(r => setTimeout(r, 800));
    return FALLBACK_INTEL;
  }

  const cacheKey = `LIVE_INTEL_SUMMARY_${countryCtx?.countryCode || 'default'}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const region = countryCtx ? `${COUNTRY_REGISTRY[countryCtx.countryCode]?.name || countryCtx.region}, ${countryCtx.region}` : 'global';
  const prompt = `What are the 3 most critical agricultural news headlines right now regarding climate events, pest outbreaks, or major commodity price shifts in ${region}? Be concise, 1 sentence per headline.`;

  try {
    const response: GenerateContentResponse = await getAI()?.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.3
      }
    });

    const text = response.text || "Market intelligence systems offline.";
    const cleanText = cleanAIOutput(text);
    setCache(cacheKey, cleanText);
    return cleanText;
  } catch (error) {
    console.error("Intel Fetch Error (Falling back):", error);
    return FALLBACK_INTEL;
  }
}

/**
 * Generates specific daily tasks based on weather and active crops.
 */
export const generateDailyTasks = async (weather: WeatherData, crops: Crop[], countryCtx?: CountryContext): Promise<string> => {
  if (!VITE_GEMINI_KEY) {
    await new Promise(r => setTimeout(r, 1200));
    return JSON.stringify(FALLBACK_TASKS);
  }

  const cropNames = crops.map(c => `${c.name} (${c.status})`).join(', ');
  const regionInfo = countryCtx ? `Region: ${COUNTRY_REGISTRY[countryCtx.countryCode]?.name || countryCtx.region}, Climate: ${countryCtx.climateZone}` : '';
  
  const prompt = `
    Context:
    Current Weather: ${weather.temp}°C, Condition: ${weather.condition}, Wind: ${weather.windSpeed}km/h, Forecast: ${weather.forecast}.
    ${regionInfo}
    Active Plots: ${cropNames}.

    Task:
    Generate 3 high-priority, specific farming tasks for today based on this context. 
    Focus on risk mitigation and yield protection.
    
    Format:
    Return ONLY a valid JSON array of strings. Do not include markdown formatting or "json" tags.
  `;

  try {
    const response: GenerateContentResponse = await getAI()?.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { temperature: 0.3 }
    });

    return extractJson(response.text || "[]");
  } catch (error) {
    console.error("AI Task Generation Error (Falling back):", error);
    return JSON.stringify(FALLBACK_TASKS);
  }
};

/**
 * Analyzes a crop or soil image using multimodal reasoning.
 */
export const analyzeCropImage = async (base64Image: string, userPrompt: string, countryCtx?: CountryContext): Promise<string> => {
  if (!VITE_GEMINI_KEY) {
    await new Promise(r => setTimeout(r, 2000));
    return FALLBACK_ANALYSIS;
  }

  try {
    const mimeTypeMatch = base64Image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';
    const base64Data = base64Image.split(',')[1] || base64Image;

    const enhancedPrompt = `
      Analyze this image acting as a Resilience Agronomist.
      User Context: ${userPrompt || "Assess for disease, nutrient deficiency, or soil health indicators."}
      
      Look for:
      1. Early signs of disease (Monoculture fragility risk).
      2. Soil compaction or degradation symptoms.
      3. Water stress indicators.
      
      Provide a diagnosis that balances biological treatment with economic reality.
    `;

    const response: GenerateContentResponse = await getAI()?.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Data } },
          { text: enhancedPrompt }
        ]
      },
      config: { systemInstruction: buildSystemInstruction(countryCtx) }
    });

    const text = response.text || "I analyzed the image but couldn't generate a specific diagnosis.";
    return cleanAIOutput(text);
  } catch (error) {
    console.error("AI Vision Error (Falling back):", error);
    return FALLBACK_ANALYSIS;
  }
};
