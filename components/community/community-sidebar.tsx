"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle2, MessageCircle, TrendingUpIcon as Trending, Users } from "lucide-react"
import type { User } from "@/types/community"

interface CommunitySidebarProps {
  activeMembers: User[]
  communityStats: {
    totalMembers: number
    activeDiscussions: number
    upcomingEvents: number
    successStories: number
  }
  trendingTopics: Array<{
    tag: string
    count: number
  }>
}

export function CommunitySidebar({ activeMembers, communityStats, trendingTopics }: CommunitySidebarProps) {
  return (
    <div className="space-y-6">
      {/* Community Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>Community Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Total Members</span>
            </div>
            <span className="font-medium">{communityStats.totalMembers}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-600" />
              <span>Active Discussions</span>
            </div>
            <span className="font-medium">{communityStats.activeDiscussions}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <span>Upcoming Events</span>
            </div>
            <span className="font-medium">{communityStats.upcomingEvents}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-amber-600" />
              <span>Success Stories</span>
            </div>
            <span className="font-medium">{communityStats.successStories}</span>
          </div>
        </CardContent>
      </Card>

      {/* Trending Topics Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Trending className="h-5 w-5 text-blue-600" />
            <CardTitle>Trending Topics</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div key={index} className="flex items-center justify-between">
              <Badge variant="secondary" className="text-sm">
                #{topic.tag}
              </Badge>
              <span className="text-xs text-muted-foreground">{topic.count} posts</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Active Members Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Active Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={member.avatar_url} alt={member.name} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{member.name}</div>
                <div className="text-xs text-muted-foreground">{member.role}</div>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View All Members
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

