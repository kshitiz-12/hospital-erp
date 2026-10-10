import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { doctors } from '../data/hospital'
import { IconArrowRight } from './Icons'
import { Reveal } from './Reveal'

export function DoctorCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % doctors.length)
    }, 4500)
    return () => window.clearInterval(id)
  }, [paused])

  const doctor = doctors[index]
  const prev = () => setIndex((i) => (i - 1 + doctors.length) % doctors.length)
  const next = () => setIndex((i) => (i + 1) % doctors.length)

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f3f7fb_0%,#ffffff_60%,#eef4fb_100%)] py-16 sm:py-20">
      <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-cura-orange/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-cura-blue/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-cura-blue">Our doctors</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-cura-navy sm:text-4xl">
                Specialist consultants you can book
              </h2>
              <p className="mt-3 text-base leading-relaxed text-cura-slate">
                Specialisation, OPD days, experience and fees — shown clearly before you choose a slot.
              </p>
            </div>
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 text-sm font-bold text-cura-blue hover:text-cura-navy"
            >
              View all doctors
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div
            className="mt-10 overflow-hidden rounded-[1.75rem] border border-cura-line bg-white shadow-xl shadow-cura-navy/10"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative min-h-[22rem] bg-cura-soft sm:min-h-[26rem]">
                <img
                  key={doctor.id}
                  src={doctor.image}
                  alt={doctor.name}
                  className="carousel-fade absolute inset-0 h-full w-full object-cover object-[center_18%]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cura-navy/75 to-transparent p-5 text-white lg:hidden">
                  <p className="font-extrabold">{doctor.name}</p>
                  <p className="text-sm text-white/85">{doctor.role}</p>
                </div>
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-cura-orange">
                    {index + 1} / {doctors.length}
                  </p>
                  <h3 className="mt-2 font-serif text-3xl font-semibold text-cura-navy">{doctor.name}</h3>
                  <p className="mt-1 text-base font-semibold text-cura-blue">{doctor.role}</p>
                  <p className="mt-1 text-sm text-cura-muted">{doctor.credentials}</p>
                  <p className="mt-4 text-sm leading-relaxed text-cura-slate">{doctor.bio}</p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <Spec label="Experience" value={doctor.experience} />
                    <Spec label="Consult fee" value={`₹${doctor.fee}`} />
                    <Spec label="OPD days" value={doctor.opdDays} />
                    <Spec label="Timings" value={doctor.available} />
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-cura-muted">Specialisation</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {doctor.specialties.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-[#fff4ec] px-3 py-1 text-xs font-bold text-cura-orange-dark"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-cura-line pt-5">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={prev}
                      className="rounded-full border border-cura-line px-4 py-2 text-sm font-bold text-cura-navy hover:bg-cura-soft"
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      className="rounded-full border border-cura-line px-4 py-2 text-sm font-bold text-cura-navy hover:bg-cura-soft"
                    >
                      Next
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/doctors/${doctor.id}`}
                      className="rounded-full border border-cura-line px-4 py-2.5 text-sm font-bold text-cura-navy hover:bg-cura-ice"
                    >
                      Full profile
                    </Link>
                    <Link
                      to={`/book?doctor=${doctor.id}`}
                      className="inline-flex items-center gap-2 rounded-full bg-cura-orange px-5 py-2.5 text-sm font-bold text-white hover:bg-cura-orange-dark"
                    >
                      Book appointment
                      <IconArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 border-t border-cura-line bg-cura-soft/70 px-4 py-3 sm:px-6">
              {doctors.map((d, i) => (
                <button
                  key={d.id}
                  type="button"
                  aria-label={`Show ${d.name}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 flex-1 rounded-full transition ${
                    i === index ? 'bg-cura-blue' : 'bg-cura-line hover:bg-cura-muted/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-cura-line bg-[#f7f9fc] px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-cura-muted">{label}</p>
      <p className="mt-1 text-sm font-bold text-cura-navy">{value}</p>
    </div>
  )
}
