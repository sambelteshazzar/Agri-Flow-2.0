# NVIDIA API Evaluation for Agri-Flow 2.0

**Context:** Agri-Flow 2.0 uses Google Gemini for AI features. The user asked whether NVIDIA's APIs (via NVIDIA NIM on build.nvidia.com / `integrate.api.nvidia.com`) could replace the missing Gemini key.

## App's AI Surface

The `AIProvider` interface (`services/ai/AIProvider.ts`) defines 6 capabilities + 1 transport:

| Method | Usage Site | Capability |
|---|---|---|
| `getFarmingAdvice(prompt, ctx)` | `AIAdvisor` text chat | Long-form grounded agronomy advice with citations |
| `fetchAgNews(ctx)` | `NewsHub` | Structured JSON list of 8 latest news items (Market/Tech/Policy/Climate) |
| `getLiveAgriIntel(ctx)` | Dashboard ticker | 3-sentence live intel summary |
| `generateDailyTasks(weather, crops, ctx)` | Dashboard | 3 task strings |
| `analyzeCropImage(base64, prompt, ctx)` | `CropScanner`, `LivestockManager` scan | Image+disease diagnosis |
| `getLiveClient()` | `AIAdvisor`, `VoiceAgent` | Hands out the underlying SDK client for `live.connect` (WebSocket bi-directional streaming — real-time voice) |

All Gemini calls also use **`googleSearch` grounding** and **`responseSchema` constrained JSON output**.

## NVIDIA NIM Equivalents — Feasibility Matrix

NVIDIA exposes hosted endpoints under `integrate.api.nvidia.com/v1/chat/completions` (OpenAI-compatible) and specialized endpoints for multimodal/VLM. Quoting `docs.api.nvidia.com/nim`.

### ✅ REPLACEABLE — Text advice / News / Tasks / Intel

| Agri-Flow Method | NVIDIA Model (recommended) | Endpoint | Notes |
|---|---|---|---|
| `getFarmingAdvice` | `meta/llama-3.3-70b-instruct` or `nvidia/llama-3.3-nemotron-super-49b-v1.5` | `POST /v1/chat/completions` | OpenAI-compatible. Strong instruction following, 128K context. Nemotron Super 49B is optimized for reasoning + tool use. |
| `fetchAgNews` | Same as above | `POST /v1/chat/completions` | Use OpenAI `response_format: { type: "json_schema", ... }` to get constrained JSON. NVIDIA supports this. |
| `getLiveAgriIntel` | Same as above | `POST /v1/chat/completions` | Standard chat completion. |
| `generateDailyTasks` | `meta/llama-3.1-8b-instruct` (faster) or 70B | `POST /v1/chat/completions` | Cheap + fast; the task is short. |

**Web search grounding:** NVIDIA NIM does **not** expose Google Search grounding natively. Workarounds:
1. Drop the live-grounding feature — rely on the model's instruction-following + 2026 context baked into the system prompt (already in `buildSystemInstruction()`). Acceptable for a final-year project since it still demonstrates climate-aware reasoning.
2. Use `nvidia/llama-3.1-nemotron-nano-8b-v1` (built for RAG/agent loops) with a pre-built news fetch step done upstream (e.g., a static curated list seeded once per session), pass context as system message.

### ✅ REPLACEABLE — Image analysis

| Agri-Flow Method | NVIDIA Model | Endpoint |
|---|---|---|
| `analyzeCropImage` | `microsoft/phi-4-multimodal-instruct` OR `meta/llama-3.2-11b-vision-instruct` OR `nvidia/vila` | `POST ai.api.nvidia.com/v1/vlm/<model>` (VLM endpoint) OR sometimes `POST /v1/chat/completions` with image content part. |

- **Phi-4-multimodal** is the best fit — strong on plant/disease reasoning, lightweight.
- These accept base64 image inline in the chat messages payload: `{ role: "user", content: [{ type: "image_url", image_url: { url: "data:image/jpeg;base64,..." } }, { type: "text", text: prompt }] }`.
- Audit log: tested with `@google/genai` `inlineData` shape, but NVIDIA expects OpenAI-style `image_url` content parts — straightforward to translate.

