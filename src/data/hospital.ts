export type Doctor = {
  id: string
  name: string
  role: string
  credentials: string
  specialties: string[]
  experience: string
  fee: number
  image: string
  bio: string
  languages: string[]
  opdDays: string
  available: string
}

export type Service = {
  id: string
  name: string
  description: string
  duration: string
  fee: number
  category: string
  image: string
}

export type Specialty = {
  id: string
  title: string
  description: string
  longDescription: string
  icon: string
  image: string
  highlights: string[]
}

export const hospital = {
  name: 'Curabiz Hospital',
  tagline: 'Private multi-specialty hospital · Jaipur',
  phone: '+91 925 737 3668',
  phoneHref: 'tel:+919257373668',
  whatsappHref:
    'https://wa.me/919257373668?text=' +
    encodeURIComponent('Hello, I would like a WhatsApp consultation at Curabiz Hospital.'),
  email: 'info@slatebiz.com',
  address: 'DH-079, 1st Floor, Ansal Sushant City-1, Kalwar Road, Jaipur, Rajasthan 303706',
  hours: 'Mon – Sat: 9:00 AM – 8:00 PM · Sun: 9:00 AM – 2:00 PM',
  badges: ['Private multi-specialty', 'Cashless desk', 'In-house diagnostics', 'Specialist OPD'],
  images: {
    hero: '/images/hero-hospital.jpg?v=4',
    about: '/images/about-lobby.jpg?v=4',
    facility: '/images/facility-care.jpg?v=4',
    logo: '/images/curabiz-logo-nav.png',
    logoColor: '/images/curabiz-logo-color.png',
    logoWhite: '/images/curabiz-logo-white.png',
  },
}

export const stats = [
  {
    value: '15+',
    label: 'Years serving Jaipur families',
    end: 15,
    suffix: '+',
    format: 'plain' as const,
  },
  {
    value: '50,000+',
    label: 'Patients treated',
    end: 50000,
    suffix: '+',
    format: 'comma' as const,
  },
  {
    value: '25+',
    label: 'Specialist consultants',
    end: 25,
    suffix: '+',
    format: 'plain' as const,
  },
  {
    value: '24×7',
    label: 'Emergency & nursing support',
    end: 24,
    suffix: '×7',
    format: 'plain' as const,
  },
]

export const trustPoints = [
  'Private multi-specialty hospital with specialist OPD & admission',
  'In-house pharmacy and advanced diagnostics under one roof',
  'Dedicated nursing supervision for admitted patients',
  'Clear treatment plans with structured follow-up visits',
]

export const empanelments = [
  { name: 'CGHS', detail: 'Central Govt. Health Scheme pathways' },
  { name: 'RGHS', detail: 'Rajasthan Govt. Health Scheme support' },
  { name: 'Cashless', detail: 'TPA / insurance desk assistance' },
  { name: 'NABH-oriented', detail: 'Documentation habits for quality audits' },
]

export const facilities = [
  {
    title: 'OPD consultation rooms',
    body: 'Dedicated consulting chambers with token-based queue management.',
    image: '/images/dept-opd.jpg?v=4',
  },
  {
    title: 'Private & deluxe rooms',
    body: 'Comfortable rooms with nursing rounds and clear visiting hours.',
    image: '/images/dept-ipd.jpg?v=4',
  },
  {
    title: 'In-house pharmacy',
    body: 'Prescription-linked medicines available at the hospital counter.',
    image: '/images/dept-pharmacy.jpg?v=4',
  },
  {
    title: 'Pathology & diagnostics',
    body: 'Common lab investigations with reports attached to the patient file.',
    image: '/images/dept-lab.jpg?v=4',
  },
]

