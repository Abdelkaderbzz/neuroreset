"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, Phone, MapPin } from "lucide-react"
import { getAppointments } from "@/lib/supabase-utils"
import { SupabaseFallback } from "@/components/supabase-fallback"

interface AppointmentListProps {
  onSelectAppointment: (id: string | null) => void
  selectedAppointment: string | null
}

export function AppointmentList({ onSelectAppointment, selectedAppointment }: AppointmentListProps) {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAppointments() {
      setLoading(true)
      setError(null)

      try {
        const data = await getAppointments()
        setAppointments(data)
      } catch (err: any) {
        console.error("Error fetching appointments:", err)
        setError(err.message || "Failed to load appointments")
        setAppointments([])
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-4">
            <SupabaseFallback
              title="Could not load appointments"
              message={`We encountered an error while loading appointments: ${error}`}
            />
          </div>
        </CardContent>
      </Card>
    )
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
              <div key={index} className="flex items-start gap-4 p-4 border rounded-lg animate-pulse">
                <div className="h-10 w-10 rounded-full bg-muted"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="flex gap-4">
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
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
                className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedAppointment === appointment.id ? "border-primary bg-muted/50" : "hover:border-primary/50"
                }`}
                onClick={() => onSelectAppointment(appointment.id)}
              >
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    appointment.type === "video"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : appointment.type === "phone"
                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                  }`}
                >
                  {appointment.type === "video" && <Video className="h-5 w-5" />}
                  {appointment.type === "phone" && <Phone className="h-5 w-5" />}
                  {appointment.type === "in-person" && <MapPin className="h-5 w-5" />}
                </div>

                <div className="flex-1">
                  <h3 className="font-medium">{appointment.title}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(appointment.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm">{appointment.provider}</span>
                    <Badge variant="outline">
                      {appointment.type === "video" && "Video Call"}
                      {appointment.type === "phone" && "Phone Call"}
                      {appointment.type === "in-person" && "In Person"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No appointments found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

