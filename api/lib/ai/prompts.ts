import type { Photo } from '../types.js'
import type { CaptionMode } from '../types.js'
import { getModeConfig } from '../modeRegistry.js'

export const SHARED_SYSTEM_PROMPT = `You write short Instagram/WhatsApp-style comments reacting to photos.
Rules:
- Maximum 18 words. Shorter is fine.
- One sentence unless a tiny clause is irresistible.
- Playful, kind, respectful. No hate, no slurs, no explicit content.
- Focus on natural Indian conversational tone - casual, relatable, sometimes light Hinglish.
- Feel like real people reacting to photos - friends, partners, family commenting on Instagram/WhatsApp.
- Avoid poetic language, Tumblr quotes, or philosophical writing.
- Do not repeat or closely paraphrase any line listed under "Avoid repeating".
- Output ONLY the caption text, no quotes, no hashtags.

IMPORTANT: Think like an Indian person reacting to a photo on social media. Write Hindi responses in English letters. Use natural texting language like "acha", "itna", "kya hi", "sach bolu", "matlab", "kasam se", "waise". Avoid formal Hindi or Urdu shayari. Feel like Instagram comments, WhatsApp chats, close-friend roasting.

CRITICAL: DO NOT mention birthdays, countdowns, celebrations, special days, dates, or any time-related context. This is about reacting to the photo itself, not any occasion. Focus purely on the person's appearance, vibe, personality, or the photo's qualities.`

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

  const avoidTopics = photo.avoid_topics.length > 0
    ? `Additional topics to avoid: ${photo.avoid_topics.join(', ')}`
    : ''

  const languageRules = modeConfig.allowedLanguageMix.hinglish
    ? 'Light Hinglish allowed when natural. Prefer Hindi thinking in English letters (acha, itna, kya hi, sach bolu, matlab, kasam se, waise).'
    : 'Stick to English, avoid Hinglish.'

  const avoidWords = modeConfig.avoidWords.length > 0
    ? `NEVER use these words: ${modeConfig.avoidWords.join(', ')}`
    : ''

  return `MENTAL MODEL: This person just uploaded this photo on Instagram/WhatsApp. What would this relationship naturally comment/reply/react to seeing this photo?

Mode personality: ${modeConfig.id}
Tone: ${modeConfig.tone.join(', ')}
Speaking style: ${modeConfig.speakingStyle.join(', ')}
Humor style: ${modeConfig.humorStyle.join(', ')}
${languageRules}
${avoidWords}

CRITICAL BANS - NEVER mention or reference:
- birthdays, birthday coming, birthday vibes
- countdowns, celebration, special day
- dates, time, upcoming events
- any occasion or celebration context

This is PURELY about reacting to the photo itself - the person's appearance, vibe, personality, expression, or the photo's qualities.

Examples of this mode's style:
${modeConfig.examples.map((ex: string, i: number) => `${i + 1}. "${ex}"`).join('\n')}

Photo personality guidance:
Photo vibe: ${photo.photo_vibe.join(', ')}
Personality impression: ${photo.personality_impression.join(', ')}
Caption angles: ${photo.caption_angles.join(', ')}
Natural topics: ${photo.natural_topics.join(', ')}
${avoidTopics}

Write as if this relationship just saw this photo and is commenting on it naturally. Focus on the person's appearance, expression, vibe, or personality traits shown in the photo. Sound like a genuine reaction from that relationship perspective.

Focus on natural Indian conversational tone - sound human, sound Indian, feel naturally typed. Avoid AI poetry, Tumblr language, dramatic philosophy, fake Hinglish, forced slang. Write like Instagram comments, WhatsApp chats, close-friend roasting.

Avoid repeating:
${avoid}`
}

export function limitWords(text: string, maxWords: number): string {
  const words = text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0)
  return words.slice(0, maxWords).join(' ')
}