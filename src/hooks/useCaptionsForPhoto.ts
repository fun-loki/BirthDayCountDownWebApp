import { useCallback, useEffect, useState } from 'react'
import { postCaption } from '../services/captionApi'
import { CAPTION_MODES, type CaptionMode, type CaptionResponseBody } from '../types'

type LoadingMap = Partial<Record<CaptionMode, boolean>>

function initialLoading(): LoadingMap {
  return Object.fromEntries(CAPTION_MODES.map((m) => [m, true])) as LoadingMap
}

export function useCaptionsForPhoto(photoId: string) {
  const [data, setData] = useState<Partial<Record<CaptionMode, CaptionResponseBody>>>({})
  const [loading, setLoading] = useState<LoadingMap>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
      if (cancelled) return
      setData({})
      setLoading(initialLoading())
      setError(null)

      for (const mode of CAPTION_MODES) {
        postCaption({ photoId, mode })
          .then((res) => {
            if (cancelled) return
            setData((prev) => ({ ...prev, [mode]: res }))
            setLoading((prev) => ({ ...prev, [mode]: false }))
          })
          .catch((e) => {
            if (cancelled) return
            const msg = e instanceof Error ? e.message : 'Caption failed'
            setError(msg)
            setLoading((prev) => ({ ...prev, [mode]: false }))
          })
      }
    })

    return () => {
      cancelled = true
    }
  }, [photoId])

  const regenerate = useCallback(
    async (mode: CaptionMode) => {
      setLoading((prev) => ({ ...prev, [mode]: true }))
      setError(null)
      try {
        const res = await postCaption({
          photoId,
          mode,
          variationSeed: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        })
        setData((prev) => ({ ...prev, [mode]: res }))
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Regenerate failed')
      } finally {
        setLoading((prev) => ({ ...prev, [mode]: false }))
      }
    },
    [photoId],
  )

  return { data, loading, error, regenerate }
}
