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
  visuals: string[]
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
  return `Analyze this image and return ONLY simple visual hints useful for generating desi Instagram-style reaction comments.

Focus ONLY on:
- pose
- expression
- selfie type
- lighting
- vibe
- observable visual details

DO NOT generate:
- emotional analysis
- poetic descriptions
- personality analysis
- deep meaning
- aesthetic philosophy

Return STRICT JSON only.

Schema:
{
  "visuals": string[]
}

Rules:
- short phrases only
- lowercase only
- simple observations
- no emotions
- no poetry
- no explanations
- no abstract words
- avoid AI sounding language`
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

  const visuals = Array.isArray(metadata.visuals)
    ? metadata.visuals.map(String).map((item) => item.trim().toLowerCase()).filter(Boolean)
    : []

  if (visuals.length === 0) throw new Error('visuals must be a non-empty array')

  return {
    id: '',
    file: '',
    visuals,
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
  const entries = (await fs.readdir(directory, { withFileTypes: true })) as Array<{
    isFile(): boolean
    name: string
  }>

  return entries
    .filter((entry) => entry.isFile() && isSupportedImage(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
}

async function getImageBase64(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath)
  imageSize(buffer)
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
      const error = new Error(`JSON parse failed: ${secondError instanceof Error ? secondError.message : String(secondError)}; original: ${firstError instanceof Error ? firstError.message : String(firstError)}`)
      error.cause = secondError
      throw error
    }
  }
}

async function analyzeImage(ollamaClient: typeof ollama, fileName: string, imageBase64: string): Promise<PhotoMetadata> {
  const prompt = buildPrompt()
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt += 1) {
    if (attempt > 1) {
      console.log(`⚠ Retrying ${fileName} (attempt ${attempt}/${MAX_RETRIES + 1})`)
    }

    const requestStart = Date.now()
    let waitTimer: ReturnType<typeof setInterval> | undefined
    let waitSeconds = 0
    const spinnerChars = ['|', '/', '-', '\\']
    let spinnerIndex = 0

    try {
      console.log('→ Sending request to Ollama...')
      process.stdout.write('Waiting for Ollama response... 0s |')

      waitTimer = setInterval(() => {
        waitSeconds += 1
        spinnerIndex = (spinnerIndex + 1) % spinnerChars.length
        process.stdout.write(`\rWaiting for Ollama response... ${waitSeconds}s ${spinnerChars[spinnerIndex]}`)
        if (waitSeconds % 5 === 0) {
          process.stdout.write(' ')
        }
      }, 1000)

      const response = await ollamaClient.chat({
        model: MODEL_NAME,
        messages: [{ role: 'user', content: prompt, images: [imageBase64] }],
        format: 'json',
        stream: false,
      })

      if (waitTimer) {
        clearInterval(waitTimer)
      }
      process.stdout.write('\r' + ' '.repeat(80) + '\r')

      const aiElapsed = (Date.now() - requestStart) / 1000
      const rawContent = response.message?.content ?? ''
      if (!rawContent.trim()) {
        throw new Error('Empty response from Ollama')
      }

      console.log(`✓ AI response received (${aiElapsed.toFixed(1)}s)`)
      console.log('→ Parsing JSON...')
      const metadata = await parseMetadataResponse(rawContent)
      console.log('✓ Metadata parsed successfully')
      return metadata
    } catch (error) {
      if (waitTimer) {
        clearInterval(waitTimer)
      }

      lastError = error instanceof Error ? error : new Error(String(error))
      console.log(`⚠ ${lastError.message}`)

      if (attempt > MAX_RETRIES) {
        throw lastError
      }
    }
  }

  throw lastError ?? new Error('Unknown Ollama error')
}

