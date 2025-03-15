"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Save } from "lucide-react"

type Category = "email" | "push" | "sms"

export function NotificationSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    email: {
      dailyDigest: true,
      appointments: true,
      communityUpdates: false,
      achievements: true,
    },
    push: {
      taskReminders: true,
      appointments: true,
      messages: true,
      communityUpdates: false,
    },
    sms: {
      appointments: true,
      urgentAlerts: true,
    },
    reminderTime: "evening",
  })

  const handleToggle = (category: Category, setting: string) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting as keyof (typeof prev)[category]],
      },
    }))
  }

  const handleSave = () => {
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
      variant: "success",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Manage how and when you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Email Notifications</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-daily">Daily Digest</Label>
                <p className="text-sm text-muted-foreground">Receive a daily summary of your progress and tasks</p>
              </div>
              <Switch
                id="email-daily"
                checked={settings.email.dailyDigest}
                onCheckedChange={() => handleToggle("email", "dailyDigest")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-appointments">Appointment Reminders</Label>
                <p className="text-sm text-muted-foreground">Receive reminders about upcoming appointments</p>
              </div>
              <Switch
                id="email-appointments"
                checked={settings.email.appointments}
                onCheckedChange={() => handleToggle("email", "appointments")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-community">Community Updates</Label>
                <p className="text-sm text-muted-foreground">Receive updates from community groups you've joined</p>
              </div>
              <Switch
                id="email-community"
                checked={settings.email.communityUpdates}
                onCheckedChange={() => handleToggle("email", "communityUpdates")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-achievements">Achievements & Milestones</Label>
                <p className="text-sm text-muted-foreground">Receive notifications about your recovery milestones</p>
              </div>
              <Switch
                id="email-achievements"
                checked={settings.email.achievements}
                onCheckedChange={() => handleToggle("email", "achievements")}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Push Notifications</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-tasks">Task Reminders</Label>
                <p className="text-sm text-muted-foreground">Receive reminders for your daily recovery tasks</p>
              </div>
              <Switch
                id="push-tasks"
                checked={settings.push.taskReminders}
                onCheckedChange={() => handleToggle("push", "taskReminders")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-appointments">Appointment Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive alerts before your scheduled appointments</p>
              </div>
              <Switch
                id="push-appointments"
                checked={settings.push.appointments}
                onCheckedChange={() => handleToggle("push", "appointments")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-messages">Message Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications for new messages</p>
              </div>
              <Switch
                id="push-messages"
                checked={settings.push.messages}
                onCheckedChange={() => handleToggle("push", "messages")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-community">Community Activity</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about activity in your communities
                </p>
              </div>
              <Switch
                id="push-community"
                checked={settings.push.communityUpdates}
                onCheckedChange={() => handleToggle("push", "communityUpdates")}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">SMS Notifications</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-appointments">Appointment Reminders</Label>
                <p className="text-sm text-muted-foreground">Receive text reminders for upcoming appointments</p>
              </div>
              <Switch
                id="sms-appointments"
                checked={settings.sms.appointments}
                onCheckedChange={() => handleToggle("sms", "appointments")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-urgent">Urgent Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive text messages for urgent or important notifications
                </p>
              </div>
              <Switch
                id="sms-urgent"
                checked={settings.sms.urgentAlerts}
                onCheckedChange={() => handleToggle("sms", "urgentAlerts")}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Reminder Preferences</h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="reminder-time">Preferred Reminder Time</Label>
              <Select
                value={settings.reminderTime}
                onValueChange={(value) => setSettings((prev) => ({ ...prev, reminderTime: value }))}
              >
                <SelectTrigger id="reminder-time">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (8:00 AM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (1:00 PM)</SelectItem>
                  <SelectItem value="evening">Evening (7:00 PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Notification Settings
        </Button>
      </CardFooter>
    </Card>
  )
}

