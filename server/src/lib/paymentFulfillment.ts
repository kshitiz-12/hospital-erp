import { prisma } from './prisma'
import {
  APPOINTMENT_STATUS,
  PAYMENT_METHOD_RAZORPAY,
  PAYMENT_STATUS,
} from './razorpay'
import { companyId, financialYearId, systemUserId, toNumber, transactionDateInt } from '../utils/helpers'

export type FulfillResult =
  | {
      ok: true
      alreadyConfirmed: boolean
      appointmentId: number
      bookingId: string
      paymentId: string
      orderId: string
    }
  | { ok: false; reason: string; status: number }

/**
 * Idempotent payment fulfillment:
 * - Same payment id replay → success
 * - Already confirmed with different payment → conflict
 * - Conditional status flip (0 → 1) so concurrent verifies don't double-apply
 */
export async function fulfillRazorpayPayment(params: {
  appointmentId: number
  orderId: string
  paymentId: string
}): Promise<FulfillResult> {
  const orderId = params.orderId.slice(0, 45)
  const paymentId = params.paymentId.slice(0, 45)
  const sys = systemUserId()

  return prisma.$transaction(async (tx) => {
    const appointment = await tx.appointment.findUnique({
      where: { id: params.appointmentId },
      include: { payments: { orderBy: { id: 'desc' } } },
    })

    if (!appointment) {
      return { ok: false as const, reason: 'Appointment not found', status: 404 }
    }

    const amountInr = toNumber(appointment.amount)
    const existingPaid = appointment.payments.find(
      (p) =>
        p.paymentMethod === PAYMENT_METHOD_RAZORPAY &&
        p.ccTransactionId &&
        p.ccTransactionId !== PAYMENT_STATUS.PENDING,
    )

    // Replay: already confirmed with same payment id
    if (appointment.status === APPOINTMENT_STATUS.CONFIRMED) {
      if (existingPaid?.ccTransactionId === paymentId) {
        return {
          ok: true as const,
          alreadyConfirmed: true,
          appointmentId: appointment.id,
          bookingId: `CBH-${appointment.id}`,
          paymentId,
          orderId: existingPaid.bankName ?? orderId,
        }
      }
      return {
        ok: false as const,
        reason: 'Appointment is already paid with a different payment',
        status: 409,
      }
    }

    // Payment id must not be attached to another appointment
    const paymentElsewhere = await tx.appointmentPaymentDetails.findFirst({
      where: {
        ccTransactionId: paymentId,
        appointmentId: { not: params.appointmentId },
        paymentMethod: PAYMENT_METHOD_RAZORPAY,
      },
    })
    if (paymentElsewhere) {
      return {
        ok: false as const,
        reason: 'Payment already used on another appointment',
        status: 409,
      }
    }

    // Conditional confirm — wins the race once
    const flipped = await tx.appointment.updateMany({
      where: {
        id: params.appointmentId,
        status: APPOINTMENT_STATUS.PENDING_PAYMENT,
      },
      data: {
        status: APPOINTMENT_STATUS.CONFIRMED,
        amountReceived: amountInr,
        updatedBy: sys,
      },
    })

    if (flipped.count === 0) {
      const again = await tx.appointment.findUnique({
        where: { id: params.appointmentId },
        include: { payments: true },
      })
      const paid = again?.payments.find((p) => p.ccTransactionId === paymentId)
      if (again?.status === APPOINTMENT_STATUS.CONFIRMED && paid) {
        return {
          ok: true as const,
          alreadyConfirmed: true,
          appointmentId: params.appointmentId,
          bookingId: `CBH-${params.appointmentId}`,
          paymentId,
          orderId: paid.bankName ?? orderId,
        }
      }
      return {
        ok: false as const,
        reason: 'Could not confirm appointment (invalid status)',
        status: 409,
      }
    }

    const pending = await tx.appointmentPaymentDetails.findFirst({
      where: {
        appointmentId: params.appointmentId,
        paymentMethod: PAYMENT_METHOD_RAZORPAY,
        OR: [{ bankName: orderId }, { ccTransactionId: PAYMENT_STATUS.PENDING }],
      },
      orderBy: { id: 'desc' },
    })

    if (pending) {
      await tx.appointmentPaymentDetails.update({
        where: { id: pending.id },
        data: {
          amount: amountInr,
          bankName: orderId,
          ccTransactionId: paymentId,
          updatedBy: sys,
          transactionDate: transactionDateInt(),
        },
      })
    } else {
      await tx.appointmentPaymentDetails.create({
        data: {
          dayBookId: 0,
          appointmentId: params.appointmentId,
          paymentMethod: PAYMENT_METHOD_RAZORPAY,
          amount: amountInr,
          createdBy: sys,
          updatedBy: sys,
          companyId: companyId(),
          financialYearId: financialYearId(),
          bankName: orderId,
          ccTransactionId: paymentId,
          transactionDate: transactionDateInt(),
          isRep: 1,
        },
      })
    }

    return {
      ok: true as const,
      alreadyConfirmed: false,
      appointmentId: params.appointmentId,
      bookingId: `CBH-${params.appointmentId}`,
      paymentId,
      orderId,
    }
  })
}
