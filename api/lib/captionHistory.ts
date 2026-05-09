const history = new Map<string, string[]>()
const MAX = 5

function key(photoId: string, mode: string) {
  return `${photoId}:${mode}`
}

export function getRecentCaptions(photoId: string, mode: string): string[] {
  return [...(history.get(key(photoId, mode)) ?? [])]
}

export function pushCaption(photoId: string, mode: string, caption: string) {
  const k = key(photoId, mode)
  const prev = history.get(k) ?? []
  const next = [...prev, caption]
  history.set(k, next.slice(-MAX))
}
