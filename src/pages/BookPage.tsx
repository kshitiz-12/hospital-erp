import { AppointmentBooking } from '../components/AppointmentBooking'
import { Empanelments } from '../components/Empanelments'
import { HowItWorks } from '../components/HowItWorks'
import { PageHero } from '../components/PageHero'

export function BookPage() {
  return (
    <>
      <PageHero
        eyebrow="Appointments"
        title="Book your consultation"
        subtitle="Doctor → service → date & time → details → pay. Specialisation and fees stay visible while you book."
        image="/images/dept-opd.jpg?v=4"
      />
      <div className="bg-[#f7f9fc]">
        <AppointmentBooking embedded />
      </div>
      <HowItWorks />
      <Empanelments />
    </>
  )
}
