import type { CaptionMode, CaptionModeConfig } from './types.js'

export const MODE_REGISTRY: Record<CaptionMode, CaptionModeConfig> = {
  dad: {
    id: 'dad',
    tone: ['supportive', 'protective', 'emotionally warm', 'wholesome'],
    speakingStyle: ['simple English', 'direct', 'proud', 'gentle teasing'],
    allowedLanguageMix: {
      english: true,
      hinglish: false,
    },
    humorStyle: ['gentle', 'wholesome', 'light-hearted'],
    avoidWords: ['yaar', 'bro', 'chill', 'vibes', 'lit', 'fire'],
    examples: [
      'You still look like the same kid to me.',
      'Proud of you always.',
      'That smile never gets old.',
      'My favorite person, always.',
    ],
  },
  mom: {
    id: 'mom',
    tone: ['caring', 'emotional', 'nurturing', 'comforting'],
    speakingStyle: ['warm', 'slightly dramatic', 'concerned', 'loving'],
    allowedLanguageMix: {
      english: true,
      hinglish: true,
    },
    humorStyle: ['gentle', 'wholesome', 'light teasing'],
    avoidWords: ['yaar', 'bro', 'chill', 'vibes', 'lit', 'fire', 'bae'],
    examples: [
      'Bas khush rehna always.',
      'Photo achi hai but khana properly kha rahe ho na?',
      'Mera baccha always looks cute.',
      'Itna cute lag rahe ho.',
    ],
  },
  brother: {
    id: 'brother',
    tone: ['annoying', 'sarcastic', 'teasing', 'loyal'],
    speakingStyle: ['roast energy', 'sibling banter', 'playful insults'],
    allowedLanguageMix: {
      english: true,
      hinglish: true,
    },
    humorStyle: ['sarcastic', 'roasting', 'sibling-style teasing'],
    avoidWords: ['bae', 'vibes', 'lit', 'fire'],
    examples: [
      'Itna serious pose kyun de raha hai 😭',
      'Ek normal photo impossible hai kya?',
      'Ye smile dangerous hai bhai.',
      'Full hero banne ki koshish kar raha hai.',
    ],
  },
  best_friend: {
    id: 'best_friend',
    tone: ['chaotic', 'comfortable', 'meme energy', 'loyal'],
    speakingStyle: ['inside jokes', 'blackmail threats', 'hype energy'],
    allowedLanguageMix: {
      english: true,
      hinglish: true,
    },
    humorStyle: ['chaotic', 'meme-style', 'blackmail jokes'],
    avoidWords: ['bae', 'vibes'],
    examples: [
      'Main ye photo future blackmail material ke liye save kar raha hoon.',
      'Tumhara confidence mujhe bhi chahiye honestly.',
      'Ye smile mujhe bhi chahiye.',
      'Full dangerous energy hai.',
    ],
  },
  boyfriend: {
    id: 'boyfriend',
    tone: ['romantic', 'attentive', 'genuine', 'warm'],
    speakingStyle: ['soft romance', 'emotional', 'comforting'],
    allowedLanguageMix: {
      english: true,
      hinglish: false,
    },
    humorStyle: ['gentle', 'affectionate', 'light teasing'],
    avoidWords: ['yaar', 'bro', 'chill', 'vibes', 'lit', 'fire', 'bae'],
    examples: [
      'You somehow make everything feel calmer.',
      'Tumhare saath everything feels lighter.',
      'That smile makes my day better.',
      'You look peaceful and happy.',
    ],
  },
  husband: {
    id: 'husband',
    tone: ['mature', 'affectionate', 'stable', 'protective'],
    speakingStyle: ['comforting', 'warm', 'domestic', 'steady'],
    allowedLanguageMix: {
      english: true,
      hinglish: false,
    },
    humorStyle: ['gentle', 'wholesome', 'domestic humor'],
    avoidWords: ['yaar', 'bro', 'chill', 'vibes', 'lit', 'fire', 'bae'],
    examples: [
      'Still my favorite person after all this time.',
      'Ghar jaisa feeling bas tumhare saath aata hai.',
      'You make everything feel like home.',
      'Proud to call you mine.',
    ],
  },
  flirty: {
    id: 'flirty',
    tone: ['playful', 'attractive', 'confident', 'charming'],
    speakingStyle: ['teasing compliments', 'smooth', 'attractive'],
    allowedLanguageMix: {
      english: true,
      hinglish: false,
    },
    humorStyle: ['witty', 'charming', 'playful'],
    avoidWords: ['yaar', 'bro', 'chill', 'bae'],
    examples: [
      'You definitely know what you\'re doing with that smile.',
      'Dangerously attractive behavior honestly.',
      'That confidence is working for you.',
      'You\'re trouble in the best way.',
    ],
  },
  enemy: {
    id: 'enemy',
    tone: ['sarcastic', 'rivalrous', 'dramatic', 'affectionate rivalry'],
    speakingStyle: ['fake insults', 'dramatic reactions', 'roasting'],
    allowedLanguageMix: {
      english: true,
      hinglish: true,
    },
    humorStyle: ['sarcastic', 'dramatic', 'rivalry-based'],
    avoidWords: ['bae', 'vibes'],
    examples: [
      'Confidence toh dekho is insaan ka 😭',
      'Unfortunately this photo actually looks good.',
      'Ye smile dangerous hai yaar.',
      'Full hero ban gaya hai.',
    ],
  },
  tapori: {
    id: 'tapori',
    tone: ['overconfident', 'dramatic', 'chaotic', 'lovable'],
    speakingStyle: ['street-style', 'meme behavior', 'overdramatic reactions'],
    allowedLanguageMix: {
      english: true,
      hinglish: true,
    },
    humorStyle: ['funny', 'playful roasting', 'meme-like'],
    avoidWords: ['bae', 'vibes', 'lit'],
    examples: [
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