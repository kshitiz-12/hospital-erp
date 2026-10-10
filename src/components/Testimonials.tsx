import { testimonials } from '../data/hospital'

type TestimonialsProps = {
  variant?: 'light' | 'onDark'
}

export function Testimonials({ variant = 'light' }: TestimonialsProps) {
  const onDark = variant === 'onDark'

  return (
    <div>
      <div className="max-w-2xl">
        <p
          className={`text-xs font-bold uppercase tracking-[0.16em] ${
            onDark ? 'text-cura-orange' : 'text-cura-orange'
          }`}
        >
          Patient stories
        </p>
        <h2
          className={`mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl ${
            onDark ? 'text-white' : 'text-cura-navy'
          }`}
        >
          Families who trust Curabiz Hospital
        </h2>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {testimonials.map((t) => (
          <blockquote
            key={t.name}
            className={`flex h-full flex-col rounded-2xl border p-6 ${
              onDark
                ? 'border-white/15 bg-white/10 text-white backdrop-blur'
                : 'border-[#e2e8f0] bg-gradient-to-b from-[#f7f9fc] to-white'
            }`}
          >
            <p className={`flex-1 text-sm leading-relaxed ${onDark ? 'text-white/85' : 'text-cura-slate'}`}>
              “{t.quote}”
            </p>
            <footer className={`mt-5 border-t pt-4 ${onDark ? 'border-white/15' : 'border-cura-line'}`}>
              <p className={`text-sm font-extrabold ${onDark ? 'text-white' : 'text-cura-navy'}`}>{t.name}</p>
              <p className={`mt-0.5 text-xs font-medium ${onDark ? 'text-white/65' : 'text-cura-muted'}`}>
                {t.detail}
              </p>
            </footer>
          </blockquote>
        ))}
      </div>
    </div>
  )
}
