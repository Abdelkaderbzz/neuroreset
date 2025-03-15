"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Video, Phone, MapPin, Edit, Trash2, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getAppointmentById } from "@/lib/supabase-utils"

interface AppointmentDetailsProps {
  appointmentId: string
  onClose: () => void
}

export function AppointmentDetails({ appointmentId, onClose }: AppointmentDetailsProps) {
  const { toast } = useToast()
  const [appointment, setAppointment] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAppointment() {
      try {
        const data = await getAppointmentById(appointmentId)
        setAppointment(data)
      } catch (error) {
        console.error(`Error fetching appointment with id ${appointmentId}:`, error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointment()
  }, [appointmentId])

  if (loading) {
    return (
      <Card>
        <CardHeader className="relative pb-2">
          <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
          <div className="h-6 bg-muted rounded w-24 mb-2"></div>
          <div className="h-6 bg-muted rounded w-3/4"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-32"></div>
              <div className="h-3 bg-muted rounded w-24"></div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="h-4 bg-muted rounded w-40"></div>
            <div className="h-4 bg-muted rounded w-36"></div>
          </div>

          <Separator />

          <div>
            <div className="h-5 bg-muted rounded w-20 mb-2"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4 mt-1"></div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="h-9 bg-muted rounded w-full"></div>
          <div className="flex gap-2 w-full">
            <div className="h-9 bg-muted rounded flex-1"></div>
            <div className="h-9 bg-muted rounded flex-1"></div>
          </div>
        </CardFooter>
      </Card>
    )
  }

  if (!appointment) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p>Appointment not found</p>
          <Button onClick={onClose} className="mt-4">
            Go Back
          </Button>
        </CardContent>
      </Card>
    )
  }

  const handleJoinMeeting = () => {
    if (appointment.joinLink) {
      window.open(appointment.joinLink, "_blank")
    } else if (appointment.phoneNumber) {
      toast({
        title: "Calling...",
        description: `Connecting to ${appointment.phoneNumber}`,
      })
    } else {
      toast({
        title: "Location Details",
        description: appointment.location,
      })
    }
  }

  const handleReschedule = () => {
    toast({
      title: "Reschedule",
      description: "Rescheduling functionality will be available soon.",
    })
  }

  const handleCancel = () => {
    toast({
      title: "Cancel Appointment",
      description: "Are you sure you want to cancel this appointment?",
      variant: "destructive",
    })
  }

  return (
    <Card>
      <CardHeader className="relative pb-2">
        <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
        <Badge className="w-fit mb-2">
          {appointment.type === "video" && "Video Call"}
          {appointment.type === "phone" && "Phone Call"}
          {appointment.type === "in-person" && "In Person"}
        </Badge>
        <CardTitle>{appointment.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
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
          <div>
            <div className="font-medium">{appointment.provider}</div>
            <div className="text-sm text-muted-foreground">{appointment.providerTitle}</div>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {new Date(appointment.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{appointment.time}</span>
          </div>
          {appointment.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{appointment.location}</span>
            </div>
          )}
          {appointment.phoneNumber && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{appointment.phoneNumber}</span>
            </div>
          )}
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-2">Notes</h4>
          <p className="text-sm text-muted-foreground">{appointment.notes}</p>
        </div>

        <div className="pt-2">
          <h4 className="font-medium mb-2">Reminders</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Email reminder:</span>
            <Badge variant="outline">1 hour before</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button className="w-full" onClick={handleJoinMeeting}>
          {appointment.type === "video" && "Join Video Call"}
          {appointment.type === "phone" && "Call Now"}
          {appointment.type === "in-person" && "View Location"}
        </Button>
        <div className="flex gap-2 w-full">
          <Button variant="outline" className="flex-1" onClick={handleReschedule}>
            <Edit className="h-4 w-4 mr-2" />
            Reschedule
          </Button>
          <Button variant="outline" className="flex-1 text-destructive hover:text-destructive" onClick={handleCancel}>
            <Trash2 className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

