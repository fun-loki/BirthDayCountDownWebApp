import type { ModeConfigFile, Photo } from './types.js'
import { apiLog } from './log.js'
import photosData from '../../public/data/photos.json' with { type: 'json' }
import modeConfigData from '../../public/data/mode-config.json' with { type: 'json' }

let photos: Photo[] | null = null
let modeConfig: ModeConfigFile | null = null
let loggedWarm = false

// Migration function to convert old photo format to new natural format
function migratePhotoFormat(oldPhoto: Record<string, unknown>): Photo {
  // If already in new format, return as-is
  if (oldPhoto.photo_vibe && oldPhoto.personality_impression) {
    return oldPhoto as Photo
  }

  // Convert old format to new format
  return {
    id: String(oldPhoto.id || ''),
    file: String(oldPhoto.file || ''),
    photo_vibe: Array.isArray(oldPhoto.visual_style) ? oldPhoto.visual_style.map(String) : ['calm', 'cozy'],
    personality_impression: Array.isArray(oldPhoto.emotional_energy) ? oldPhoto.emotional_energy.map(String) : ['soft spoken energy'],
    caption_angles: Array.isArray(oldPhoto.caption_inspiration) ? oldPhoto.caption_inspiration.map(String) : ['someone easy to miss'],
    natural_topics: Array.isArray(oldPhoto.aesthetic_keywords) ? oldPhoto.aesthetic_keywords.map(String) : ['smile', 'comfort'],
    avoid_topics: Array.isArray(oldPhoto.avoid_caption_topics) ? oldPhoto.avoid_caption_topics.map(String) : ['clothes', 'fashion'],
    displayOrder: Number(oldPhoto.displayOrder) || 0,
  }
}

export function getPhotos(): Photo[] {
  if (!photos) {
    const rawPhotos = photosData as Record<string, unknown>[]
    photos = rawPhotos.map(migratePhotoFormat)
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
