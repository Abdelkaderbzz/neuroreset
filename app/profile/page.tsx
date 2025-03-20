"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useAppContext, UserProfile } from "@/contexts/app-context";
import {
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  Edit,
  Lock,
  LogOut,
  Save,
  Settings,
  Shield,
  Sparkles,
  Trophy,
  User,
  UserCog,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const { toast } = useToast();
  const router = useRouter();
  const {profile, updateProfile, goals } = useAppContext();
  // const [profile, setProfile] = useState<UserProfile | null>(null);
  

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name,
    email: profile?.email,
    phone: profile?.phone || "no phone number",
    bio: profile?.bio,
    sobrietyDate: (profile?.sobrietyDate
      ? new Date(profile?.sobrietyDate)
      : new Date()
    )
      .toISOString()
      ?.split("T")[0],
    recovery_type: profile?.recovery_type,
    emergency_contact: profile?.emergency_contact,
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      showProgress: true,
      showJournal: false,
      showGoals: true,
    },
  });
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        phone: profile.phone || "no phone number",
        bio: profile.bio,
        sobrietyDate: (profile.sobrietyDate
          ? new Date(profile.sobrietyDate)
          : new Date()
        )
          .toISOString()
          ?.split("T")[0],
        recovery_type: profile.recovery_type,
        emergency_contact: profile.emergency_contact,
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
        privacy: {
          showProgress: true,
          showJournal: false,
          showGoals: true,
        },
      });
    }
  }, [profile]);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleChange = (
    field: string,
    section: "notifications" | "privacy"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field],
      },
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // Update profile in context

      const updatedProfile = {
        id: profile?.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        emergency_contact: formData.emergency_contact,
        sobrietydate: new Date(formData.sobrietyDate).toISOString(),
        recovery_type: formData.recovery_type,
      };

      // Update profile in the backend
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      // Update profile in context
      updateProfile(updatedProfile);

      setIsEditing(false);

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating profile:", error);

      toast({
        title: "Error",
        description: "An error occurred while updating your profile.",
        variant: "destructive",
      });
    }
  };

  // Calculate sobriety days
  const sobrietyDays = Math.floor(
    (new Date().getTime() - new Date(profile?.sobrietyDate || new Date().toISOString()).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // Achievements data
  const achievements = [
    {
      id: "a1",
      title: "First Day Complete",
      description: "Successfully completed your first day of recovery",
      icon: (
        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
      ),
      date: "March 10, 2025",
      unlocked: true,
    },
    {
      id: "a2",
      title: "One Week Milestone",
      description: "Maintained sobriety for 7 consecutive days",
      icon: <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      date: "March 17, 2025",
      unlocked: true,
    },
    {
      id: "a3",
      title: "Journaling Habit",
      description: "Completed 10 journal entries",
      icon: <Edit className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
      date: "March 20, 2025",
      unlocked: true,
    },
    {
      id: "a4",
      title: "Community Contributor",
      description: "Participated in 5 group discussions",
      icon: <User className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
      date: "March 25, 2025",
      unlocked: true,
    },
    {
      id: "a5",
      title: "30 Day Champion",
      description: "Maintained sobriety for 30 consecutive days",
      icon: <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
      date: "April 9, 2025",
      unlocked: false,
    },
  ];

  // Activity data
  const recentActivity = [
    {
      id: "act1",
      type: "task",
      title: "Completed morning meditation",
      time: "Today, 8:15 AM",
    },
    {
      id: "act2",
      type: "journal",
      title: "Added new journal entry",
      time: "Today, 12:30 PM",
    },
    {
      id: "act3",
      type: "community",
      title: "Participated in Alcohol Recovery group",
      time: "Yesterday, 6:00 PM",
    },
    {
      id: "act4",
      type: "goal",
      title: "Updated progress on 'Daily Meditation Habit'",
      time: "Yesterday, 9:15 PM",
    },
    {
      id: "act5",
      type: "session",
      title: "Attended session with Dr. Sarah Johnson",
      time: "March 15, 2025",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">My Profile</h1>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Summary Card */}
              <Card className="md:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle>Profile Summary</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile?.avatar} alt={profile?.name} />
                      <AvatarFallback className="text-2xl">
                        {profile?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <h3 className="text-xl font-bold">{formData.name}</h3>
                  <p className="text-muted-foreground">{formData.email}</p>

                  <div className="mt-6 w-full">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Recovery Progress</span>
                      <span>{sobrietyDays} days</span>
                    </div>
                    <Progress
                      value={(sobrietyDays / 30) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6 w-full">
                    <div className="bg-muted rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">
                        Sobriety Date
                      </p>
                      <p className="font-medium">
                        {new Date(profile?.sobrietyDate || new Date().toISOString()).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-muted rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">
                        Recovery Type
                      </p>
                      <p className="font-medium">{profile?.recovery_type}</p>
                    </div>
                  </div>

                  <div className="mt-6 w-full">
                    <h4 className="font-medium text-sm mb-2">Badges</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                      >
                        7 Day Streak
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                      >
                        Journaling
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300"
                      >
                        Community
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Details Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>
                    Manage your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="p-2 border rounded-md bg-muted/30">
                          {formData.name}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="p-2 border rounded-md bg-muted/30">
                          {formData.email}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="p-2 border rounded-md bg-muted/30">
                          {formData.phone}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sobrietyDate">Sobriety Date</Label>
                      {isEditing ? (
                        <Input
                          id="sobrietyDate"
                          name="sobrietyDate"
                          type="date"
                          value={formData.sobrietyDate}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="p-2 border rounded-md bg-muted/30">
                          {new Date(profile?.sobrietyDate || new Date().toISOString()).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recovery_type">Recovery Type</Label>
                      {isEditing ? (
                        <Input
                          id="recovery_type"
                          name="recovery_type"
                          value={formData.recovery_type}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="p-2 border rounded-md bg-muted/30">
                          {formData.recovery_type}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">
                        Emergency Contact
                      </Label>
                      {isEditing ? (
                        <Input
                          id="emergencyContact"
                          name="emergencyContact"
                          value={formData.emergency_contact}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="p-2 border rounded-md bg-muted/30">
                          {formData.emergency_contact}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-muted/30 min-h-[100px]">
                        {formData.bio}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recovery Goals Card */}
              <Card className="md:col-span-3">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Recovery Goals</CardTitle>
                    <CardDescription>
                      Track your progress towards your goals
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/goals")}
                  >
                    View All Goals
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {goals.slice(0, 3).map((goal) => (
                      <div key={goal.id} className="border rounded-lg p-4">
                        <h4 className="font-medium">{goal.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {goal.description}
                        </p>
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{goal.progress}%</span>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
                        </div>
                        <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Target:{" "}
                            {new Date(goal.targetDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
                <CardDescription>
                  Milestones and badges you've earned on your recovery journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`flex items-start gap-4 p-4 border rounded-lg ${
                        !achievement.unlocked ? "opacity-50" : ""
                      }`}
                    >
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        {achievement.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{achievement.title}</h4>
                          {!achievement.unlocked && (
                            <Badge variant="outline">Locked</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {achievement.description}
                        </p>
                        {achievement.unlocked && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <Trophy className="h-3 w-3" />
                            <span>Earned on {achievement.date}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Achievements
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your recent actions and progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 border rounded-lg"
                    >
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        {activity.type === "task" && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                        {activity.type === "journal" && (
                          <Edit className="h-4 w-4 text-blue-600" />
                        )}
                        {activity.type === "community" && (
                          <User className="h-4 w-4 text-purple-600" />
                        )}
                        {activity.type === "goal" && (
                          <Trophy className="h-4 w-4 text-amber-600" />
                        )}
                        {activity.type === "session" && (
                          <Calendar className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Full Activity Log
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <UserCog className="h-5 w-5" />
                  <CardTitle>Account Settings</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password & Security</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start">
                      <Lock className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Shield className="mr-2 h-4 w-4" />
                      Two-Factor Authentication
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Notification Preferences
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates and reminders via email
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={formData.notifications.email}
                        onCheckedChange={() =>
                          handleToggleChange("email", "notifications")
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications">
                          Push Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications on your device
                        </p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={formData.notifications.push}
                        onCheckedChange={() =>
                          handleToggleChange("push", "notifications")
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sms-notifications">
                          SMS Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive text messages for important updates
                        </p>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={formData.notifications.sms}
                        onCheckedChange={() =>
                          handleToggleChange("sms", "notifications")
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Privacy Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-progress">Show Progress</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow others to see your recovery progress
                        </p>
                      </div>
                      <Switch
                        id="show-progress"
                        checked={formData.privacy.showProgress}
                        onCheckedChange={() =>
                          handleToggleChange("showProgress", "privacy")
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-journal">
                          Share Journal Entries
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Allow others to see your public journal entries
                        </p>
                      </div>
                      <Switch
                        id="show-journal"
                        checked={formData.privacy.showJournal}
                        onCheckedChange={() =>
                          handleToggleChange("showJournal", "privacy")
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-goals">Share Goals</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow others to see your recovery goals
                        </p>
                      </div>
                      <Switch
                        id="show-goals"
                        checked={formData.privacy.showGoals}
                        onCheckedChange={() =>
                          handleToggleChange("showGoals", "privacy")
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Account Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Data Export
                    </Button>
                    <Button variant="destructive" className="justify-start">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
