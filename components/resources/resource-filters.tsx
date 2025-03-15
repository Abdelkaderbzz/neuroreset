"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ResourceFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  resourceType: string | null
  setResourceType: (type: string | null) => void
}

export function ResourceFilters({ searchQuery, setSearchQuery, resourceType, setResourceType }: ResourceFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-full md:w-auto">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search resources..."
          className="pl-8 w-full md:w-[200px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
            {resourceType && <span className="ml-1">: {resourceType}</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Resource Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setResourceType(null)}>All Types</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setResourceType("Article")}>Articles</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setResourceType("Video")}>Videos</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setResourceType("Audio")}>Audio</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setResourceType("Worksheet")}>Worksheets</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setResourceType("Book")}>Books</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

