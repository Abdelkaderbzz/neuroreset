"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Heart,
  MessageCircle,
  MoreHorizontal,
  PenSquare,
  Plus,
  Search,
  Share,
  TrendingUpIcon as Trending,
  Users,
} from "lucide-react"

// Sample data for community posts
const communityPosts = [
  {
    id: "post1",
    author: {
      name: "Michael S.",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Member",
      badge: "30 Days",
    },
    content:
      "Just completed my first month sober! It hasn't been easy, but the support from this community has been incredible. Special thanks to my sponsor James and everyone in the Alcohol Recovery group for the encouragement.",
    time: "2 hours ago",
    likes: 24,
    comments: 8,
    liked: false,
    tags: ["Milestone", "Gratitude"],
  },
  {
    id: "post2",
    author: {
      name: "Dr. Emily Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Therapist",
      badge: "Expert",
    },
    content:
      "Reminder: Stress is a common trigger for many in recovery. Here are 3 quick techniques you can use anywhere:\n\n1. Box breathing: Inhale for 4, hold for 4, exhale for 4, hold for 4\n2. 5-4-3-2-1 grounding: Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste\n3. Progressive muscle relaxation: Tense and release each muscle group\n\nWhat techniques work best for you?",
    time: "5 hours ago",
    likes: 42,
    comments: 15,
    liked: true,
    tags: ["Coping Strategies", "Stress Management"],
  },
  {
    id: "post3",
    author: {
      name: "Jessica T.",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Member",
      badge: "1 Year",
    },
    content:
      "Found this amazing meditation app that's been helping me stay centered. It has specific meditations for addiction recovery and dealing with cravings. Happy to share more details if anyone's interested!",
    time: "Yesterday",
    likes: 18,
    comments: 7,
    liked: false,
    tags: ["Resources", "Meditation"],
  },
  {
    id: "post4",
    author: {
      name: "Support Group",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Announcement",
      badge: "Official",
    },
    content:
      "📢 New virtual support group meeting added! Join us every Thursday at 7 PM for our 'Young Adults in Recovery' session. This group is specifically for those aged 18-30 navigating recovery. Register through the Events tab.",
    time: "2 days ago",
    likes: 31,
    comments: 5,
    liked: false,
    tags: ["Announcement", "Support Group"],
  },
]

// Sample data for upcoming events
const upcomingEvents = [
  {
    id: "event1",
    title: "Mindfulness Workshop",
    description: "Learn practical mindfulness techniques for recovery",
    date: "March 20, 2025",
    time: "6:00 PM - 7:30 PM",
    location: "Virtual (Zoom)",
    attendees: 18,
    host: "Dr. Sarah Johnson",
  },
  {
    id: "event2",
    title: "Weekend Wellness Retreat",
    description: "A day of self-care, meditation, and community",
    date: "March 25, 2025",
    time: "9:00 AM - 4:00 PM",
    location: "Serenity Gardens",
    attendees: 24,
    host: "Recovery Center",
  },
  {
    id: "event3",
    title: "Family Support Session",
    description: "For family members of those in recovery",
    date: "March 27, 2025",
    time: "7:00 PM - 8:30 PM",
    location: "Virtual (Zoom)",
    attendees: 12,
    host: "Lisa Rodriguez, LCSW",
  },
]

// Sample data for success stories
const successStories = [
  {
    id: "story1",
    author: {
      name: "Robert K.",
      avatar: "/placeholder.svg?height=60&width=60",
      sobrietyTime: "2 years",
    },
    title: "Finding Purpose After Addiction",
    excerpt:
      "After struggling with alcohol addiction for over a decade, I found a new purpose through volunteering and helping others in recovery...",
    readTime: "5 min read",
  },
  {
    id: "story2",
    author: {
      name: "Sarah L.",
      avatar: "/placeholder.svg?height=60&width=60",
      sobrietyTime: "18 months",
    },
    title: "Rebuilding Family Relationships",
    excerpt:
      "The hardest part of my recovery was repairing the relationships with my family. Through patience, therapy, and consistent effort...",
    readTime: "7 min read",
  },
  {
    id: "story3",
    author: {
      name: "David M.",
      avatar: "/placeholder.svg?height=60&width=60",
      sobrietyTime: "3 years",
    },
    title: "From Rock Bottom to Recovery Coach",
    excerpt:
      "Three years ago, I was homeless and hopeless. Today, I'm a certified recovery coach helping others find their path...",
    readTime: "10 min read",
  },
]

