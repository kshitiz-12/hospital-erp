import { Reveal } from './Reveal'
import { IconCheck } from './Icons'
import { hospital, trustPoints } from '../data/hospital'

type TrustBandProps = {
  variant?: 'dark' | 'light'
}

export function TrustBand({ variant = 'light' }: TrustBandProps) {
  const light = variant === 'light'

  return (
    <section
      className={`py-12 sm:py-14 ${
        light
          ? 'bg-[#f7f9fc]'
          : 'bg-gradient-to-br from-cura-navy via-[#0d3b75] to-cura-blue'
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap gap-2">
            {hospital.badges.map((badge) => (
              <span
                key={badge}
                className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${
                  light
                    ? 'border-cura-blue/15 bg-white text-cura-blue shadow-sm'
                    : 'border-white/20 bg-white/10 text-white'
                }`}
              >
                {badge}
              </span>
            ))}
          </div>
          <h2
            className={`mt-4 max-w-3xl font-serif text-2xl font-semibold sm:text-3xl ${
              light ? 'text-cura-navy' : 'text-white'
            }`}
          >
            A private multi-specialty hospital in Jaipur — specialist-led care with organised OPD to discharge.
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {trustPoints.map((point, index) => (
            <Reveal key={point} delay={index * 70}>
              <div
                className={`flex items-start gap-3 rounded-2xl border px-4 py-3 transition hover:-translate-y-0.5 ${
                  light
                    ? 'border-cura-line bg-white shadow-sm hover:border-cura-blue/25 hover:shadow-md'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full bg-cura-orange text-white">
                  <IconCheck className="h-3.5 w-3.5" />
                </span>
                <p className={`text-sm leading-relaxed ${light ? 'text-cura-slate' : 'text-white/90'}`}>
                  {point}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
