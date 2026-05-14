import { useState } from 'react'
import { Countdown } from '../components/Countdown'
import { PhotoHero } from '../components/PhotoHero'
import { ModeSelector } from '../components/ModeSelector'
import { CaptionBar } from '../components/CaptionBar'
import { LoadScreen } from '../components/LoadScreen'
import { useStaticData } from '../hooks/useStaticData'
import { useCountdown } from '../hooks/useCountdown'
import { useHourlyTick } from '../hooks/useHourlyTick'
import { useCaptionsForPhoto } from '../hooks/useCaptionsForPhoto'
import { usePhotoRotation } from '../hooks/usePhotoRotation'
import { neighborIndices } from '../lib/hourlyPhoto'
import type { AppConfig, Photo } from '../types'
import type { CaptionMode } from '../types'

function CaptionSection({
  photoId,
  mode,
  onModeChange,
}: {
  photoId: string
  mode: CaptionMode
  onModeChange: (m: CaptionMode) => void
}) {
  const { data, loading, error, regenerate } = useCaptionsForPhoto(photoId)
  const activeCaption = data[mode]
  const modeLoading = loading[mode]

  return (
    <>
      <ModeSelector value={mode} onChange={onModeChange} loadingFor={loading} />
      <CaptionBar
        mode={mode}
        caption={activeCaption}
        loading={!!modeLoading}
        error={error}
        onRegenerate={() => void regenerate(mode)}
      />
    </>
  )
}

function HomeInner({ app, photos }: { app: AppConfig; photos: Photo[] }) {
  const now = useHourlyTick()
  const [mode, setMode] = useState<CaptionMode>('best_friend')
  const { parts, invalid } = useCountdown(app.birthday, app.timezone)
  const { selection, rotateToNext } = usePhotoRotation(photos, app.timezone, now)

  if (!selection) {
    return (
      <LoadScreen
        title="Almost ready"
        message="Add at least one photo entry to public/data/photos.json and matching files under public/photos/."
      />
    )
  }

  const { current, index, sorted } = selection
  const { prev, next } = neighborIndices(index, sorted.length)
  const preloadSrc = [sorted[prev]!.file, sorted[next]!.file]

  return (
    <main>
      <Countdown title={app.title} subtitle={app.subtitle} parts={parts} invalid={invalid} />
      <PhotoHero src={current.file} alt={current.visuals.join(', ')} preloadSrc={preloadSrc} onRotate={rotateToNext} />
      <CaptionSection key={current.id} photoId={current.id} mode={mode} onModeChange={setMode} />
    </main>
  )
}

export function HomePage() {
  const staticData = useStaticData()

  if (staticData.status === 'loading') {
    return <LoadScreen title="One moment" message="Loading your little celebration site…" />
  }

  if (staticData.status === 'error') {
    return <LoadScreen title="Something went wrong" message={staticData.message} />
  }

  return <HomeInner app={staticData.app} photos={staticData.photos} />
}
