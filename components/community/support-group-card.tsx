"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Calendar, Users } from "lucide-react"
import type { SupportGroup, User } from "@/types/community"
import { supabase } from "@/lib/supabase"


interface SupportGroupCardProps {
  group: SupportGroup
  currentUser: User
  onGroupUpdate: (updatedGroup: SupportGroup) => void
}

export function SupportGroupCard({ group, currentUser, onGroupUpdate }: SupportGroupCardProps) {
  const { toast } = useToast()
  const [isJoining, setIsJoining] = useState(false)


  const handleJoinGroup = async () => {
    if (group.joined) return

    setIsJoining(true)

    try {
      // Add user to group members
      const { error } = await supabase.from("group_members").insert({
        group_id: group.id,
        user_id: currentUser.id,
      })

      if (error) throw error

      // Update group members count
      await supabase
        .from("support_groups")
        .update({ members_count: group.members_count + 1 })
        .eq("id", group.id)

      // Update UI
      onGroupUpdate({
        ...group,
        members_count: group.members_count + 1,
        joined: true,
      })

      toast({
        title: "Group joined",
        description: "You've successfully joined the group.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error joining group:", error)
      toast({
        title: "Error",
        description: "Failed to join group",
        variant: "destructive",
      })
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{group.name}</CardTitle>
          <Badge variant="outline">{group.active_now} online</Badge>
        </div>
        <CardDescription>{group.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{group.members_count} members</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{group.meeting_times}</span>
            </div>
          </div>

          <div className="flex -space-x-2">
            {Array.from({ length: Math.min(5, group.members_count) }).map((_, i) => (
              <Avatar key={i} className="h-8 w-8 border-2 border-background">
                <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${i + 1}`} />
                <AvatarFallback>U{i + 1}</AvatarFallback>
              </Avatar>
            ))}
            {group.members_count > 5 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                +{group.members_count - 5}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {group.joined ? (
          <Button variant="outline" className="w-full">
            View Group
          </Button>
        ) : (
          <Button className="w-full" onClick={handleJoinGroup} disabled={isJoining}>
            {isJoining ? "Joining..." : "Join Group"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

