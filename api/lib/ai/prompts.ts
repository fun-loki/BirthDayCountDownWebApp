import type { Photo } from '../types.js'
import { getModeConfig } from '../modeRegistry.js'

export const SHARED_SYSTEM_PROMPT = `You write short Instagram/WhatsApp-style captions for a birthday countdown site.
Rules:
- Maximum 18 words. Shorter is fine.
- One sentence unless a tiny clause is irresistible.
- Playful, kind, respectful. No hate, no slurs, no explicit content.
- Focus on natural Indian conversational tone - casual, relatable, sometimes light Hinglish.
- Feel like real people talking - friends, partners, family.
- Avoid poetic language, Tumblr quotes, or philosophical writing.
- Do not repeat or closely paraphrase any line listed under "Avoid repeating".
- Output ONLY the caption text, no quotes, no hashtags.`

export function buildUserPrompt(
  photo: Photo,
  mode: string,
  recentCaptions: string[],
): string {
  const modeConfig = getModeConfig(mode as any)

  const avoid =
    recentCaptions.length > 0
      ? recentCaptions.map((c, i) => `${i + 1}. ${c}`).join('\n')
      : '(none yet)'

  const avoidTopics = photo.avoid_topics.length > 0
    ? `Additional topics to avoid: ${photo.avoid_topics.join(', ')}`
    : ''

  const languageRules = modeConfig.allowedLanguageMix.hinglish
    ? 'Light Hinglish allowed when natural.'
    : 'Stick to English, avoid Hinglish.'

  const avoidWords = modeConfig.avoidWords.length > 0
    ? `Avoid these words: ${modeConfig.avoidWords.join(', ')}`
    : ''

  return `Mode personality: ${modeConfig.id}
Tone: ${modeConfig.tone.join(', ')}
Speaking style: ${modeConfig.speakingStyle.join(', ')}
Humor style: ${modeConfig.humorStyle.join(', ')}
${languageRules}
${avoidWords}

Examples of this mode's style:
${modeConfig.examples.map((ex: string, i: number) => `${i + 1}. "${ex}"`).join('\n')}

Photo personality guidance:
Photo vibe: ${photo.photo_vibe.join(', ')}
Personality impression: ${photo.personality_impression.join(', ')}
Caption angles: ${photo.caption_angles.join(', ')}
Natural topics: ${photo.natural_topics.join(', ')}
${avoidTopics}

Focus on natural Indian conversational tone - sound human, sound Indian, feel naturally typed. Avoid AI poetry, Tumblr language, dramatic philosophy, fake Hinglish, forced slang.

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
