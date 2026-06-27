import type { AIProvider } from './AIProvider';
import { GeminiProvider } from './GeminiProvider';

let _provider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (!_provider) {
    _provider = new GeminiProvider();
  }
  return _provider;
}

export function resetAIProvider(): void {
  _provider = null;
}

export function getLiveAIClient() {
  return getAIProvider().getLiveClient();
}

export type { AIProvider, CountryContext, FarmingAdviceResult } from './AIProvider';
export { GeminiProvider } from './GeminiProvider';
