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
  isSimulated?: boolean;
}

export interface AIProvider {
  // Stable, human-readable provider name. Do NOT use constructor.name —
  // production minifiers rename classes to single letters, which would
  // show the user "Provider: t" in the AIAdvisor greeting.
  displayName: string;

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
