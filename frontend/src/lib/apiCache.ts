/**
 * Shared API client with 30-second caching and deduplication.
 * Both CommunityDashboard and OperationsWorkspace use this
 * to hit the same GET /api/signals endpoint.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL = 30_000; // 30 seconds

/**
 * Fetches data from the API with a 30-second cache.
 * If cached data exists, returns it immediately.
 * Always triggers a background refresh if the cache is stale.
 */
export async function fetchWithCache<T>(
  path: string,
  onUpdate?: (data: T) => void
): Promise<T> {
  const url = `${API_URL}${path}`;
  const cached = cache.get(url) as CacheEntry<T> | undefined;
  const now = Date.now();

  // If cache is fresh, return immediately
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // If cache exists but stale, return stale data and refresh in background
  if (cached) {
    refreshInBackground<T>(url, onUpdate);
    return cached.data;
  }

  // No cache at all — must fetch
  const data = await fetchFresh<T>(url);
  cache.set(url, { data, timestamp: Date.now() });
  return data;
}

async function fetchFresh<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json() as Promise<T>;
}

function refreshInBackground<T>(url: string, onUpdate?: (data: T) => void) {
  fetchFresh<T>(url)
    .then((data) => {
      cache.set(url, { data, timestamp: Date.now() });
      onUpdate?.(data);
    })
    .catch((err) => {
      console.error('Background refresh failed:', err);
    });
}

/**
 * Deduplicates signals by ID and content signature, keeping newest first.
 */
export function deduplicateSignals(data: any[]): any[] {
  // Sort newest first
  const sorted = [...data].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const seenId = new Set<string>();
  const seenContent = new Set<string>();

  return sorted.filter((s) => {
    if (seenId.has(s.id)) return false;
    const signature = `${s.location}|${s.description}|${s.created_at}`;
    if (seenContent.has(signature)) return false;
    seenId.add(s.id);
    seenContent.add(signature);
    return true;
  });
}

/**
 * Invalidates the cache for a specific path.
 */
export function invalidateCache(path: string) {
  const url = `${API_URL}${path}`;
  cache.delete(url);
}
