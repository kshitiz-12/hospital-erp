import { useState } from 'react'
import { faqs } from '../data/hospital'
import { Reveal } from './Reveal'

export function FaqSection() {
  const [open, setOpen] = useState(0)

  return (
    <section className="bg-[#f7f9fc] py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-cura-orange">FAQs</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-cura-navy">Before you visit</h2>
          </div>
        </Reveal>
        <div className="mt-8 space-y-3">
          {faqs.map((item, index) => {
            const active = open === index
            return (
              <Reveal key={item.q} delay={index * 60}>
                <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">
                  <button
                    type="button"
                    onClick={() => setOpen(active ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-bold text-cura-navy sm:text-base">{item.q}</span>
                    <span className="text-cura-blue">{active ? '−' : '+'}</span>
                  </button>
                  {active && (
                    <p className="border-t border-[#e2e8f0] px-5 py-4 text-sm leading-relaxed text-cura-slate">
                      {item.a}
                    </p>
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
