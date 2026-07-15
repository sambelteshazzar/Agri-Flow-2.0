import type { NewsArticle } from '../types';

// Wikimedia Commons API — no API key required, no hotlinking restrictions,
// generous rate limits. Images are CC-BY-SA / public domain.
const COMMONS_ENDPOINT = 'https://commons.wikimedia.org/w/api.php';
const UA = 'AgriFlow/2.0 (educational smart-farming project; https://github.com/anomalyco/opencode)';

// Cache image lookups for 24h to be polite to the Commons API. Articles often
// re-appear across refreshes (same news content), so this avoids re-querying
// for the same cover photo repeatedly.
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const CACHE_PREFIX = 'agflow_commons_img_';
const MEMORY_CACHE = new Map<string, { url: string | null; ts: number }>();

// Category queries — consistently return 3+ agriculture JPEGs.
const CATEGORY_TERMS: Record<NewsArticle['category'], string> = {
  Market: 'grain market harvest crops trading',
  Tech: 'agriculture drone technology farming',
  Policy: 'government agriculture farming parliament',
  Climate: 'drought flooded farmland weather',
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

interface CommonsImageInfo {
  thumburl?: string;
  url?: string;
  thumbwidth?: number;
  mime?: string;
}
interface CommonsPage {
  imageinfo?: CommonsImageInfo[];
}
interface CommonsResponse {
  query?: { pages?: Record<string, CommonsPage> };
}

// Extract up to 3 meaningful keywords from a title, ignoring common stopwords.
// Returns a space-separated query string suitable for Commons' search.
interface FetchOptions {
  // When true, prefer the original full-resolution URL — used for the featured
  // hero card which is much larger. Otherwise, prefer the 800px thumbnail.
  preferLarge?: boolean;
  signal?: AbortSignal;
}

async function fetchFromCommons(
  query: string,
  opts: FetchOptions,
): Promise<string | null> {
  // filetype:bitmap restricts to actual photos (JPEG/PNG), excluding PDFs and
  // SVGs which are too low-quality or stylistically wrong for cover photos.
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: `filetype:bitmap ${query}`,
    gsrnamespace: '6', // File namespace only
    gsrlimit: '5',
    prop: 'imageinfo',
    iiprop: 'url|mime',
    iiurlwidth: '800',
    origin: '*', // CORS-enabled endpoint
  });
  const url = `${COMMONS_ENDPOINT}?${params.toString()}`;
  try {
    const res = await fetch(url, {
      signal: opts.signal,
      headers: { 'Api-User-Agent': UA },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as CommonsResponse;
    const pages = data.query?.pages;
    if (!pages) return null;

    // Wikimedia returns pages as an object keyed by pageid, order not
    // guaranteed. Sort by the search index field when available, else pick
    // pics that are JPEGs (skip PNG diagrams / illustrations).
    const candidates = Object.values(pages)
      .filter(p => p.imageinfo?.[0])
      .map(p => p.imageinfo![0]);

    // Prefer JPEGs (real photos); fall back to any bitmap type.
    const photo = candidates.find(c => c.mime === 'image/jpeg') || candidates[0];
    if (!photo) return null;

    if (opts.preferLarge) return photo.url || photo.thumburl || null;
    return photo.thumburl || photo.url || null;
  } catch {
    return null; // network error, abort, etc.
  }
}

/**
 * Fetch an agriculture-themed cover photo from Wikimedia Commons for the given
 * article. Returns null if no results, network failure, or abort.
 * Callers should fall back to the existing SVG placeholders when null.
 *
 * Results are cached for 24h (in-memory + localStorage when available). Cache
 * key is derived from the article's stable id (or a title hash if no id) and
 * the size preference.
 *
 * No API key required. Wikimedia Commons hosts freely-licensed media
 * (CC-BY-SA / public domain) and permits hotlinking from upload.wikimedia.org.
 */
export async function fetchNewsImage(
  article: NewsArticle,
  opts: FetchOptions = {},
): Promise<string | null> {
  const cacheKey = `${article.id || hashTitle(article.title)}_${opts.preferLarge ? 'lg' : 'md'}`;
  const cached = readCache(cacheKey);
  if (cached !== undefined) return cached;

  const query = buildQuery(article);
  const url = await fetchFromCommons(query, opts);
  if (url) writeCache(cacheKey, url); // only cache successful results
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

function buildQuery(article: NewsArticle): string {
  const categoryTerms = CATEGORY_TERMS[article.category] || 'agriculture farming';
  const titleKeywords = article.title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3)
    .slice(0, 3)
    .join(' ');
  return `${categoryTerms} ${titleKeywords}`.trim();
}

/**
 * Wikimedia Commons requires no API key, so this always returns true once the
 * module is loaded. Kept for symmetry with the previous Pixabay impl so the
 * NewsHub component's isConfigured() guard stays meaningful (and stays a
 * no-op short-circuit when Commons is reachable).
 */
export function isNewsImageConfigured(): boolean {
  return true;
}
