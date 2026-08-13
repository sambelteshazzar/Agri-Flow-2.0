import type { AIProvider } from './AIProvider';
import { GeminiProvider } from './GeminiProvider';
import { NvidiaNIMProvider } from './NvidiaNIMProvider';

// SECURITY: Never read VITE_NVIDIA_API_KEY at runtime in the browser.
// Vite inlines every VITE_* var into the client bundle, which leaks the key
// to anyone with DevTools open. Provider selection is driven by derived
// non-secret flags instead. The NVIDIA key is only ever attached to
// requests server-side, in /api/ai-chat or the vite dev proxy.
const VITE_GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const VITE_NVIDIA_KEY = import.meta.env.VITE_NVIDIA_API_KEY || '';
const AI_PROVIDER_HINT = (import.meta.env.VITE_AI_PROVIDER || '').toLowerCase();

let _provider: AIProvider | null = null;

function createProvider(): AIProvider {
  // Explicit hint wins.
  if (AI_PROVIDER_HINT === 'gemini') return new GeminiProvider();
  if (AI_PROVIDER_HINT === 'nvidia') return new NvidiaNIMProvider();
  // Otherwise infer from which key is present. A Gemini key means we can
  // use Gemini directly (and unlock Live voice). A NVIDIA key alone — no
  // Gemini key — means route through the NVIDIA proxy.
  if (VITE_GEMINI_KEY) return new GeminiProvider();
  if (VITE_NVIDIA_KEY) return new NvidiaNIMProvider();
  // Default: Gemini (which will gracefully fall back to simulated data
  // when no key is configured — see GeminiProvider methods).
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

// Live voice is ONLY supported by the Gemini Live API (real-time bidirectional
// audio over WebSocket). The NVIDIA NIM provider exposes no equivalent. We
// must report false here whenever the selected provider is NVIDIA — otherwise
// VoiceAgent enables the mic button, calls getLiveClient() which returns
// null, and dies with a misleading "Connection lost" toast. The key insight:
// hasLiveVoice must track the ACTIVE provider, not just whether a Gemini key
// exists. If the user set VITE_AI_PROVIDER=nvidia, voice is off even when a
// Gemini key is also present.
export function hasLiveVoice(): boolean {
  // Resolve the provider the same way createProvider() does, then check that
  // it's the Gemini one AND has a usable key.
  if (AI_PROVIDER_HINT === 'nvidia') return false;
  if (AI_PROVIDER_HINT === 'gemini') return !!VITE_GEMINI_KEY;
  // No explicit hint: voice is live only if Gemini is the inferred provider.
  return !!VITE_GEMINI_KEY;
}

export function getLiveAIClient() {
  return getAIProvider().getLiveClient();
}

export type { AIProvider, CountryContext, FarmingAdviceResult } from './AIProvider';
export { GeminiProvider } from './GeminiProvider';
export { NvidiaNIMProvider } from './NvidiaNIMProvider';
