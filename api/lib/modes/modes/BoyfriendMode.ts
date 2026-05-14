import type { CaptionMode } from '../../types.js'
import { BaseMode } from '../BaseMode.js'

export class BoyfriendMode extends BaseMode {
  id: CaptionMode = 'boyfriend'
  relationshipEnergy = 'romantic attentive boyfriend'
  humorStyle = ['affectionate', 'light teasing', 'possessive']
  teasingLevel: 'playful' = 'playful'
  languageStyle: 'mixed' = 'mixed'
  aggressionLevel: 'gentle' = 'gentle'
  reactionCategories = ['wholesome', 'emotional comfort', 'flirty', 'possessive']
  bannedPhrases = ['birthday', 'countdown', 'galaxies', 'soul', 'aura', 'poetry', 'yaar', 'bro', 'chill', 'vibes', 'bae']
  examples = [
    'Tumhare bina genuinely maza nahi aata.',
    'Acha ab itna bhi cute mat lago.',
    'Mera favourite insan fr.',
    'Tumhare saath everything feels lighter.',
  ]
}
