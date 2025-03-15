"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  Download,
  Share,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { getResourceById } from "@/lib/supabase-utils"

interface ResourceViewDialogProps {
  resourceId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
  isSaved: boolean
}

export function ResourceViewDialog({ resourceId, open, onOpenChange, onSave, isSaved }: ResourceViewDialogProps) {
  const [resource, setResource] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchResource() {
      if (!resourceId) return

      try {
        const data = await getResourceById(resourceId)
        setResource(data)
      } catch (error) {
        console.error(`Error fetching resource with id ${resourceId}:`, error)
      } finally {
        setLoading(false)
      }
    }

    if (open) {
      fetchResource()
    }
  }, [resourceId, open])

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

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="h-6 bg-muted rounded w-24 mb-2"></div>
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
          </DialogHeader>

          <div className="flex items-center gap-3 py-2">
            <div className="h-10 w-10 rounded-full bg-muted"></div>
            <div className="space-y-1">
              <div className="h-5 bg-muted rounded w-32"></div>
              <div className="h-3 bg-muted rounded w-24"></div>
            </div>
          </div>

          <Separator />

          <div className="py-2 space-y-2">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!resource) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{resource.type}</Badge>
            <Badge variant="outline">{resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}</Badge>
          </div>
          <DialogTitle className="text-xl mt-2">{resource.title}</DialogTitle>
          <DialogDescription>{resource.description}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 py-2">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            {getResourceIcon(resource.type)}
          </div>
          <div>
            <p className="font-medium">{resource.author}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{resource.readTime}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="py-2 whitespace-pre-line">{resource.content}</div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
          <Button onClick={onSave} className="w-full sm:w-auto">
            {isSaved ? (
              <>
                <BookmarkCheck className="h-4 w-4 mr-2" />
                Saved
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4 mr-2" />
                Save Resource
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

