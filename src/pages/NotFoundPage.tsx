import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 pt-24">
      <div className="max-w-md text-center">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-cura-blue">404</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-cura-navy">Page not found</h1>
        <p className="mt-3 text-sm text-cura-slate">That link doesn’t exist on Curabiz Hospital.</p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-cura-blue px-5 py-3 text-sm font-bold text-white hover:bg-cura-navy"
        >
          Back home
        </Link>
      </div>
    </section>
  )
}
