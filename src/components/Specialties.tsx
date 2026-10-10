import { Link } from 'react-router-dom'
import { specialties } from '../data/hospital'
import { IconArrowRight } from './Icons'
import { Reveal } from './Reveal'

type SpecialtiesProps = {
  limit?: number
  showHeader?: boolean
  animate?: boolean
}

export function Specialties({ limit, showHeader = true, animate = false }: SpecialtiesProps) {
  const items = limit ? specialties.slice(0, limit) : specialties

  return (
    <section className="bg-transparent py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {showHeader &&
          (animate ? (
            <Reveal>
              <SpecialtiesHeader />
            </Reveal>
          ) : (
            <SpecialtiesHeader />
          ))}

        <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${showHeader ? 'mt-10' : ''}`}>
          {items.map((item, index) => {
            const card = (
              <Link
                to={`/departments/${item.id}`}
                className="group overflow-hidden rounded-2xl border border-cura-line bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cura-blue/30 hover:shadow-xl hover:shadow-cura-blue/10"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cura-navy/50 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-cura-navy group-hover:text-cura-blue">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cura-slate">{item.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-cura-blue">
                    Learn more
                    <IconArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            )

            return animate ? (
              <Reveal key={item.id} delay={index * 100}>
                {card}
              </Reveal>
            ) : (
              <div key={item.id}>{card}</div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function SpecialtiesHeader() {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-cura-blue">Departments</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-cura-navy sm:text-4xl">
          How Curabiz Hospital runs care
        </h2>
        <p className="mt-3 text-base leading-relaxed text-cura-slate">
          From front-desk tokens to discharge — organised the way hospitals actually work.
        </p>
      </div>
      <Link
        to="/departments"
        className="inline-flex items-center gap-2 text-sm font-bold text-cura-blue hover:text-cura-navy"
      >
        View all departments
        <IconArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
