import type { AIProvider } from './AIProvider';
import { GeminiProvider } from './GeminiProvider';
import { NvidiaNIMProvider } from './NvidiaNIMProvider';

// SECURITY: Never read VITE_NVIDIA_API_KEY at runtime in the browser.
// Vite inlines every VITE_* var into the client bundle, which leaks the key
// to anyone with DevTools open. Provider selection is driven by a derived
// "which provider" flag instead. The NVIDIA key is only ever attached to
// requests server-side, in /api/ai-chat or the vite dev proxy.
const VITE_GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const AI_PROVIDER_HINT = (import.meta.env.VITE_AI_PROVIDER || '').toLowerCase();

let _provider: AIProvider | null = null;

function createProvider(): AIProvider {
  if (VITE_GEMINI_KEY || AI_PROVIDER_HINT === 'gemini') return new GeminiProvider();
  if (AI_PROVIDER_HINT === 'nvidia') return new NvidiaNIMProvider();
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