### ❌ NOT REPLACEABLE — Live voice / bi-directional streaming

`ai.live.connect()` is the Gemini Live API — a bi-directional WebSocket for **real-time audio** (mic capture → model → audio playback). `AIAdvisor` and `VoiceAgent` use this for the live "Call Agri-Intelligence" feature and the floating voice agent.

NVIDIA NIM's hosted inference does **not** expose an equivalent streaming voice endpoint at this time (checked at `docs.api.nvidia.com/nim`). TTS exists via NVIDIA Riva (self-hosted), STT via Riva ASR — but those are containerized enterprise products, not hosted-as-a-service keys.

**Implication:** Two options for the live voice features:
1. **Best for this project:** Drop the live voice features (use text-only mode for AIAdvisor). Since we already let `getFarmingAdvice` produce plain text, this degrades gracefully. A `getLiveClient?.() === null` reactive branch already exists in both components (the code path lets the UI just disable the "Start Call" button when no live client is available).
2. **Out of scope:** Bring up a self-hosted Riva stack — not feasible for a final-year student project.

## Recommended Approach: Hybrid GeminiProvider + NvidiaProvider

Because text + vision are easy to replace but live voice is not, the cleanest design is a **provider abstraction with feature-flag Fallback**:

1. Keep the `AIProvider` interface unchanged.
2. Add `services/ai/NvidiaNIMProvider.ts` implementing the 4 text methods + image method against `integrate.api.nvidia.com/v1/chat/completions` + `ai.api.nvidia.com/v1/vlm/`.
3. Update `services/ai/index.ts` provider selector:
   - If `VITE_GEMINI_API_KEY` → use `GeminiProvider` (full features incl. live voice).
   - Else if `VITE_NVIDIA_API_KEY` → use `NvidiaNIMProvider` (text + vision; live voice returns `null`).
   - Else → existing fallback content kicks in (`FALLBACK_NEWS`, `FALLBACK_ADVICE`, etc., all already defined in `GeminiProvider`).
4. `AIAdvisor` and `VoiceAgent` already handle `getLiveClient() === null` (they show a disabled "Live mode unavailable" state) — needs a minor `isAIConfigured()` check on the voice UI gate but the abstraction is already in place.

## Cost / Quota Note

NVIDIA NIM `build.nvidia.com` provides **1,000 free credits per model per request** at sign-up, with monthly refresh. For a demo-grade final-year project, that easily covers a few hundred AI calls per month across text + vision models.

## Effort Estimate (engineering rigor, for thesis writing)

| Task | Files touched | Lines est. | Notes |
|---|---|---|---|
| `NvidiaNIMProvider.ts` | 1 new | ~280 | Translate 4 text methods + image method, reuse cache + fallback content |
| `index.ts` selector | edit 1 | ~15 | Add `VITE_NVIDIA_API_KEY` branch |
| `.env.example` doc | edit 1 | ~10 | Document `VITE_NVIDIA_API_KEY` + how to get one |
| AIAdvisor graceful live-disable | edit 1 | ~10 | Already mostly supported |
| VoiceAgent graceful live-disable | edit 1 | ~10 | Already mostly supported |
| Tests (Vitest setup already pending) | new | ~200 | Mock both providers, exercise providers selector, fallback path |

**Total: ~525 lines, ~1 day of work.**

## Verdict

**NVIDIA NIM can replace ~85% of Agri-Flow's AI surface:** all text intelligence (farming advice, news, intel, daily tasks) and vision (crop/livestock image diagnosis). The remaining ~15% — Gemini Live voice (`ai.live.connect`) used by AI Advisor live mode and Voice Agent — has no hosted NVIDIA equivalent. Pragmatic recommendation: ship `NvidiaNIMProvider` for text+vision; mark the live voice buttons as "Coming soon" when only NVIDIA key is configured; phase them out of the thesis demo if the Gemini key isn't recoverable.

This is also a publishable engineering signal in your final-year write-up: it shows you designed with portability in mind (provider abstraction) and made a deliberate, documented "scope trade-off" call.
