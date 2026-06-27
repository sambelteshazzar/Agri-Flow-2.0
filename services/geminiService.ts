import { WeatherData, Crop, NewsArticle } from '../types';
import { getAIProvider } from './ai';
import type { CountryContext, FarmingAdviceResult } from './ai/AIProvider';

export type { CountryContext } from './ai/AIProvider';

export const isAIConfigured = (): boolean => getAIProvider().isConfigured();

export const getFarmingAdvice = async (prompt: string, countryCtx?: CountryContext): Promise<FarmingAdviceResult> => {
  return getAIProvider().getFarmingAdvice(prompt, countryCtx);
};

export const fetchAgNews = async (countryCtx?: CountryContext): Promise<NewsArticle[]> => {
  return getAIProvider().fetchAgNews(countryCtx);
};

export const getLiveAgriIntel = async (countryCtx?: CountryContext): Promise<string> => {
  return getAIProvider().getLiveAgriIntel(countryCtx);
};

export const generateDailyTasks = async (weather: WeatherData, crops: Crop[], countryCtx?: CountryContext): Promise<string> => {
  return getAIProvider().generateDailyTasks(weather, crops, countryCtx);
};

export const analyzeCropImage = async (base64Image: string, userPrompt: string, countryCtx?: CountryContext): Promise<string> => {
  return getAIProvider().analyzeCropImage(base64Image, userPrompt, countryCtx);
};

export function getLiveAIClient() {
  return getAIProvider().getLiveClient();
}
