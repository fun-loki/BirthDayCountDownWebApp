import type { VercelRequest, VercelResponse } from '@vercel/node'
import { randomUUID } from 'node:crypto'
import { CAPTION_MODES, type CaptionRequestBody, type CaptionMode } from './lib/types.js'
import { getPhotos, getModeConfig } from './lib/dataCache.js'
import { cacheKeyForCaption, captionCacheGet, captionCacheSet } from './lib/ttlCache.js'
import { CaptionGeneratorService } from './lib/services/caption/caption-generator.service.js'
import { apiLog } from './lib/log.js'

function isCaptionMode(m: string): m is CaptionMode {
  return (CAPTION_MODES as readonly string[]).includes(m)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const reqId = randomUUID().slice(0, 8)
  const started = Date.now()

  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    let body: CaptionRequestBody
    try {
      body = typeof req.body === 'string' ? (JSON.parse(req.body) as CaptionRequestBody) : (req.body as CaptionRequestBody)
    } catch {
      apiLog('warn', 'caption_bad_json', { reqId })
      res.status(400).json({ error: 'Invalid JSON body' })
      return
    }

    if (!body?.photoId || !body?.mode || !isCaptionMode(body.mode)) {
      res.status(400).json({ error: 'photoId and valid mode required' })
      return
    }

    const xaiKey = process.env.XAI_API_KEY ?? ''
    if (!xaiKey) {
      res.status(500).json({ error: 'XAI_API_KEY is not configured' })
      return
    }

    const photos = getPhotos()
    const photo = photos.find((p) => p.id === body.photoId)
    if (!photo) {
      res.status(404).json({ error: 'Photo not found' })
      return
    }

    // Debug log metadata
    apiLog('info', 'caption_metadata_loaded', {
      reqId,
      photoId: body.photoId,
      visualsCount: photo.visuals?.length || 0,
      visuals: photo.visuals,
    })

    // Validate photo metadata
    if (!Array.isArray(photo.visuals) || photo.visuals.length === 0) {
      apiLog('error', 'caption_invalid_visuals', {
        reqId,
        photoId: body.photoId,
        visuals: photo.visuals,
      })
      res.status(422).json({
        error: 'caption generation failed',
        detail: 'missing visuals metadata'
      })
      return
    }

    const modeConfig = getModeConfig()
    const entry = modeConfig[body.mode]
    if (!entry) {
      res.status(400).json({ error: 'Mode config missing' })
      return
    }

    const cacheKey = cacheKeyForCaption(body.photoId, body.mode, body.variationSeed)
    const cachedText = captionCacheGet(cacheKey)
    if (cachedText) {
      apiLog('info', 'caption_cache_hit', {
        reqId,
        photoId: body.photoId,
        mode: body.mode,
        ms: Date.now() - started,
        provider: 'xai',
      })
      res.status(200).json({
        caption: cachedText,
        provider: 'xai',
        model: entry.model,
        cached: true,
        generatedAt: new Date().toISOString(),
      })
      return
    }

    apiLog('info', 'caption_cache_miss', {
      reqId,
      photoId: body.photoId,
      mode: body.mode,
      provider: 'xai',
    })

    try {
      const captionGenerator = new CaptionGeneratorService()
      const { text, provider, model } = await captionGenerator.generateCaptionText({
        photo,
        mode: body.mode,
        entry,
        xaiKey,
      })
      captionCacheSet(cacheKey, text)
      apiLog('info', 'caption_generated', {
        reqId,
        photoId: body.photoId,
        mode: body.mode,
        provider,
        ms: Date.now() - started,
      })
      res.status(200).json({
        caption: text,
        provider,
        model,
        cached: false,
        generatedAt: new Date().toISOString(),
      })
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error'
      apiLog('error', 'caption_ai_failed', {
        reqId,
        photoId: body.photoId,
        mode: body.mode,
        error: message,
      })
      res.status(502).json({ error: 'Caption generation failed', detail: message })
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown server error'
    apiLog('error', 'caption_uncaught_error', {
      reqId,
      error: message,
      stack: e instanceof Error ? e.stack : undefined,
    })
    res.status(500).json({ error: 'Server error', detail: message })
  }
}