export const specialties: Specialty[] = [
  {
    id: 'medicine',
    title: 'General Medicine',
    description: 'Fever, diabetes, BP, infections and chronic adult care.',
    longDescription:
      'Our medicine OPD handles day-to-day illnesses and long-term conditions with clear prescriptions, lab advice and follow-up dates — the way Indian family clinics actually run.',
    icon: 'pulse',
    image: '/images/dept-opd.jpg?v=4',
    highlights: ['Diabetes & BP clinic', 'Infection management', 'Chronic disease follow-up', 'Health check review'],
  },
  {
    id: 'paeds',
    title: 'Paediatrics',
    description: 'Child health, vaccines, growth and common infections.',
    longDescription:
      'Paediatric OPD with growth tracking, immunisation guidance and parent counselling for infants and school-age children.',
    icon: 'heart',
    image: '/images/about-lobby.jpg?v=4',
    highlights: ['Vaccination advice', 'Growth monitoring', 'Respiratory infections', 'Nutrition counselling'],
  },
  {
    id: 'ortho',
    title: 'Orthopaedics',
    description: 'Joints, spine, fractures and sports injury care.',
    longDescription:
      'Orthopaedic consultations for joint pain, back problems and injury follow-ups, with X-ray coordination and rehab guidance.',
    icon: 'bone',
    image: '/images/facility-care.jpg?v=4',
    highlights: ['Joint pain clinic', 'Spine OPD', 'Fracture follow-up', 'Physio coordination'],
  },
  {
    id: 'gynae',
    title: 'Obstetrics & Gynaecology',
    description: 'Women’s health, pregnancy care and menstrual disorders.',
    longDescription:
      'Gynaecology OPD for menstrual issues, pregnancy check-ups and women’s wellness with respectful private consultation.',
    icon: 'leaf',
    image: '/images/dept-opd.jpg?v=4',
    highlights: ['Antenatal check-ups', 'PCOS support', 'Menstrual disorders', 'Women’s wellness'],
  },
  {
    id: 'cardiac',
    title: 'Cardiology',
    description: 'BP, chest pain evaluation and ECG-supported consults.',
    longDescription:
      'Cardiology OPD for hypertension, chest discomfort evaluation and ECG-supported consultation with lifestyle advice.',
    icon: 'shield',
    image: '/images/dept-ipd.jpg?v=4',
    highlights: ['ECG support', 'Hypertension clinic', 'Risk counselling', 'Follow-up care'],
  },
  {
    id: 'diagnostics',
    title: 'Diagnostics & Lab',
    description: 'Pathology tests with billing and report linkage.',
    longDescription:
      'Hospital pathology for routine blood work and investigations ordered during OPD or admission, with reports on the patient file.',
    icon: 'mind',
    image: '/images/dept-lab.jpg?v=4',
    highlights: ['Routine blood panels', 'Fasting packages', 'OPD & IPD samples', 'Report hand-over'],
  },
]

export const doctors: Doctor[] = [
  {
    id: 'dr-vikram',
    name: 'Dr. Vikram Malhotra',
    role: 'Consultant – General Medicine',
    credentials: 'M.B.B.S., M.D. (Medicine)',
    specialties: ['Diabetes', 'Hypertension', 'Fever & infections', 'Thyroid'],
    experience: '14 years',
    fee: 600,
    image: '/images/doctor-arjun.jpg?v=4',
    bio: 'Dr. Malhotra leads adult medicine OPD for chronic and acute conditions, with clear treatment plans and practical follow-ups for Jaipur families.',
    languages: ['English', 'Hindi'],
    opdDays: 'Mon – Sat',
    available: '10:00 AM – 2:00 PM',
  },
  {
    id: 'dr-ishita',
    name: 'Dr. Ishita Banerjee',
    role: 'Consultant – Paediatrics',
    credentials: 'M.B.B.S., M.D. (Paediatrics)',
    specialties: ['Vaccines', 'Growth', 'Respiratory', 'Nutrition'],
    experience: '11 years',
    fee: 700,
    image: '/images/doctor-neha.jpg?v=4',
    bio: 'Dr. Banerjee runs paediatric clinics with growth tracking, immunisation schedules and calm parent counselling.',
    languages: ['English', 'Hindi', 'Bengali'],
    opdDays: 'Mon – Sat',
    available: '11:00 AM – 3:00 PM',
  },
  {
    id: 'dr-manav',
    name: 'Dr. Manav Rathore',
    role: 'Consultant – Orthopaedics',
    credentials: 'M.B.B.S., M.S. (Ortho)',
    specialties: ['Joints', 'Spine', 'Sports injury', 'Fracture care'],
    experience: '16 years',
    fee: 800,
    image: '/images/doctor-rohan.jpg?v=4',
    bio: 'Dr. Rathore treats joint pain, sports injuries and spine complaints with structured OPD pathways and rehab coordination.',
    languages: ['English', 'Hindi', 'Rajasthani'],
    opdDays: 'Mon – Fri',
    available: '4:00 PM – 7:00 PM',
  },
  {
    id: 'dr-aisha',
    name: 'Dr. Aisha Qureshi',
    role: 'Consultant – Obstetrics & Gynaecology',
    credentials: 'M.B.B.S., M.S. (Obs & Gynae)',
    specialties: ['Pregnancy care', 'PCOS', 'Menstrual disorders', 'Women’s wellness'],
    experience: '13 years',
    fee: 750,
    image: '/images/doctor-kavita.jpg?v=4',
    bio: 'Dr. Qureshi provides respectful women’s health consultations, antenatal check-ups and PCOS-focused care.',
    languages: ['English', 'Hindi', 'Urdu'],
    opdDays: 'Tue – Sat',
    available: '10:30 AM – 1:30 PM',
  },
  {
    id: 'dr-rahul',
    name: 'Dr. Rahul Khanna',
    role: 'Consultant – Cardiology',
    credentials: 'M.B.B.S., M.D., D.M. (Cardiology)',
    specialties: ['BP clinic', 'ECG review', 'Chest pain eval', 'Lifestyle risk'],
    experience: '18 years',
    fee: 1000,
    image: '/images/doctor-suresh.jpg?v=4',
    bio: 'Dr. Khanna focuses on hypertension, ECG-supported evaluation and practical heart-risk counselling for adults.',
    languages: ['English', 'Hindi'],
    opdDays: 'Mon, Wed, Fri',
    available: '5:00 PM – 7:30 PM',
  },
]

