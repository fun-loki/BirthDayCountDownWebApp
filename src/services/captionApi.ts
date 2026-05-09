import type { CaptionRequestBody, CaptionResponseBody } from '../types'

export async function postCaption(body: CaptionRequestBody): Promise<CaptionResponseBody> {
  const r = await fetch('/api/caption', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = (await r.json().catch(() => ({}))) as CaptionResponseBody & {
    error?: string
    detail?: string
  }
  if (!r.ok) {
    throw new Error(data.detail ?? data.error ?? `Caption request failed (${r.status})`)
  }
  return data
}
