// Vercel Serverless Function — proxies chat completion requests to NVIDIA's API.
//
// Why this exists: NVIDIA's API rejects browser-side CORS requests (no
// Access-Control-Allow-Origin header on the preflight response). When the app
// runs on Vercel as a static SPA, direct browser → NVIDIA calls fail. This
// function acts as a same-origin proxy: the browser calls /api/ai-chat, and
// Vercel's server-side environment makes the actual NVIDIA request (no CORS).
//
// Locally, the Vite dev server (vite.config.ts) can proxy /api/* to either
// this function (via `vercel dev`) or directly to NVIDIA — handled in dev.

interface ChatRequest {
  model?: string;
  messages: Array<{ role: string; content: string | any[] }>;
  temperature?: number;
  max_tokens?: number;
}

const NVIDIA_API_BASE = 'https://integrate.api.nvidia.com/v1';
const DEFAULT_MODEL = 'meta/llama-3.1-8b-instruct';

export default async function handler(req: {
  method: string;
  body: ChatRequest;
  headers: { [key: string]: string | string[] | undefined };
}): Promise<{ status: number; body: any; headers?: Record<string, string> }> {
  // Only accept POST. Vercel auto-handles OPTIONS preflight for same-origin.
  if (req.method !== 'POST') {
    return {
      status: 405,
      body: { error: 'Method not allowed. Use POST.' },
      headers: { 'Content-Type': 'application/json' },
    };
  }

  // Read the NVIDIA key from Vercel environment (server-side, never exposed).
  const nvidiaKey = process.env.VITE_NVIDIA_API_KEY || process.env.NVIDIA_API_KEY || '';
  if (!nvidiaKey) {
    return {
      status: 503,
      body: { error: 'NVIDIA API key not configured on the server. Set VITE_NVIDIA_API_KEY in Vercel Project Settings → Environment Variables.' },
      headers: { 'Content-Type': 'application/json' },
    };
  }

  const body = req.body as ChatRequest;
  if (!body?.messages?.length) {
    return {
      status: 400,
      body: { error: 'Missing "messages" array in request body.' },
      headers: { 'Content-Type': 'application/json' },
    };
  }

  const model = body.model || DEFAULT_MODEL;
  const temperature = typeof body.temperature === 'number' ? body.temperature : 0.4;
  // Cap at 800 tokens to keep responses snappy — the system instruction is
  // already large. NVIDIA sometimes takes 10+ seconds for 2048-token responses,
  // which blows past Vercel's default function timeout.
  const maxTokens = Math.min(
    typeof body.max_tokens === 'number' ? body.max_tokens : 2048,
    800
  );

  try {
    // Server-side fetch — no CORS restrictions.
    const upstream = await fetch(`${NVIDIA_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${nvidiaKey}`,
      },
      body: JSON.stringify({
        model,
        messages: body.messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      return {
        status: upstream.status,
        body: { error: `NVIDIA API error: ${errText}` },
        headers: { 'Content-Type': 'application/json' },
      };
    }

    const data = await upstream.json();
    return {
      status: 200,
      body: data,
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return {
      status: 502,
      body: { error: `Upstream fetch failed: ${msg}` },
      headers: { 'Content-Type': 'application/json' },
    };
  }
}
