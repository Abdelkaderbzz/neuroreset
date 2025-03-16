"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Calendar, Clock, Users } from "lucide-react"
import type { Event, User } from "@/types/community"
import { supabase } from "@/lib/supabase"


interface EventCardProps {
  event: Event
  currentUser: User
  onEventUpdate: (updatedEvent: Event) => void
}

export function EventCard({ event, currentUser, onEventUpdate }: EventCardProps) {
  const { toast } = useToast()
  const [isRegistering, setIsRegistering] = useState(false)


  const handleRegisterEvent = async () => {
    setIsRegistering(true)

    try {
      // Add user to event attendees
      const { error } = await supabase.from("event_attendees").insert({
        event_id: event.id,
        user_id: currentUser.id,
      })

      if (error) throw error

      // Update event attendees count
      await supabase
        .from("events")
        .update({ attendees_count: event.attendees_count + 1 })
        .eq("id", event.id)

      // Update UI
      onEventUpdate({
        ...event,
        attendees_count: event.attendees_count + 1,
      })

      toast({
        title: "Registration successful",
        description: "You've been registered for the event.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error registering for event:", error)
      toast({
        title: "Error",
        description: "Failed to register for event",
        variant: "destructive",
      })
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Hosted by: {event.host}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{event.attendees_count} attending</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleRegisterEvent} disabled={isRegistering}>
          {isRegistering ? "Registering..." : "Register"}
        </Button>
      </CardFooter>
    </Card>
  )
}

function MapPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

