type Entry<T> = { value: T; expiresAt: number }

const store = new Map<string, Entry<string>>()
const TTL_MS = 10 * 60 * 1000

export function cacheKeyForCaption(photoId: string, mode: string, variationSeed?: string) {
  if (variationSeed) return `${photoId}:${mode}:seed:${variationSeed}`
  const timeBucket = Math.floor(Date.now() / TTL_MS)
  return `${photoId}:${mode}:${timeBucket}`
}

export function captionCacheGet(key: string): string | null {
  const row = store.get(key)
  if (!row) return null
  if (Date.now() > row.expiresAt) {
    store.delete(key)
    return null
  }
  return row.value
}

export function captionCacheSet(key: string, value: string) {
  store.set(key, { value, expiresAt: Date.now() + TTL_MS })
}
