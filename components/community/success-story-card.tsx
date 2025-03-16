import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import type { SuccessStory } from "@/types/community"

interface SuccessStoryCardProps {
  story: SuccessStory
}

export function SuccessStoryCard({ story }: SuccessStoryCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage src={story.author?.avatar_url} alt={story.author?.name} />
            <AvatarFallback>{story.author?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{story.author?.name}</div>
            <Badge variant="outline" className="mt-1">
              {story.author?.badge} sober
            </Badge>
          </div>
        </div>
        <CardTitle>{story.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{story.excerpt}</p>
        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{story.read_time}</span>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="outline" className="w-full">
          Read Full Story
        </Button>
      </CardFooter>
    </Card>
  )
}

