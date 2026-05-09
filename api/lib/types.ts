export type CaptionMode =
  | 'dad'
  | 'mom'
  | 'brother'
  | 'best_friend'
  | 'boyfriend'
  | 'husband'
  | 'flirty'
  | 'enemy'

export const CAPTION_MODES: readonly CaptionMode[] = [
  'dad',
  'mom',
  'brother',
  'best_friend',
  'boyfriend',
  'husband',
  'flirty',
  'enemy',
] as const

export type Photo = {
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

export type ModeConfigEntry = {
  provider: 'openai' | 'xai'
  model: string
  temperature: number
  max_tokens: number
  style_instructions: string
}

export type ModeConfigFile = Record<CaptionMode, ModeConfigEntry>

export type CaptionRequestBody = {
  photoId: string
  mode: CaptionMode
  variationSeed?: string
}

export type CaptionResponseBody = {
  caption: string
  provider: string
  model: string
  cached: boolean
  generatedAt: string
}

export type AnalyzePhotoItem = {
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

export type AnalyzeResponseBody = {
  items: AnalyzePhotoItem[]
}
