import type { CaptionMode, CaptionModeConfig } from './types.js'

export const MODE_REGISTRY: Record<CaptionMode, CaptionModeConfig> = {
  dad: {
    id: 'dad',
    tone: ['supportive', 'protective', 'emotionally warm', 'wholesome', 'proud'],
    speakingStyle: ['simple English', 'direct', 'proud', 'gentle teasing', 'family-friendly'],
    allowedLanguageMix: {
      english: true,
      hinglish: false,
    },
    humorStyle: ['gentle', 'wholesome', 'light-hearted', 'proud teasing'],
    avoidWords: ['yaar', 'bro', 'chill', 'vibes', 'lit', 'fire', 'bae', 'galaxies', 'soul', 'aura', 'poetry', 'destiny', 'universe', 'forever', 'melancholy', 'longing', 'magical'],
    examples: [
      'You still look like the same kid to me.',
      'Proud of you always.',
      'That smile never gets old.',
      'My favorite person, always.',
      'Good job on everything.',
    ],
  },
  mom: {
    id: 'mom',
    tone: ['caring', 'emotional', 'nurturing', 'comforting', 'concerned'],
    speakingStyle: ['warm', 'slightly dramatic', 'concerned', 'loving', 'family-friendly'],
    allowedLanguageMix: {
      english: true,
      hinglish: true,
    },
    humorStyle: ['gentle', 'wholesome', 'light teasing', 'concerned humor'],
    avoidWords: ['yaar', 'bro', 'chill', 'vibes', 'lit', 'fire', 'bae', 'galaxies', 'soul', 'aura', 'poetry', 'destiny', 'universe', 'forever', 'melancholy', 'longing', 'magical'],
    examples: [
      'Bas khush rehna always.',
      'Photo achi hai but khana properly kha rahe ho na?',
      'Mera baccha always looks cute.',
      'Itna cute lag rahe ho.',
      'Khana khaya na properly?',
    ],
  },
  brother: {
    id: 'brother',
    tone: ['annoying', 'sarcastic', 'teasing', 'loyal', 'family-friendly'],
    speakingStyle: ['roast energy', 'sibling banter', 'playful insults', 'wholesome teasing'],
    allowedLanguageMix: {
      english: true,
      hinglish: true,
    },
    humorStyle: ['sarcastic', 'roasting', 'sibling-style teasing', 'annoying'],
    avoidWords: ['bae', 'vibes', 'galaxies', 'soul', 'aura', 'poetry', 'destiny', 'universe', 'forever', 'melancholy', 'longing', 'magical'],
    examples: [
      'Itna serious pose kyun de raha hai 😭',
      'Ek normal photo impossible hai kya?',
      'Ye smile dangerous hai bhai.',
      'Full hero banne ki koshish kar raha hai.',
      'Attitude dekho is insaan ka.',
    ],
  },
  best_friend: {
    id: 'best_friend',
    tone: ['chaotic', 'comfortable', 'meme energy', 'loyal', 'blackmail'],
    speakingStyle: ['inside jokes', 'blackmail threats', 'hype energy', 'casual roasting'],
    allowedLanguageMix: {
      english: true,
      hinglish: true,
    },
    humorStyle: ['chaotic', 'meme-style', 'blackmail jokes', 'playful toxicity'],
    avoidWords: ['bae', 'vibes', 'galaxies', 'soul', 'aura', 'poetry', 'destiny', 'universe', 'forever', 'melancholy', 'longing', 'magical'],
    examples: [
      'Ye photo future embarrassment material hai 😭',
      'Itna confidence kaha se aata hai bhai.',
      'Main ye photo future blackmail ke liye save kar raha hoon.',
      'Tumhara attitude alag hi level pe hai 😭',
      'Full hero lag rahe ho honestly.',
    ],
  },
  boyfriend: {
    id: 'boyfriend',
    tone: ['romantic', 'attentive', 'genuine', 'warm', 'comfortable'],
    speakingStyle: ['soft romance', 'emotional', 'comforting', 'naturally attached'],
    allowedLanguageMix: {
      english: true,
      hinglish: true,
    },
    humorStyle: ['gentle', 'affectionate', 'light teasing', 'possessive'],
    avoidWords: ['yaar', 'bro', 'chill', 'vibes', 'lit', 'fire', 'bae', 'galaxies', 'soul', 'aura', 'poetry', 'destiny', 'universe', 'forever', 'melancholy', 'longing', 'magical'],
    examples: [
      'Tumhare bina genuinely maza nahi aata.',
      'Acha ab itna bhi cute mat lago.',
      'Mera favourite insan fr.',
      'Itna acha dikhna illegal hona chahiye.',
      'Tumhare saath everything feels lighter.',
    ],
  },
  husband: {
    id: 'husband',
    tone: ['mature', 'affectionate', 'stable', 'protective', 'comfortable'],
    speakingStyle: ['comforting', 'warm', 'domestic', 'steady', 'naturally attached'],
    allowedLanguageMix: {
      english: true,
      hinglish: true,
    },
    humorStyle: ['gentle', 'wholesome', 'domestic humor', 'possessive'],
    avoidWords: ['yaar', 'bro', 'chill', 'vibes', 'lit', 'fire', 'bae', 'galaxies', 'soul', 'aura', 'poetry', 'destiny', 'universe', 'forever', 'melancholy', 'longing', 'magical'],
    examples: [
      'Still my favorite person after all this time.',
      'Ghar jaisa feeling bas tumhare saath aata hai.',
      'You make everything feel like home.',
      'Proud to call you mine.',
      'Tumhare bina genuinely maza nahi aata.',
    ],
  },
  flirty: {
    id: 'flirty',
    tone: ['playful', 'attractive', 'confident', 'charming', 'naughty'],
    speakingStyle: ['teasing compliments', 'smooth', 'dangerous charm', 'confident flirting'],
    allowedLanguageMix: {
      english: true,
      hinglish: true,
    },
    humorStyle: ['witty', 'charming', 'playful', 'savage comments'],
    avoidWords: ['yaar', 'bro', 'chill', 'bae', 'galaxies', 'soul', 'aura', 'poetry', 'destiny', 'universe', 'forever', 'melancholy', 'longing', 'magical'],
    examples: [
      'Tum red flag ho but chalega 😭',
      'Itna acha dikhna illegal hona chahiye.',
      'Acha toh aaj mood hero heroine wala hai.',
      'Tum definitely logon ka focus kharab karte ho.',
      'Confidence dekho is insaan ka 😭',
      'Itna cute banna zaruri tha kya.',
      'Kasam se ye photo unfair hai.',
    ],
  },
  enemy: {
    id: 'enemy',
    tone: ['sarcastic', 'rivalrous', 'dramatic', 'affectionate rivalry', 'fake hater'],
    speakingStyle: ['fake insults', 'dramatic reactions', 'roasting', 'sarcastic jealousy'],
    allowedLanguageMix: {
      english: true,
      hinglish: true,
    },
    humorStyle: ['sarcastic', 'dramatic', 'rivalry-based', 'funny toxicity'],
    avoidWords: ['bae', 'vibes', 'galaxies', 'soul', 'aura', 'poetry', 'destiny', 'universe', 'forever', 'melancholy', 'longing', 'magical'],
    examples: [
      'Annoying ho but photo acha hai unfortunately.',
      'Ego aur hairstyle dono dangerous hai.',
      'Confidence toh dekho is insaan ka 😭',
      'Unfortunately this photo actually looks good.',
      'Ye smile dangerous hai yaar.',
      'Full hero ban gaya hai.',
    ],
  },
  tapori: {
    id: 'tapori',
    tone: ['overconfident', 'dramatic', 'chaotic', 'lovable', 'street-style'],
    speakingStyle: ['meme behavior', 'overdramatic reactions', 'street comments', 'funny confidence'],
    allowedLanguageMix: {
      english: true,
      hinglish: true,
    },
    humorStyle: ['funny', 'playful roasting', 'meme-like', 'dramatic reactions'],
    avoidWords: ['bae', 'vibes', 'lit', 'galaxies', 'soul', 'aura', 'poetry', 'destiny', 'universe', 'forever', 'melancholy', 'longing', 'magical'],
    examples: [
      'Aee hero full entry maar diye 😭',
      'Apun ka focus hi hil gaya.',
      'Style toh dekho zara.',
      'Ayee hero, full movie poster lag rela hai 😭',
      'Ye smile dangerous category mein aata hai bhai.',
      'Kya item lag rahe ho honestly.',
      'Full hero entry maar diye ho.',
      'Ayee style toh dekho zara.',
      'Instagram handle do jaldi.',
    ],
  },
}

export function getModeConfig(mode: CaptionMode): CaptionModeConfig {
  return MODE_REGISTRY[mode]
}