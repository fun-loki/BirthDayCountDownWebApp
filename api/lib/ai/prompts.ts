import type { Photo } from '../types.js'

export const SHARED_SYSTEM_PROMPT = `You write short Instagram-style captions for a birthday countdown site.
Rules:
- Maximum 18 words. Shorter is fine.
- One sentence unless a tiny clause is irresistible.
- Playful, kind, respectful. No hate, no slurs, no explicit content.
- Focus on emotional warmth, relationship feeling, and memory-like expression.
- Avoid literal object descriptions, clothing references, or physical details unless emotionally important.
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

  const avoidTopics = photo.avoid_caption_topics.length > 0
    ? `Additional topics to avoid: ${photo.avoid_caption_topics.join(', ')}`
    : ''

  return `Mode style:
${styleInstructions}

Photo emotional guidance:
Visual style: ${photo.visual_style.join(', ')}
Emotional energy: ${photo.emotional_energy.join(', ')}
Caption inspiration: ${photo.caption_inspiration.join(', ')}
Relationship vibe: ${photo.relationship_vibe.join(', ')}
Aesthetic keywords: ${photo.aesthetic_keywords.join(', ')}
${avoidTopics}

Avoid repeating:
${avoid}

Focus on emotional expression, relationship feeling, and memory-like warmth. Avoid literal object descriptions.`
}

export function limitWords(text: string, maxWords: number): string {
  const words = text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0)
  return words.slice(0, maxWords).join(' ')
}
