import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import {
  companyId,
  financialYearId,
  genderToId,
  parseAppDate,
  systemUserId,
  toNumber,
  transactionDateInt,
} from '../utils/helpers'
import { PAYMENT_METHOD_CASH, PAYMENT_METHOD_RAZORPAY } from '../lib/razorpay'

export const appointmentsRouter = Router()

const createSchema = z.object({
  doctorId: z.coerce.number().int().positive(),
  appDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  appTime: z.string().min(1).max(45),
  patient: z.object({
    name: z.string().min(1).max(255),
    phone: z.string().regex(/^\d{10}$/),
    email: z.string().email().max(255),
    age: z.string().max(3).optional().default(''),
    gender: z.string().min(1),
    notes: z.string().max(2000).optional().default(''),
  }),
  serviceName: z.string().max(255).optional(),
  amount: z.coerce.number().min(0).optional(),
})

appointmentsRouter.post('/', async (req, res) => {
  try {
    const body = createSchema.parse(req.body)
    const doctor = await prisma.userDetails.findUnique({
      where: { empId: body.doctorId },
      include: { visitDetails: true },
    })

    if (!doctor || !doctor.visitDetails) {
      res.status(404).json({ error: 'Doctor not found' })
      return
    }

    const fee =
      body.amount != null
        ? body.amount
        : toNumber(doctor.visitDetails.appointmentFee)

    const sys = systemUserId()
    const company = companyId()
    const fy = financialYearId()
    const today = transactionDateInt()
    const appDate = parseAppDate(body.appDate)

    const sameDayCount = await prisma.appointment.count({
      where: { appDate },
    })

    const result = await prisma.$transaction(async (tx) => {
      const lastUhid = await tx.customer.aggregate({ _max: { uhid: true } })
      const nextUhid = (lastUhid._max.uhid ?? 1000) + 1

      const existing = await tx.customer.findFirst({
        where: {
          OR: [
            { mobileNumber: body.patient.phone },
            { phoneNumber: body.patient.phone },
            { emailId: body.patient.email },
          ],
        },
        orderBy: { id: 'desc' },
      })

      const patient =
        existing ??
        (await tx.customer.create({
          data: {
            name: body.patient.name.trim(),
            mobileNumber: body.patient.phone,
            phoneNumber: body.patient.phone,
            whatsapp: body.patient.phone,
            emailId: body.patient.email.trim().toLowerCase(),
            age: body.patient.age || null,
            genderId: genderToId(body.patient.gender),
            createdBy: sys,
            updatedBy: sys,
            status: 1,
            companyId: company,
            transactionDate: today,
            createdDate: new Date(),
            uhid: nextUhid,
            howDidYouHearAboutUs: 'Website',
          },
        }))

      if (existing) {
        await tx.customer.update({
          where: { id: existing.id },
          data: {
            name: body.patient.name.trim(),
            emailId: body.patient.email.trim().toLowerCase(),
            age: body.patient.age || existing.age,
            genderId: genderToId(body.patient.gender),
            updatedBy: sys,
            mobileNumber: body.patient.phone,
            phoneNumber: body.patient.phone,
            whatsapp: body.patient.phone,
          },
        })
      }

      const appointment = await tx.appointment.create({
        data: {
          financialYearId: fy,
          companyId: company,
          dayBookId: 0,
          discount: 0,
          amount: fee,
          appDate,
          appTime: body.appTime,
          ipdPatientId: 0,
          opdPatientId: patient.id,
          doctorId: body.doctorId,
          chiefComplaint: body.patient.notes?.slice(0, 2000) || null,
          referredBy: 0,
          createdBy: sys,
          updatedBy: sys,
          status: fee <= 0 ? 1 : 0,
          appointmentType: 1,
          serialNo: 0,
          dailySerialNo: sameDayCount + 1,
          comments: body.serviceName?.slice(0, 45) ?? null,
          amountReceived: fee <= 0 ? 0 : null,
        },
      })

      if (fee <= 0) {
        await tx.appointmentPaymentDetails.create({
          data: {
            dayBookId: 0,
            appointmentId: appointment.id,
            paymentMethod: PAYMENT_METHOD_CASH,
            amount: 0,
            createdBy: sys,
            companyId: company,
            financialYearId: fy,
            bankName: 'PAY_AT_HOSPITAL',
            ccTransactionId: 'FREE',
            transactionDate: today,
            isRep: 1,
          },
        })
      }

      return { appointment, patient, fee }
    })

    res.status(201).json({
      appointmentId: result.appointment.id,
      bookingId: `CBH-${result.appointment.id}`,
      patientId: result.patient.id,
      uhid: result.patient.uhid,
      amount: result.fee,
      status: result.appointment.status,
      requiresPayment: result.fee > 0,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid booking payload', details: err.flatten() })
      return
    }
    console.error('[POST /api/appointments]', err)
    res.status(500).json({ error: 'Failed to create appointment' })
  }
})

appointmentsRouter.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: 'Invalid appointment id' })
      return
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: { include: { visitDetails: { include: { specialty: true } } } },
        payments: true,
      },
    })

    if (!appointment) {
      res.status(404).json({ error: 'Appointment not found' })
      return
    }

    res.json({
      bookingId: `CBH-${appointment.id}`,
      appointment,
    })
  } catch (err) {
    console.error('[GET /api/appointments/:id]', err)
    res.status(500).json({ error: 'Failed to load appointment' })
  }
})
