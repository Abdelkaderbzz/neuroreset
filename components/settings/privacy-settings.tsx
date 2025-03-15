"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Save, Shield } from "lucide-react"

export function PrivacySettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    profile: {
      showProgress: true,
      showJournals: false,
      showGoals: true,
      showBadges: true,
    },
    community: {
      allowMessages: true,
      showOnlineStatus: true,
      allowTagging: false,
    },
    dataSharing: {
      shareWithProviders: true,
      anonymousResearch: true,
    },
    profileVisibility: "supportNetwork",
  })

  type Category = "profile" | "community" | "dataSharing"

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
      title: "Privacy settings updated",
      description: "Your privacy preferences have been saved.",
      variant: "success",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Privacy Settings</CardTitle>
        </div>
        <CardDescription>Control your privacy and data sharing preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Profile Privacy</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="profile-progress">Show Recovery Progress</Label>
                <p className="text-sm text-muted-foreground">Allow others to see your recovery timeline and progress</p>
              </div>
              <Switch
                id="profile-progress"
                checked={settings.profile.showProgress}
                onCheckedChange={() => handleToggle("profile", "showProgress")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="profile-journals">Share Journal Entries</Label>
                <p className="text-sm text-muted-foreground">Allow others to see your public journal entries</p>
              </div>
              <Switch
                id="profile-journals"
                checked={settings.profile.showJournals}
                onCheckedChange={() => handleToggle("profile", "showJournals")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="profile-goals">Show Recovery Goals</Label>
                <p className="text-sm text-muted-foreground">Allow others to see your recovery goals</p>
              </div>
              <Switch
                id="profile-goals"
                checked={settings.profile.showGoals}
                onCheckedChange={() => handleToggle("profile", "showGoals")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="profile-badges">Display Badges & Achievements</Label>
                <p className="text-sm text-muted-foreground">
                  Show your earned badges and achievements on your profile
                </p>
              </div>
              <Switch
                id="profile-badges"
                checked={settings.profile.showBadges}
                onCheckedChange={() => handleToggle("profile", "showBadges")}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Community Interaction</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="community-messages">Allow Direct Messages</Label>
                <p className="text-sm text-muted-foreground">
                  Allow other community members to send you direct messages
                </p>
              </div>
              <Switch
                id="community-messages"
                checked={settings.community.allowMessages}
                onCheckedChange={() => handleToggle("community", "allowMessages")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="community-online">Show Online Status</Label>
                <p className="text-sm text-muted-foreground">Show when you're active on the platform</p>
              </div>
              <Switch
                id="community-online"
                checked={settings.community.showOnlineStatus}
                onCheckedChange={() => handleToggle("community", "showOnlineStatus")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="community-tagging">Allow Tagging</Label>
                <p className="text-sm text-muted-foreground">Allow others to tag you in posts and comments</p>
              </div>
              <Switch
                id="community-tagging"
                checked={settings.community.allowTagging}
                onCheckedChange={() => handleToggle("community", "allowTagging")}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Data Sharing</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="data-providers">Share with Healthcare Providers</Label>
                <p className="text-sm text-muted-foreground">Share your recovery data with your healthcare providers</p>
              </div>
              <Switch
                id="data-providers"
                checked={settings.dataSharing.shareWithProviders}
                onCheckedChange={() => handleToggle("dataSharing", "shareWithProviders")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="data-research">Anonymous Research Contribution</Label>
                <p className="text-sm text-muted-foreground">
                  Allow your anonymized data to be used for addiction research
                </p>
              </div>
              <Switch
                id="data-research"
                checked={settings.dataSharing.anonymousResearch}
                onCheckedChange={() => handleToggle("dataSharing", "anonymousResearch")}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Profile Visibility</h3>

          <div className="space-y-1">
            <Label htmlFor="profile-visibility">Who can see your profile</Label>
            <Select
              value={settings.profileVisibility}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, profileVisibility: value }))}
            >
              <SelectTrigger id="profile-visibility">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="everyone">Everyone</SelectItem>
                <SelectItem value="supportNetwork">Support Network Only</SelectItem>
                <SelectItem value="providers">Healthcare Providers Only</SelectItem>
                <SelectItem value="private">Private (Only You)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Privacy Settings
        </Button>
      </CardFooter>
    </Card>
  )
}

