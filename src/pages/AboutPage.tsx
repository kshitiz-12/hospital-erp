import { Link } from 'react-router-dom'
import { CountUp } from '../components/CountUp'
import { Empanelments } from '../components/Empanelments'
import { Facilities } from '../components/Facilities'
import { IconCheck } from '../components/Icons'
import { PageHero } from '../components/PageHero'
import { Reveal } from '../components/Reveal'
import { TrustBand } from '../components/TrustBand'
import { hospital, stats, trustPoints } from '../data/hospital'

const timeline = [
  {
    title: 'Built for Indian care teams',
    body: 'OPD tokens, UHID, beds, eRx and pharmacy — not a generic ERP with medical stickers.',
  },
  {
    title: 'One hospital record',
    body: 'When a doctor writes, pharmacy and billing already know. Families get clearer visits.',
  },
  {
    title: 'Jaipur-ready pathways',
    body: 'Documentation habits oriented toward quality audits and common scheme workflows.',
  },
]

export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Private multi-specialty care in Jaipur"
        subtitle="A practical hospital experience — organised front desk, specialist OPD and one patient journey from registration to discharge."
        image={hospital.images.about}
        variant="split"
      />

      <TrustBand variant="light" />

      <section className="overflow-hidden bg-[#f7f9fc] py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="group overflow-hidden rounded-[1.75rem] border border-cura-line shadow-lg shadow-cura-navy/5">
              <img
                src={hospital.images.facility}
                alt="Hospital corridor"
                className="h-72 w-full object-cover transition duration-700 group-hover:scale-105 lg:h-full"
              />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-[1.75rem] border border-cura-line bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-serif text-3xl font-semibold text-cura-navy">Our story</h2>
              <p className="mt-4 text-base leading-relaxed text-cura-slate">
                We are built around a simple idea: registration to discharge should feel like one continuous
                journey. Patients book online, doctors see prior context, and pharmacy or lab don’t retype what was
                already ordered.
              </p>
              <ul className="mt-5 space-y-2">
                {trustPoints.map((point, index) => (
                  <li
                    key={point}
                    className="about-point flex items-start gap-2 text-sm text-cura-slate"
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cura-blue/10 text-cura-blue">
                      <IconCheck className="h-3.5 w-3.5" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="mt-6 inline-flex rounded-full border border-cura-line bg-[#f7f9fc] px-5 py-3 text-sm font-bold text-cura-navy transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
              >
                Visit or contact us
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-3 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 90}>
              <div className="about-stat rounded-2xl border border-cura-line bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-cura-blue/30 hover:shadow-lg">
                <p className="font-serif text-3xl font-semibold text-cura-navy sm:text-4xl">
                  <CountUp
                    end={stat.end}
                    suffix={stat.suffix}
                    format={stat.format}
                    duration={1700 + index * 120}
                  />
                </p>
                <p className="mt-2 text-xs font-medium text-cura-muted">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-4 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {timeline.map((item, index) => (
            <Reveal key={item.title} delay={index * 110}>
              <article className="about-card h-full rounded-2xl border border-cura-line bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-cura-blue/30 hover:shadow-lg">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-cura-blue/10 text-cura-blue transition group-hover:scale-110">
                  <IconCheck className="h-4 w-4" />
                </span>
                <h3 className="mt-3 font-bold text-cura-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cura-slate">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <Facilities />
      <Empanelments />
    </>
  )
}
