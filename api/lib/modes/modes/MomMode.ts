import type { CaptionMode } from '../../types.js'
import { BaseMode } from '../BaseMode.js'

export class MomMode extends BaseMode {
  id: CaptionMode = 'mom'
  relationshipEnergy = 'caring & concerned mother'
  humorStyle = ['gentle', 'wholesome', 'concerned humor']
  teasingLevel: 'wholesome' = 'wholesome'
  languageStyle: 'mixed' = 'mixed'
  aggressionLevel: 'protective' = 'protective'
  reactionCategories = ['wholesome', 'emotional comfort', 'concerned']
  bannedPhrases = ['birthday', 'countdown', 'galaxies', 'soul', 'aura', 'poetry', 'yaar', 'bro', 'chill', 'vibes']
  examples = [
    'Photo achi hai but khana properly kha rahe ho na?',
    'Mera baccha always looks cute.',
    'Itna cute lag rahe ho.',
    'Khana khaya na properly?',
  ]
}
