"use client"

import { Button } from "@/components/ui/button"
import { Calendar, List, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AppointmentFiltersProps {
  view: "calendar" | "list"
  setView: (view: "calendar" | "list") => void
}

export function AppointmentFilters({ view, setView }: AppointmentFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-muted rounded-md p-1">
        <Button
          variant={view === "calendar" ? "default" : "ghost"}
          size="sm"
          onClick={() => setView("calendar")}
          className="px-3"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Calendar
        </Button>
        <Button
          variant={view === "list" ? "default" : "ghost"}
          size="sm"
          onClick={() => setView("list")}
          className="px-3"
        >
          <List className="h-4 w-4 mr-2" />
          List
        </Button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Filter Appointments</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Type</DropdownMenuLabel>
            <DropdownMenuItem>All Types</DropdownMenuItem>
            <DropdownMenuItem>Video Calls</DropdownMenuItem>
            <DropdownMenuItem>Phone Calls</DropdownMenuItem>
            <DropdownMenuItem>In-Person</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Provider</DropdownMenuLabel>
            <DropdownMenuItem>All Providers</DropdownMenuItem>
            <DropdownMenuItem>Dr. Sarah Johnson</DropdownMenuItem>
            <DropdownMenuItem>James Wilson</DropdownMenuItem>
            <DropdownMenuItem>Support Groups</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

