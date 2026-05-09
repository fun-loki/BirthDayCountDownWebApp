import type { CaptionMode, CaptionResponseBody } from '../types'
import { modeLabel } from '../lib/modeLabel'
import styles from './CaptionBar.module.css'

type Props = {
  mode: CaptionMode
  caption?: CaptionResponseBody
  loading?: boolean
  error?: string | null
  onRegenerate: () => void
}

export function CaptionBar({ mode, caption, loading, error, onRegenerate }: Props) {
  return (
    <section className={styles.root} aria-label="AI caption">
      {loading && !caption ? (
        <div className={styles.loadingLine} />
      ) : (
        <p className={styles.quote}>
          {caption?.caption ?? 'Pick a voice to hear what the moment would say.'}
        </p>
      )}
      <div className={styles.meta}>
        {caption ? (
          <>
            <span>{modeLabel(mode)}</span>
            <span>·</span>
            <span>
              {caption.provider} / {caption.model}
            </span>
            {caption.cached ? (
              <>
                <span>·</span>
                <span>cached</span>
              </>
            ) : null}
          </>
        ) : (
          <span>Warming captions for this hour&apos;s photo…</span>
        )}
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.btn}
          onClick={onRegenerate}
          disabled={loading || !caption}
        >
          {loading ? 'Thinking…' : 'Regenerate'}
        </button>
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}
    </section>
  )
}
