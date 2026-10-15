import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { toNumber } from '../utils/helpers'

export const doctorsRouter = Router()

type DoctorRow = {
  empId: number
  firstName: string | null
  lastName: string | null
  qualification: string | null
  registrationNumber: string | null
  specialtyId: number | null
  visitDetails: {
    specialityId: number | null
    appointmentFee: { toString(): string } | null
    followUpFee: { toString(): string } | null
    onlineFee: { toString(): string } | null
    emergencyFee: { toString(): string } | null
    opdDays: string | null
    fromMorningTime: string | null
    toMorningTime: string | null
    fromAfternoonTime: string | null
    toAfternoonTime: string | null
    fromEveningTime: string | null
    toEveningTime: string | null
    degreeOne: string | null
    degreeTwo: string | null
    degreeThree: string | null
    degreeFour: string | null
    specialty: { id: number; name: string | null } | null
  } | null
}

function mapDoctor(row: DoctorRow) {
  const visit = row.visitDetails
  const name = [row.firstName, row.lastName].filter(Boolean).join(' ').trim() || `Doctor #${row.empId}`
  const degrees = [visit?.degreeOne, visit?.degreeTwo, visit?.degreeThree, visit?.degreeFour].filter(
    (d): d is string => Boolean(d),
  )
  const morning =
    visit?.fromMorningTime && visit?.toMorningTime
      ? `${visit.fromMorningTime} – ${visit.toMorningTime}`
      : null
  const afternoon =
    visit?.fromAfternoonTime && visit?.toAfternoonTime
      ? `${visit.fromAfternoonTime} – ${visit.toAfternoonTime}`
      : null
  const evening =
    visit?.fromEveningTime && visit?.toEveningTime
      ? `${visit.fromEveningTime} – ${visit.toEveningTime}`
      : null

  return {
    id: row.empId,
    name,
    firstName: row.firstName,
    lastName: row.lastName,
    qualification: row.qualification || degrees.join(', ') || null,
    registrationNumber: row.registrationNumber,
    specialtyId: visit?.specialityId ?? row.specialtyId,
    specialtyName: visit?.specialty?.name ?? null,
    fee: toNumber(visit?.appointmentFee),
    followUpFee: toNumber(visit?.followUpFee),
    onlineFee: toNumber(visit?.onlineFee),
    emergencyFee: toNumber(visit?.emergencyFee),
    opdDays: visit?.opdDays ?? null,
    available: morning ?? afternoon ?? evening,
    slots: { morning, afternoon, evening },
    degrees,
  }
}

doctorsRouter.get('/meta/specialties', async (_req, res) => {
  try {
    const specialties = await prisma.medicalSpecialty.findMany({
      orderBy: { id: 'asc' },
    })
    res.json({ specialties })
  } catch (err) {
    console.error('[GET /api/doctors/meta/specialties]', err)
    res.status(500).json({ error: 'Failed to load specialties' })
  }
})

doctorsRouter.get('/', async (_req, res) => {
  try {
    let rows = await prisma.userDetails.findMany({
      where: {
        status: { not: 0 },
        visitDetails: { isNot: null },
      },
      include: {
        visitDetails: { include: { specialty: true } },
      },
      orderBy: { empId: 'asc' },
    })

    if (rows.length === 0) {
      rows = await prisma.userDetails.findMany({
        where: { visitDetails: { isNot: null } },
        include: {
          visitDetails: { include: { specialty: true } },
        },
        orderBy: { empId: 'asc' },
      })
    }

    res.json({ doctors: rows.map(mapDoctor) })
  } catch (err) {
    console.error('[GET /api/doctors]', err)
    res.status(500).json({ error: 'Failed to load doctors' })
  }
})

doctorsRouter.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: 'Invalid doctor id' })
      return
    }

    const row = await prisma.userDetails.findUnique({
      where: { empId: id },
      include: {
        visitDetails: { include: { specialty: true } },
      },
    })

    if (!row || !row.visitDetails) {
      res.status(404).json({ error: 'Doctor not found' })
      return
    }

    res.json({ doctor: mapDoctor(row) })
  } catch (err) {
    console.error('[GET /api/doctors/:id]', err)
    res.status(500).json({ error: 'Failed to load doctor' })
  }
})
