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

export function verifyPaymentSignature(params: {
  orderId: string
  paymentId: string
  signature: string
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) return false

  const body = `${params.orderId}|${params.paymentId}`
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')
  return expected === params.signature
}

/** EHR payment method constant for website Razorpay / online payments */
export const PAYMENT_METHOD_RAZORPAY = 5
export const PAYMENT_METHOD_CASH = 1
