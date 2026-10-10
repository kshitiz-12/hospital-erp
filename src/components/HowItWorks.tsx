import { Link } from 'react-router-dom'
import { bookingSteps } from '../data/hospital'
import { Reveal } from './Reveal'
import { IconArrowRight } from './Icons'

export function HowItWorks() {
  return (
    <section className="bg-cura-navy py-16 text-white sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-cura-orange">How booking works</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">
                Same working appointment flow hospitals expect
              </h2>
            </div>
            <Link
              to="/book"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-cura-orange px-5 py-3 text-sm font-bold text-white hover:bg-cura-orange-dark"
            >
              Start booking
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {bookingSteps.map((step, index) => (
            <Reveal key={step.title} delay={index * 90}>
              <div className="h-full rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-cura-orange text-sm font-extrabold">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
