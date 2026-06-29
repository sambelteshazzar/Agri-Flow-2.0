import type { AIProvider, CountryContext, FarmingAdviceResult } from './AIProvider';
import { WeatherData, Crop, NewsArticle } from '../../types';
import { COUNTRY_REGISTRY } from '../../constants';
import {
  setCache, getCache, buildSystemInstruction, cleanAIOutput, extractJson,
  FALLBACK_NEWS, FALLBACK_INTEL, FALLBACK_TASKS, FALLBACK_ADVICE, FALLBACK_ANALYSIS
} from './shared';

const VITE_NVIDIA_KEY = import.meta.env.VITE_NVIDIA_API_KEY || '';

const TEXT_MODEL = 'nvidia/llama-3.3-nemotron-super-49b-v1';
const VISION_MODEL = 'microsoft/phi-4-multimodal-instruct';
const API_BASE = 'https://integrate.api.nvidia.com/v1';

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
