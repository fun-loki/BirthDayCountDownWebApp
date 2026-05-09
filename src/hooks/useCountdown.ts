import { useEffect, useMemo, useState } from 'react'
import { getBirthdayTargetMs, getCountdownParts, type CountdownParts } from '../lib/countdown'

export function useCountdown(birthdayIso: string, timeZone: string) {
  const targetMs = useMemo(() => {
    try {
      return getBirthdayTargetMs(birthdayIso, timeZone)
    } catch {
      return NaN
    }
  }, [birthdayIso, timeZone])

  const [parts, setParts] = useState<CountdownParts>(() =>
    Number.isFinite(targetMs)
      ? getCountdownParts(targetMs, Date.now())
      : { totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0 },
  )

  useEffect(() => {
    if (!Number.isFinite(targetMs)) return
    const tick = () => setParts(getCountdownParts(targetMs, Date.now()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [targetMs])

  return { parts, targetMs, invalid: !Number.isFinite(targetMs) }
}
