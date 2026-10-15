import {
  confirmFreeOrSimulated,
  createAppointment,
  createPaymentOrder,
  fetchPaymentConfig,
  newIdempotencyKey,
  verifyPaymentWithRetry,
  type CreateAppointmentPayload,
} from './api'

export const RAZORPAY_KEY_PLACEHOLDER =
  import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_PLACEHOLDER_KEY'

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false)
      return
    }
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const existing = document.querySelector<HTMLScriptElement>('script[data-razorpay]')
    if (existing) {
      existing.addEventListener('load', () => resolve(true))
      existing.addEventListener('error', () => resolve(false))
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.dataset.razorpay = 'true'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export type BookingPaymentInput = CreateAppointmentPayload & {
  description: string
}

export type BookingPaymentResult =
  | {
      ok: true
      bookingId: string
      appointmentId: number
      paymentId: string
      simulated: boolean
      amount: number
    }
  | { ok: false; reason: string }

/**
 * Creates the appointment, then pays with idempotent Razorpay order + verify
 * (or free / simulated confirm when keys are not configured).
 */
export async function bookAndPay(input: BookingPaymentInput): Promise<BookingPaymentResult> {
  const payKey = newIdempotencyKey('pay')

  try {
    const created = await createAppointment({
      doctorId: input.doctorId,
      appDate: input.appDate,
      appTime: input.appTime,
      amount: input.amount,
      serviceName: input.serviceName,
      patient: input.patient,
    })

    if (!created.requiresPayment || created.amount <= 0) {
      const confirmed = await confirmFreeOrSimulated(created.appointmentId, undefined, payKey)
      return {
        ok: true,
        bookingId: confirmed.bookingId,
        appointmentId: confirmed.appointmentId,
        paymentId: confirmed.paymentId,
        simulated: false,
        amount: created.amount,
      }
    }

    const config = await fetchPaymentConfig()
    if (!config.configured) {
      const simId = `pay_sim_${Date.now()}`
      const confirmed = await confirmFreeOrSimulated(created.appointmentId, simId, payKey)
      return {
        ok: true,
        bookingId: confirmed.bookingId,
        appointmentId: confirmed.appointmentId,
        paymentId: confirmed.paymentId,
        simulated: true,
        amount: created.amount,
      }
    }

    const order = await createPaymentOrder(created.appointmentId, payKey)

    if (order.alreadyPaid) {
      return {
        ok: true,
        bookingId: order.bookingId,
        appointmentId: order.appointmentId,
        paymentId: order.paymentId ?? 'ALREADY_PAID',
        simulated: false,
        amount: created.amount,
      }
    }

    const loaded = await loadRazorpayScript()
    if (!loaded || !window.Razorpay) {
      return { ok: false, reason: 'Could not load Razorpay Checkout. Check your network.' }
    }

    return new Promise((resolve) => {
      const rzp = new window.Razorpay!({
        key: order.keyId || RAZORPAY_KEY_PLACEHOLDER,
        amount: order.amount,
        currency: order.currency,
        name: 'Curabiz Hospital',
        description: input.description,
        order_id: order.orderId,
        prefill: {
          name: order.prefill.name || input.patient.name,
          email: order.prefill.email || input.patient.email,
          contact: order.prefill.contact || input.patient.phone,
        },
        notes: {
          appointmentId: String(created.appointmentId),
          bookingId: created.bookingId,
          idempotencyKey: payKey,
        },
        theme: { color: '#0c69b6' },
        handler: async (response) => {
          try {
            if (!response.razorpay_order_id || !response.razorpay_signature) {
              resolve({ ok: false, reason: 'Incomplete Razorpay response' })
              return
            }
            const verified = await verifyPaymentWithRetry(
              {
                appointmentId: created.appointmentId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              payKey,
            )
            resolve({
              ok: true,
              bookingId: verified.bookingId,
              appointmentId: verified.appointmentId,
              paymentId: verified.paymentId,
              simulated: false,
              amount: created.amount,
            })
          } catch (err) {
            resolve({
              ok: false,
              reason:
                err instanceof Error
                  ? err.message
                  : 'Payment may have succeeded — contact the hospital with your payment id.',
            })
          }
        },
        modal: {
          ondismiss: () =>
            resolve({
              ok: false,
              reason: 'Payment cancelled. Your appointment is saved as pending — retry uses the same order.',
            }),
        },
      })
      rzp.open()
    })
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : 'Booking failed',
    }
  }
}

/** @deprecated Use bookAndPay */
export async function startRazorpayPayment() {
  return { ok: false as const, reason: 'Use bookAndPay instead' }
}
