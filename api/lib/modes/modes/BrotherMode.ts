import type { CaptionMode } from '../../types.js'
import { BaseMode } from '../BaseMode.js'

export class BrotherMode extends BaseMode {
  id: CaptionMode = 'brother'
  relationshipEnergy = 'annoying & teasing brother'
  humorStyle = ['sarcastic', 'roasting', 'sibling banter']
  teasingLevel: 'playful' = 'playful'
  languageStyle: 'mixed' = 'mixed'
  aggressionLevel: 'teasing' = 'teasing'
  reactionCategories = ['roast', 'teasing', 'sarcastic']
  bannedPhrases = ['birthday', 'countdown', 'galaxies', 'soul', 'aura', 'poetry', 'bae', 'vibes']
  examples = [
    'Itna serious pose kyun de raha hai 😭',
    'Ek normal photo impossible hai kya?',
    'Ye smile dangerous hai bhai.',
    'Full hero banne ki koshish kar raha hai.',
  ]
}
