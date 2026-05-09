import { useEffect, useState } from 'react'
import { fetchJson } from '../lib/fetchJson'
import type { AppConfig, ModeConfigFile, Photo } from '../types'

export type StaticDataState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; app: AppConfig; photos: Photo[]; modeConfig: ModeConfigFile }

export function useStaticData(): StaticDataState {
  const [state, setState] = useState<StaticDataState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [app, photos, modeConfig] = await Promise.all([
          fetchJson<AppConfig>('/data/app-config.json'),
          fetchJson<Photo[]>('/data/photos.json'),
          fetchJson<ModeConfigFile>('/data/mode-config.json'),
        ])
        if (cancelled) return
        setState({ status: 'ready', app, photos, modeConfig })
      } catch (e) {
        if (cancelled) return
        setState({
          status: 'error',
          message: e instanceof Error ? e.message : 'Failed to load config',
        })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
