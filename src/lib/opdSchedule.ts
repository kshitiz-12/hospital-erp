/** Weekday index: 0=Sun … 6=Sat (matches Date.getDay()) */
const WEEKDAY_KEY: Record<string, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
}

const WEEKDAY_LABEL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function weekdayKey(token: string): number | null {
  const key = token.trim().toLowerCase().replace(/\./g, '').slice(0, 3)
  return key in WEEKDAY_KEY ? WEEKDAY_KEY[key] : null
}

/**
 * Parse OPD day strings like:
 * - "Mon – Sat" / "Mon - Fri"
 * - "Mon, Wed, Fri"
 * - "MON,TUE,WED,THU,FRI"
 */
export function parseOpdWeekdays(opdDays: string): Set<number> {
  const normalized = opdDays
    .toLowerCase()
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()

  if (!normalized) return new Set()

  const range = normalized.match(
    /\b(sun|mon|tue|wed|thu|fri|sat)[a-z]*\s*-\s*(sun|mon|tue|wed|thu|fri|sat)[a-z]*\b/,
  )
  if (range) {
    const start = weekdayKey(range[1])
    const end = weekdayKey(range[2])
    const days = new Set<number>()
    if (start == null || end == null) return days
    let i = start
    for (let n = 0; n < 7; n++) {
      days.add(i)
      if (i === end) break
      i = (i + 1) % 7
    }
    return days
  }

  const days = new Set<number>()
  for (const part of normalized.split(/[,;/|]+/)) {
    const day = weekdayKey(part)
    if (day != null) days.add(day)
  }
  return days
}

export function formatOpdWeekdays(days: Set<number>): string {
  return WEEKDAY_LABEL.filter((_, i) => days.has(i)).join(', ')
}

function parseTimeToMinutes(value: string): number | null {
  const m = value.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i)
  if (!m) return null
  let hours = Number(m[1])
  const mins = Number(m[2])
  const ap = m[3].toUpperCase()
  if (ap === 'PM' && hours !== 12) hours += 12
  if (ap === 'AM' && hours === 12) hours = 0
  return hours * 60 + mins
}

function formatMinutes(total: number): string {
  let hours = Math.floor(total / 60)
  const mins = total % 60
  const ap = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  if (hours === 0) hours = 12
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${ap}`
}

/**
 * Build slots inside a window like "5:00 PM – 7:30 PM".
 * Defaults to 30-minute steps; last slot must finish by end time.
 */
export function slotsForAvailableWindow(available: string, stepMins = 30): string[] {
  const parts = available.split(/\s*[–—-]\s*/)
  if (parts.length < 2) return []

  const start = parseTimeToMinutes(parts[0])
  const end = parseTimeToMinutes(parts[1])
  if (start == null || end == null || end <= start) return []

  const slots: string[] = []
  for (let t = start; t + stepMins <= end; t += stepMins) {
    slots.push(formatMinutes(t))
  }
  if (slots.length === 0) slots.push(formatMinutes(start))
  return slots
}

export type BookableDay = {
  value: string
  label: string
  sub: string
  weekday: number
}

/** Next OPD dates for a doctor (scans ahead so sparse schedules still fill the strip). */
export function nextOpdDays(opdDays: string, count = 7, scanDays = 28): BookableDay[] {
  const allowed = parseOpdWeekdays(opdDays)
  const formatter = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
  const out: BookableDay[] = []
  const today = new Date()
  today.setHours(12, 0, 0, 0)

  for (let i = 0; i < scanDays && out.length < count; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const weekday = d.getDay()
    if (allowed.size > 0 && !allowed.has(weekday)) continue

    const value = d.toISOString().slice(0, 10)
    const parts = formatter.formatToParts(d)
    const weekdayLabel = parts.find((p) => p.type === 'weekday')?.value ?? ''
    const day = parts.find((p) => p.type === 'day')?.value ?? ''
    const month = parts.find((p) => p.type === 'month')?.value ?? ''

    out.push({
      value,
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : weekdayLabel,
      sub: `${day} ${month}`,
      weekday,
    })
  }

  return out
}
