import type { ModeConfigFile, Photo } from './types.js'
import { apiLog } from './log.js'
import photosData from '../../public/data/photos.json' with { type: 'json' }
import modeConfigData from '../../public/data/mode-config.json' with { type: 'json' }

let photos: Photo[] | null = null
let modeConfig: ModeConfigFile | null = null
let loggedWarm = false

// Migration function to convert old photo format to new emotional format
function migratePhotoFormat(oldPhoto: Record<string, unknown>): Photo {
  // If already in new format, return as-is
  if (oldPhoto.visual_style && oldPhoto.emotional_energy) {
    return oldPhoto as Photo
  }

  // Convert old format to new format
  return {
    id: String(oldPhoto.id || ''),
    file: String(oldPhoto.file || ''),
    visual_style: Array.isArray(oldPhoto.visible_details) ? oldPhoto.visible_details.map(String) : [],
    emotional_energy: [String(oldPhoto.mood || 'warm')],
    caption_inspiration: [String(oldPhoto.summary || 'comforting presence').split('.')[0]],
    relationship_vibe: ['close connection'],
    aesthetic_keywords: Array.isArray(oldPhoto.tags) ? oldPhoto.tags.map(String) : [],
    avoid_caption_topics: ['clothing', 'sweater', 'shirt'],
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
