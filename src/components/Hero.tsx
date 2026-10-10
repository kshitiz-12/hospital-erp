import { Link } from 'react-router-dom'
import { hospital } from '../data/hospital'
import { IconWhatsApp } from './Icons'

export function Hero() {
  return (
    <section className="relative min-h-[92svh] overflow-hidden bg-cura-navy">
      <div className="absolute inset-0">
        <img
          src={hospital.images.hero}
          alt="Hospital campus"
          className="hero-kenburns h-full w-full object-cover object-[center_40%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cura-navy/85 via-cura-navy/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-cura-navy/55 via-transparent to-cura-navy/30" />
      </div>

      <div className="relative mx-auto flex min-h-[92svh] max-w-6xl items-center px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="hero-line hero-line-1 text-sm font-bold uppercase tracking-[0.22em] text-cura-orange">
            Private multi-specialty · Jaipur
          </p>

          <h1 className="hero-line hero-line-2 mt-4 max-w-xl text-balance font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
            One patient journey. Registration to discharge.
          </h1>

          <p className="hero-line hero-line-3 mt-5 max-w-lg text-lg leading-relaxed text-white/88 sm:text-xl">
            Advanced OPD to discharge care — specialists, diagnostics and pharmacy under one organised roof.
          </p>

          <div className="hero-line hero-line-4 mt-9 flex flex-wrap items-center gap-3">
            <a
              href={hospital.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-black/20 transition hover:bg-[#1ebe57]"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white/15">
                <IconWhatsApp className="h-4 w-4" />
              </span>
              WhatsApp consultation
            </a>
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              Find a specialist
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f7f9fc] to-transparent" />
    </section>
  )
}
