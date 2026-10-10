import { Link } from 'react-router-dom'
import { hospital } from '../data/hospital'
import { IconPhone } from './Icons'

export function Footer() {
  return (
    <footer className="border-t border-cura-line bg-cura-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div>
          <Link to="/" aria-label="CuraBiz home">
            <img src={hospital.images.logoWhite} alt="CuraBiz" className="h-9 w-auto" />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">
            Private multi-specialty care with OPD, IPD, pharmacy, lab and billing on one patient journey.
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/55">Contact</p>
          <ul className="mt-4 space-y-3 text-sm text-white/85">
            <li>
              <a href={hospital.phoneHref} className="inline-flex items-center gap-2 hover:text-white">
                <IconPhone className="h-4 w-4 text-cura-orange" />
                {hospital.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${hospital.email}`} className="hover:text-white">
                {hospital.email}
              </a>
            </li>
            <li className="leading-relaxed">{hospital.address}</li>
            <li className="text-white/65">{hospital.hours}</li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/55">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-white/85">
            <li>
              <Link to="/departments" className="hover:text-white">
                Departments
              </Link>
            </li>
            <li>
              <Link to="/doctors" className="hover:text-white">
                Doctors
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-white">
                Services
              </Link>
            </li>
            <li>
              <Link to="/book" className="hover:text-white">
                Book appointment
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} CuraBiz · Private multi-specialty hospital, Jaipur
      </div>
    </footer>
  )
}
