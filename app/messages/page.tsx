"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import {
  Search,
  Send,
  Phone,
  Video,
  MoreHorizontal,
  Paperclip,
  Mic,
  Smile,
  Check,
  CheckCheck,
  Clock,
  Plus,
} from "lucide-react"

// Sample data for conversations
const conversations = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    role: "Therapist",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "How have you been feeling since our last session?",
    time: "10:30 AM",
    unread: 1,
    online: true,
    type: "expert",
  },
  {
    id: "2",
    name: "Support Group",
    role: "Group Chat",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Michael: I found a great new meditation app that's helping me.",
    time: "Yesterday",
    unread: 3,
    online: true,
    type: "group",
  },
  {
    id: "3",
    name: "James Wilson",
    role: "Recovery Coach",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Remember to complete your daily reflection task.",
    time: "Yesterday",
    unread: 0,
    online: false,
    type: "expert",
  },
  {
    id: "4",
    name: "Emily Chen",
    role: "Peer Support",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thanks for sharing your experience in the group today.",
    time: "Monday",
    unread: 0,
    online: true,
    type: "peer",
  },
  {
    id: "5",
    name: "Mindfulness Group",
    role: "Group Chat",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Lisa: Don't forget about our guided meditation tomorrow at 7PM.",
    time: "Monday",
    unread: 0,
    online: true,
    type: "group",
  },
  {
    id: "6",
    name: "Robert Kim",
    role: "Peer Support",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "How's your new exercise routine going?",
    time: "Last week",
    unread: 0,
    online: false,
    type: "peer",
  },
]

// Sample messages for a conversation
const sampleMessages = [
  {
    id: "m1",
    sender: "Dr. Sarah Johnson",
    content: "Hello Alex, how have you been feeling since our last session?",
    time: "10:30 AM",
    status: "read",
    isMe: false,
  },
  {
    id: "m2",
    sender: "Me",
    content:
      "Hi Dr. Johnson, I've been doing better. The new coping strategies we discussed have been helping with my anxiety.",
    time: "10:32 AM",
    status: "read",
    isMe: true,
  },
  {
    id: "m3",
    sender: "Dr. Sarah Johnson",
    content: "That's great to hear! Have you been keeping up with your daily meditation practice?",
    time: "10:33 AM",
    status: "read",
    isMe: false,
  },
  {
    id: "m4",
    sender: "Me",
    content:
      "Yes, I've been meditating every morning for about 10 minutes. It's making a difference in how I start my day.",
    time: "10:35 AM",
    status: "read",
    isMe: true,
  },
  {
    id: "m5",
    sender: "Dr. Sarah Johnson",
    content:
      "Excellent progress, Alex. Consistency is key with meditation. Have you noticed any specific triggers for cravings this week?",
    time: "10:36 AM",
    status: "read",
    isMe: false,
  },
  {
    id: "m6",
    sender: "Me",
    content:
      "Work stress has been a big trigger. I had a difficult project deadline on Wednesday and really felt the urge then.",
    time: "10:38 AM",
    status: "read",
    isMe: true,
  },
  {
    id: "m7",
    sender: "Dr. Sarah Johnson",
    content: "How did you handle that situation? Did you use any of the techniques we discussed?",
    time: "10:39 AM",
    status: "read",
    isMe: false,
  },
  {
    id: "m8",
    sender: "Me",
    content:
      "I used the breathing technique and took a short walk. It helped me get through the moment without giving in to the craving.",
    time: "10:41 AM",
    status: "delivered",
    isMe: true,
  },
  {
    id: "m9",
    sender: "Dr. Sarah Johnson",
    content:
      "I'm really proud of you for applying those techniques in a challenging moment. That's significant progress.",
    time: "10:42 AM",
    status: "sent",
    isMe: false,
  },
]

