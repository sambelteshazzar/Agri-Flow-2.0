import type { AIProvider, CountryContext, FarmingAdviceResult } from './AIProvider';
import { WeatherData, Crop, NewsArticle } from '../../types';

import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';
import { COUNTRY_REGISTRY } from '../../constants';
import {
  setCache, getCache, buildSystemInstruction, cleanAIOutput, extractJson,
  FALLBACK_NEWS, FALLBACK_INTEL, FALLBACK_TASKS, FALLBACK_ADVICE, FALLBACK_ANALYSIS
} from './shared';

const VITE_GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let _ai: InstanceType<typeof GoogleGenAI> | null = null;
const getAI = () => {
  if (!_ai && VITE_GEMINI_KEY) {
    _ai = new GoogleGenAI({ apiKey: VITE_GEMINI_KEY });
  }
  return _ai;
};

export class GeminiProvider implements AIProvider {
  isConfigured(): boolean {
    return !!VITE_GEMINI_KEY;
  }

  async getFarmingAdvice(prompt: string, countryCtx?: CountryContext): Promise<FarmingAdviceResult> {
    if (!VITE_GEMINI_KEY) {
      await new Promise(r => setTimeout(r, 1500));
      return FALLBACK_ADVICE;
    }

    const cacheKey = `ADVICE_${prompt.trim().toLowerCase()}_${countryCtx?.countryCode || 'default'}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;

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
      const result: FarmingAdviceResult = {
        text: cleanAIOutput(rawText),
        sources: sources.length > 0 ? sources : undefined
      };

      setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error("AI Text Error (Falling back):", error);
      return FALLBACK_ADVICE;
    }
  }

  async fetchAgNews(countryCtx?: CountryContext): Promise<NewsArticle[]> {
    if (!VITE_GEMINI_KEY) {
      await new Promise(r => setTimeout(r, 1000));
      return FALLBACK_NEWS;
    }

    const cacheKey = `GLOBAL_AG_NEWS_${countryCtx?.countryCode || 'default'}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;

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
  }

  async getLiveAgriIntel(countryCtx?: CountryContext): Promise<string> {
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

  async generateDailyTasks(weather: WeatherData, crops: Crop[], countryCtx?: CountryContext): Promise<string> {
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
  }

  async analyzeCropImage(base64Image: string, userPrompt: string, countryCtx?: CountryContext): Promise<string> {
    if (!VITE_GEMINI_KEY) {
      await new Promise(r => setTimeout(r, 2000));
      return FALLBACK_ANALYSIS;
    }

    try {
      const mimeTypeMatch = base64Image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';
      const base64Data = base64Image.split(',')[1] || base64Image;

      const enhancedPrompt = `
        Analyze this crop image as a Resilience Agronomist for a farmer in ${countryCtx?.countryCode || 'West Africa'}.
        User Observation: ${userPrompt || "General crop health check."}

        Return a JSON object with exactly these fields:
        {
          "diagnosis": "Primary condition name (e.g., Nitrogen Deficiency, Fall Armyworm, Maize Streak Virus, Healthy)",
          "confidence": "High|Medium|Low",
          "indicators": ["Specific visual evidence from the image (e.g., 'Yellowing starting at leaf tip moving down midrib', 'Ragged holes in whorl leaves with frass')"],
          "severity": "None|Mild|Moderate|Severe",
          "immediateActions": ["Actionable step 1", "Actionable step 2"],
          "economicNote": "Brief cost/benefit context in local currency",
          "regenerativeTip": "Soil/ecosystem health recommendation"
        }

        Focus on: nutrient deficiencies (N, P, K, Mg, Zn), common diseases (MLNV, FAW, Rust, Blight, Streak), water stress, pest damage. Be specific to West African crops if possible.
      `;

      const response: GenerateContentResponse = await getAI()?.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { mimeType: mimeType, data: base64Data } },
            { text: enhancedPrompt }
          ]
        },
        config: {
          systemInstruction: buildSystemInstruction(countryCtx),
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              diagnosis: { type: Type.STRING },
              confidence: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
              indicators: { type: Type.ARRAY, items: { type: Type.STRING } },
              severity: { type: Type.STRING, enum: ["None", "Mild", "Moderate", "Severe"] },
              immediateActions: { type: Type.ARRAY, items: { type: Type.STRING } },
              economicNote: { type: Type.STRING },
              regenerativeTip: { type: Type.STRING }
            },
            required: ["diagnosis", "confidence", "indicators", "severity", "immediateActions", "economicNote", "regenerativeTip"]
          }
        }
      });

      const jsonStr = extractJson(response.text || "{}");
      try {
        const parsed = JSON.parse(jsonStr);
        // Format as clean text for the UI
        return `Diagnosis: ${parsed.diagnosis} (${parsed.confidence} confidence)\n\nIndicators:\n${parsed.indicators.map((i: string) => `• ${i}`).join('\n')}\n\nSeverity: ${parsed.severity}\n\nImmediate Actions:\n${parsed.immediateActions.map((a: string) => `1. ${a}`).join('\n')}\n\nEconomic Note: ${parsed.economicNote}\n\nRegenerative Tip: ${parsed.regenerativeTip}`;
      } catch {
        return cleanAIOutput(response.text || "Analysis complete but format unexpected.");
      }
} catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error("AI Text Error:", errMsg);
      return `AI service error: ${errMsg}. Check API key, quota, or network.`;
    }
  }

  getLiveClient(): InstanceType<typeof GoogleGenAI> | null {
    return getAI();
  }
}
