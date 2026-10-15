import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { fulfillRazorpayPayment } from '../lib/paymentFulfillment'
import {
  APPOINTMENT_STATUS,
  getRazorpay,
  isRazorpayConfigured,
  PAYMENT_METHOD_CASH,
  PAYMENT_METHOD_RAZORPAY,
  PAYMENT_STATUS,
  verifyPaymentSignature,
  verifyWebhookSignature,
} from '../lib/razorpay'
import { isRazorpayOrderId, readIdempotencyKey } from '../utils/idempotency'
import {
  companyId,
  financialYearId,
  systemUserId,
  toNumber,
  transactionDateInt,
} from '../utils/helpers'

export const paymentsRouter = Router()

function orderResponse(params: {
  orderId: string
  amountPaise: number
  appointmentId: number
  prefill: { name: string; email: string; contact: string }
  reused: boolean
}) {
  return {
    orderId: params.orderId,
    amount: params.amountPaise,
    currency: 'INR' as const,
    keyId: process.env.RAZORPAY_KEY_ID,
    appointmentId: params.appointmentId,
    bookingId: `CBH-${params.appointmentId}`,
    reused: params.reused,
    prefill: params.prefill,
  }
}

paymentsRouter.get('/config', (_req, res) => {
  res.json({
    configured: isRazorpayConfigured(),
    keyId: isRazorpayConfigured() ? process.env.RAZORPAY_KEY_ID : null,
  })
})

const createOrderSchema = z.object({
  appointmentId: z.coerce.number().int().positive(),
  idempotencyKey: z.string().min(8).max(100).optional(),
})

/**
 * Idempotent create-order:
 * - Idempotency-Key / body key → return same order if already issued
 * - Existing PENDING row for appointment → reuse order (no duplicate Razorpay orders)
 * - Already paid → 200 with alreadyPaid flag
 */
