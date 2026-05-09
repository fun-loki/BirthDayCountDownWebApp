import type { AnalyzePhotoItem } from '../types'

export async function postAnalyzePhotos(files: File[]): Promise<AnalyzePhotoItem[]> {
  const form = new FormData()
  for (const f of files) {
    form.append('images', f)
  }
  const r = await fetch('/api/analyze-photos', {
    method: 'POST',
    body: form,
  })
  const data = (await r.json().catch(() => ({}))) as {
    error?: string
    detail?: string
    items?: AnalyzePhotoItem[]
  }
  if (!r.ok) {
    throw new Error(data.detail ?? data.error ?? `Analyze failed (${r.status})`)
  }
  return data.items ?? []
}
