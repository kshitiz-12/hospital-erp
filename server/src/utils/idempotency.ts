import type { Request } from 'express'

/** Prefer Idempotency-Key header; fall back to body.idempotencyKey */
export function readIdempotencyKey(req: Request): string | undefined {
  const header = req.header('Idempotency-Key')?.trim()
  if (header) return header.slice(0, 100)

  const bodyKey = (req.body as { idempotencyKey?: unknown } | undefined)?.idempotencyKey
  if (typeof bodyKey === 'string' && bodyKey.trim()) return bodyKey.trim().slice(0, 100)

  return undefined
}

export function isRazorpayOrderId(value: string | null | undefined): boolean {
  return Boolean(value && /^order_/i.test(value))
}
