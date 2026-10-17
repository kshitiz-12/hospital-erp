import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  doctors,
  getDoctor,
  services,
  type Doctor,
  type Service,
} from '../data/hospital'
import {
  formatOpdWeekdays,
  nextOpdDays,
  parseOpdWeekdays,
  slotsForAvailableWindow,
} from '../lib/opdSchedule'
import { bookAndPay } from '../lib/razorpay'
import { IconArrowRight, IconCalendar, IconCheck } from './Icons'

/** Maps marketing site doctor slugs → seeded EHR `userdetails.EMPID` */
const DOCTOR_DB_IDS: Record<string, number> = {
  'dr-vikram': 10,
  'dr-ishita': 11,
  'dr-manav': 12,
  'dr-aisha': 13,
  'dr-rahul': 14,
}

type Step = 1 | 2 | 3 | 4 | 5

type PatientForm = {
  name: string
  phone: string
  email: string
  age: string
  gender: string
  notes: string
}

const steps: { id: Step; label: string }[] = [
  { id: 1, label: 'Doctor' },
  { id: 2, label: 'Service' },
  { id: 3, label: 'Date & time' },
  { id: 4, label: 'Details' },
  { id: 5, label: 'Pay' },
]

const emptyPatient: PatientForm = {
  name: '',
  phone: '',
  email: '',
  age: '',
  gender: '',
  notes: '',
}

type AppointmentBookingProps = {
  embedded?: boolean
}

