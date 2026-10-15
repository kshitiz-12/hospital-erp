const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
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
  prefill: { name: string; email: string; contact: string }
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

export function createPaymentOrder(appointmentId: number) {
  return request<CreateOrderResponse>('/payments/create-order', {
    method: 'POST',
    body: JSON.stringify({ appointmentId }),
  })
}

export function verifyPayment(payload: {
  appointmentId: number
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}) {
  return request<{
    ok: boolean
    bookingId: string
    appointmentId: number
    paymentId: string
  }>('/payments/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function confirmFreeOrSimulated(appointmentId: number, simulatedPaymentId?: string) {
  return request<{
    ok: boolean
    bookingId: string
    appointmentId: number
    paymentId: string
    simulated?: boolean
  }>('/payments/confirm-free', {
    method: 'POST',
    body: JSON.stringify({ appointmentId, simulatedPaymentId }),
  })
}
