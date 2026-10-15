import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import {
  getRazorpay,
  isRazorpayConfigured,
  PAYMENT_METHOD_CASH,
  PAYMENT_METHOD_RAZORPAY,
  verifyPaymentSignature,
} from '../lib/razorpay'
import {
  companyId,
  financialYearId,
  systemUserId,
  toNumber,
  transactionDateInt,
} from '../utils/helpers'

export const paymentsRouter = Router()

paymentsRouter.get('/config', (_req, res) => {
  res.json({
    configured: isRazorpayConfigured(),
    keyId: isRazorpayConfigured() ? process.env.RAZORPAY_KEY_ID : null,
  })
})

const createOrderSchema = z.object({
  appointmentId: z.coerce.number().int().positive(),
})

paymentsRouter.post('/create-order', async (req, res) => {
  try {
    if (!isRazorpayConfigured()) {
      res.status(503).json({ error: 'Razorpay is not configured on the server' })
      return
    }

    const { appointmentId } = createOrderSchema.parse(req.body)
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { patient: true },
    })

    if (!appointment) {
      res.status(404).json({ error: 'Appointment not found' })
      return
    }

    if (appointment.status === 1) {
      res.status(400).json({ error: 'Appointment is already paid' })
      return
    }

    const amountInr = toNumber(appointment.amount)
    if (amountInr <= 0) {
      res.status(400).json({ error: 'No payment required for this appointment' })
      return
    }

    const amountPaise = Math.round(amountInr * 100)
    const razorpay = getRazorpay()

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `appt_${appointmentId}`.slice(0, 40),
      notes: {
        appointmentId: String(appointmentId),
        patientId: String(appointment.opdPatientId ?? ''),
        bookingId: `CBH-${appointmentId}`,
      },
    })

    // Store Razorpay order id in BANKNAME (varchar 45) until payment completes
    await prisma.appointmentPaymentDetails.create({
      data: {
        dayBookId: 0,
        appointmentId,
        paymentMethod: PAYMENT_METHOD_RAZORPAY,
        amount: amountInr,
        createdBy: systemUserId(),
        companyId: companyId(),
        financialYearId: financialYearId(),
        bankName: String(order.id).slice(0, 45),
        ccTransactionId: 'PENDING',
        transactionDate: transactionDateInt(),
        isRep: 1,
      },
    })

    res.json({
      orderId: order.id,
      amount: amountPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      appointmentId,
      bookingId: `CBH-${appointmentId}`,
      prefill: {
        name: appointment.patient?.name ?? '',
        email: appointment.patient?.emailId ?? '',
        contact: appointment.patient?.mobileNumber ?? appointment.patient?.phoneNumber ?? '',
      },
    })
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
})

paymentsRouter.post('/verify', async (req, res) => {
  try {
    const body = verifySchema.parse(req.body)

    const valid = verifyPaymentSignature({
      orderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
      signature: body.razorpay_signature,
    })

    if (!valid) {
      res.status(400).json({ error: 'Invalid payment signature' })
      return
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: body.appointmentId },
    })

    if (!appointment) {
      res.status(404).json({ error: 'Appointment not found' })
      return
    }

    const amountInr = toNumber(appointment.amount)
    const sys = systemUserId()

    await prisma.$transaction(async (tx) => {
      await tx.appointment.update({
        where: { id: body.appointmentId },
        data: {
          status: 1,
          amountReceived: amountInr,
          updatedBy: sys,
        },
      })

      const pending = await tx.appointmentPaymentDetails.findFirst({
        where: {
          appointmentId: body.appointmentId,
          paymentMethod: PAYMENT_METHOD_RAZORPAY,
          bankName: body.razorpay_order_id.slice(0, 45),
        },
        orderBy: { id: 'desc' },
      })

      if (pending) {
        await tx.appointmentPaymentDetails.update({
          where: { id: pending.id },
          data: {
            amount: amountInr,
            ccTransactionId: body.razorpay_payment_id.slice(0, 45),
            bankName: body.razorpay_order_id.slice(0, 45),
            updatedBy: sys,
            transactionDate: transactionDateInt(),
          },
        })
      } else {
        await tx.appointmentPaymentDetails.create({
          data: {
            dayBookId: 0,
            appointmentId: body.appointmentId,
            paymentMethod: PAYMENT_METHOD_RAZORPAY,
            amount: amountInr,
            createdBy: sys,
            updatedBy: sys,
            companyId: companyId(),
            financialYearId: financialYearId(),
            bankName: body.razorpay_order_id.slice(0, 45),
            ccTransactionId: body.razorpay_payment_id.slice(0, 45),
            transactionDate: transactionDateInt(),
            isRep: 1,
          },
        })
      }
    })

    res.json({
      ok: true,
      bookingId: `CBH-${body.appointmentId}`,
      appointmentId: body.appointmentId,
      paymentId: body.razorpay_payment_id,
      orderId: body.razorpay_order_id,
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

/** Confirm zero-amount or simulated bookings without Razorpay */
const confirmFreeSchema = z.object({
  appointmentId: z.coerce.number().int().positive(),
  simulatedPaymentId: z.string().max(45).optional(),
})

paymentsRouter.post('/confirm-free', async (req, res) => {
  try {
    const body = confirmFreeSchema.parse(req.body)
    const appointment = await prisma.appointment.findUnique({
      where: { id: body.appointmentId },
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

    const sys = systemUserId()
    const paymentId = (body.simulatedPaymentId ?? 'PAY_AT_HOSPITAL').slice(0, 45)

    await prisma.$transaction(async (tx) => {
      await tx.appointment.update({
        where: { id: body.appointmentId },
        data: {
          status: 1,
          amountReceived: amountInr > 0 ? amountInr : 0,
          updatedBy: sys,
        },
      })

      const existing = await tx.appointmentPaymentDetails.findFirst({
        where: { appointmentId: body.appointmentId },
      })

      if (!existing) {
        await tx.appointmentPaymentDetails.create({
          data: {
            dayBookId: 0,
            appointmentId: body.appointmentId,
            paymentMethod: amountInr > 0 ? PAYMENT_METHOD_RAZORPAY : PAYMENT_METHOD_CASH,
            amount: amountInr,
            createdBy: sys,
            companyId: companyId(),
            financialYearId: financialYearId(),
            bankName: amountInr > 0 ? 'SIMULATED' : 'PAY_AT_HOSPITAL',
            ccTransactionId: paymentId,
            transactionDate: transactionDateInt(),
            isRep: 1,
          },
        })
      }
    })

    res.json({
      ok: true,
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
