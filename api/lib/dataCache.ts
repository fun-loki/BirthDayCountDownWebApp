import type { ModeConfigFile, Photo } from './types.js'
import { apiLog } from './log.js'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

let photos: Photo[] | null = null
let modeConfig: ModeConfigFile | null = null
let loggedWarm = false

// Load JSON data at runtime
function loadPhotosData(): Record<string, unknown>[] {
  try {
    const data = readFileSync(join(process.cwd(), 'public/data/photos.json'), 'utf8')
    return JSON.parse(data) as Record<string, unknown>[]
  } catch (e) {
    apiLog('error', 'photos_json_load_failed', { error: e instanceof Error ? e.message : 'Unknown error' })
    return []
  }
}

function loadModeData(): ModeConfigFile {
  try {
    const data = readFileSync(join(process.cwd(), 'public/data/mode-config.json'), 'utf8')
    return JSON.parse(data) as ModeConfigFile
  } catch (e) {
    apiLog('error', 'mode_config_json_load_failed', { error: e instanceof Error ? e.message : 'Unknown error' })
    throw new Error('Failed to load mode configuration')
  }
}

function normalizeGender(value: unknown): Photo['gender'] {
  const raw = typeof value === 'string' ? value.trim().toLowerCase() : ''
  if (raw === 'female' || raw === 'woman' || raw === 'girl') return 'female'
  if (raw === 'male' || raw === 'man' || raw === 'boy') return 'male'
  if (raw === 'unknown' || raw === 'unsure' || raw === 'ambiguous') return 'unknown'
  return 'female'
}

function normalizeArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map(String)
    .map((item) => item.trim())
    .filter(Boolean)
}

function migratePhotoFormat(rawPhoto: Record<string, unknown>): Photo {
  const visuals = normalizeArray(rawPhoto.visuals)
  const legacyVisuals = [
    ...normalizeArray(rawPhoto.photo_vibe),
    ...normalizeArray(rawPhoto.visual_style),
    ...normalizeArray(rawPhoto.caption_angles)?.slice(0, 2),
    ...normalizeArray(rawPhoto.natural_topics)?.slice(0, 2),
  ].filter(Boolean)

  const finalVisuals = visuals.length > 0 ? visuals : legacyVisuals
  const sanitizedVisuals = finalVisuals.length > 0 ? [...new Set(finalVisuals)].slice(0, 8) : ['casual pose', 'indoor lighting']

  const personVibe = normalizeArray(rawPhoto.person_vibe)
  return {
    id: String(rawPhoto.id || ''),
    file: String(rawPhoto.file || ''),
    visuals: sanitizedVisuals,
    gender: normalizeGender(rawPhoto.gender),
    person_vibe: personVibe.length > 0 ? personVibe.slice(0, 4) : [],
    displayOrder: Number(rawPhoto.displayOrder) || 0,
  }
}

export function getPhotos(): Photo[] {
  if (!photos) {
    const rawPhotos = loadPhotosData()
    photos = rawPhotos.map(migratePhotoFormat)
  }
  maybeLogWarm()
  return photos
}

export function getModeConfig(): ModeConfigFile {
  if (!modeConfig) {
    modeConfig = loadModeData()
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
