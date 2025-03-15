"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Video, Phone, MapPin, Plus } from "lucide-react"
import { NewAppointmentDialog } from "@/components/appointments/new-appointment-dialog"
import { useToast } from "@/components/ui/use-toast"
import { getUpcomingAppointments } from "@/lib/supabase-utils"

interface UpcomingAppointmentsProps {
  onSelectAppointment: (id: string) => void
}

export function UpcomingAppointments({ onSelectAppointment }: UpcomingAppointmentsProps) {
  const { toast } = useToast()
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false)
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const data = await getUpcomingAppointments()
        setAppointments(data)
      } catch (error) {
        console.error("Error fetching upcoming appointments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg animate-pulse">
                <div className="h-8 w-8 rounded-full bg-muted"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="flex gap-3">
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <div className="h-9 bg-muted rounded w-full"></div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => onSelectAppointment(appointment.id)}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    appointment.type === "video"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : appointment.type === "phone"
                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                  }`}
                >
                  {appointment.type === "video" && <Video className="h-4 w-4" />}
                  {appointment.type === "phone" && <Phone className="h-4 w-4" />}
                  {appointment.type === "in-person" && <MapPin className="h-4 w-4" />}
                </div>

                <div className="flex-1">
                  <h4 className="font-medium">{appointment.title}</h4>
                  <p className="text-sm text-muted-foreground">{appointment.provider}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(appointment.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No upcoming appointments</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={handleNewAppointment}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule New Appointment
        </Button>
      </CardFooter>

      <NewAppointmentDialog
        open={showNewAppointmentDialog}
        onOpenChange={setShowNewAppointmentDialog}
        onAppointmentCreated={handleAppointmentCreated}
      />
    </Card>
  )
}

