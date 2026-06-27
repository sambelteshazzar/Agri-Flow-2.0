import { WeatherData, Crop, NewsArticle, ClimateZone } from '../../types';

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

export interface AISource {
  title: string;
  uri: string;
}

export interface FarmingAdviceResult {
  text: string;
  sources?: AISource[];
}

export interface AIProvider {
  isConfigured(): boolean;

  getFarmingAdvice(
    prompt: string,
    countryCtx?: CountryContext
  ): Promise<FarmingAdviceResult>;

  fetchAgNews(
    countryCtx?: CountryContext
  ): Promise<NewsArticle[]>;

  getLiveAgriIntel(
    countryCtx?: CountryContext
  ): Promise<string>;

  generateDailyTasks(
    weather: WeatherData,
    crops: Crop[],
    countryCtx?: CountryContext
  ): Promise<string>;

  analyzeCropImage(
    base64Image: string,
    userPrompt: string,
    countryCtx?: CountryContext
  ): Promise<string>;

  getLiveClient(): any | null;
}
