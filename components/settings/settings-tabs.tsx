"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Bell, Lock, Palette, Phone } from "lucide-react"

interface SettingsTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function SettingsTabs({ activeTab, setActiveTab }: SettingsTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="account" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Account</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Notifications</span>
        </TabsTrigger>
        <TabsTrigger value="privacy" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          <span className="hidden sm:inline">Privacy</span>
        </TabsTrigger>
        <TabsTrigger value="appearance" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Appearance</span>
        </TabsTrigger>
        <TabsTrigger value="emergency" className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          <span className="hidden sm:inline">Emergency</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

