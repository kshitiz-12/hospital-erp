import { Link, Navigate, useParams } from 'react-router-dom'
import { IconArrowRight, IconCheck } from '../components/Icons'
import { getDoctor } from '../data/hospital'

export function DoctorDetailPage() {
  const { id } = useParams()
  const doctor = id ? getDoctor(id) : undefined

  if (!doctor) return <Navigate to="/doctors" replace />

  return (
    <section className="bg-[#f7f9fc] pt-16 sm:pt-[4.25rem]">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-4 sm:gap-5 sm:px-6 lg:h-[calc(100svh-4.25rem)] lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch lg:px-8 lg:py-5">
        <div className="overflow-hidden rounded-2xl border border-cura-line bg-cura-ice shadow-lg shadow-cura-navy/10 lg:h-full">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="h-56 w-full object-cover object-[center_18%] sm:h-72 lg:h-full lg:max-h-none"
          />
        </div>

        <div className="flex flex-col rounded-2xl border border-cura-line bg-white p-4 shadow-sm sm:p-5 lg:overflow-auto">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cura-blue">Doctor profile</p>
          <h1 className="mt-1 font-serif text-2xl font-semibold text-cura-navy sm:text-3xl">{doctor.name}</h1>
          <p className="mt-1 text-sm font-semibold text-cura-blue">{doctor.role}</p>
          <p className="text-xs text-cura-muted">{doctor.credentials}</p>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-cura-slate">{doctor.bio}</p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Info label="Experience" value={doctor.experience} />
            <Info label="Consult fee" value={`₹${doctor.fee}`} />
            <Info label="OPD days" value={doctor.opdDays} />
            <Info label="Timings" value={doctor.available} />
          </div>

          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-cura-muted">Specialisation</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {doctor.specialties.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-[#fff4ec] px-2.5 py-1 text-[11px] font-bold text-cura-orange-dark"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-cura-muted">Languages</p>
            {doctor.languages.map((lang) => (
              <span key={lang} className="inline-flex items-center gap-1 text-xs font-semibold text-cura-slate">
                <IconCheck className="h-3.5 w-3.5 text-cura-blue" />
                {lang}
              </span>
            ))}
          </div>

          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            <Link
              to={`/book?doctor=${doctor.id}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-cura-orange px-4 py-2 text-xs font-bold text-white hover:bg-cura-orange-dark sm:text-sm"
            >
              Book this doctor
              <IconArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/doctors"
              className="inline-flex items-center rounded-full border border-cura-line bg-[#f7f9fc] px-4 py-2 text-xs font-bold text-cura-navy hover:bg-white sm:text-sm"
            >
              All doctors
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-cura-line bg-[#f7f9fc] px-3 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-cura-muted">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-cura-navy">{value}</p>
    </div>
  )
}
