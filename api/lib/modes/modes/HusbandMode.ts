import type { CaptionMode } from '../../types.js'
import { BaseMode } from '../BaseMode.js'

export class HusbandMode extends BaseMode {
  id: CaptionMode = 'husband'
  relationshipEnergy = 'stable protective husband'
  humorStyle = ['gentle', 'domestic humor', 'possessive']
  teasingLevel: 'wholesome' = 'wholesome'
  languageStyle: 'mixed' = 'mixed'
  aggressionLevel: 'protective' = 'protective'
  reactionCategories = ['wholesome', 'emotional comfort', 'possessive']
  bannedPhrases = ['birthday', 'countdown', 'galaxies', 'soul', 'aura', 'poetry', 'yaar', 'bro', 'chill', 'vibes', 'bae']
  examples = [
    'Still my favorite person after all this time.',
    'Ghar jaisa feeling bas tumhare saath aata hai.',
    'You make everything feel like home.',
    'Proud to call you mine.',
  ]
}
