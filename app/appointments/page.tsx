"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AppointmentCalendar } from "@/components/appointments/appointment-calendar"
import { AppointmentList } from "@/components/appointments/appointment-list"
import { AppointmentDetails } from "@/components/appointments/appointment-details"
import { UpcomingAppointments } from "@/components/appointments/upcoming-appointments"
import { AppointmentFilters } from "@/components/appointments/appointment-filters"

export default function AppointmentsPage() {
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)
  const [view, setView] = useState<"calendar" | "list">("calendar")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Appointments</h1>
            <p className="text-muted-foreground">Schedule and manage your therapy sessions</p>
          </div>
          <AppointmentFilters view={view} setView={setView} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {view === "calendar" ? (
              <AppointmentCalendar
                onSelectAppointment={setSelectedAppointment}
                selectedAppointment={selectedAppointment}
              />
            ) : (
              <AppointmentList onSelectAppointment={setSelectedAppointment} selectedAppointment={selectedAppointment} />
            )}
          </div>

          <div className="space-y-6">
            {selectedAppointment ? (
              <AppointmentDetails appointmentId={selectedAppointment} onClose={() => setSelectedAppointment(null)} />
            ) : (
              <UpcomingAppointments onSelectAppointment={setSelectedAppointment} />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

