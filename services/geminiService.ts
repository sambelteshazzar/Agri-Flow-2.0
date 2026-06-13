
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { WeatherData, Crop, Task, NewsArticle } from '../types';

// Lazy AI Client — constructor throws in browser if apiKey is null
let _ai: InstanceType<typeof GoogleGenAI> | null = null;
const getAI = () => {
  if (!_ai && process.env.API_KEY) {
    _ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return _ai;
};

// --- SIMPLE IN-MEMORY CACHE ---
const responseCache = new Map<string, any>();

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
const SYSTEM_INSTRUCTION = `
You are the "AgriFlow Resilience Engine," an advanced agricultural AI. Your goal is to help West African farmers navigate the critical challenges of 2026: Climate Instability, Economic Profit Squeeze, and Soil Degradation.

CORE KNOWLEDGE BASE (2026 CONTEXT):
1. Economic Squeeze: Farmers are price takers. Input costs (fertilizer/fuel) remain elevated (+12.5% MoM urea), while commodity prices are volatile. Nigeria's new ₦70,000/month minimum wage has pushed farm labor costs up. Focus on margin protection and low-input strategies.
2. Climate Extremes: PRESASS 2026 forecasts average Sahel rainfall but with severe dry spells Jun-Aug. Move beyond simple weather — account for dry spell timing, water scarcity, and heat stress on specific crops.
3. Soil Regeneration: Topsoil loss is a crisis. Aggressively promote cover cropping, no-till, and biodiversity to restore land.
4. Labor Shifts: Nigeria's minimum wage increase to ₦70,000/month affects farm labor budgets. Suggest labor-efficient technologies or workflows — partial mechanization can cut labor needs 35%.

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
2. Cost-Benefit Analysis: If recommending an action, briefly mention the input cost implication.
3. Regenerative Solution: How does this improve soil/water retention long-term?
4. Action Item: A clear, industrial-grade instruction for the farm manager.
`;

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
export const getFarmingAdvice = async (prompt: string): Promise<{ text: string; sources?: { title: string; uri: string }[] }> => {
  if (!process.env.API_KEY) {
    await new Promise(r => setTimeout(r, 1500));
    return FALLBACK_ADVICE;
  }
  
  const cacheKey = `ADVICE_${prompt.trim().toLowerCase()}`;
  if (responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey);
  }

  try {
    const response: GenerateContentResponse = await getAI()?.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
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

    responseCache.set(cacheKey, result);
    return result;

  } catch (error) {
    console.error("AI Text Error (Falling back):", error);
    return FALLBACK_ADVICE;
  }
};

/**
 * Fetches structured real-time global agriculture news.
 */
export const fetchAgNews = async (): Promise<NewsArticle[]> => {
  if (!process.env.API_KEY) {
    await new Promise(r => setTimeout(r, 1000));
    return FALLBACK_NEWS;
  }

  const cacheKey = 'GLOBAL_AG_NEWS';
  const cached = responseCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < 1000 * 60 * 15)) {
    return cached.data;
  }

  const prompt = `
    Find the 8 latest significant global agriculture news headlines from the last 24 hours.
    Focus on Commodities (Crop Prices), AgTech (New innovations), Climate (Weather impacts on farming), and Policy (Trade/Subsidies).
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

    responseCache.set(cacheKey, { timestamp: Date.now(), data: result });
    return result;

  } catch (error) {
    console.error("News Fetch Error (Falling back):", error);
    return FALLBACK_NEWS;
  }
};

/**
 * Fetches real-time agricultural intelligence summaries.
 */
export const getLiveAgriIntel = async (): Promise<string> => {
  if (!process.env.API_KEY) {
    await new Promise(r => setTimeout(r, 800));
    return FALLBACK_INTEL;
  }

  const cacheKey = 'LIVE_INTEL_SUMMARY';
  if (responseCache.has(cacheKey)) return responseCache.get(cacheKey);

  const prompt = "What are the 3 most critical agricultural news headlines right now regarding climate events, pest outbreaks, or major commodity price shifts globally? Be concise, 1 sentence per headline.";

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
    responseCache.set(cacheKey, cleanText);
    return cleanText;
  } catch (error) {
    console.error("Intel Fetch Error (Falling back):", error);
    return FALLBACK_INTEL;
  }
}

/**
 * Generates specific daily tasks based on weather and active crops.
 */
export const generateDailyTasks = async (weather: WeatherData, crops: Crop[]): Promise<string> => {
  if (!process.env.API_KEY) {
    await new Promise(r => setTimeout(r, 1200));
    return JSON.stringify(FALLBACK_TASKS);
  }

  const cropNames = crops.map(c => `${c.name} (${c.status})`).join(', ');
  
  const prompt = `
    Context:
    Current Weather: ${weather.temp}°C, Condition: ${weather.condition}, Wind: ${weather.windSpeed}km/h, Forecast: ${weather.forecast}.
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
export const analyzeCropImage = async (base64Image: string, userPrompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
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
      config: { systemInstruction: SYSTEM_INSTRUCTION }
    });

    const text = response.text || "I analyzed the image but couldn't generate a specific diagnosis.";
    return cleanAIOutput(text);
  } catch (error) {
    console.error("AI Vision Error (Falling back):", error);
    return FALLBACK_ANALYSIS;
  }
};
