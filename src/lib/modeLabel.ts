import type { CaptionMode } from '../types'

const LABELS: Record<CaptionMode, string> = {
  dad: 'Dad',
  mom: 'Mom',
  brother: 'Brother',
  best_friend: 'Best friend',
  boyfriend: 'Boyfriend',
  husband: 'Husband',
  flirty: 'Flirty',
  enemy: 'Frenemy',
  tapori: 'Tapori',
}

export function modeLabel(mode: CaptionMode): string {
  return LABELS[mode]
}
