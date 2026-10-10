import { Empanelments } from '../components/Empanelments'
import { Facilities } from '../components/Facilities'
import { PageHero } from '../components/PageHero'
import { Specialties } from '../components/Specialties'
import { hospital } from '../data/hospital'

export function DepartmentsPage() {
  return (
    <>
      <PageHero
        eyebrow="Departments"
        title="Clinical departments for everyday Indian hospital care"
        subtitle="Medicine, paediatrics, orthopaedics, gynaecology, cardiology and diagnostics — organised for OPD to admission."
        image={hospital.images.hero}
      />
      <div className="bg-[#f7f9fc]">
        <Specialties showHeader={false} animate />
      </div>
      <Facilities />
      <Empanelments />
    </>
  )
}
