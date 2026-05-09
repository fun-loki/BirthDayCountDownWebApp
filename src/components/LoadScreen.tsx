import styles from './LoadScreen.module.css'

type Props = {
  title: string
  message: string
}

export function LoadScreen({ title, message }: Props) {
  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.text}>{message}</p>
      </div>
    </div>
  )
}
