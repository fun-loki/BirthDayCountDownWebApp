import type { VercelRequest, VercelResponse } from '@vercel/node'
import { randomUUID } from 'node:crypto'
import { readFileSync, unlinkSync } from 'node:fs'
import formidable from 'formidable'
import type { File } from 'formidable'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AnalyzePhotoItem, AnalyzeResponseBody, Gender } from './lib/types.js'
import { apiLog } from './lib/log.js'
import { VISION_ANALYSIS_PROMPT } from './lib/prompts/metadata/vision-analysis.prompt.js'

export const config = {
  api: {
    bodyParser: false,
  },
}

function collectFiles(files: formidable.Files): File[] {
  const out: File[] = []
  for (const v of Object.values(files)) {
    if (!v) continue
    if (Array.isArray(v)) out.push(...v)
    else out.push(v)
  }
  return out
}

function cleanJsonString(text: string): string {
  const trimmed = text.trim()
  const withoutFences = trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '')
  const firstBrace = withoutFences.indexOf('{')
  const lastBrace = withoutFences.lastIndexOf('}')
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return withoutFences.slice(firstBrace, lastBrace + 1)
  }
  return withoutFences
}

function normalizeGender(value: unknown): Gender {
  const raw = typeof value === 'string' ? value.trim().toLowerCase() : ''
  if (raw === 'female' || raw === 'woman' || raw === 'girl') return 'female'
  if (raw === 'male' || raw === 'man' || raw === 'boy') return 'male'
  if (raw === 'unknown' || raw === 'unsure' || raw === 'ambiguous') return 'unknown'
  return 'female'
}

function normalizeVibe(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map(String)
    .map((item) => item.trim())
    .filter(Boolean)
}

async function visionDescribe(opts: {
  apiKey: string
  imagePath: string
  mime: string
}): Promise<Omit<AnalyzePhotoItem, 'id' | 'file' | 'displayOrder'>> {
  const buffer = readFileSync(opts.imagePath)
  const b64 = buffer.toString('base64')

  const system = VISION_ANALYSIS_PROMPT

  const genAI = new GoogleGenerativeAI(opts.apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const prompt = `${system}\n\nDescribe observable visual details in this image.`

  apiLog('info', 'vision_gemini_request', { mime: opts.mime, model: 'gemini-2.0-flash' })

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: opts.mime,
          data: b64,
        },
      },
    ])

    const response = await result.response
    const text = response.text()

    if (!text) throw new Error('Empty Gemini response')

    const parsed = JSON.parse(cleanJsonString(text)) as {
      visuals?: unknown
      gender?: unknown
      person_vibe?: unknown
    }

    const visuals = Array.isArray(parsed.visuals)
      ? parsed.visuals.map(String)
      : []

    apiLog('info', 'vision_gemini_success', { mime: opts.mime, model: 'gemini-2.0-flash' })

    return {
      visuals,
      gender: normalizeGender(parsed.gender),
      person_vibe: normalizeVibe(parsed.person_vibe),
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Gemini vision failed'
    apiLog('error', 'vision_gemini_failed', { mime: opts.mime, model: 'gemini-2.0-flash', error: message })
    throw new Error(`Gemini vision error: ${message}`)
  }
}

function safeFilename(name: string) {
  const base = name.split(/[/\\]/).pop() ?? 'photo.jpg'
  return base.replace(/[^a-zA-Z0-9._-]/g, '_') || 'photo.jpg'
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const reqId = randomUUID().slice(0, 8)
  const started = Date.now()

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.GEMINI_API_KEY ?? ''
  if (!apiKey) {
    res.status(500).json({ error: 'GEMINI_API_KEY is not configured' })
    return
  }

  const form = formidable({
    multiples: true,
    maxTotalFileSize: 25 * 1024 * 1024,
    keepExtensions: true,
  })

  let files: File[]
  try {
    const [, parsedFiles] = await form.parse(req)
    files = collectFiles(parsedFiles)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Upload parse failed'
    apiLog('warn', 'analyze_parse_failed', { reqId, error: message })
    res.status(400).json({ error: message })
    return
  }

  if (files.length === 0) {
    res.status(400).json({ error: 'No images uploaded' })
    return
  }

  apiLog('info', 'analyze_batch_start', { reqId, count: files.length })

  const items: AnalyzePhotoItem[] = []
  const tempPaths: string[] = []

  try {
    let order = 0
    for (let i = 0; i < files.length; i++) {
      const f = files[i]
      if (!f?.filepath) continue
      tempPaths.push(f.filepath)
      order += 1
      const mime = f.mimetype || 'image/jpeg'
      const name = safeFilename(f.originalFilename ?? `upload-${i}.jpg`)
      const id = `photo-${randomUUID()}`
      const publicPath = `/photos/${name}`

      const meta = await visionDescribe({
        apiKey,
        imagePath: f.filepath,
        mime,
      })

      items.push({
        id,
        file: publicPath,
        visuals: meta.visuals,
        gender: meta.gender,
        person_vibe: meta.person_vibe,
        displayOrder: order,
      })
    }

    const body: AnalyzeResponseBody = { items }
    apiLog('info', 'analyze_batch_done', {
      reqId,
      count: items.length,
      ms: Date.now() - started,
    })
    res.status(200).json(body)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Vision failed'
    apiLog('error', 'analyze_failed', { reqId, error: message })
    res.status(502).json({ error: 'Image analysis failed', detail: message })
  } finally {
    for (const p of tempPaths) {
      try {
        unlinkSync(p)
      } catch {
        /* ignore */
      }
    }
  }
}
