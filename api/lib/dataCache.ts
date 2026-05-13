import type { ModeConfigFile, Photo } from './types.js'
import { apiLog } from './log.js'
import photosData from '../../public/data/photos.json' with { type: 'json' }

let photos: Photo[] | null = null
let modeConfig: ModeConfigFile | null = null
let loggedWarm = false

// Migration function to convert old photo format to new simple format
function migratePhotoFormat(oldPhoto: Record<string, unknown>): Photo {
  // If already in new format, return as-is
  if (oldPhoto.visuals && !oldPhoto.photo_vibe) {
    return oldPhoto as Photo
  }

  // Convert old format (with emotional fields) to new simple format
  const visuals: string[] = []

  // Try to extract visual information from old fields
  if (Array.isArray(oldPhoto.photo_vibe)) {
    visuals.push(...oldPhoto.photo_vibe.map(String))
  }
  if (Array.isArray(oldPhoto.visual_style)) {
    visuals.push(...oldPhoto.visual_style.map(String))
  }
  if (Array.isArray(oldPhoto.caption_angles)) {
    visuals.push(...(oldPhoto.caption_angles as string[]).slice(0, 2))
  }
  if (Array.isArray(oldPhoto.natural_topics)) {
    visuals.push(...(oldPhoto.natural_topics as string[]).slice(0, 2))
  }

  // Fallback if no visual data found
  if (visuals.length === 0) {
    visuals.push('casual pose', 'indoor lighting')
  }

  return {
    id: String(oldPhoto.id || ''),
    file: String(oldPhoto.file || ''),
    visuals: [...new Set(visuals)].slice(0, 8),
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
    // Mode config is no longer imported from JSON file - it's in the registry
    // This maintains backward compatibility but returns empty config
    modeConfig = {} as ModeConfigFile
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
