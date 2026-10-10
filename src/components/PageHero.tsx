type PageHeroProps = {
  eyebrow: string
  title: string
  subtitle: string
  image?: string
  variant?: 'overlay' | 'split'
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  variant = 'overlay',
}: PageHeroProps) {
  if (image && variant === 'split') {
    return (
      <section className="bg-[#f7f9fc] pt-20 sm:pt-24">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-cura-blue">{eyebrow}</p>
            <h1 className="mt-2 max-w-xl font-serif text-4xl font-semibold tracking-tight text-cura-navy sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-cura-slate sm:text-lg">{subtitle}</p>
          </div>
          <div className="relative overflow-hidden rounded-[1.75rem] border border-cura-line shadow-xl shadow-cura-navy/10">
            <img src={image} alt="" className="h-64 w-full object-cover sm:h-80 lg:h-[22rem]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-cura-navy/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden pt-24">
      {image ? (
        <>
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-cura-navy/80 via-cura-navy/50 to-cura-navy/20" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f7f9fc] to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#d6e8f8_0%,_transparent_55%),linear-gradient(180deg,#f7f9fc_0%,#ffffff_80%)]" />
      )}

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-20">
        <p
          className={`text-xs font-bold uppercase tracking-[0.16em] ${
            image ? 'text-cura-orange' : 'text-cura-blue'
          }`}
        >
          {eyebrow}
        </p>
        <h1
          className={`mt-2 max-w-3xl font-serif text-4xl font-semibold tracking-tight sm:text-5xl ${
            image ? 'text-white' : 'text-cura-navy'
          }`}
        >
          {title}
        </h1>
        <p
          className={`mt-4 max-w-2xl text-base leading-relaxed sm:text-lg ${
            image ? 'text-white/90' : 'text-cura-slate'
          }`}
        >
          {subtitle}
        </p>
      </div>
    </section>
  )
}
