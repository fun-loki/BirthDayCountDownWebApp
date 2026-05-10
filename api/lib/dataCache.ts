import type { ModeConfigFile, Photo } from './types.js'
import { apiLog } from './log.js'
import photosData from '../../public/data/photos.json'
import modeConfigData from '../../public/data/mode-config.json'

let photos: Photo[] | null = null
let modeConfig: ModeConfigFile | null = null
let loggedWarm = false

export function getPhotos(): Photo[] {
  if (!photos) {
    photos = photosData as Photo[]
  }
  maybeLogWarm()
  return photos
}

export function getModeConfig(): ModeConfigFile {
  if (!modeConfig) {
    modeConfig = modeConfigData as ModeConfigFile
  }
  maybeLogWarm()
  return modeConfig
}

function maybeLogWarm() {
  if (loggedWarm || !photos || !modeConfig) return
  loggedWarm = true
  apiLog('info', 'startup_preload', {
    photos: photos.length,
    modes: Object.keys(modeConfig).length,
  })
}
