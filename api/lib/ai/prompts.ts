import type { Photo } from '../types.js'
import type { CaptionMode } from '../types.js'
import { getModeConfig } from '../modeRegistry.js'

export const SHARED_SYSTEM_PROMPT = `You write ONE desi Instagram/WhatsApp-style reaction comment to a photo.

This is NOT poetry. This is NOT literature. This is NOT emotional writing.

This is:
- Social media reaction energy
- WhatsApp reply energy
- Indian friend/family comment energy

Rules:
- Maximum 18 words. Shorter is better.
- One sentence only.
- Natural Indian texting tone.
- No hate, no slurs, no explicit content.
- Sound like a real person, not AI.

Output ONLY the reaction comment text. No quotes, no hashtags, no emojis in the structure.

BANNED OUTPUT TYPES:
- Poetic language (galaxies, soul, aura, destiny, etc.)
- Birthday references
- Countdown references
- Philosophical writing
- Tumblr-style captions
- Formal Urdu/Hindi
- AI-generated tone

REQUIRED OUTPUT STYLE:
- Desi Instagram comment energy
- Natural Hinglish mixing
- Real person reaction
- Authentic social media vibe`

export function buildUserPrompt(
  photo: Photo,
  mode: CaptionMode,
  recentCaptions: string[],
): string {
  const modeConfig = getModeConfig(mode)

  const avoid =
    recentCaptions.length > 0
      ? recentCaptions.map((c, i) => `${i + 1}. ${c}`).join('\n')
      : '(none yet)'

  const bannedPhrases = modeConfig.bannedPhrases.length > 0
    ? `NEVER use: ${modeConfig.bannedPhrases.join(', ')}`
    : ''

  const reactionBias = modeConfig.reactionCategories.length > 0
    ? `Reaction style preference: ${modeConfig.reactionCategories.join(', ')}`
    : ''

  const languageStyle = modeConfig.languageStyle === 'hinglish'
    ? 'Use natural Hinglish. Think in Hindi, write in English letters.'
    : modeConfig.languageStyle === 'mixed'
      ? 'Mix English and Hinglish naturally. Use words like: acha, itna, kya hi, matlab, kasam se, waise.'
      : 'Use English. Minimize Hinglish.'

  return `REACTION COMMENT TASK:
Someone just posted this photo on Instagram/WhatsApp. Write ONE authentic desi reaction comment from this ${modeConfig.relationshipEnergy} perspective.

${reactionBias}
Language: ${languageStyle}
${bannedPhrases}
Teasing level: ${modeConfig.teasingLevel}
Aggression level: ${modeConfig.aggressionLevel}

Example comments from this perspective:
${modeConfig.examples.map((ex: string, i: number) => `${i + 1}. "${ex}"`).join('\n')}

Visual context from photo:
- Observable details: ${photo.visuals.join(', ')}

React naturally to these visual details. Keep it short, real, and authentic to this relationship type. No overthinking. No poetry. Just real reaction.

Already used recently - AVOID repeating:
${avoid}`
}

export function limitWords(text: string, maxWords: number): string {
  const words = text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0)
  return words.slice(0, maxWords).join(' ')
}