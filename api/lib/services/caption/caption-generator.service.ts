import { DESI_REACTION_SYSTEM_PROMPT } from '../../prompts/system/desi-reaction-system.prompt.js'
import { PromptBuilderService } from './prompt-builder.service.js'
import type { ModeConfigEntry, Photo, CaptionMode } from '../../types.js'
import { getRecentCaptions, pushCaption } from '../../captionHistory.js'

type ChatMessage =
  | { role: 'system'; content: string }
  | { role: 'user'; content: string }

type ChatResponse = {
  text: string
  provider: 'xai'
  model: string
}

export class CaptionGeneratorService {
  private readonly promptBuilder = new PromptBuilderService()

  private limitWords(text: string, maxWords: number): string {
    const words = text
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0)
    return words.slice(0, maxWords).join(' ')
  }

  private async postXaiChat(opts: {
    apiKey: string
    model: string
    messages: ChatMessage[]
    temperature: number
    max_tokens: number
  }): Promise<string> {
    const res = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${opts.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: opts.model,
        messages: opts.messages,
        temperature: opts.temperature,
        max_tokens: opts.max_tokens,
      }),
    })

    const raw = await res.text()
    if (!res.ok) {
      throw new Error(`AI HTTP ${res.status}: ${raw.slice(0, 500)}`)
    }

    const data = JSON.parse(raw) as {
      choices?: Array<{ message?: { content?: string } }>
    }
    const text = data.choices?.[0]?.message?.content?.trim() ?? ''
    if (!text) throw new Error('Empty AI response')
    return text
  }

  public async generateCaptionText(opts: {
    photo: Photo
    mode: CaptionMode
    entry: ModeConfigEntry
    xaiKey: string
  }): Promise<ChatResponse> {
    const recent = getRecentCaptions(opts.photo.id, opts.mode)
    const userPrompt = this.promptBuilder.buildUserPrompt(opts.photo, opts.mode, recent)
    const messages: ChatMessage[] = [
      { role: 'system', content: DESI_REACTION_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ]

    const text = this.limitWords(
      await this.postXaiChat({
        apiKey: opts.xaiKey,
        model: opts.entry.model,
        messages,
        temperature: opts.entry.temperature,
        max_tokens: opts.entry.max_tokens,
      }),
      18,
    )

    pushCaption(opts.photo.id, opts.mode, text)
    return { text, provider: 'xai', model: opts.entry.model }
  }
}
