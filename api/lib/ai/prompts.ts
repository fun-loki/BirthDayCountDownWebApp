import type { Photo } from '../types.js'

export const SHARED_SYSTEM_PROMPT = `You write short Instagram-style captions for a birthday countdown site.
Rules:
- Maximum 18 words. Shorter is fine.
- One sentence unless a tiny clause is irresistible.
- Playful, kind, respectful. No hate, no slurs, no explicit content.
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
  return `Mode style:
${styleInstructions}

Photo summary: ${photo.summary}
Visible details: ${photo.visible_details.join(', ')}
Mood: ${photo.mood}
Setting: ${photo.setting}
Tags: ${photo.tags.join(', ')}
Notes: ${photo.confidence_notes || '—'}

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
