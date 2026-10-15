import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const specialties = [
  { id: 1, name: 'Gastroenterology' },
  { id: 2, name: 'Cardiology' },
  { id: 3, name: 'Dermatology' },
  { id: 15, name: 'Internal medicine' },
  { id: 16, name: 'Obstetrics and gynaecology' },
  { id: 21, name: 'Pediatrics' },
]

const doctors = [
  {
    empId: 10,
    firstName: 'Dr. Vikram',
    lastName: 'Malhotra',
    userId: 'dr.vikram',
    mobileNumber: '9829000001',
    userRole: 7,
    status: 1,
    specialtyId: 15,
    qualification: 'M.B.B.S., M.D. (Medicine)',
    registrationNumber: 'RJ-MED-1001',
    visit: {
      specialityId: 15,
      appointmentFee: 600,
      followUpFee: 400,
      onlineFee: 500,
      emergencyFee: 1200,
      opdDays: 'MON,TUE,WED,THU,FRI,SAT',
      fromMorningTime: '10:00 AM',
      toMorningTime: '2:00 PM',
      degreeOne: 'M.B.B.S.',
      degreeTwo: 'M.D. (Medicine)',
    },
  },
  {
    empId: 11,
    firstName: 'Dr. Ishita',
    lastName: 'Banerjee',
    userId: 'dr.ishita',
    mobileNumber: '9829000002',
    userRole: 7,
    status: 1,
    specialtyId: 21,
    qualification: 'M.B.B.S., M.D. (Paediatrics)',
    registrationNumber: 'RJ-PED-1002',
    visit: {
      specialityId: 21,
      appointmentFee: 700,
      followUpFee: 450,
      onlineFee: 550,
      emergencyFee: 1400,
      opdDays: 'MON,TUE,WED,THU,FRI,SAT',
      fromMorningTime: '11:00 AM',
      toMorningTime: '3:00 PM',
      degreeOne: 'M.B.B.S.',
      degreeTwo: 'M.D. (Paediatrics)',
    },
  },
  {
    empId: 12,
    firstName: 'Dr. Manav',
    lastName: 'Rathore',
    userId: 'dr.manav',
    mobileNumber: '9829000003',
    userRole: 7,
    status: 1,
    specialtyId: 15,
    qualification: 'M.B.B.S., M.S. (Ortho)',
    registrationNumber: 'RJ-ORT-1003',
    visit: {
      specialityId: 15,
      appointmentFee: 800,
      followUpFee: 500,
      onlineFee: 600,
      emergencyFee: 1500,
      opdDays: 'MON,TUE,WED,THU,FRI',
      fromEveningTime: '4:00 PM',
      toEveningTime: '7:00 PM',
      degreeOne: 'M.B.B.S.',
      degreeTwo: 'M.S. (Ortho)',
    },
  },
  {
    empId: 13,
    firstName: 'Dr. Aisha',
    lastName: 'Qureshi',
    userId: 'dr.aisha',
    mobileNumber: '9829000004',
    userRole: 7,
    status: 1,
    specialtyId: 16,
    qualification: 'M.B.B.S., M.S. (Obs & Gynae)',
    registrationNumber: 'RJ-GYN-1004',
    visit: {
      specialityId: 16,
      appointmentFee: 750,
      followUpFee: 500,
      onlineFee: 600,
      emergencyFee: 1500,
      opdDays: 'TUE,WED,THU,FRI,SAT',
      fromMorningTime: '10:30 AM',
      toMorningTime: '1:30 PM',
      degreeOne: 'M.B.B.S.',
      degreeTwo: 'M.S. (Obs & Gynae)',
    },
  },
  {
    empId: 14,
    firstName: 'Dr. Rahul',
    lastName: 'Khanna',
    userId: 'dr.rahul',
    mobileNumber: '9829000005',
    userRole: 7,
    status: 1,
    specialtyId: 2,
    qualification: 'M.B.B.S., M.D., D.M. (Cardiology)',
    registrationNumber: 'RJ-CAR-1005',
    visit: {
      specialityId: 2,
      appointmentFee: 1000,
      followUpFee: 700,
      onlineFee: 800,
      emergencyFee: 2000,
      opdDays: 'MON,WED,FRI',
      fromEveningTime: '5:00 PM',
      toEveningTime: '7:30 PM',
      degreeOne: 'M.B.B.S.',
      degreeTwo: 'M.D.',
      degreeThree: 'D.M. (Cardiology)',
    },
  },
]

async function main() {
  for (const s of specialties) {
    await prisma.medicalSpecialty.upsert({
      where: { id: s.id },
      update: { name: s.name },
      create: s,
    })
  }

  for (const d of doctors) {
    const { visit, ...user } = d
    await prisma.userDetails.upsert({
      where: { empId: user.empId },
      update: {
        firstName: user.firstName,
        lastName: user.lastName,
        mobileNumber: user.mobileNumber,
        phoneNumber: user.mobileNumber,
        status: user.status,
        userRole: user.userRole,
        specialtyId: user.specialtyId,
        qualification: user.qualification,
        registrationNumber: user.registrationNumber,
        companyId: 1,
        isRep: 1,
      },
      create: {
        empId: user.empId,
        firstName: user.firstName,
        lastName: user.lastName,
        userId: user.userId,
        mobileNumber: user.mobileNumber,
        phoneNumber: user.mobileNumber,
        status: user.status,
        userRole: user.userRole,
        specialtyId: user.specialtyId,
        qualification: user.qualification,
        registrationNumber: user.registrationNumber,
        companyId: 1,
        createdBy: 1,
        updatedBy: 1,
        isRep: 1,
        saltValue: 'website',
      },
    })

    await prisma.doctorVisitDetails.upsert({
      where: { doctorId: user.empId },
      update: visit,
      create: { doctorId: user.empId, ...visit },
    })
  }

  console.log(`Seeded ${specialties.length} specialties and ${doctors.length} doctors`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
