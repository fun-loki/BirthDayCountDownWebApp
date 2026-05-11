import type { Photo } from '../types.js'

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
  styleInstructions: string,
  recentCaptions: string[],
): string {
  const avoid =
    recentCaptions.length > 0
      ? recentCaptions.map((c, i) => `${i + 1}. ${c}`).join('\n')
      : '(none yet)'

  const avoidTopics = photo.avoid_topics.length > 0
    ? `Additional topics to avoid: ${photo.avoid_topics.join(', ')}`
    : ''

  return `Mode style:
${styleInstructions}

Photo personality guidance:
Photo vibe: ${photo.photo_vibe.join(', ')}
Personality impression: ${photo.personality_impression.join(', ')}
Caption angles: ${photo.caption_angles.join(', ')}
Natural topics: ${photo.natural_topics.join(', ')}
${avoidTopics}

Focus on natural Indian conversational tone - casual, relatable, playful teasing, sometimes light Hinglish. Avoid poetic/abstract language.

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
