import { CAPTION_MODES, type CaptionMode } from '../types'
import { modeLabel } from '../lib/modeLabel'
import styles from './ModeSelector.module.css'

type Props = {
  value: CaptionMode
  onChange: (m: CaptionMode) => void
  loadingFor?: Partial<Record<CaptionMode, boolean>>
}

export function ModeSelector({ value, onChange, loadingFor }: Props) {
  return (
    <div className={styles.root}>
      <p className={styles.label}>Voice</p>
      <div className={styles.chips} role="list">
        {CAPTION_MODES.map((mode) => {
          const active = mode === value
          const loading = loadingFor?.[mode]
          return (
            <button
              key={mode}
              type="button"
              className={`${styles.chip} ${active ? styles.chipActive : ''} ${
                loading ? styles.chipLoading : ''
              }`}
              onClick={() => onChange(mode)}
            >
              {modeLabel(mode)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
