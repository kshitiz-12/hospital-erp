import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { hospital } from '../data/hospital'
import { IconClose, IconMenu, IconPhone } from './Icons'

const links = [
  { to: '/departments', label: 'Departments' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isHome = pathname === '/'
  const transparent = isHome && !scrolled && !open

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        transparent
          ? 'bg-transparent'
          : 'border-b border-cura-line/80 bg-white/95 shadow-sm backdrop-blur-xl'
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center" onClick={() => setOpen(false)} aria-label="CuraBiz home">
          <img
            src={transparent ? hospital.images.logoWhite : hospital.images.logo}
            alt="CuraBiz"
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-lg px-2.5 py-1.5 text-[13px] font-semibold transition ${
                  transparent
                    ? isActive
                      ? 'bg-white/15 text-white'
                      : 'text-white/85 hover:bg-white/10 hover:text-white'
                    : isActive
                      ? 'bg-cura-ice text-cura-blue'
                      : 'text-cura-slate hover:bg-cura-ice hover:text-cura-blue'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={hospital.phoneHref}
            className={`hidden items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-semibold transition xl:inline-flex ${
              transparent
                ? 'border-white/30 bg-white/10 text-white hover:bg-white/20'
                : 'border-cura-line bg-white text-cura-navy hover:border-cura-blue/40'
            }`}
          >
            <IconPhone className={`h-3.5 w-3.5 ${transparent ? 'text-white' : 'text-cura-blue'}`} />
            {hospital.phone}
          </a>
          <Link
            to="/book"
            className="inline-flex items-center rounded-full bg-cura-orange px-3 py-1.5 text-xs font-bold text-white shadow-sm shadow-cura-orange/25 transition hover:bg-cura-orange-dark sm:px-3.5 sm:text-[13px]"
          >
            Book appointment
          </Link>
          <button
            type="button"
            className={`grid h-9 w-9 place-items-center rounded-lg border lg:hidden ${
              transparent
                ? 'border-white/30 bg-white/10 text-white'
                : 'border-cura-line bg-white text-cura-navy'
            }`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose className="h-4 w-4" /> : <IconMenu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-cura-line bg-white px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-semibold ${
                    isActive ? 'bg-cura-ice text-cura-blue' : 'text-cura-slate hover:bg-cura-ice'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-full bg-cura-orange px-3 py-2 text-center text-sm font-bold text-white"
            >
              Book appointment
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
