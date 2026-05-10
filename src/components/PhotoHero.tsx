import styles from './PhotoHero.module.css'
import { RotatePhotoButton } from './RotatePhotoButton'

type Props = {
  src: string
  alt: string
  preloadSrc: string[]
  onRotate?: () => void
}

export function PhotoHero({ src, alt, preloadSrc, onRotate }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.frame}>
        <img
          key={src}
          className={styles.photo}
          src={src}
          alt={alt}
          decoding="async"
          fetchPriority="high"
        />
        {onRotate && <RotatePhotoButton onClick={onRotate} />}
      </div>
      <div className={styles.preload} aria-hidden>
        {preloadSrc.map((p) => (
          <img key={p} src={p} alt="" decoding="async" />
        ))}
      </div>
      <p className={styles.captionHint}>Photo refreshes each hour in your timezone.</p>
    </div>
  )
}
