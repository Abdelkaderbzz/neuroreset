"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Video, Music, FileSpreadsheet, BookOpen } from "lucide-react"
import { getSavedResources } from "@/lib/supabase-utils"

export function SavedResources() {
  const [savedResources, setSavedResources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSavedResources() {
      try {
        const data = await getSavedResources()
        setSavedResources(data)
      } catch (error) {
        console.error("Error fetching saved resources:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSavedResources()
  }, [])

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "Article":
        return <FileText className="h-4 w-4 text-blue-600" />
      case "Video":
        return <Video className="h-4 w-4 text-red-600" />
      case "Audio":
        return <Music className="h-4 w-4 text-green-600" />
      case "Worksheet":
        return <FileSpreadsheet className="h-4 w-4 text-purple-600" />
      case "Book":
        return <BookOpen className="h-4 w-4 text-amber-600" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg animate-pulse">
                <div className="h-8 w-8 rounded-full bg-muted"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
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
        <CardTitle>Saved Resources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {savedResources.length > 0 ? (
            savedResources.map((resource) => (
              <div key={resource.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  {getResourceIcon(resource.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{resource.title}</h4>
                  <p className="text-xs text-muted-foreground">{resource.author}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">No saved resources</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Saved Resources
        </Button>
      </CardFooter>
    </Card>
  )
}

