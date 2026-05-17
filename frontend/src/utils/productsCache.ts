export const PRODUCTS_CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

interface CacheEntry<T> {
  data: T
  timestamp: number
}

export function getCached<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const entry: CacheEntry<T> = JSON.parse(raw)
    return entry.data
  } catch {
    return null
  }
}

export function setCached<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() }
    localStorage.setItem(key, JSON.stringify(entry))
  } catch {
    // localStorage can be unavailable (private mode, quota exceeded); fail silently
  }
}

export function isCacheValid(key: string): boolean {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return false
    const entry: CacheEntry<unknown> = JSON.parse(raw)
    return Date.now() - entry.timestamp < PRODUCTS_CACHE_TTL_MS
  } catch {
    return false
  }
}
