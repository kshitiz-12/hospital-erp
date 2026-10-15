import Razorpay from 'razorpay'
import crypto from 'crypto'

let client: Razorpay | null = null

export function getRazorpay(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret || keyId.includes('PLACEHOLDER') || keySecret.includes('PLACEHOLDER')) {
    throw new Error('Razorpay keys are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.')
  }

  if (!client) {
    client = new Razorpay({ key_id: keyId, key_secret: keySecret })
  }
  return client
}

export function isRazorpayConfigured(): boolean {
  const keyId = process.env.RAZORPAY_KEY_ID ?? ''
  const keySecret = process.env.RAZORPAY_KEY_SECRET ?? ''
  return Boolean(keyId && keySecret && !keyId.includes('PLACEHOLDER') && !keySecret.includes('PLACEHOLDER'))
}

function timingSafeEqualHex(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'utf8')
    const bufB = Buffer.from(b, 'utf8')
    if (bufA.length !== bufB.length) return false
    return crypto.timingSafeEqual(bufA, bufB)
  } catch {
    return false
  }
}

/** Checkout payment signature: HMAC_SHA256(order_id|payment_id) */
export function verifyPaymentSignature(params: {
  orderId: string
  paymentId: string
  signature: string
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) return false

  const body = `${params.orderId}|${params.paymentId}`
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')
  return timingSafeEqualHex(expected, params.signature)
}

/** Webhook signature: HMAC_SHA256(rawBody) with RAZORPAY_WEBHOOK_SECRET */
export function verifyWebhookSignature(rawBody: Buffer | string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret || secret.includes('PLACEHOLDER')) return false

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  return timingSafeEqualHex(expected, signature)
}

/** EHR payment method constant for website Razorpay / online payments */
export const PAYMENT_METHOD_RAZORPAY = 5
export const PAYMENT_METHOD_CASH = 1

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  SIMULATED: 'SIMULATED',
  PAY_AT_HOSPITAL: 'PAY_AT_HOSPITAL',
} as const

export const APPOINTMENT_STATUS = {
  PENDING_PAYMENT: 0,
  CONFIRMED: 1,
  CANCELLED: 2,
} as const
