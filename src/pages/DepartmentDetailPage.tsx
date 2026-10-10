import { Link, Navigate, useParams } from 'react-router-dom'
import { IconArrowRight, IconCheck, SpecialtyIcon } from '../components/Icons'
import { PageHero } from '../components/PageHero'
import { getSpecialty, specialties } from '../data/hospital'

export function DepartmentDetailPage() {
  const { id } = useParams()
  const dept = id ? getSpecialty(id) : undefined

  if (!dept) return <Navigate to="/departments" replace />

  const related = specialties.filter((s) => s.id !== dept.id).slice(0, 3)

  return (
    <>
      <PageHero eyebrow="Department" title={dept.title} subtitle={dept.longDescription} image={dept.image} />
      <section className="bg-[#f7f9fc] pb-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="rounded-3xl border border-[#e2e8f0] bg-white p-6 sm:p-8">
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-cura-blue to-cura-sky text-white">
              <SpecialtyIcon name={dept.icon} className="h-6 w-6" />
            </div>
            <h2 className="font-serif text-2xl font-semibold text-cura-navy">What patients get</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {dept.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-cura-slate">
                  <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-cura-blue/10 text-cura-blue">
                    <IconCheck className="h-3.5 w-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/book"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-cura-orange px-5 py-3 text-sm font-bold text-white hover:bg-cura-orange-dark"
            >
              Book appointment
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <aside className="rounded-3xl border border-[#e2e8f0] bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-cura-muted">Related departments</p>
            <ul className="mt-4 space-y-3">
              {related.map((item) => (
                <li key={item.id}>
                  <Link
                    to={`/departments/${item.id}`}
                    className="flex items-center gap-3 rounded-2xl border border-transparent bg-[#f7f9fc] p-3 transition hover:border-cura-blue/30"
                  >
                    <img src={item.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
                    <div>
                      <p className="text-sm font-bold text-cura-navy">{item.title}</p>
                      <p className="line-clamp-2 text-xs text-cura-muted">{item.description}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  )
}
