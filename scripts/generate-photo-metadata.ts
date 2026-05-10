import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { imageSize } from 'image-size'
import ollama from 'ollama'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const PHOTOS_DIR = path.join(ROOT, 'public', 'photos')
const OUTPUT_DIR = path.join(ROOT, 'public', 'data')
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'photos.json')
const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const MODEL_NAME = 'gemma3:4b'
const MAX_RETRIES = 1

export type PhotoMetadata = {
  id: string
  file: string
  summary: string
  visible_details: string[]
  mood: string
  setting: string
  tags: string[]
  confidence_notes: string
  displayOrder: number
}

function isSupportedImage(fileName: string): boolean {
  return SUPPORTED_EXTENSIONS.has(path.extname(fileName).toLowerCase())
}

function generatePhotoId(index: number): string {
  return `photo-${String(index + 1).padStart(3, '0')}`
}

function getOutputFilePath(fileName: string): string {
  return `/photos/${fileName}`
}

function buildPrompt(): string {
  return `Analyze this image for a birthday countdown website.

Return STRICT JSON only.

Schema:
{
  "summary": string,
  "visible_details": string[],
  "mood": string,
  "setting": string,
  "tags": string[],
  "confidence_notes": string
}

Rules:
- summary under 20 words
- concise visual details only
- no markdown
- no explanations
- tags lowercase
- romantic/emotional awareness
- confidence_notes empty unless uncertainty exists`
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

function validateMetadata(value: unknown): PhotoMetadata {
  if (typeof value !== 'object' || value === null) {
    throw new Error('Metadata is not an object')
  }

  const metadata = value as Record<string, unknown>
  const summary = String(metadata.summary ?? '').trim()
  const mood = String(metadata.mood ?? '').trim()
  const setting = String(metadata.setting ?? '').trim()
  const confidence_notes = String(metadata.confidence_notes ?? '').trim()

  if (!summary) throw new Error('Missing summary')
  if (!mood) throw new Error('Missing mood')
  if (!setting) throw new Error('Missing setting')

  const details = Array.isArray(metadata.visible_details)
    ? metadata.visible_details.map(String).map((item) => item.trim()).filter(Boolean)
    : []
  const tags = Array.isArray(metadata.tags)
    ? metadata.tags.map(String).map((tag) => tag.trim().toLowerCase()).filter(Boolean)
    : []

  if (details.length === 0) throw new Error('visible_details must be a non-empty array')
  if (tags.length === 0) throw new Error('tags must be a non-empty array')

  return {
    id: '',
    file: '',
    summary,
    visible_details: details,
    mood,
    setting,
    tags,
    confidence_notes,
    displayOrder: 0,
  }
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const content = await fs.readFile(filePath, 'utf8')
    return JSON.parse(content) as T
  } catch {
    return fallback
  }
}

async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  const content = JSON.stringify(data, null, 2) + '\n'
  await fs.writeFile(filePath, content, 'utf8')
}

async function discoverImages(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile() && isSupportedImage(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
}

async function getImageBase64(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath)
  imageSize(buffer) // validate image content
  return buffer.toString('base64')
}

async function parseMetadataResponse(content: string): Promise<PhotoMetadata> {
  try {
    return validateMetadata(JSON.parse(cleanJsonString(content)))
  } catch (firstError) {
    const fallbackText = cleanJsonString(content)
    try {
      return validateMetadata(JSON.parse(fallbackText))
    } catch (secondError) {
      throw new Error(`JSON parse failed: ${secondError instanceof Error ? secondError.message : String(secondError)}; original: ${firstError instanceof Error ? firstError.message : String(firstError)}`)
    }
  }
}

async function analyzeImage(ollamaClient: typeof ollama, fileName: string, imageBase64: string): Promise<PhotoMetadata> {
  const prompt = buildPrompt()
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt += 1) {
    if (attempt > 1) {
      console.log(`Retrying JSON parse for ${fileName} (attempt ${attempt})`)
    }

    try {
      const response = await ollamaClient.chat({
        model: MODEL_NAME,
        messages: [{ role: 'user', content: prompt, images: [imageBase64] }],
        format: 'json',
        stream: false,
      })

      const rawContent = response.message?.content ?? ''
      if (!rawContent.trim()) {
        throw new Error('Empty response from Ollama')
      }

      return await parseMetadataResponse(rawContent)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      if (attempt > MAX_RETRIES) {
        throw lastError
      }
    }
  }

  throw lastError ?? new Error('Unknown Ollama error')
}

async function main(): Promise<void> {
  console.log('Starting photo metadata generation')
  console.log(`Source photos: ${PHOTOS_DIR}`)
  console.log(`Output file: ${OUTPUT_FILE}`)

  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  const discoveredNames = await discoverImages(PHOTOS_DIR)
  console.log(`Discovered ${discoveredNames.length} supported image(s)`)

  if (discoveredNames.length === 0) {
    console.log('No supported images found. Supported extensions:', [...SUPPORTED_EXTENSIONS].join(', '))
    return
  }

  const existingItems = await readJsonFile<PhotoMetadata[]>(OUTPUT_FILE, [])
  const processedFiles = new Set(existingItems.map((item) => item.file))
  const items: PhotoMetadata[] = [...existingItems]

  const client = ollama

  for (const [index, fileName] of discoveredNames.entries()) {
    const displayOrder = index + 1
    const filePath = getOutputFilePath(fileName)

    if (processedFiles.has(filePath)) {
      console.log(`Skipping already processed image: ${fileName}`)
      continue
    }

    console.log(`Processing ${fileName} (${displayOrder}/${discoveredNames.length})`)
    const absolutePath = path.join(PHOTOS_DIR, fileName)

    try {
      const imageBase64 = await getImageBase64(absolutePath)
      const metadata = await analyzeImage(client, fileName, imageBase64)

      const item: PhotoMetadata = {
        ...metadata,
        id: generatePhotoId(items.length),
        file: filePath,
        displayOrder,
      }

      items.push(item)
      await writeJsonFile(OUTPUT_FILE, items)
      console.log(`Saved metadata for ${fileName}`)
    } catch (error) {
      console.error(`Failed to process ${fileName}:`, error instanceof Error ? error.message : String(error))
    }
  }

  console.log(`Completed metadata generation. Final item count: ${items.length}`)
}

main().catch((error) => {
  console.error('Photo metadata generation failed:', error instanceof Error ? error.message : String(error))
  process.exit(1)
})
