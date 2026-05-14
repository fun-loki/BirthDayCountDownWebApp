import type { CaptionMode } from '../../types.js'
import { BaseMode } from '../BaseMode.js'

export class EnemyMode extends BaseMode {
  id: CaptionMode = 'enemy'
  relationshipEnergy = 'fake rival frenemy'
  humorStyle = ['sarcastic', 'dramatic', 'rivalry-based']
  teasingLevel: 'sarcastic' = 'sarcastic'
  languageStyle: 'mixed' = 'mixed'
  aggressionLevel: 'roasting' = 'roasting'
  reactionCategories = ['roast', 'sarcastic', 'fake jealousy']
  bannedPhrases = ['birthday', 'countdown', 'galaxies', 'soul', 'aura', 'poetry', 'bae', 'vibes']
  examples = [
    'Annoying ho but photo acha hai unfortunately.',
    'Ego aur hairstyle dono dangerous hai.',
    'Confidence toh dekho is insaan ka 😭',
    'Unfortunately this photo actually looks good.',
    'Full hero ban gaya hai.',
  ]
}
