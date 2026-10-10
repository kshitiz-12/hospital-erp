import { Doctors } from '../components/Doctors'
import { Empanelments } from '../components/Empanelments'
import { HowItWorks } from '../components/HowItWorks'
import { PageHero } from '../components/PageHero'
import { hospital } from '../data/hospital'

export function DoctorsPage() {
  return (
    <>
      <PageHero
        eyebrow="Doctors"
        title="Consultants with clear OPD days & fees"
        subtitle="Specialisation, experience, timings and consult charges — the details patients ask for before booking."
        image={hospital.images.about}
      />
      <Doctors showHeader={false} animate />
      <Empanelments />
      <HowItWorks />
    </>
  )
}
