import { useEffect, useState } from 'react'

/** Re-evaluate consumers on a short interval so the hourly photo slot updates without a full page reload. */
export function useHourlyTick() {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 15000)
    return () => window.clearInterval(id)
  }, [])

  return now
}
