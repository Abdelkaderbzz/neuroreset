"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Camera, Save } from "lucide-react"
import { useAppContext } from "@/contexts/app-context"

export function AccountSettings() {

  const { profile } = useAppContext();

  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: "+216 58 627 016",
    username: profile.name,
    password: "••••••••",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "Account updated",
      description: "Your account information has been updated successfully.",
      variant: "success",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>Update your personal information and account settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
            <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2 flex-1 w-full">
            <div className="space-y-1">
              <Label htmlFor="name">Full Name</Label>
              {isEditing ? (
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
              ) : (
                <div className="p-2 border rounded-md bg-muted/30">{formData.name}</div>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email Address</Label>
              {isEditing ? (
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
              ) : (
                <div className="p-2 border rounded-md bg-muted/30">{formData.email}</div>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
              ) : (
                <div className="p-2 border rounded-md bg-muted/30">{formData.phone}</div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Account Security</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              {isEditing ? (
                <Input id="username" name="username" value={formData.username} onChange={handleInputChange} />
              ) : (
                <div className="p-2 border rounded-md bg-muted/30">{formData.username}</div>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              {isEditing ? (
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="p-2 border rounded-md bg-muted/30">{formData.password}</div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label>Two-Factor Authentication</Label>
            <div className="p-2 border rounded-md bg-muted/30 flex justify-between items-center">
              <span>Not enabled</span>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {isEditing ? (
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        ) : (
          <Button className="w-full" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

