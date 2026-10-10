import { empanelments } from '../data/hospital'
import { Reveal } from './Reveal'

export function Empanelments() {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-cura-blue">Empanelments</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-cura-navy">Support for cashless & schemes</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-cura-slate">
              Front-desk assistance for common Indian hospital pathways — bring your documents when you visit.
            </p>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {empanelments.map((item, index) => (
            <Reveal key={item.name} delay={index * 80}>
              <div className="rounded-2xl border border-cura-line bg-gradient-to-b from-cura-ice to-white p-5 text-center shadow-sm">
                <p className="font-serif text-xl font-semibold text-cura-navy">{item.name}</p>
                <p className="mt-2 text-xs leading-relaxed text-cura-muted">{item.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
