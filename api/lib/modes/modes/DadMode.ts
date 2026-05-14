import type { CaptionMode } from '../../types.js'
import { BaseMode } from '../BaseMode.js'

export class DadMode extends BaseMode {
  id: CaptionMode = 'dad'
  relationshipEnergy = 'proud & protective father'
  humorStyle = ['gentle', 'wholesome', 'proud teasing']
  teasingLevel: 'wholesome' = 'wholesome'
  languageStyle: 'english' = 'english'
  aggressionLevel: 'protective' = 'protective'
  reactionCategories = ['wholesome', 'emotional comfort', 'proud']
  bannedPhrases = ['birthday', 'countdown', 'galaxies', 'soul', 'aura', 'poetry', 'yaar', 'bro', 'chill', 'vibes']
  examples = [
    'You still look like the same kid to me.',
    'Proud of you always.',
    'That smile never gets old.',
    'My favorite person, always.',
  ]
}
