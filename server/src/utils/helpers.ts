/** YYYYMMDD as int, matching EHR TRANSACTIONDATE style */
export function transactionDateInt(date = new Date()): number {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return Number(`${y}${m}${d}`)
}

export function parseAppDate(isoDate: string): Date {
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

export function genderToId(gender: string): number {
  const g = gender.trim().toLowerCase()
  if (g === 'male' || g === 'm') return 1
  if (g === 'female' || g === 'f') return 2
  return 3
}

export function systemUserId(): number {
  return Number(process.env.SYSTEM_USER_ID ?? 1)
}

export function companyId(): number {
  return Number(process.env.COMPANY_ID ?? 1)
}

export function financialYearId(): number {
  return Number(process.env.FINANCIAL_YEAR_ID ?? 1)
}

export function toNumber(value: unknown, fallback = 0): number {
  if (value == null) return fallback
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}