function formatDuration(ms: number): string {
  const seconds = Math.round(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return minutes > 0 ? `${minutes}m ${String(remainingSeconds).padStart(2, '0')}s` : `${remainingSeconds}s`
}

async function assertDirectoryExists(directory: string): Promise<void> {
  try {
    const stats = await fs.stat(directory)
    if (!stats.isDirectory()) {
      throw new Error(`${directory} is not a directory`)
    }
  } catch (error) {
    const err = new Error(`Photos folder not found: ${directory}`)
    if (error instanceof Error) {
      err.cause = error
    }
    throw err
  }
}

async function verifyOllamaConnection(client: typeof ollama): Promise<void> {
  console.log('Checking Ollama connection...')
  const start = Date.now()
  try {
    const response = await client.chat({
      model: MODEL_NAME,
      messages: [{ role: 'user', content: 'ping' }],
      stream: false,
    })

    if (!response || !response.message) {
      throw new Error('Invalid Ollama connection response')
    }

    console.log(`✓ Ollama connection successful (${formatDuration(Date.now() - start)})`)
    console.log(`✓ Using model: ${MODEL_NAME}`)
  } catch (error) {
    const err = new Error(`Ollama connectivity check failed: ${error instanceof Error ? error.message : String(error)}`)
    if (error instanceof Error) {
      err.cause = error
    }
    throw err
  }
}

async function main(): Promise<void> {
  const startTime = Date.now()
  console.log('================================')
  console.log('Photo Metadata Generation Starting')
  console.log('================================')
  console.log(`Source photos: ${PHOTOS_DIR}`)
  console.log(`Output file: ${OUTPUT_FILE}`)

  await fs.mkdir(OUTPUT_DIR, { recursive: true })
  await assertDirectoryExists(PHOTOS_DIR)

  const discoveredNames = await discoverImages(PHOTOS_DIR)
  console.log(`✓ Found ${discoveredNames.length} supported image(s)`)

  if (discoveredNames.length === 0) {
    console.log('No supported images found. Supported extensions:', [...SUPPORTED_EXTENSIONS].join(', '))
    return
  }

  await verifyOllamaConnection(ollama)

  const existingItems = await readJsonFile<PhotoMetadata[]>(OUTPUT_FILE, [])
  const processedFiles = new Set(existingItems.map((item) => item.file))
  const items: PhotoMetadata[] = [...existingItems]

  let successfulCount = 0
  let failedCount = 0

  const total = discoveredNames.length

  for (const [index, fileName] of discoveredNames.entries()) {
    const current = index + 1
    const percent = Math.round((current / total) * 100)
    const filePath = getOutputFilePath(fileName)
    const absolutePath = path.join(PHOTOS_DIR, fileName)

    if (processedFiles.has(filePath)) {
      console.log(`Skipping already processed image: ${fileName} [${current}/${total}] (${percent}%)`)
      continue
    }

    console.log(`\n[${current}/${total}] (${percent}%) Processing: ${fileName}`)
    const imageStart = Date.now()

    try {
      console.log('→ Reading image...')
      const imageBase64 = await getImageBase64(absolutePath)

      console.log('→ Converting to base64...')
      const metadata = await analyzeImage(ollama, fileName, imageBase64)

      const item: PhotoMetadata = {
        ...metadata,
        id: generatePhotoId(items.length),
        file: filePath,
        displayOrder: current,
      }

      console.log('→ Saving photos.json...')
      items.push(item)
      await writeJsonFile(OUTPUT_FILE, items)
      console.log('✓ Saved successfully')
      console.log(`✓ Completed ${fileName} in ${formatDuration(Date.now() - imageStart)}`)
      successfulCount += 1
    } catch (error) {
      failedCount += 1
      console.error(`✗ Failed processing ${fileName}`)
      console.error(`Reason: ${error instanceof Error ? error.message : String(error)}`)
      console.error('Continuing with next image...')
    }
  }

  console.log('\n================================')
  console.log('Metadata Generation Complete')
  console.log('================================')
  console.log(`Processed: ${total}`)
  console.log(`Successful: ${successfulCount}`)
  console.log(`Failed: ${failedCount}`)
  console.log(`Output: ${OUTPUT_FILE}`)
  console.log(`Total Time: ${formatDuration(Date.now() - startTime)}`)
}

main().catch((error) => {
  console.error('Photo metadata generation failed:')
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
