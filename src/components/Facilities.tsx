import { Link } from 'react-router-dom'
import { facilities } from '../data/hospital'
import { Reveal } from './Reveal'
import { IconArrowRight } from './Icons'

export function Facilities() {
  return (
    <section className="bg-[#f7f9fc] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-cura-orange">Facilities</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-cura-navy sm:text-4xl">
              Everything under one hospital roof
            </h2>
            <p className="mt-3 text-base leading-relaxed text-cura-slate">
              OPD, wards, pharmacy and lab — so families don’t run across the city for every step of care.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {facilities.map((item, index) => (
            <Reveal key={item.title} delay={index * 90}>
              <article className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="relative h-48 overflow-hidden">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 text-lg font-extrabold text-white">{item.title}</h3>
                </div>
                <p className="p-5 text-sm leading-relaxed text-cura-slate">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-8 text-center">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-sm font-bold text-cura-blue hover:text-cura-navy"
            >
              More about the hospital
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
