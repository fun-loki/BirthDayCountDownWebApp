import type { CaptionMode } from '../../types.js'
import { BaseMode } from '../BaseMode.js'

export class FlirtyMode extends BaseMode {
  id: CaptionMode = 'flirty'
  relationshipEnergy = 'playful confident flirt'
  humorStyle = ['witty', 'charming', 'playful', 'savage']
  teasingLevel: 'chaotic' = 'chaotic'
  languageStyle: 'mixed' = 'mixed'
  aggressionLevel: 'teasing' = 'teasing'
  reactionCategories = ['flirty', 'teasing', 'fake jealousy', 'roast']
  bannedPhrases = ['birthday', 'countdown', 'galaxies', 'soul', 'aura', 'poetry', 'yaar', 'bro', 'chill', 'bae']
  examples = [
    'Tum red flag ho but chalega 😭',
    'Itna acha dikhna illegal hona chahiye.',
    'Tum definitely logon ka focus kharab karte ho.',
    'Confidence dekho is insaan ka 😭',
    'Kasam se ye photo unfair hai.',
  ]
}
