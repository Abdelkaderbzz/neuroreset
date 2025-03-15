"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useTheme } from "next-themes"
import { Moon, Save, Sun, Monitor } from "lucide-react"

export function AppearanceSettings() {
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState({
    fontSize: "medium",
    colorScheme: "blue",
    reduceMotion: false,
    highContrast: false,
  })

  const handleSave = () => {
    toast({
      title: "Appearance settings updated",
      description: "Your appearance preferences have been saved.",
      variant: "success",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance Settings</CardTitle>
        <CardDescription>Customize how NeuroReset looks and feels</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Theme</h3>

          <div className="grid grid-cols-3 gap-4">
            <div
              className={`flex flex-col items-center gap-2 p-4 border rounded-md cursor-pointer transition-all ${
                theme === "light" ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => setTheme("light")}
            >
              <div className="h-10 w-10 rounded-full bg-white border flex items-center justify-center">
                <Sun className="h-5 w-5 text-amber-500" />
              </div>
              <span className="font-medium">Light</span>
            </div>

            <div
              className={`flex flex-col items-center gap-2 p-4 border rounded-md cursor-pointer transition-all ${
                theme === "dark" ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => setTheme("dark")}
            >
              <div className="h-10 w-10 rounded-full bg-gray-900 border flex items-center justify-center">
                <Moon className="h-5 w-5 text-blue-400" />
              </div>
              <span className="font-medium">Dark</span>
            </div>

            <div
              className={`flex flex-col items-center gap-2 p-4 border rounded-md cursor-pointer transition-all ${
                theme === "system" ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => setTheme("system")}
            >
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-white to-gray-900 border flex items-center justify-center">
                <Monitor className="h-5 w-5 text-gray-600" />
              </div>
              <span className="font-medium">System</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Text Size</h3>

          <RadioGroup
            value={settings.fontSize}
            onValueChange={(value) => setSettings((prev) => ({ ...prev, fontSize: value }))}
            className="grid grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem value="small" id="text-small" className="sr-only" />
              <Label
                htmlFor="text-small"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <span className="text-sm">Small</span>
                <span className="mt-2">Aa</span>
              </Label>
            </div>

            <div>
              <RadioGroupItem value="medium" id="text-medium" className="sr-only" />
              <Label
                htmlFor="text-medium"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <span className="text-sm">Medium</span>
                <span className="mt-2 text-lg">Aa</span>
              </Label>
            </div>

            <div>
              <RadioGroupItem value="large" id="text-large" className="sr-only" />
              <Label
                htmlFor="text-large"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <span className="text-sm">Large</span>
                <span className="mt-2 text-xl">Aa</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Color Scheme</h3>

          <div className="space-y-1">
            <Label htmlFor="color-scheme">Primary Color</Label>
            <Select
              value={settings.colorScheme}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, colorScheme: value }))}
            >
              <SelectTrigger id="color-scheme">
                <SelectValue placeholder="Select color scheme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">Blue (Default)</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="amber">Amber</SelectItem>
                <SelectItem value="rose">Rose</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Accessibility</h3>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="reduce-motion"
                checked={settings.reduceMotion}
                onChange={() => setSettings((prev) => ({ ...prev, reduceMotion: !prev.reduceMotion }))}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <div className="space-y-0.5">
                <Label htmlFor="reduce-motion">Reduce Motion</Label>
                <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="high-contrast"
                checked={settings.highContrast}
                onChange={() => setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }))}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <div className="space-y-0.5">
                <Label htmlFor="high-contrast">High Contrast</Label>
                <p className="text-sm text-muted-foreground">Increase contrast for better readability</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Appearance Settings
        </Button>
      </CardFooter>
    </Card>
  )
}

