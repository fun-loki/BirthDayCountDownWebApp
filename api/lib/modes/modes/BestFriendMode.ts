import type { CaptionMode } from '../../types.js'
import { BaseMode } from '../BaseMode.js'

export class BestFriendMode extends BaseMode {
  id: CaptionMode = 'best_friend'
  relationshipEnergy = 'chaotic loyal best friend'
  humorStyle = ['chaotic', 'meme-style', 'blackmail jokes']
  teasingLevel: 'chaotic' = 'chaotic'
  languageStyle: 'mixed' = 'mixed'
  aggressionLevel: 'roasting' = 'roasting'
  reactionCategories = ['roast', 'chaotic', 'blackmail', 'fake jealousy']
  bannedPhrases = ['birthday', 'countdown', 'galaxies', 'soul', 'aura', 'poetry', 'bae', 'vibes']
  examples = [
    'Ye photo future embarrassment material hai 😭',
    'Itna confidence kaha se aata hai bhai.',
    'Main ye photo future blackmail ke liye save kar raha hoon.',
    'Full hero lag rahe ho honestly.',
  ]
}
