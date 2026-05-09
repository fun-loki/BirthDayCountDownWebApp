import type { CountdownParts } from '../lib/countdown'
import styles from './Countdown.module.css'

type Props = {
  title: string
  subtitle: string
  parts: CountdownParts
  invalid?: boolean
}

export function Countdown({ title, subtitle, parts, invalid }: Props) {
  if (invalid) {
    return (
      <header className={styles.root}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <p className={styles.invalid}>Check birthday and timezone in app-config.json.</p>
      </header>
    )
  }

  if (parts.totalMs <= 0) {
    return (
      <header className={styles.root}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <p className={styles.done}>It&apos;s here. Happy birthday.</p>
      </header>
    )
  }

  return (
    <header className={styles.root}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
      <div className={styles.grid} aria-live="polite">
        <div className={styles.cell}>
          <div className={styles.value}>{parts.days}</div>
          <div className={styles.label}>days</div>
        </div>
        <div className={styles.cell}>
          <div className={styles.value}>{pad(parts.hours)}</div>
          <div className={styles.label}>hours</div>
        </div>
        <div className={styles.cell}>
          <div className={styles.value}>{pad(parts.minutes)}</div>
          <div className={styles.label}>min</div>
        </div>
        <div className={styles.cell}>
          <div className={styles.value}>{pad(parts.seconds)}</div>
          <div className={styles.label}>sec</div>
        </div>
      </div>
    </header>
  )
}

function pad(n: number) {
  return n.toString().padStart(2, '0')
}
