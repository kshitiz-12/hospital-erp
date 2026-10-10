import { useState, type FormEvent } from 'react'
import { FaqSection } from '../components/FaqSection'
import { IconPhone } from '../components/Icons'
import { PageHero } from '../components/PageHero'
import { hospital } from '../data/hospital'

export function ContactPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !/^\d{10}$/.test(form.phone) || !form.email.includes('@') || !form.message.trim()) {
      return
    }
    setSent(true)
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to Curabiz Hospital"
        subtitle="Reach reception for OPD slots, packages or directions. We typically respond the same working day."
        image={hospital.images.hero}
      />

      <section className="bg-[#f7f9fc] pb-16 pt-2">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-[#e2e8f0]">
              <img src={hospital.images.about} alt="Hospital lobby" className="h-48 w-full object-cover" />
            </div>
            <div className="rounded-3xl border border-[#e2e8f0] bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-cura-muted">Phone</p>
              <a
                href={hospital.phoneHref}
                className="mt-2 inline-flex items-center gap-2 text-lg font-extrabold text-cura-navy hover:text-cura-blue"
              >
                <IconPhone className="h-5 w-5 text-cura-orange" />
                {hospital.phone}
              </a>
            </div>
            <div className="rounded-3xl border border-[#e2e8f0] bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-cura-muted">Email</p>
              <a href={`mailto:${hospital.email}`} className="mt-2 block font-bold text-cura-navy hover:text-cura-blue">
                {hospital.email}
              </a>
            </div>
            <div className="rounded-3xl border border-[#e2e8f0] bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-cura-muted">Address & hours</p>
              <p className="mt-2 text-sm leading-relaxed text-cura-slate">{hospital.address}</p>
              <p className="mt-3 text-sm font-semibold text-cura-muted">{hospital.hours}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-[#e2e8f0] bg-white p-6 shadow-xl shadow-cura-navy/5 sm:p-8">
            {sent ? (
              <div className="py-10 text-center">
                <h2 className="font-serif text-2xl font-semibold text-cura-navy">Message received</h2>
                <p className="mt-2 text-sm text-cura-slate">
                  Placeholder form only — wire this to your CRM or email API when ready.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false)
                    setForm({ name: '', phone: '', email: '', message: '' })
                  }}
                  className="mt-6 rounded-full bg-cura-blue px-5 py-3 text-sm font-bold text-white"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <h2 className="font-serif text-2xl font-semibold text-cura-navy">Send a message</h2>
                <Field label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="Your name" />
                <Field
                  label="Phone"
                  value={form.phone}
                  onChange={(v) => setForm((f) => ({ ...f, phone: v.replace(/\D/g, '').slice(0, 10) }))}
                  placeholder="10-digit mobile"
                />
                <Field
                  label="Email"
                  value={form.email}
                  onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                  placeholder="you@email.com"
                  type="email"
                />
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-cura-muted">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="How can we help?"
                    className="w-full rounded-2xl border border-cura-line bg-[#f7f9fc] px-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-cura-blue/30"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-cura-orange py-3.5 text-sm font-bold text-white hover:bg-cura-orange-dark"
                >
                  Submit message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      <FaqSection />
    </>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  type?: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-cura-muted">{label}</label>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-cura-line bg-[#f7f9fc] px-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-cura-blue/30"
      />
    </div>
  )
}
