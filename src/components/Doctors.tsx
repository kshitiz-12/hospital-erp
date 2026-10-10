import { Link } from 'react-router-dom'
import { doctors } from '../data/hospital'
import { IconArrowRight } from './Icons'
import { Reveal } from './Reveal'

type DoctorsProps = {
  limit?: number
  showHeader?: boolean
  animate?: boolean
}

export function Doctors({ limit, showHeader = true, animate = false }: DoctorsProps) {
  const items = limit ? doctors.slice(0, limit) : doctors

  return (
    <section className="bg-[#f7f9fc] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {showHeader &&
          (animate ? (
            <Reveal>
              <DoctorsHeader />
            </Reveal>
          ) : (
            <DoctorsHeader />
          ))}

        <div className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${showHeader ? 'mt-8' : ''}`}>
          {items.map((doctor, index) => {
            const card = (
              <article className="doctor-card group overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-sm">
                <div className="relative h-36 overflow-hidden bg-[#e8f2fb] sm:h-40">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="doctor-photo h-full w-full object-cover object-[center_18%]"
                  />
                </div>
                <div className="p-3.5">
                  <h3 className="text-sm font-extrabold text-cura-navy">{doctor.name}</h3>
                  <p className="mt-0.5 text-xs font-semibold text-cura-blue">{doctor.role}</p>
                  <p className="mt-0.5 text-[10px] text-cura-muted">{doctor.credentials}</p>
                  <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-[10px]">
                    <div className="rounded-lg bg-[#f7f9fc] px-2 py-1.5">
                      <p className="font-bold text-cura-muted">OPD</p>
                      <p className="font-semibold text-cura-navy">{doctor.opdDays}</p>
                    </div>
                    <div className="rounded-lg bg-[#fff4ec] px-2 py-1.5">
                      <p className="font-bold text-cura-muted">Fee</p>
                      <p className="font-semibold text-cura-navy">₹{doctor.fee}</p>
                    </div>
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {doctor.specialties.slice(0, 2).map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-cura-ice px-2 py-0.5 text-[10px] font-semibold text-cura-navy"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-cura-line pt-2.5">
                    <span className="text-[10px] font-medium text-cura-muted">{doctor.available}</span>
                    <div className="flex gap-2.5 text-xs font-bold">
                      <Link to={`/doctors/${doctor.id}`} className="text-cura-slate hover:text-cura-blue">
                        Profile
                      </Link>
                      <Link
                        to={`/book?doctor=${doctor.id}`}
                        className="text-cura-orange hover:text-cura-orange-dark"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            )

            return animate ? (
              <Reveal key={doctor.id} delay={index * 100}>
                {card}
              </Reveal>
            ) : (
              <div key={doctor.id}>{card}</div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function DoctorsHeader() {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-cura-blue">Doctors</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-cura-navy sm:text-4xl">
          Book the right consultant
        </h2>
        <p className="mt-3 text-base leading-relaxed text-cura-slate">
          Specialisation, OPD days, timings and fees — all visible before you book.
        </p>
      </div>
      <Link
        to="/doctors"
        className="inline-flex w-fit items-center gap-2 rounded-full bg-cura-blue px-5 py-3 text-sm font-bold text-white shadow-md shadow-cura-blue/25 transition hover:bg-cura-navy"
      >
        All doctors
        <IconArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