// Sample data for support groups
const supportGroups = [
  {
    id: "group1",
    name: "Alcohol Recovery",
    members: 128,
    activeNow: 12,
    description: "Support for those recovering from alcohol addiction",
    meetingTimes: "Mon, Wed, Fri at 7 PM",
    joined: true,
  },
  {
    id: "group2",
    name: "Mindfulness Practice",
    members: 95,
    activeNow: 8,
    description: "Daily mindfulness and meditation for recovery",
    meetingTimes: "Daily at 8 AM",
    joined: true,
  },
  {
    id: "group3",
    name: "Family Support",
    members: 76,
    activeNow: 5,
    description: "For family members of those in recovery",
    meetingTimes: "Tuesdays at 6 PM",
    joined: false,
  },
  {
    id: "group4",
    name: "Young Adults",
    members: 112,
    activeNow: 15,
    description: "Recovery support for ages 18-30",
    meetingTimes: "Thursdays at 7 PM",
    joined: false,
  },
]

export default function CommunityPage() {
  const { toast } = useToast()
  const [posts, setPosts] = useState(communityPosts)
  const [newPostContent, setNewPostContent] = useState("")
  const [isPostingComment, setIsPostingComment] = useState<string | null>(null)
  const [commentText, setCommentText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPosts, setFilteredPosts] = useState(posts)

  // Filter posts based on search query
  useEffect(() => {
    if (searchQuery) {
      setFilteredPosts(
        posts.filter(
          (post) =>
            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
        ),
      )
    } else {
      setFilteredPosts(posts)
    }
  }, [searchQuery, posts])

  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
            liked: !post.liked,
          }
        }
        return post
      }),
    )
  }

  const handleCommentSubmit = (postId: string) => {
    if (!commentText.trim()) return

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments + 1,
          }
        }
        return post
      }),
    )

    setIsPostingComment(null)
    setCommentText("")

    toast({
      title: "Comment posted",
      description: "Your comment has been added to the discussion.",
      variant: "success",
    })
  }

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return

    const newPost = {
      id: `post${posts.length + 1}`,
      author: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Member",
        badge: "7 Days",
      },
      content: newPostContent,
      time: "Just now",
      likes: 0,
      comments: 0,
      liked: false,
      tags: [],
    }

    setPosts([newPost, ...posts])
    setNewPostContent("")

    toast({
      title: "Post created",
      description: "Your post has been shared with the community.",
      variant: "success",
    })
  }

  const handleJoinGroup = (groupId: string) => {
    // In a real app, this would make an API call to join the group
    toast({
      title: "Group joined",
      description: "You've successfully joined the group.",
      variant: "success",
    })
  }

  const handleRegisterEvent = (eventId: string) => {
    // In a real app, this would make an API call to register for the event
    toast({
      title: "Registration successful",
      description: "You've been registered for the event.",
      variant: "success",
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Community</h1>
            <p className="text-muted-foreground">Connect with peers and experts on your recovery journey</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search community..."
                className="pl-8 w-full md:w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
          </div>
        </div>

        <Tabs defaultValue="feed">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="stories">Success Stories</TabsTrigger>
          </TabsList>

          {/* Feed Tab */}
          <TabsContent value="feed" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                {/* Create Post Card */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Your Avatar" />
                        <AvatarFallback>AJ</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <textarea
                          className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Share something with the community..."
                          rows={3}
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                        ></textarea>
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Plus className="h-4 w-4 mr-1" />
                              Tag
                            </Button>
                            <Button variant="outline" size="sm">
                              <ImageIcon className="h-4 w-4 mr-1" />
                              Photo
                            </Button>
                          </div>
                          <Button onClick={handleCreatePost} disabled={!newPostContent.trim()}>
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Feed Posts */}
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden">
                      <CardContent className="pt-6">
                        <div className="flex gap-3">
                          <Avatar>
                            <AvatarImage src={post.author.avatar} alt={post.author.name} />
                            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{post.author.name}</div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>{post.author.role}</span>
                                  {post.author.badge && (
                                    <Badge variant="outline" className="text-xs">
                                      {post.author.badge}
                                    </Badge>
                                  )}
                                  <span>•</span>
                                  <span>{post.time}</span>
                                </div>
                              </div>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="mt-3 whitespace-pre-line">{post.content}</div>

                            {post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {post.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                              <div className="flex items-center gap-6">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`flex items-center gap-1 ${post.liked ? "text-red-500" : ""}`}
                                  onClick={() => handleLikePost(post.id)}
                                >
                                  <Heart className="h-4 w-4" fill={post.liked ? "currentColor" : "none"} />
                                  <span>{post.likes}</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => setIsPostingComment(post.id)}
                                >
                                  <MessageCircle className="h-4 w-4" />
                                  <span>{post.comments}</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                  <Share className="h-4 w-4" />
                                  <span>Share</span>
                                </Button>
                              </div>
                            </div>

                            {isPostingComment === post.id && (
                              <div className="mt-4 pt-4 border-t">
                                <div className="flex gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Your Avatar" />
                                    <AvatarFallback>AJ</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <Input
                                      placeholder="Write a comment..."
                                      value={commentText}
                                      onChange={(e) => setCommentText(e.target.value)}
                                    />
                                    <div className="flex justify-end gap-2 mt-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setIsPostingComment(null)
                                          setCommentText("")
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={() => handleCommentSubmit(post.id)}
                                        disabled={!commentText.trim()}
                                      >
                                        Comment
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center py-12">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No posts found</h3>
                        <p className="text-muted-foreground mb-4">We couldn't find any posts matching your search.</p>
                        <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
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
                      <span className="font-medium">1,248</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-green-600" />
                        <span>Active Discussions</span>
                      </div>
                      <span className="font-medium">32</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-purple-600" />
                        <span>Upcoming Events</span>
                      </div>
                      <span className="font-medium">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-amber-600" />
                        <span>Success Stories</span>
                      </div>
                      <span className="font-medium">156</span>
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
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-sm">
                        #MindfulnessMonday
                      </Badge>
                      <span className="text-xs text-muted-foreground">24 posts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-sm">
                        #SobrietyMilestones
                      </Badge>
                      <span className="text-xs text-muted-foreground">18 posts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-sm">
                        #CopingStrategies
                      </Badge>
                      <span className="text-xs text-muted-foreground">15 posts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-sm">
                        #RecoveryTips
                      </Badge>
                      <span className="text-xs text-muted-foreground">12 posts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-sm">
                        #SelfCare
                      </Badge>
                      <span className="text-xs text-muted-foreground">10 posts</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Active Members Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Active Members</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Dr. Emily Chen" />
                        <AvatarFallback>EC</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">Dr. Emily Chen</div>
                        <div className="text-xs text-muted-foreground">Therapist</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Michael S." />
                        <AvatarFallback>MS</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">Michael S.</div>
                        <div className="text-xs text-muted-foreground">Member</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Jessica T." />
                        <AvatarFallback>JT</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">Jessica T.</div>
                        <div className="text-xs text-muted-foreground">Member</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Robert K." />
                        <AvatarFallback>RK</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">Robert K.</div>
                        <div className="text-xs text-muted-foreground">Member</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Members
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Support Groups</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supportGroups.map((group) => (
                <Card key={group.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{group.name}</CardTitle>
                      <Badge variant="outline">{group.activeNow} online</Badge>
                    </div>
                    <CardDescription>{group.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{group.members} members</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{group.meetingTimes}</span>
                        </div>
                      </div>

                      <div className="flex -space-x-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Avatar key={i} className="h-8 w-8 border-2 border-background">
                            <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${i + 1}`} />
                            <AvatarFallback>U{i + 1}</AvatarFallback>
                          </Avatar>
                        ))}
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                          +{group.members - 5}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {group.joined ? (
                      <Button variant="outline" className="w-full">
                        View Group
                      </Button>
                    ) : (
                      <Button className="w-full" onClick={() => handleJoinGroup(group.id)}>
                        Join Group
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Upcoming Events</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar View
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id}>
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
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Hosted by: {event.host}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{event.attendees} attending</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => handleRegisterEvent(event.id)}>
                      Register
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Success Stories Tab */}
          <TabsContent value="stories" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Success Stories</h2>
              <Button>
                <PenSquare className="h-4 w-4 mr-2" />
                Share Your Story
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {successStories.map((story) => (
                <Card key={story.id} className="overflow-hidden">
                  <CardHeader className="pb-0">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar>
                        <AvatarImage src={story.author.avatar} alt={story.author.name} />
                        <AvatarFallback>{story.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{story.author.name}</div>
                        <Badge variant="outline" className="mt-1">
                          {story.author.sobrietyTime} sober
                        </Badge>
                      </div>
                    </div>
                    <CardTitle>{story.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{story.excerpt}</p>
                    <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{story.readTime}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button variant="outline" className="w-full">
                      Read Full Story
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

function ImageIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
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

function User(props: React.SVGProps<SVGSVGElement>) {
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

