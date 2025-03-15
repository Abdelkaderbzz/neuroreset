"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bell, Calendar, CheckCircle2, Clock, Settings, Trophy, Users } from "lucide-react"

// Sample notifications
const notifications = [
  {
    id: 1,
    type: "task",
    title: "Morning Meditation",
    message: "It's time for your morning meditation session.",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "achievement",
    title: "New Badge Earned",
    message: "Congratulations! You've earned the '7-Day Streak' badge.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 3,
    type: "community",
    title: "New Group Message",
    message: "Dr. Emily posted a new message in 'Alcohol Recovery' group.",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 4,
    type: "appointment",
    title: "Upcoming Session",
    message: "Reminder: You have a session with Dr. Sarah Johnson tomorrow at 3:00 PM.",
    time: "5 hours ago",
    read: true,
  },
  {
    id: 5,
    type: "task",
    title: "Journal Entry",
    message: "Don't forget to complete your daily journal entry.",
    time: "Yesterday",
    read: true,
  },
]

export function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [notificationState, setNotificationState] = useState(notifications)

  const unreadCount = notificationState.filter((n) => !n.read).length

  const filteredNotifications =
    activeTab === "all" ? notificationState : notificationState.filter((n) => n.type === activeTab)

  const markAllAsRead = () => {
    setNotificationState(notificationState.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: number) => {
    setNotificationState(notificationState.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task":
        return <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      case "achievement":
        return <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      case "community":
        return <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
      case "appointment":
        return <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
      default:
        return <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-medium text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>Notifications</SheetTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                Mark all as read
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <SheetDescription>Stay updated on your recovery journey</SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b">
            <TabsList className="w-full justify-start rounded-none border-b-0 p-0">
              <TabsTrigger
                value="all"
                className="relative rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
              >
                All
                {unreadCount > 0 && <Badge className="ml-2 bg-red-600">{unreadCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger
                value="task"
                className="relative rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
              >
                Tasks
              </TabsTrigger>
              <TabsTrigger
                value="achievement"
                className="relative rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
              >
                Achievements
              </TabsTrigger>
              <TabsTrigger
                value="community"
                className="relative rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
              >
                Community
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-auto">
            <TabsContent value={activeTab} className="m-0 p-0 data-[state=active]:flex data-[state=active]:flex-col">
              {filteredNotifications.length > 0 ? (
                <div className="divide-y">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-muted/50 transition-colors ${!notification.read ? "bg-muted/30" : ""}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium">{notification.title}</h4>
                            {!notification.read && <div className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-2" />}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Bell className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium">No notifications</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You're all caught up! Check back later for updates.
                  </p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        <div className="border-t p-4">
          <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

