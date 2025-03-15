"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Bookmark,
  BookmarkCheck,
  FileText,
  Video,
  Music,
  FileSpreadsheet,
  BookOpen,
  Clock,
  ExternalLink,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { ResourceViewDialog } from "@/components/resources/resource-view-dialog"
import { getResources } from "@/lib/supabase-utils"
import { supabase } from "@/lib/supabase"
import { SupabaseFallback } from "@/components/supabase-fallback"

interface ResourceGridProps {
  searchQuery: string
  selectedCategory: string | null
  resourceType: string | null
}

export function ResourceGrid({ searchQuery, selectedCategory, resourceType }: ResourceGridProps) {
  const { toast } = useToast()
  const [resources, setResources] = useState<any[]>([])
  const [savedResources, setSavedResources] = useState<string[]>([])
  const [selectedResource, setSelectedResource] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchResources() {
      setLoading(true)
      setError(null)

      try {
        const data = await getResources({
          searchQuery,
          category: selectedCategory,
          type: resourceType,
        })

        setResources(data)

        // Get saved resources
        const saved = data.filter((r) => r.saved).map((r) => r.id)
        setSavedResources(saved)
      } catch (err: any) {
        console.error("Error fetching resources:", err)
        setError(err.message || "Failed to load resources")
        setResources([])
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [searchQuery, selectedCategory, resourceType])

  const handleToggleSave = async (id: string) => {
    const resource = resources.find((r) => r.id === id)
    if (!resource) return

    const newSavedState = !savedResources.includes(id)

    try {
      // Update the resource in Supabase
      const { error } = await supabase.from("resources").update({ saved: newSavedState }).eq("id", id)

      if (error) throw error

      // Update local state
      if (newSavedState) {
        setSavedResources([...savedResources, id])
        toast({
          description: "Resource saved to your library",
        })
      } else {
        setSavedResources(savedResources.filter((resourceId) => resourceId !== id))
        toast({
          description: "Resource removed from saved items",
        })
      }
    } catch (err: any) {
      console.error("Error updating resource:", err)
      toast({
        title: "Error",
        description: "Failed to update resource",
        variant: "destructive",
      })
    }
  }

  const handleViewResource = (id: string) => {
    setSelectedResource(id)
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "Article":
        return <FileText className="h-5 w-5 text-blue-600" />
      case "Video":
        return <Video className="h-5 w-5 text-red-600" />
      case "Audio":
        return <Music className="h-5 w-5 text-green-600" />
      case "Worksheet":
        return <FileSpreadsheet className="h-5 w-5 text-purple-600" />
      case "Book":
        return <BookOpen className="h-5 w-5 text-amber-600" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  if (error) {
    return (
      <div className="py-8">
        <SupabaseFallback
          title="Could not load resources"
          message={`We encountered an error while loading resources: ${error}`}
        />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="h-6 bg-muted rounded w-24 mb-2"></div>
                <div className="h-8 w-8 rounded-full bg-muted"></div>
              </div>
              <div className="h-5 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full mb-4"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>

              <div className="flex items-center gap-3 mt-4">
                <div className="h-8 w-8 rounded-full bg-muted"></div>
                <div className="space-y-1">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-3 bg-muted rounded w-16"></div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="h-9 bg-muted rounded w-full"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.length > 0 ? (
          resources.map((resource) => (
            <Card key={resource.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="mb-2">
                    {resource.type}
                  </Badge>
                  <Button variant="ghost" size="icon" onClick={() => handleToggleSave(resource.id)} className="h-8 w-8">
                    {savedResources.includes(resource.id) ? (
                      <BookmarkCheck className="h-4 w-4 text-primary" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{resource.description}</p>

                <div className="flex items-center gap-3 mt-4">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    {getResourceIcon(resource.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{resource.author}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{resource.read_time}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => handleViewResource(resource.id)}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Resource
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No resources found</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              We couldn't find any resources matching your search criteria. Try adjusting your filters or search terms.
            </p>
            <Button
              onClick={() => {
                setSelectedResource(null)
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {selectedResource && (
        <ResourceViewDialog
          resourceId={selectedResource}
          open={!!selectedResource}
          onOpenChange={(open) => {
            if (!open) setSelectedResource(null)
          }}
          onSave={() => handleToggleSave(selectedResource)}
          isSaved={savedResources.includes(selectedResource)}
        />
      )}
    </>
  )
}