export default function MessagesPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState(sampleMessages)
  const [filteredConversations, setFilteredConversations] = useState(conversations)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages when messages change or active conversation changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, activeConversation])

  // Filter conversations based on search query and active tab
  useEffect(() => {
    let filtered = conversations

    if (searchQuery) {
      filtered = filtered.filter(
        (conv) =>
          conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (activeTab !== "all") {
      filtered = filtered.filter((conv) => conv.type === activeTab)
    }

    setFilteredConversations(filtered)
  }, [searchQuery, activeTab])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) return

    // Add new message to the conversation
    const newMessage = {
      id: `m${messages.length + 1}`,
      sender: "Me",
      content: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sending",
      isMe: true,
    }

    setMessages([...messages, newMessage])
    setMessage("")

    // Simulate message sending and response
    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "sent" } : msg)))

      // After 1 second, change status to delivered
      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg)))

        // After 2 more seconds, change status to read and add a response
        setTimeout(() => {
          setMessages((prev) => {
            const updatedMessages = prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "read" } : msg))

            // Add a response message
            const responseMessage = {
              id: `m${updatedMessages.length + 1}`,
              sender: "Dr. Sarah Johnson",
              content: "Thank you for sharing that. How are you feeling about it now?",
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              status: "sent",
              isMe: false,
            }

            return [...updatedMessages, responseMessage]
          })
        }, 2000)
      }, 1000)
    }, 500)
  }

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case "sending":
        return <Clock className="h-3 w-3 text-muted-foreground" />
      case "sent":
        return <Check className="h-3 w-3 text-muted-foreground" />
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      default:
        return null
    }
  }

  const handleStartNewChat = () => {
    toast({
      title: "New conversation",
      description: "This feature will be available soon.",
    })
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Messages</h1>
          <Button onClick={handleStartNewChat}>
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden border rounded-lg">
          {/* Conversations List */}
          <div className={`w-full md:w-80 border-r ${activeConversation ? "hidden md:block" : "block"}`}>
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search messages..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <div className="px-3 pt-3">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="expert">Experts</TabsTrigger>
                  <TabsTrigger value="group">Groups</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="m-0">
                <ScrollArea className="h-[calc(100vh-13rem)]">
                  <div className="p-3 space-y-2">
                    {filteredConversations.length > 0 ? (
                      filteredConversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            activeConversation === conversation.id ? "bg-accent" : "hover:bg-muted"
                          }`}
                          onClick={() => setActiveConversation(conversation.id)}
                        >
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={conversation.avatar} alt={conversation.name} />
                              <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                            </Avatar>
                            {conversation.online && (
                              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <div className="font-medium truncate">{conversation.name}</div>
                              <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                {conversation.time}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">{conversation.role}</div>
                            <div className="text-sm truncate mt-1">{conversation.lastMessage}</div>
                          </div>
                          {conversation.unread > 0 && (
                            <Badge className="ml-auto shrink-0 bg-blue-600">{conversation.unread}</Badge>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">No conversations found</div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          {/* Conversation View */}
          <div className={`flex-1 flex flex-col ${!activeConversation ? "hidden md:flex" : "flex"}`}>
            {activeConversation ? (
              <>
                <div className="p-3 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setActiveConversation(null)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-left"
                      >
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </Button>

                    <Avatar>
                      <AvatarImage
                        src={conversations.find((c) => c.id === activeConversation)?.avatar}
                        alt={conversations.find((c) => c.id === activeConversation)?.name || ""}
                      />
                      <AvatarFallback>
                        {conversations.find((c) => c.id === activeConversation)?.name[0] || ""}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="font-medium">{conversations.find((c) => c.id === activeConversation)?.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        {conversations.find((c) => c.id === activeConversation)?.online ? (
                          <>
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                            <span>Online</span>
                          </>
                        ) : (
                          "Offline"
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`flex gap-2 max-w-[80%] ${msg.isMe ? "flex-row-reverse" : ""}`}>
                          {!msg.isMe && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" alt={msg.sender} />
                              <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                            </Avatar>
                          )}

                          <div>
                            <div
                              className={`rounded-lg px-3 py-2 ${
                                msg.isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                            >
                              {msg.content}
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                              <span>{msg.time}</span>
                              {msg.isMe && getMessageStatusIcon(msg.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="p-3 border-t">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Button type="button" variant="ghost" size="icon">
                      <Smile className="h-5 w-5" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="button" variant="ghost" size="icon">
                      <Mic className="h-5 w-5" />
                    </Button>
                    <Button type="submit" size="icon" disabled={!message.trim()}>
                      <Send className="h-5 w-5" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">Your Messages</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Connect with your support network, therapists, and recovery coaches through secure messaging.
                </p>
                <Button onClick={handleStartNewChat}>
                  <Plus className="h-4 w-4 mr-2" />
                  Start a New Conversation
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function MessageSquare(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

