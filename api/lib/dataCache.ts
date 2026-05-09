import type { ModeConfigFile, Photo } from './types'
import { apiLog } from './log'
import { readPublicRelative } from './readData'

let photos: Photo[] | null = null
let modeConfig: ModeConfigFile | null = null
let loggedWarm = false

export function getPhotos(): Photo[] {
  if (!photos) {
    photos = JSON.parse(readPublicRelative('data/photos.json')) as Photo[]
  }
  maybeLogWarm()
  return photos
}

export function getModeConfig(): ModeConfigFile {
  if (!modeConfig) {
    modeConfig = JSON.parse(readPublicRelative('data/mode-config.json')) as ModeConfigFile
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
