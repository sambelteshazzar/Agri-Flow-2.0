import type { NewsArticle } from '../types';

const PIXABAY_KEY = import.meta.env.VITE_PIXABAY_API_KEY || '';
const PIXABAY_ENDPOINT = 'https://pixabay.com/api/';

// Per Pixabay ToS: requests must be cached for 24 hours.
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const CACHE_PREFIX = 'agflow_pixabay_img_';
const MEMORY_CACHE = new Map<string, { url: string | null; ts: number }>();

// Category -> Pixabay-friendly query terms. Used when title yields no good keywords
// or as a relevance booster combined with extracted title keywords.
const CATEGORY_TERMS: Record<NewsArticle['category'], string> = {
  Market: 'agriculture market crops grain trading harvest',
  Tech: 'agriculture technology drone farming innovation',
  Policy: 'government agriculture policy farming regulation',
  Climate: 'climate farming weather drought rain agriculture',
};

function readCache(key: string): string | null | undefined {
  const mem = MEMORY_CACHE.get(key);
  if (mem) {
    if (Date.now() - mem.ts < CACHE_TTL_MS) return mem.url;
    MEMORY_CACHE.delete(key);
  }
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as { url: string | null; ts: number };
    if (Date.now() - parsed.ts > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return undefined;
    }
    MEMORY_CACHE.set(key, parsed);
    return parsed.url;
  } catch {
    return undefined;
  }
}

function writeCache(key: string, url: string | null): void {
  const entry = { url, ts: Date.now() };
  MEMORY_CACHE.set(key, entry);
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // localStorage may be unavailable (private mode, quota); memory cache still works.
  }
}

interface PixabayHit {
  webformatURL?: string;
  largeImageURL?: string;
  previewURL?: string;
}

interface PixabayResponse {
  total?: number;
  totalHits?: number;
  hits?: PixabayHit[];
}

// Extract up to 3 meaningful keywords from a title, ignoring common stopwords.
//Returns a space-separated query string suitable for Pixabay's `q` parameter.
const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'for', 'in', 'on', 'at', 'to', 'of', 'with',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'this', 'that', 'these', 'those',
  'from', 'as', 'by', 'it', 'its', 'has', 'have', 'had', 'will', 'would', 'could',
  'should', 'may', 'might', 'can', 'must', 'about', 'into', 'than', 'then', 'over',
  'under', 'after', 'before', 'new', 'report', 'reports', 'says', 'said', 'news',
  'update', 'latest', 'first', 'one', 'two', 'three', 'all', 'more', 'most', 'other',
]);
function extractKeywords(title: string): string {
  const words = (title.toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/))
    .filter(w => w.length > 2 && !STOPWORDS.has(w));
  // Dedupe + take first 3
  const seen = new Set<string>();
  const picked: string[] = [];
  for (const w of words) {
    if (seen.has(w)) continue;
    seen.add(w);
    picked.push(w);
    if (picked.length >= 3) break;
  }
  return picked.join(' ');
}

function buildQuery(article: NewsArticle): string {
  const titleKw = extractKeywords(article.title);
  const catKw = CATEGORY_TERMS[article.category] || 'agriculture farming';
  // Pixabay free-text search works best with a few keywords; prefer title
  // keywords when present (more specific), fall back to category terms.
  return (titleKw || catKw).slice(0, 100);
}

interface FetchOptions {
  // When true, prefer largeImageURL (1280px) — used for the featured hero card.
  preferLarge?: boolean;
  signal?: AbortSignal;
}

async function fetchFromPixabay(
  query: string,
  opts: FetchOptions,
): Promise<string | null> {
  if (!PIXABAY_KEY) return null;
  const params = new URLSearchParams({
    key: PIXABAY_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: '3',
    min_width: '800',
  });
  const url = `${PIXABAY_ENDPOINT}?${params.toString()}`;
  try {
    const res = await fetch(url, { signal: opts.signal });
    if (!res.ok) return null; // 429 rate limit, 400 key error, etc. — silent fallback
    const data = (await res.json()) as PixabayResponse;
    const hit = data.hits?.[0];
    if (!hit) return null;
    if (opts.preferLarge) return hit.largeImageURL || hit.webformatURL || hit.previewURL || null;
    return hit.webformatURL || hit.largeImageURL || hit.previewURL || null;
  } catch {
    return null; // network error, abort, etc.
  }
}

/**
 * Fetch an agriculture-themed cover photo from Pixabay for the given article.
 * Returns null if unconfigured, rate-limited, network failure, or no results.
 * Callers should fall back to the existing SVG placeholders when null.
 *
 * Results are cached for 24h per Pixabay ToS — both in-memory and in localStorage
 * (when available). Cache key is derived from the article's stable id (or title
 * hash if no id) and the size preference.
 */
export async function fetchNewsImage(
  article: NewsArticle,
  opts: FetchOptions = {},
): Promise<string | null> {
  const cacheKey = `${article.id || hashTitle(article.title)}_${opts.preferLarge ? 'lg' : 'md'}`;
  const cached = readCache(cacheKey);
  if (cached !== undefined) return cached;

  const query = buildQuery(article);
  const url = await fetchFromPixabay(query, opts);
  writeCache(cacheKey, url);
  return url;
}

// Lightweight string hash (FNV-1a) — used to derive a stable cache key when an
// article lacks a stable id. Kept simple to avoid bringing in any deps.
function hashTitle(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16);
}

/**
 * Convenience: is the Pixabay integration configured at all?
 * Lets the UI skip rendering a "loading photo..." shimmer when there's no key.
 */
export function isPixabayConfigured(): boolean {
  return !!PIXABAY_KEY;
}
