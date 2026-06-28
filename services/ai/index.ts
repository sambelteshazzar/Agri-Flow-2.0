import type { AIProvider } from './AIProvider';
import { GeminiProvider } from './GeminiProvider';
import { NvidiaNIMProvider } from './NvidiaNIMProvider';

const VITE_GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const VITE_NVIDIA_KEY = import.meta.env.VITE_NVIDIA_API_KEY || '';

let _provider: AIProvider | null = null;

function createProvider(): AIProvider {
  if (VITE_GEMINI_KEY) return new GeminiProvider();
  if (VITE_NVIDIA_KEY) return new NvidiaNIMProvider();
  return new GeminiProvider();
}

export function getAIProvider(): AIProvider {
  if (!_provider) {
    _provider = createProvider();
  }
  return _provider;
}

export function resetAIProvider(): void {
  _provider = null;
}

export function hasLiveVoice(): boolean {
  return !!VITE_GEMINI_KEY;
}

export function getLiveAIClient() {
  return getAIProvider().getLiveClient();
}

export type { AIProvider, CountryContext, FarmingAdviceResult } from './AIProvider';
export { GeminiProvider } from './GeminiProvider';
export { NvidiaNIMProvider } from './NvidiaNIMProvider';
