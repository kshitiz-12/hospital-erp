import { Link } from 'react-router-dom'
import { hospital } from '../data/hospital'
import { IconCheck } from './Icons'
import { Reveal } from './Reveal'

const points = [
  {
    title: 'Patient files in seconds',
    body: 'Pull records fast — even across large databases — so reception never waits on a freeze.',
  },
  {
    title: 'UHID at the front desk',
    body: 'Daily OPD auto-reset means staff stop maintaining thick paper registers.',
  },
  {
    title: 'Doctor → pharmacy loop',
    body: 'Prescriptions deduct stock and trigger billing. Discharge is not a reconciliation meeting.',
  },
  {
    title: 'Secure & ABDM-oriented',
    body: 'RBAC, audit logs and documentation habits oriented toward modern compliance.',
  },
]

export function WhyUs() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0">
        <img src={hospital.images.about} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(10,47,92,0.94)_0%,rgba(12,105,182,0.88)_55%,rgba(26,127,212,0.82)_100%)]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
        <Reveal>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">Why Curabiz</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              What makes Curabiz Hospital different
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/80">
              Not a generic ERP with medical labels — workflows built for Indian OPD, beds, eRx and pharmacy
              stock.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/book"
                className="inline-flex rounded-full bg-cura-orange px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/20 transition hover:bg-cura-orange-dark"
              >
                Schedule a visit
              </Link>
              <Link
                to="/about"
                className="inline-flex rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                About the hospital
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-3 sm:grid-cols-2">
          {points.map((point, index) => (
            <Reveal key={point.title} delay={index * 90}>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md transition hover:bg-white/15">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-cura-blue text-white">
                  <IconCheck className="h-4 w-4" />
                </span>
                <h3 className="mt-3 text-base font-bold text-white">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{point.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
