import styles from './RotatePhotoButton.module.css'

type Props = {
  onClick: () => void
}

export function RotatePhotoButton({ onClick }: Props) {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      aria-label="Rotate to next photo"
      title="Next photo"
      type="button"
    >
      <svg
        className={styles.icon}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
      </svg>
    </button>
  )
}
