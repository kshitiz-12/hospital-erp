import { Link } from 'react-router-dom'
import { HowItWorks } from '../components/HowItWorks'
import { IconArrowRight } from '../components/Icons'
import { PageHero } from '../components/PageHero'
import { Reveal } from '../components/Reveal'
import { hospital, services } from '../data/hospital'

export function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Consults, packages and tele-follow-ups"
        subtitle="Clear durations and fee structure. Doctor consult charges are added when you book an appointment."
        image="/images/dept-opd.jpg?v=4"
      />
      <section className="bg-[#f7f9fc] pb-16 pt-4">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {services.map((service, index) => (
            <Reveal key={service.id} delay={index * 100}>
              <article className="service-card group overflow-hidden rounded-2xl border border-cura-line bg-white shadow-sm">
                <div className="relative h-44 overflow-hidden sm:h-48">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="service-photo h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cura-navy/55 via-cura-navy/10 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cura-blue shadow-sm">
                    {service.category}
                  </span>
                  <span className="absolute bottom-4 right-4 rounded-full bg-cura-orange px-3 py-1 text-xs font-bold text-white shadow-md">
                    {service.fee === 0 ? 'Doctor fee' : `₹${service.fee}`}
                  </span>
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-extrabold text-cura-navy transition group-hover:text-cura-blue">
                    {service.name}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-cura-slate">{service.description}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-cura-line pt-3">
                    <p className="text-xs font-semibold text-cura-muted">Duration · {service.duration}</p>
                    <Link
                      to="/book"
                      className="inline-flex items-center gap-1 text-xs font-bold text-cura-orange transition group-hover:gap-1.5 hover:text-cura-orange-dark"
                    >
                      Book
                      <IconArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <div className="mx-auto mt-10 max-w-6xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-sm text-cura-slate">
              Call{' '}
              <a href={hospital.phoneHref} className="font-bold text-cura-blue">
                {hospital.phone}
              </a>{' '}
              for package queries.
            </p>
            <Link
              to="/book"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-cura-orange px-6 py-3.5 text-sm font-bold text-white hover:bg-cura-orange-dark"
            >
              Book a service
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
      <HowItWorks />
    </>
  )
}
