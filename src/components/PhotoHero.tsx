import styles from './PhotoHero.module.css'

type Props = {
  src: string
  alt: string
  preloadSrc: string[]
}

export function PhotoHero({ src, alt, preloadSrc }: Props) {
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