paymentsRouter.post('/create-order', async (req, res) => {
  try {
    if (!isRazorpayConfigured()) {
      res.status(503).json({ error: 'Razorpay is not configured on the server' })
      return
    }

    const body = createOrderSchema.parse(req.body)
    const idempotencyKey = readIdempotencyKey(req) ?? body.idempotencyKey
    const appointmentId = body.appointmentId

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: true,
        payments: { orderBy: { id: 'desc' } },
      },
    })

    if (!appointment) {
      res.status(404).json({ error: 'Appointment not found' })
      return
    }

    const amountInr = toNumber(appointment.amount)
    const amountPaise = Math.round(amountInr * 100)
    const prefill = {
      name: appointment.patient?.name ?? '',
      email: appointment.patient?.emailId ?? '',
      contact: appointment.patient?.mobileNumber ?? appointment.patient?.phoneNumber ?? '',
    }

    if (appointment.status === APPOINTMENT_STATUS.CONFIRMED) {
      const paid = appointment.payments.find(
        (p) => p.ccTransactionId && p.ccTransactionId !== PAYMENT_STATUS.PENDING,
      )
      res.json({
        alreadyPaid: true,
        appointmentId,
        bookingId: `CBH-${appointmentId}`,
        paymentId: paid?.ccTransactionId ?? null,
        orderId: paid?.bankName ?? null,
        amount: amountPaise,
        currency: 'INR',
        keyId: process.env.RAZORPAY_KEY_ID,
        prefill,
      })
      return
    }

    if (amountInr <= 0) {
      res.status(400).json({ error: 'No payment required for this appointment' })
      return
    }

    // 1) Explicit idempotency key → reuse prior PENDING row created with that key
    if (idempotencyKey) {
      const byKey = await prisma.appointmentPaymentDetails.findFirst({
        where: {
          chequeNumber: idempotencyKey,
          paymentMethod: PAYMENT_METHOD_RAZORPAY,
        },
        orderBy: { id: 'desc' },
      })

      if (byKey && isRazorpayOrderId(byKey.bankName)) {
        if (byKey.appointmentId !== appointmentId) {
          res.status(409).json({ error: 'Idempotency key already used for another appointment' })
          return
        }
        res.json(
          orderResponse({
            orderId: byKey.bankName!,
            amountPaise: Math.round(toNumber(byKey.amount) * 100),
            appointmentId,
            prefill,
            reused: true,
          }),
        )
        return
      }
    }

    // 2) Reuse open PENDING order for this appointment (retry-safe)
    const pending = appointment.payments.find(
      (p) =>
        p.paymentMethod === PAYMENT_METHOD_RAZORPAY &&
        p.ccTransactionId === PAYMENT_STATUS.PENDING &&
        isRazorpayOrderId(p.bankName) &&
        toNumber(p.amount) === amountInr,
    )

    if (pending?.bankName) {
      if (idempotencyKey && !pending.chequeNumber) {
        await prisma.appointmentPaymentDetails.update({
          where: { id: pending.id },
          data: { chequeNumber: idempotencyKey },
        })
      }
      res.json(
        orderResponse({
          orderId: pending.bankName,
          amountPaise,
          appointmentId,
          prefill,
          reused: true,
        }),
      )
      return
    }

    // 3) Create a new Razorpay order once
    const razorpay = getRazorpay()
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `appt_${appointmentId}_${Date.now()}`.slice(0, 40),
      notes: {
        appointmentId: String(appointmentId),
        patientId: String(appointment.opdPatientId ?? ''),
        bookingId: `CBH-${appointmentId}`,
        ...(idempotencyKey ? { idempotencyKey } : {}),
      },
    })

    const orderId = String(order.id).slice(0, 45)
    const sys = systemUserId()

    // Prefer updating a stale PENDING row; else create one
    const stalePending = appointment.payments.find(
      (p) =>
        p.paymentMethod === PAYMENT_METHOD_RAZORPAY &&
        p.ccTransactionId === PAYMENT_STATUS.PENDING,
    )

    if (stalePending) {
      await prisma.appointmentPaymentDetails.update({
        where: { id: stalePending.id },
        data: {
          amount: amountInr,
          bankName: orderId,
          ccTransactionId: PAYMENT_STATUS.PENDING,
          chequeNumber: idempotencyKey ?? stalePending.chequeNumber,
          updatedBy: sys,
          transactionDate: transactionDateInt(),
        },
      })
    } else {
      await prisma.appointmentPaymentDetails.create({
        data: {
          dayBookId: 0,
          appointmentId,
          paymentMethod: PAYMENT_METHOD_RAZORPAY,
          amount: amountInr,
          createdBy: sys,
          companyId: companyId(),
          financialYearId: financialYearId(),
          bankName: orderId,
          ccTransactionId: PAYMENT_STATUS.PENDING,
          chequeNumber: idempotencyKey,
          transactionDate: transactionDateInt(),
          isRep: 1,
        },
      })
    }

    res.status(201).json(
      orderResponse({
        orderId,
        amountPaise,
        appointmentId,
        prefill,
        reused: false,
      }),
    )
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid payload', details: err.flatten() })
      return
    }
    console.error('[POST /api/payments/create-order]', err)
    res.status(500).json({ error: 'Failed to create Razorpay order' })
  }
})

const verifySchema = z.object({
  appointmentId: z.coerce.number().int().positive(),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  idempotencyKey: z.string().min(8).max(100).optional(),
})

/**
 * Idempotent verify:
 * - Signature check (timing-safe)
 * - Order must match pending BANKNAME for appointment
 * - Replay of same payment id → 200
 * - Concurrent verifies → single winner via status flip
 */
