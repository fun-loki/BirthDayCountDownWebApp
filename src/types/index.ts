export type CaptionMode =
  | 'dad'
  | 'mom'
  | 'brother'
  | 'best_friend'
  | 'boyfriend'
  | 'husband'
  | 'flirty'
  | 'enemy'
  | 'tapori'

export const CAPTION_MODES: readonly CaptionMode[] = [
  'dad',
  'mom',
  'brother',
  'best_friend',
  'boyfriend',
  'husband',
  'flirty',
  'enemy',
  'tapori',
] as const

export type CaptionModeConfig = {
  id: string
  tone: string[]
  speakingStyle: string[]
  allowedLanguageMix: {
    english: boolean
    hinglish: boolean
  }
  humorStyle: string[]
  avoidWords: string[]
  examples: string[]
}

export type Photo = {
  id: string
  file: string
  visuals: string[]
  displayOrder: number
}

export type ModeConfigEntry = {
  provider: 'xai'
  model: string
  temperature: number
  max_tokens: number
  style_instructions: string
}

export type ModeConfigFile = Record<CaptionMode, ModeConfigEntry>

export type AppConfig = {
  title: string
  subtitle: string
  birthday: string
  timezone: string
}

export type CaptionRequestBody = {
  photoId: string
  mode: CaptionMode
  variationSeed?: string
}

export type CaptionResponseBody = {
  caption: string
  provider: 'xai'
  model: string
  cached: boolean
  generatedAt: string
}

export type AnalyzePhotoItem = {
  id: string
  file: string
  visuals: string[]
  displayOrder: number
}
