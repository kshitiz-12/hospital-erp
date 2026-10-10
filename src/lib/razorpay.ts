/** Placeholder Razorpay helpers — wire real order APIs before going live. */

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

export type PaymentIntent = {
  amountInr: number
  patientName: string
  patientEmail: string
  patientPhone: string
  description: string
  notes?: Record<string, string>
}

/**
 * Opens Razorpay Checkout when a real key + order_id are configured.
 * Until then, simulates a successful payment so the booking UI can be tested end-to-end.
 */
export async function startRazorpayPayment(
  intent: PaymentIntent,
): Promise<{ ok: true; paymentId: string; simulated: boolean } | { ok: false; reason: string }> {
  const isPlaceholder = RAZORPAY_KEY_PLACEHOLDER.includes('PLACEHOLDER')

  if (isPlaceholder || intent.amountInr <= 0) {
    await new Promise((r) => setTimeout(r, 900))
    return {
      ok: true,
      paymentId: intent.amountInr <= 0 ? 'PAY_FREE_CONSULT' : `pay_sim_${Date.now()}`,
      simulated: true,
    }
  }

  const loaded = await loadRazorpayScript()
  if (!loaded || !window.Razorpay) {
    return { ok: false, reason: 'Could not load Razorpay Checkout. Check your network.' }
  }

  // TODO: Replace with your backend order creation:
  // const order = await fetch('/api/razorpay/create-order', { method: 'POST', body: JSON.stringify({ amount: intent.amountInr * 100 }) }).then(r => r.json())
  const orderId: string | undefined = undefined

  return new Promise((resolve) => {
    const rzp = new window.Razorpay!({
      key: RAZORPAY_KEY_PLACEHOLDER,
      amount: Math.round(intent.amountInr * 100),
      currency: 'INR',
      name: 'Curabiz Hospital',
      description: intent.description,
      order_id: orderId,
      prefill: {
        name: intent.patientName,
        email: intent.patientEmail,
        contact: intent.patientPhone,
      },
      notes: intent.notes,
      theme: { color: '#0c69b6' },
      handler: (response) => {
        resolve({
          ok: true,
          paymentId: response.razorpay_payment_id,
          simulated: false,
        })
      },
      modal: {
        ondismiss: () => resolve({ ok: false, reason: 'Payment cancelled' }),
      },
    })
    rzp.open()
  })
}
