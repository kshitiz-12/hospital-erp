import { Link } from 'react-router-dom'
import { DoctorCarousel } from '../components/DoctorCarousel'
import { Empanelments } from '../components/Empanelments'
import { Facilities } from '../components/Facilities'
import { FaqSection } from '../components/FaqSection'
import { Hero } from '../components/Hero'
import { HowItWorks } from '../components/HowItWorks'
import { IconArrowRight } from '../components/Icons'
import { Reveal } from '../components/Reveal'
import { Specialties } from '../components/Specialties'
import { Testimonials } from '../components/Testimonials'
import { TrustBand } from '../components/TrustBand'
import { hospital, stats } from '../data/hospital'

export function HomePage() {
  return (
    <>
      <Hero />

      <section className="relative z-10 -mt-10 px-4 sm:-mt-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 80}>
              <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xl shadow-cura-navy/10 transition hover:-translate-y-1 hover:shadow-2xl">
                <p className="font-serif text-2xl font-semibold text-cura-navy">{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-cura-muted">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <TrustBand />
      <Specialties limit={6} animate />
      <DoctorCarousel />
      <Facilities />
      <Empanelments />
      <HowItWorks />

      <section className="relative overflow-hidden py-16 sm:py-20">
        <img src={hospital.images.facility} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[#0a2f5c]/88" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Testimonials variant="onDark" />
          </Reveal>
        </div>
      </section>

      <FaqSection />

      <section className="bg-[#f7f9fc] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="cta-glow overflow-hidden rounded-[1.75rem] bg-gradient-to-r from-[#0a2f5c] via-cura-navy to-cura-blue px-6 py-10 text-white sm:px-10">
              <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                <div className="max-w-xl">
                  <h2 className="font-serif text-3xl font-semibold">Book your hospital visit today</h2>
                  <p className="mt-2 text-sm text-white/80">
                    Choose doctor, service and slot online, then pay to confirm.
                  </p>
                </div>
                <Link
                  to="/book"
                  className="inline-flex items-center gap-2 rounded-full bg-cura-orange px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-cura-orange-dark"
                >
                  Book appointment
                  <IconArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
