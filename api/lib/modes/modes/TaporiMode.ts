import type { CaptionMode } from '../../types.js'
import { BaseMode } from '../BaseMode.js'

export class TaporiMode extends BaseMode {
  id: CaptionMode = 'tapori'
  relationshipEnergy = 'chaotic street-style tapori'
  humorStyle = ['funny', 'playful roasting', 'meme-like', 'dramatic']
  teasingLevel: 'chaotic' = 'chaotic'
  languageStyle: 'hinglish' = 'hinglish'
  aggressionLevel: 'roasting' = 'roasting'
  reactionCategories = ['roast', 'chaotic', 'overreaction', 'teasing']
  bannedPhrases = ['birthday', 'countdown', 'galaxies', 'soul', 'aura', 'poetry', 'bae', 'vibes', 'lit']
  examples = [
    'Aee hero full entry maar diye 😭',
    'Apun ka fokus hi hil gaya.',
    'Style toh dekho zara.',
    'Ye smile dangerous category mein aata hai bhai.',
    'Kya item lag rahe ho honestly.',
    'Full hero entry maar diye ho.',
    'Instagram handle do jaldi.',
  ]
}
