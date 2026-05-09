import { DateTime } from 'luxon'

export function getBirthdayTargetMs(birthdayIso: string, timeZone: string): number {
  const dt = DateTime.fromISO(birthdayIso, { zone: timeZone })
  if (!dt.isValid) {
    throw new Error(`Invalid birthday or timezone: ${dt.invalidReason}`)
  }
  return dt.toMillis()
}

export type CountdownParts = {
  totalMs: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function getCountdownParts(targetMs: number, nowMs: number): CountdownParts {
  const totalMs = Math.max(0, targetMs - nowMs)
  let rest = totalMs
  const days = Math.floor(rest / 86400000)
  rest -= days * 86400000
  const hours = Math.floor(rest / 3600000)
  rest -= hours * 3600000
  const minutes = Math.floor(rest / 60000)
  rest -= minutes * 60000
  const seconds = Math.floor(rest / 1000)
  return { totalMs, days, hours, minutes, seconds }
}
