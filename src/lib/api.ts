const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '/api'

async function request<T>(
  path: string,
  init?: RequestInit & { idempotencyKey?: string },
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string> | undefined),
  }
  if (init?.idempotencyKey) {
    headers['Idempotency-Key'] = init.idempotencyKey
  }

  const { idempotencyKey: _key, ...fetchInit } = init ?? {}
  const res = await fetch(`${API_BASE}${path}`, {
    ...fetchInit,
    headers,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `Request failed (${res.status})`)
  }
  return data as T
}

export type ApiDoctor = {
  id: number
  name: string
  qualification: string | null
  specialtyName: string | null
  fee: number
  followUpFee: number
  onlineFee: number
  opdDays: string | null
  available: string | null
  degrees: string[]
}

export type CreateAppointmentPayload = {
  doctorId: number
  appDate: string
  appTime: string
  amount?: number
  serviceName?: string
  patient: {
    name: string
    phone: string
    email: string
    age?: string
    gender: string
    notes?: string
  }
}

export type CreateAppointmentResponse = {
  appointmentId: number
  bookingId: string
  patientId: number
  uhid: number | null
  amount: number
  status: number | null
  requiresPayment: boolean
}

export type CreateOrderResponse = {
  orderId: string
  amount: number
  currency: string
  keyId: string
  appointmentId: number
  bookingId: string
  reused?: boolean
  alreadyPaid?: boolean
  paymentId?: string | null
  prefill: { name: string; email: string; contact: string }
}

export function newIdempotencyKey(prefix = 'pay'): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}_${crypto.randomUUID()}`
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`
}

export function fetchDoctors() {
  return request<{ doctors: ApiDoctor[] }>('/doctors')
}

export function fetchPaymentConfig() {
  return request<{ configured: boolean; keyId: string | null }>('/payments/config')
}

export function createAppointment(payload: CreateAppointmentPayload) {
  return request<CreateAppointmentResponse>('/appointments', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function createPaymentOrder(appointmentId: number, idempotencyKey: string) {
  return request<CreateOrderResponse>('/payments/create-order', {
    method: 'POST',
    idempotencyKey,
    body: JSON.stringify({ appointmentId, idempotencyKey }),
  })
}

export function verifyPayment(
  payload: {
    appointmentId: number
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
  },
  idempotencyKey: string,
) {
  return request<{
    ok: boolean
    alreadyConfirmed?: boolean
    bookingId: string
    appointmentId: number
    paymentId: string
    orderId?: string
  }>('/payments/verify', {
    method: 'POST',
    idempotencyKey,
    body: JSON.stringify({ ...payload, idempotencyKey }),
  })
}

export function confirmFreeOrSimulated(
  appointmentId: number,
  simulatedPaymentId?: string,
  idempotencyKey?: string,
) {
  const key = idempotencyKey ?? newIdempotencyKey('free')
  return request<{
    ok: boolean
    alreadyConfirmed?: boolean
    bookingId: string
    appointmentId: number
    paymentId: string
    simulated?: boolean
  }>('/payments/confirm-free', {
    method: 'POST',
    idempotencyKey: key,
    body: JSON.stringify({ appointmentId, simulatedPaymentId, idempotencyKey: key }),
  })
}

/** Retry helper for post-payment verify (network blips after successful charge). */
export async function verifyPaymentWithRetry(
  payload: {
    appointmentId: number
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
  },
  idempotencyKey: string,
  attempts = 3,
): Promise<{
  ok: boolean
  alreadyConfirmed?: boolean
  bookingId: string
  appointmentId: number
  paymentId: string
}> {
  let lastError: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await verifyPayment(payload, idempotencyKey)
    } catch (err) {
      lastError = err
      await new Promise((r) => setTimeout(r, 400 * (i + 1)))
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Payment verification failed')
}
