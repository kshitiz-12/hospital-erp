import { prisma } from './prisma'

/**
 * BhashSMS / WhatsApp utility — same contract as the Java `WhatsAppAuthClinet`.
 * GET http://bhashsms.com/api/sendmsgutil.php
 * Credentials stay in env; booking is not failed if this call errors.
 */
export async function sendBhashWhatsApp(params: {
  phone: string
  templateParams: string
}): Promise<{ ok: boolean; body: string }> {
  const user = process.env.BHASH_USER
  const pass = process.env.BHASH_PASS
  const sender = process.env.BHASH_SENDER ?? 'BUZWAP'
  const template = process.env.BHASH_TEMPLATE ?? 'slate_auth01'
  const priority = process.env.BHASH_PRIORITY ?? 'wa'
  const stype = process.env.BHASH_STYPE ?? 'auth'

  if (!user || !pass) {
    return { ok: false, body: 'Bhash credentials not configured' }
  }

  const phone = params.phone.replace(/\D/g, '').slice(-10)
  if (phone.length !== 10) {
    return { ok: false, body: 'Invalid phone' }
  }

  const url = new URL('http://bhashsms.com/api/sendmsgutil.php')
  url.searchParams.set('user', user)
  url.searchParams.set('pass', pass)
  url.searchParams.set('sender', sender)
  url.searchParams.set('phone', phone)
  url.searchParams.set('text', template)
  url.searchParams.set('priority', priority)
  url.searchParams.set('stype', stype)
  url.searchParams.set('Params', params.templateParams.slice(0, 30))

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 10_000)
  try {
    const res = await fetch(url, { method: 'GET', signal: controller.signal })
    const body = await res.text()
    if (!res.ok) {
      console.error('[whatsapp] gateway', res.status, body.slice(0, 300))
      return { ok: false, body }
    }
    console.log('[whatsapp] sent', phone, body.slice(0, 200))
    return { ok: true, body }
  } catch (err) {
    console.error('[whatsapp] request failed', err)
    return { ok: false, body: err instanceof Error ? err.message : 'request failed' }
  } finally {
    clearTimeout(timer)
  }
}

/** Fire-and-forget booking notice. Uses the approved auth template param slot. */
export function notifyAppointmentBooked(appointmentId: number, bookingId: string): void {
  void (async () => {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { patient: true },
    })
    const raw =
      appointment?.patient?.whatsapp ||
      appointment?.patient?.mobileNumber ||
      appointment?.patient?.phoneNumber
    if (!raw) return

    const code = bookingId.replace(/\D/g, '').slice(-8) || String(appointmentId)
    await sendBhashWhatsApp({ phone: raw, templateParams: code })
  })().catch((err) => console.error('[whatsapp] notify failed', err))
}
