import { useState, useCallback, useMemo } from 'react'
import { type Photo } from '../types'
import { getTimezoneHourKey, selectHourlyPhoto } from '../lib/hourlyPhoto'

/**
 * Manages both automatic hourly photo rotation and manual rotation overrides.
 * When the user manually rotates, the next hourly boundary resets the offset.
 */
export function usePhotoRotation(photos: Photo[], timezone: string, nowMs: number) {
  const [manualOffset, setManualOffset] = useState(0)
  const [offsetHourKey, setOffsetHourKey] = useState('')

  // Get the current hour key
  const currentHourKey = useMemo(() => getTimezoneHourKey(timezone, nowMs), [timezone, nowMs])

  // Reset manual offset if we've crossed into a new hour
  const shouldResetOffset = offsetHourKey && offsetHourKey !== currentHourKey

  const selection = useMemo(() => {
    try {
      const { index, sorted } = selectHourlyPhoto(photos, timezone, nowMs)
      const n = sorted.length

      // If we should reset or manual offset is 0, use the automatic selection
      if (shouldResetOffset || manualOffset === 0) {
        return { current: sorted[index], index, sorted }
      }

      // Apply manual offset
      const manualIndex = (index + manualOffset) % n
      return { current: sorted[manualIndex], index: manualIndex, sorted }
    } catch {
      return null
    }
  }, [photos, timezone, nowMs, manualOffset, shouldResetOffset])

  const rotateToNext = useCallback(() => {
    if (!selection || !photos.length) return

    const { sorted } = selection
    const n = sorted.length
    const nextOffset = (manualOffset + 1) % n

    setManualOffset(nextOffset)
    setOffsetHourKey(currentHourKey)
  }, [selection, photos.length, manualOffset, currentHourKey])

  return { selection, rotateToNext }
}
