/**
 * Hourly rotation: deterministic index from IANA timezone wall-clock hour + date.
 * Same formula for selection and neighbor preload.
 */
export function getTimezoneHourKey(timeZone: string, nowMs: number): string {
  const d = new Date(nowMs)
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
  })
  const parts = fmt.formatToParts(d)
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '00'
  return `${pick('year')}-${pick('month')}-${pick('day')}-${pick('hour')}`
}

export function hashToIndex(key: string, modulo: number): number {
  let h = 0
  for (let i = 0; i < key.length; i++) {
    h = Math.imul(31, h) + key.charCodeAt(i)
  }
  return modulo === 0 ? 0 : Math.abs(h) % modulo
}

export function selectHourlyPhoto<T extends { displayOrder: number }>(
  items: T[],
  timeZone: string,
  nowMs: number,
): { current: T; index: number; sorted: T[] } {
  const sorted = [...items].sort((a, b) => a.displayOrder - b.displayOrder)
  const n = sorted.length
  if (n === 0) {
    throw new Error('No photos configured')
  }
  const hourKey = getTimezoneHourKey(timeZone, nowMs)
  const index = hashToIndex(hourKey, n)
  return { current: sorted[index], index, sorted }
}

export function neighborIndices(index: number, length: number) {
  if (length === 0) return { prev: -1, next: -1 }
  return {
    prev: (index - 1 + length) % length,
    next: (index + 1) % length,
  }
}
