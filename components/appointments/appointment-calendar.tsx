"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { NewAppointmentDialog } from "@/components/appointments/new-appointment-dialog"

// Sample appointment data
const appointmentDates = [
  new Date(2025, 2, 15),
  new Date(2025, 2, 18),
  new Date(2025, 2, 22),
  new Date(2025, 2, 25),
  new Date(2025, 2, 29),
]

interface AppointmentCalendarProps {
  onSelectAppointment: (id: string | null) => void
  selectedAppointment: string | null
}

export function AppointmentCalendar({ onSelectAppointment, selectedAppointment }: AppointmentCalendarProps) {
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false)

  const handleDateSelect = (date: Date | undefined) => {
    setDate(date)

    // Check if the selected date has an appointment
    if (
      date &&
      appointmentDates.some(
        (d) =>
          d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear(),
      )
    ) {
      // Generate a fake appointment ID based on the date
      const appointmentId = `appt-${date.toISOString().split("T")[0]}`
      onSelectAppointment(appointmentId)
    } else {
      onSelectAppointment(null)
    }
  }

  const handleNewAppointment = () => {
    setShowNewAppointmentDialog(true)
  }

  const handleAppointmentCreated = () => {
    setShowNewAppointmentDialog(false)
    toast({
      title: "Appointment scheduled",
      description: "Your appointment has been successfully scheduled.",
      variant: "success",
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Appointment Calendar</CardTitle>
        <Button onClick={handleNewAppointment}>
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          className="rounded-md border"
          components={{
            DayContent: (props) => {
              const date = props.date
              const hasAppointment = appointmentDates.some(
                (d) =>
                  d.getDate() === date.getDate() &&
                  d.getMonth() === date.getMonth() &&
                  d.getFullYear() === date.getFullYear(),
              )

              return (
                <div className="relative h-9 w-9 p-0 font-normal aria-selected:opacity-100">
                  <div className="flex h-full w-full items-center justify-center">
                    {props.day}
                    {hasAppointment && (
                      <Badge className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full p-0" variant="default" />
                    )}
                  </div>
                </div>
              )
            },
          }}
        />

        <div className="mt-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Badge className="h-2 w-2 rounded-full p-0" />
            <span>Indicates days with scheduled appointments</span>
          </div>
        </div>
      </CardContent>

      <NewAppointmentDialog
        open={showNewAppointmentDialog}
        onOpenChange={setShowNewAppointmentDialog}
        onAppointmentCreated={handleAppointmentCreated}
        initialDate={date}
      />
    </Card>
  )
}

