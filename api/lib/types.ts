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

export type CaptionModeConfig = {
  id: CaptionMode
  relationshipEnergy: string
  humorStyle: string[]
  teasingLevel: 'wholesome' | 'playful' | 'sarcastic' | 'chaotic'
  languageStyle: 'english' | 'hinglish' | 'mixed'
  aggressionLevel: 'protective' | 'gentle' | 'teasing' | 'roasting'
  reactionCategories: string[]
  bannedPhrases: string[]
  examples: string[]
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
