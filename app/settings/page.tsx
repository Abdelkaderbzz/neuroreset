"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SettingsTabs } from "@/components/settings/settings-tabs"
import { AccountSettings } from "@/components/settings/account-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { PrivacySettings } from "@/components/settings/privacy-settings"
import { AppearanceSettings } from "@/components/settings/appearance-settings"
import { EmergencyContactSettings } from "@/components/settings/emergency-contact-settings"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and settings</p>
        </div>

        <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="space-y-6">
          {activeTab === "account" && <AccountSettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "privacy" && <PrivacySettings />}
          {activeTab === "appearance" && <AppearanceSettings />}
          {activeTab === "emergency" && <EmergencyContactSettings />}
        </div>
      </div>
    </DashboardLayout>
  )
}

