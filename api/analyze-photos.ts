import type { VercelRequest, VercelResponse } from '@vercel/node'
import { randomUUID } from 'node:crypto'
import { readFileSync, unlinkSync } from 'node:fs'
import formidable from 'formidable'
import type { File } from 'formidable'
import type { AnalyzePhotoItem, AnalyzeResponseBody } from './lib/types'
import { apiLog } from './lib/log'

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

async function visionDescribe(opts: {
  apiKey: string
  imagePath: string
  mime: string
}): Promise<Omit<AnalyzePhotoItem, 'id' | 'file' | 'displayOrder'>> {
  const buffer = readFileSync(opts.imagePath)
  const b64 = buffer.toString('base64')
  const dataUrl = `data:${opts.mime};base64,${b64}`

  const system = `You analyze photos for a private birthday countdown site.
Return a single JSON object with keys:
- summary (string, one sentence)
- visible_details (array of short strings, 3-8 items)
- mood (string)
- setting (string)
- tags (array of short strings, 3-8 items)
- confidence_notes (string, optional caveats or empty string)
No markdown, no extra keys.`

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${opts.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      max_tokens: 500,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Describe this image for caption metadata.' },
            {
              type: 'image_url',
              image_url: { url: dataUrl },
            },
          ],
        },
      ],
    }),
  })

  const raw = await res.text()
  if (!res.ok) {
    throw new Error(`Vision HTTP ${res.status}: ${raw.slice(0, 400)}`)
  }
  const data = JSON.parse(raw) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('Empty vision response')
  const parsed = JSON.parse(content) as {
    summary?: string
    visible_details?: unknown
    mood?: string
    setting?: string
    tags?: unknown
    confidence_notes?: string
  }

  const details = Array.isArray(parsed.visible_details)
    ? parsed.visible_details.map(String)
    : []
  const tags = Array.isArray(parsed.tags) ? parsed.tags.map(String) : []

  return {
    summary: String(parsed.summary ?? ''),
    visible_details: details,
    mood: String(parsed.mood ?? ''),
    setting: String(parsed.setting ?? ''),
    tags,
    confidence_notes: String(parsed.confidence_notes ?? ''),
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

  const apiKey = process.env.OPENAI_API_KEY ?? ''
  if (!apiKey) {
    res.status(500).json({ error: 'OPENAI_API_KEY is not configured' })
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
        summary: meta.summary,
        visible_details: meta.visible_details,
        mood: meta.mood,
        setting: meta.setting,
        tags: meta.tags,
        confidence_notes: meta.confidence_notes,
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