export function AppointmentBooking({ embedded = false }: AppointmentBookingProps) {
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState<Step>(1)
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [service, setService] = useState<Service | null>(null)
  const [date, setDate] = useState('')
  const [slot, setSlot] = useState('')
  const [patient, setPatient] = useState<PatientForm>(emptyPatient)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
  const [paymentCancelled, setPaymentCancelled] = useState(false)
  const [bookingId, setBookingId] = useState('')
  const [paymentId, setPaymentId] = useState('')

  useEffect(() => {
    const doctorId = searchParams.get('doctor')
    if (!doctorId) return
    const preselected = getDoctor(doctorId)
    if (preselected) {
      setDoctor(preselected)
      setStep(2)
    }
  }, [searchParams])

  // Clear date/slot when doctor changes so invalid picks don't stick
  useEffect(() => {
    setDate('')
    setSlot('')
  }, [doctor?.id])

  const dates = useMemo(
    () => (doctor ? nextOpdDays(doctor.opdDays, 7) : []),
    [doctor],
  )

  const availableSlots = useMemo(
    () => (doctor ? slotsForAvailableWindow(doctor.available, 30) : []),
    [doctor],
  )

  const opdDayLabel = useMemo(() => {
    if (!doctor) return ''
    const days = parseOpdWeekdays(doctor.opdDays)
    return days.size ? formatOpdWeekdays(days) : doctor.opdDays
  }, [doctor])

  // Drop selected date/slot if it no longer matches this doctor
  useEffect(() => {
    if (date && !dates.some((d) => d.value === date)) setDate('')
  }, [date, dates])

  useEffect(() => {
    if (slot && !availableSlots.includes(slot)) setSlot('')
  }, [slot, availableSlots])

  const totalFee = useMemo(() => {
    if (!doctor || !service) return 0
    return doctor.fee + service.fee
  }, [doctor, service])

  const canNext =
    (step === 1 && doctor) ||
    (step === 2 && service) ||
    (step === 3 && date && slot) ||
    (step === 4 &&
      patient.name.trim() &&
      /^\d{10}$/.test(patient.phone.trim()) &&
      patient.email.includes('@') &&
      patient.gender)

  function goNext() {
    setError('')
    setPaymentCancelled(false)
    if (!canNext) {
      setError('Please complete this step to continue.')
      return
    }
    setStep((s) => (s < 5 ? ((s + 1) as Step) : s))
  }

  function goBack() {
    setError('')
    setPaymentCancelled(false)
    setStep((s) => (s > 1 ? ((s - 1) as Step) : s))
  }

  async function confirmAndPay() {
    if (!doctor || !service || !date || !slot) return
    const doctorDbId = DOCTOR_DB_IDS[doctor.id]
    if (!doctorDbId) {
      setError('This doctor is not linked to the hospital database yet.')
      return
    }

    setPaying(true)
    setError('')
    setPaymentCancelled(false)

    const result = await bookAndPay({
      doctorId: doctorDbId,
      appDate: date,
      appTime: slot,
      amount: totalFee,
      serviceName: service.name,
      description: `${service.name} with ${doctor.name}`,
      patient: {
        name: patient.name.trim(),
        phone: patient.phone.trim(),
        email: patient.email.trim(),
        age: patient.age.trim(),
        gender: patient.gender,
        notes: patient.notes.trim(),
      },
    })

    setPaying(false)

    if (!result.ok) {
      if (result.cancelled) setPaymentCancelled(true)
      else setError(result.reason)
      return
    }

    setPaymentId(result.paymentId)
    setBookingId(result.bookingId)
  }

  function reset() {
    setStep(1)
    setDoctor(null)
    setService(null)
    setDate('')
    setSlot('')
    setPatient(emptyPatient)
    setError('')
    setPaymentCancelled(false)
    setBookingId('')
    setPaymentId('')
  }

  if (bookingId) {
    return (
      <section className={embedded ? 'bg-cura-soft pb-16' : 'bg-cura-soft py-16 sm:py-20'}>
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-cura-blue/20 bg-white p-8 text-center shadow-xl shadow-cura-blue/10">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-cura-blue text-white">
              <IconCheck className="h-8 w-8" />
            </div>
            <h2 className="mt-5 font-serif text-3xl font-semibold text-cura-navy">Appointment confirmed</h2>
            <p className="mt-2 text-sm text-cura-slate">
              Your appointment is saved in the hospital system. We will follow up on WhatsApp if needed.
            </p>
            <div className="mt-6 space-y-2 rounded-2xl bg-cura-soft p-5 text-left text-sm">
              <Row label="Booking ID" value={bookingId} />
              <Row label="Doctor" value={doctor?.name ?? ''} />
              <Row label="Service" value={service?.name ?? ''} />
              <Row label="When" value={`${date} · ${slot}`} />
              <Row label="Patient" value={patient.name} />
              <Row label="Amount" value={totalFee === 0 ? 'Pay at hospital' : `₹${totalFee}`} />
              <Row label="Payment" value={paymentId} />
            </div>
            <button
              type="button"
              onClick={reset}
              className="mt-6 rounded-full bg-cura-blue px-6 py-3 text-sm font-bold text-white hover:bg-cura-navy"
            >
              Book another
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`relative overflow-hidden bg-cura-soft ${embedded ? 'pb-16' : 'py-16 sm:py-20'}`}>
      {!embedded && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,_#dbeafe_0%,_transparent_70%)]" />
      )}

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {!embedded && (
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-cura-blue">Book appointment</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-cura-navy sm:text-4xl">
              Schedule in a few clear steps
            </h2>
            <p className="mt-3 text-base text-cura-slate">
              Doctor → service → slot → details → pay. Bookings save to the hospital EHR database.
            </p>
          </div>
        )}

        <div className={`${embedded ? '' : 'mt-8 '}grid gap-6 lg:grid-cols-[1fr_320px]`}>
          <div className="overflow-hidden rounded-3xl border border-cura-line bg-white shadow-xl shadow-cura-navy/5">
            <div className="border-b border-cura-line bg-gradient-to-r from-cura-ice to-white px-4 py-4 sm:px-6">
              <ol className="flex flex-wrap items-center gap-2">
                {steps.map((s, i) => {
                  const active = step === s.id
                  const done = step > s.id
                  return (
                    <li key={s.id} className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                          active
                            ? 'bg-cura-blue text-white'
                            : done
                              ? 'bg-cura-blue/10 text-cura-navy'
                              : 'bg-cura-soft text-cura-muted'
                        }`}
                      >
                        <span
                          className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${
                            active ? 'bg-white/20' : done ? 'bg-cura-blue text-white' : 'bg-white'
                          }`}
                        >
                          {done ? <IconCheck className="h-3 w-3" /> : s.id}
                        </span>
                        {s.label}
                      </span>
                      {i < steps.length - 1 && <span className="hidden h-px w-4 bg-cura-line sm:block" />}
                    </li>
                  )
                })}
              </ol>
            </div>

            <div className="p-4 sm:p-6">
              {step === 1 && (
                <div className="grid gap-3">
                  <h3 className="text-lg font-bold text-cura-navy">Choose your doctor</h3>
                  {doctors.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDoctor(d)}
                      className={`rounded-2xl border p-3 text-left transition sm:p-4 ${
                        doctor?.id === d.id
                          ? 'border-cura-blue bg-cura-ice ring-2 ring-cura-blue/20'
                          : 'border-cura-line hover:border-cura-blue/40'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={d.image}
                          alt={d.name}
                          className="h-16 w-16 shrink-0 rounded-xl object-cover object-[center_15%]"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-extrabold text-cura-navy">{d.name}</p>
                              <p className="text-sm font-semibold text-cura-blue">{d.role}</p>
                              <p className="mt-1 text-xs text-cura-muted">
                                {d.specialties.slice(0, 3).join(' · ')}
                              </p>
                              <p className="mt-1 text-[11px] font-semibold text-cura-slate">
                                {d.opdDays} · {d.available}
                              </p>
                            </div>
                            <span className="shrink-0 rounded-full bg-[#fff4ec] px-3 py-1 text-xs font-bold text-cura-orange-dark">
                              ₹{d.fee}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-3">
                  <h3 className="text-lg font-bold text-cura-navy">Select a service</h3>
                  {services.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setService(s)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        service?.id === s.id
                          ? 'border-cura-blue bg-cura-ice ring-2 ring-cura-blue/20'
                          : 'border-cura-line hover:border-cura-blue/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-extrabold text-cura-navy">{s.name}</p>
                          <p className="mt-1 text-sm text-cura-slate">{s.description}</p>
                          <p className="mt-2 text-xs font-semibold text-cura-muted">
                            {s.category} · {s.duration}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-cura-soft px-3 py-1 text-xs font-bold text-cura-navy">
                          {s.fee === 0 ? '+ doctor fee' : `+ ₹${s.fee}`}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {step === 3 && doctor && (
                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-cura-navy">
                    <IconCalendar className="h-5 w-5 text-cura-blue" />
                    Pick date & time
                  </h3>
                  <p className="mb-4 text-sm text-cura-slate">
                    {doctor.name}: OPD on <span className="font-semibold text-cura-navy">{opdDayLabel}</span>
                    {' · '}
                    <span className="font-semibold text-cura-navy">{doctor.available}</span>
                  </p>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-cura-muted">
                    OPD dates
                  </p>
                  {dates.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-cura-line bg-cura-soft/60 px-4 py-6 text-sm text-cura-slate">
                      No upcoming OPD dates found for this doctor in the next few weeks.
                    </p>
                  ) : (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {dates.map((d) => (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => {
                            setDate(d.value)
                            setSlot('')
                          }}
                          className={`min-w-[88px] rounded-2xl border px-3 py-3 text-center transition ${
                            date === d.value
                              ? 'border-cura-blue bg-cura-blue text-white'
                              : 'border-cura-line bg-white hover:border-cura-blue/40'
                          }`}
                        >
                          <span className="block text-xs font-bold">{d.label}</span>
                          <span className="mt-1 block text-sm font-semibold">{d.sub}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-cura-muted">
                    Available slots
                  </p>
                  {availableSlots.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-cura-line bg-cura-soft/60 px-4 py-6 text-sm text-cura-slate">
                      No time slots configured for this doctor&apos;s OPD hours.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {availableSlots.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSlot(t)}
                          className={`rounded-xl border px-2 py-2.5 text-xs font-bold transition sm:text-sm ${
                            slot === t
                              ? 'border-cura-blue bg-cura-blue text-white'
                              : 'border-cura-line text-cura-navy hover:border-cura-blue/50'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {step === 4 && (
                <div>
                  <h3 className="mb-4 text-lg font-bold text-cura-navy">Patient details</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                      label="Full name"
                      value={patient.name}
                      onChange={(v) => setPatient((p) => ({ ...p, name: v }))}
                      placeholder="As on ID"
                    />
                    <Field
                      label="Phone"
                      value={patient.phone}
                      onChange={(v) => setPatient((p) => ({ ...p, phone: v.replace(/\D/g, '').slice(0, 10) }))}
                      placeholder="10-digit mobile"
                    />
                    <Field
                      label="Email"
                      value={patient.email}
                      onChange={(v) => setPatient((p) => ({ ...p, email: v }))}
                      placeholder="you@email.com"
                      type="email"
                    />
                    <Field
                      label="Age"
                      value={patient.age}
                      onChange={(v) => setPatient((p) => ({ ...p, age: v.replace(/\D/g, '').slice(0, 3) }))}
                      placeholder="Years"
                    />
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-cura-muted">
                        Gender
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Female', 'Male', 'Other'].map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setPatient((p) => ({ ...p, gender: g }))}
                            className={`rounded-full border px-4 py-2 text-sm font-bold ${
                              patient.gender === g
                                ? 'border-cura-blue bg-cura-ice text-cura-blue'
                                : 'border-cura-line text-cura-slate'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-cura-muted">
                        Notes (optional)
                      </label>
                      <textarea
                        value={patient.notes}
                        onChange={(e) => setPatient((p) => ({ ...p, notes: e.target.value }))}
                        rows={3}
                        placeholder="Symptoms, preferred language, etc."
                        className="w-full rounded-2xl border border-cura-line bg-cura-soft/50 px-4 py-3 text-sm outline-none ring-cura-blue/30 focus:bg-white focus:ring-2"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && doctor && service && (
                <div>
                  <h3 className="mb-4 text-lg font-bold text-cura-navy">Review & pay</h3>
                  <div className="space-y-2 rounded-2xl bg-cura-soft p-5 text-sm">
                    <Row label="Doctor" value={doctor.name} />
                    <Row label="Service" value={service.name} />
                    <Row label="When" value={`${date} · ${slot}`} />
                    <Row label="Patient" value={`${patient.name} · ${patient.phone}`} />
                    <Row label="Consult fee" value={`₹${doctor.fee}`} />
                    <Row label="Service fee" value={service.fee === 0 ? 'Included' : `₹${service.fee}`} />
                    <div className="flex items-center justify-between border-t border-cura-line pt-3 text-base font-extrabold text-cura-navy">
                      <span>Total</span>
                      <span>{totalFee === 0 ? 'Pay at hospital' : `₹${totalFee}`}</span>
                    </div>
                  </div>
                  {paymentCancelled && (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-cura-line bg-white shadow-sm">
                      <div className="bg-gradient-to-r from-cura-navy to-cura-blue px-5 py-4 text-white">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
                          Checkout closed
                        </p>
                        <p className="mt-1 font-serif text-2xl font-semibold">No payment was taken</p>
                      </div>
                      <div className="space-y-3 px-5 py-4 text-sm text-cura-slate">
                        <p>
                          Your details are still here. Pay when you are ready, or step back and change the doctor,
                          time, or patient information.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <button
                            type="button"
                            onClick={confirmAndPay}
                            disabled={paying}
                            className="rounded-full bg-cura-orange px-4 py-2.5 text-sm font-bold text-white hover:bg-cura-orange-dark disabled:opacity-60"
                          >
                            {paying ? 'Opening checkout…' : `Pay ₹${totalFee}`}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentCancelled(false)
                              setStep(1)
                            }}
                            className="rounded-full border border-cura-line px-4 py-2.5 text-sm font-bold text-cura-navy hover:border-cura-blue/40"
                          >
                            Change details
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {!paymentCancelled && (
                  <button
                    type="button"
                    disabled={paying}
                    onClick={confirmAndPay}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cura-orange px-5 py-4 text-sm font-bold text-white shadow-lg shadow-cura-orange/25 transition hover:bg-cura-orange-dark disabled:opacity-60"
                  >
                    {paying
                      ? 'Processing…'
                      : totalFee === 0
                        ? 'Confirm appointment'
                        : `Pay ₹${totalFee} & confirm`}
                    {!paying && <IconArrowRight className="h-4 w-4" />}
                  </button>
                  )}
                </div>
              )}

              {error && <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>}

              {step < 5 && (
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-cura-line pt-4">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={step === 1}
                    className="rounded-full px-4 py-2.5 text-sm font-bold text-cura-slate disabled:opacity-30"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex items-center gap-2 rounded-full bg-cura-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-cura-navy"
                  >
                    Continue
                    <IconArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {step === 5 && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={goBack}
                    className="rounded-full px-4 py-2.5 text-sm font-bold text-cura-slate"
                  >
                    Back
                  </button>
                </div>
              )}
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-cura-line bg-white p-5 shadow-lg shadow-cura-navy/5 lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-cura-muted">Summary</p>
            <div className="mt-4 space-y-3 text-sm">
              <SummaryItem label="Doctor" value={doctor?.name ?? 'Not selected'} />
              <SummaryItem label="Service" value={service?.name ?? 'Not selected'} />
              <SummaryItem label="Slot" value={date && slot ? `${date} · ${slot}` : 'Not selected'} />
              <SummaryItem label="Patient" value={patient.name || 'Not filled'} />
            </div>
            <div className="mt-5 rounded-2xl bg-gradient-to-br from-cura-navy to-cura-blue p-4 text-white">
              <p className="text-xs font-semibold text-white/70">Estimated total</p>
              <p className="mt-1 font-serif text-3xl font-semibold">
                {doctor ? (totalFee === 0 ? 'At hospital' : `₹${totalFee}`) : '—'}
              </p>
              <p className="mt-2 text-xs text-white/75">Doctor fee + service add-ons</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  type?: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-cura-muted">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-cura-line bg-cura-soft/50 px-4 py-3 text-sm outline-none ring-cura-blue/30 focus:bg-white focus:ring-2"
      />
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-cura-muted">{label}</span>
      <span className="text-right font-semibold text-cura-navy">{value}</span>
    </div>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-cura-muted">{label}</p>
      <p className="mt-0.5 font-semibold text-cura-navy">{value}</p>
    </div>
  )
}