export const services: Service[] = [
  {
    id: 'new-opd',
    name: 'New OPD Consultation',
    description: 'First visit registration, UHID creation and doctor consult.',
    duration: '30–40 min',
    fee: 0,
    category: 'OPD',
    image: '/images/dept-opd.jpg?v=4',
  },
  {
    id: 'follow-up',
    name: 'Follow-up Visit',
    description: 'Review visit with previous prescription available to the doctor.',
    duration: '15–25 min',
    fee: 0,
    category: 'OPD',
    image: '/images/service-followup.jpg?v=1',
  },
  {
    id: 'health-check',
    name: 'Basic Health Check',
    description: 'Common lab tests bundled with physician review.',
    duration: '60–90 min',
    fee: 1499,
    category: 'Package',
    image: '/images/dept-lab.jpg?v=4',
  },
  {
    id: 'tele-consult',
    name: 'Tele-consultation',
    description: 'Phone/video follow-up for registered patients.',
    duration: '15–20 min',
    fee: 300,
    category: 'Virtual',
    image: '/images/service-tele.jpg?v=1',
  },
]

export const bookingSteps = [
  { title: 'Choose doctor', body: 'See specialisation, OPD days and consult fee before you book.' },
  { title: 'Pick service & slot', body: 'Select new visit, follow-up or package and a convenient time.' },
  { title: 'Share patient details', body: 'Name, phone and basic history for smooth registration at the counter.' },
  { title: 'Pay & confirm', body: 'Pay securely and receive your booking confirmation.' },
]

export const faqs = [
  {
    q: 'Do I need to visit the hospital to book?',
    a: 'No. Book online, then arrive a little early for registration and token. Walk-ins are also welcome subject to slot availability.',
  },
  {
    q: 'Are reports and medicines available inside the hospital?',
    a: 'Yes. Common pathology tests and an in-house pharmacy support most OPD prescriptions under one roof.',
  },
  {
    q: 'Is cashless / insurance support available?',
    a: 'Our desk assists with cashless and empanelment pathways. Bring policy or empaneled ID documents when you visit.',
  },
  {
    q: 'What should I bring for a first visit?',
    a: 'Any previous prescriptions, lab reports, Aadhaar/ID and a list of current medicines. For children, bring the vaccine card if available.',
  },
]

export const timeSlots = [
  '09:30 AM',
  '10:15 AM',
  '11:00 AM',
  '11:45 AM',
  '12:30 PM',
  '02:00 PM',
  '02:45 PM',
  '03:30 PM',
  '04:15 PM',
  '05:00 PM',
  '05:45 PM',
  '06:30 PM',
]

export const testimonials = [
  {
    quote:
      'Registration to consult felt simple — token, fees and timing were clear before we sat in the waiting area.',
    name: 'Priya Sharma',
    detail: 'OPD · General Medicine',
  },
  {
    quote:
      'Pharmacy billed exactly what the doctor wrote. No confusion at the counter, and follow-up date was noted properly.',
    name: 'Karan Joshi',
    detail: 'Follow-up · Orthopaedics',
  },
  {
    quote:
      'For my son’s vaccines and growth check, the paediatrician explained everything calmly. Hospital felt clean and organised.',
    name: 'Anjali Verma',
    detail: 'Paediatrics · Jaipur',
  },
]

export function getDoctor(id: string) {
  return doctors.find((d) => d.id === id)
}

export function getSpecialty(id: string) {
  return specialties.find((s) => s.id === id)
}