paymentsRouter.post('/verify', async (req, res) => {
  try {
    const body = verifySchema.parse(req.body)
    const idempotencyKey = readIdempotencyKey(req) ?? body.idempotencyKey

    const valid = verifyPaymentSignature({
      orderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
      signature: body.razorpay_signature,
    })

    if (!valid) {
      res.status(400).json({ error: 'Invalid payment signature' })
      return
    }

    // Bind order to this appointment's pending intent
    const pending = await prisma.appointmentPaymentDetails.findFirst({
      where: {
        appointmentId: body.appointmentId,
        paymentMethod: PAYMENT_METHOD_RAZORPAY,
        bankName: body.razorpay_order_id.slice(0, 45),
      },
      orderBy: { id: 'desc' },
    })

    // Allow verify if already fulfilled with same payment (replay) even if pending gone
    if (!pending) {
      const already = await prisma.appointmentPaymentDetails.findFirst({
        where: {
          appointmentId: body.appointmentId,
          ccTransactionId: body.razorpay_payment_id.slice(0, 45),
        },
      })
      if (!already) {
        res.status(400).json({ error: 'No matching payment order for this appointment' })
        return
      }
    } else if (
      idempotencyKey &&
      pending.chequeNumber &&
      pending.chequeNumber !== idempotencyKey
    ) {
      // Soft warning only — key mismatch shouldn't block a valid signed payment
      console.warn('[verify] idempotency key mismatch for appointment', body.appointmentId)
    }

    const result = await fulfillRazorpayPayment({
      appointmentId: body.appointmentId,
      orderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
    })

    if (!result.ok) {
      res.status(result.status).json({ error: result.reason })
      return
    }

    res.json({
      ok: true,
      alreadyConfirmed: result.alreadyConfirmed,
      bookingId: result.bookingId,
      appointmentId: result.appointmentId,
      paymentId: result.paymentId,
      orderId: result.orderId,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid payload', details: err.flatten() })
      return
    }
    console.error('[POST /api/payments/verify]', err)
    res.status(500).json({ error: 'Failed to verify payment' })
  }
})

const confirmFreeSchema = z.object({
  appointmentId: z.coerce.number().int().positive(),
  simulatedPaymentId: z.string().max(45).optional(),
  idempotencyKey: z.string().min(8).max(100).optional(),
})

/** Idempotent free / simulated confirm — safe to retry */
paymentsRouter.post('/confirm-free', async (req, res) => {
  try {
    const body = confirmFreeSchema.parse(req.body)
    const idempotencyKey = readIdempotencyKey(req) ?? body.idempotencyKey

    const appointment = await prisma.appointment.findUnique({
      where: { id: body.appointmentId },
      include: { payments: { orderBy: { id: 'desc' } } },
    })

    if (!appointment) {
      res.status(404).json({ error: 'Appointment not found' })
      return
    }

    const amountInr = toNumber(appointment.amount)
    if (amountInr > 0 && !body.simulatedPaymentId) {
      res.status(400).json({ error: 'Payment required — use Razorpay create-order flow' })
      return
    }

    // Already confirmed → return existing (idempotent)
    if (appointment.status === APPOINTMENT_STATUS.CONFIRMED) {
      const paid = appointment.payments[0]
      res.json({
        ok: true,
        alreadyConfirmed: true,
        bookingId: `CBH-${appointment.id}`,
        appointmentId: appointment.id,
        paymentId: paid?.ccTransactionId ?? 'ALREADY_CONFIRMED',
        simulated: paid?.bankName === PAYMENT_STATUS.SIMULATED,
      })
      return
    }

    if (idempotencyKey) {
      const byKey = await prisma.appointmentPaymentDetails.findFirst({
        where: { chequeNumber: idempotencyKey },
      })
      if (byKey) {
        if (byKey.appointmentId !== body.appointmentId) {
          res.status(409).json({ error: 'Idempotency key already used for another appointment' })
          return
        }
        res.json({
          ok: true,
          alreadyConfirmed: true,
          bookingId: `CBH-${body.appointmentId}`,
          appointmentId: body.appointmentId,
          paymentId: byKey.ccTransactionId ?? 'CONFIRMED',
          simulated: byKey.bankName === PAYMENT_STATUS.SIMULATED,
        })
        return
      }
    }

    const sys = systemUserId()
    const paymentId = (body.simulatedPaymentId ?? PAYMENT_STATUS.PAY_AT_HOSPITAL).slice(0, 45)

    const flipped = await prisma.appointment.updateMany({
      where: {
        id: body.appointmentId,
        status: { not: APPOINTMENT_STATUS.CONFIRMED },
      },
      data: {
        status: APPOINTMENT_STATUS.CONFIRMED,
        amountReceived: amountInr > 0 ? amountInr : 0,
        updatedBy: sys,
      },
    })

    if (flipped.count === 0) {
      res.json({
        ok: true,
        alreadyConfirmed: true,
        bookingId: `CBH-${body.appointmentId}`,
        appointmentId: body.appointmentId,
        paymentId,
        simulated: Boolean(body.simulatedPaymentId),
      })
      return
    }

    const existing = await prisma.appointmentPaymentDetails.findFirst({
      where: { appointmentId: body.appointmentId },
      orderBy: { id: 'desc' },
    })

    if (!existing) {
      await prisma.appointmentPaymentDetails.create({
        data: {
          dayBookId: 0,
          appointmentId: body.appointmentId,
          paymentMethod: amountInr > 0 ? PAYMENT_METHOD_RAZORPAY : PAYMENT_METHOD_CASH,
          amount: amountInr,
          createdBy: sys,
          companyId: companyId(),
          financialYearId: financialYearId(),
          bankName: amountInr > 0 ? PAYMENT_STATUS.SIMULATED : PAYMENT_STATUS.PAY_AT_HOSPITAL,
          ccTransactionId: paymentId,
          chequeNumber: idempotencyKey,
          transactionDate: transactionDateInt(),
          isRep: 1,
        },
      })
    } else if (existing.ccTransactionId === PAYMENT_STATUS.PENDING || !existing.ccTransactionId) {
      await prisma.appointmentPaymentDetails.update({
        where: { id: existing.id },
        data: {
          amount: amountInr,
          bankName: amountInr > 0 ? PAYMENT_STATUS.SIMULATED : PAYMENT_STATUS.PAY_AT_HOSPITAL,
          ccTransactionId: paymentId,
          chequeNumber: idempotencyKey ?? existing.chequeNumber,
          updatedBy: sys,
          transactionDate: transactionDateInt(),
        },
      })
    }

    res.json({
      ok: true,
      alreadyConfirmed: false,
      bookingId: `CBH-${body.appointmentId}`,
      appointmentId: body.appointmentId,
      paymentId,
      simulated: Boolean(body.simulatedPaymentId),
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid payload', details: err.flatten() })
      return
    }
    console.error('[POST /api/payments/confirm-free]', err)
    res.status(500).json({ error: 'Failed to confirm appointment' })
  }
})

/**
 * Razorpay webhook backup (payment.captured).
 * Mounted with express.raw in index.ts for signature verification.
 */
export async function handleRazorpayWebhook(
  rawBody: Buffer,
  signature: string | undefined,
): Promise<{ status: number; body: Record<string, unknown> }> {
  if (!signature || !verifyWebhookSignature(rawBody, signature)) {
    return { status: 400, body: { error: 'Invalid webhook signature' } }
  }

  let event: {
    event?: string
    payload?: {
      payment?: {
        entity?: {
          id?: string
          order_id?: string
          notes?: { appointmentId?: string }
        }
      }
    }
  }

  try {
    event = JSON.parse(rawBody.toString('utf8'))
  } catch {
    return { status: 400, body: { error: 'Invalid JSON' } }
  }

  if (event.event !== 'payment.captured' && event.event !== 'payment.authorized') {
    return { status: 200, body: { ok: true, ignored: true, event: event.event } }
  }

  const payment = event.payload?.payment?.entity
  const paymentId = payment?.id
  const orderId = payment?.order_id
  const appointmentId = Number(payment?.notes?.appointmentId)

  if (!paymentId || !orderId || !Number.isFinite(appointmentId)) {
    return { status: 200, body: { ok: true, ignored: true, reason: 'missing fields' } }
  }

  const result = await fulfillRazorpayPayment({
    appointmentId,
    orderId,
    paymentId,
  })

  if (!result.ok) {
    // Still 200 to avoid Razorpay endless retries on business conflicts
    return { status: 200, body: { ok: false, error: result.reason } }
  }

  return {
    status: 200,
    body: {
      ok: true,
      alreadyConfirmed: result.alreadyConfirmed,
      bookingId: result.bookingId,
      appointmentId: result.appointmentId,
      paymentId: result.paymentId,
    },
  }
}
