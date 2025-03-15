"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Edit3,
  Flag,
  ListTodo,
  MoreHorizontal,
  Share2,
  Star,
  Trophy,
} from "lucide-react"

export default function RecoveryPlanPage() {
  const [currentWeek, setCurrentWeek] = useState(1)
  const totalWeeks = 12

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your Recovery Plan</h1>
            <p className="text-muted-foreground">A personalized roadmap to guide your recovery journey</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Edit3 className="h-4 w-4 mr-2" />
              Customize
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Recovery Progress</CardTitle>
            <CardDescription>Track your journey through the 12-week recovery program</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sm">
                    Week {currentWeek} of {totalWeeks}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {Math.round((currentWeek / totalWeeks) * 100)}% Complete
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
                    disabled={currentWeek === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentWeek(Math.min(totalWeeks, currentWeek + 1))}
                    disabled={currentWeek === totalWeeks}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Progress value={(currentWeek / totalWeeks) * 100} className="h-2" />

              <div className="grid grid-cols-12 gap-1">
                {Array.from({ length: totalWeeks }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full cursor-pointer ${
                      i + 1 <= currentWeek ? "bg-blue-600" : "bg-gray-200"
                    }`}
                    onClick={() => setCurrentWeek(i + 1)}
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Current Phase</p>
                        <h3 className="text-xl font-bold">Awareness & Stability</h3>
                      </div>
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Flag className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Weekly Tasks</p>
                        <h3 className="text-xl font-bold">12/15 Completed</h3>
                      </div>
                      <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Next Milestone</p>
                        <h3 className="text-xl font-bold">30 Days Sober</h3>
                      </div>
                      <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Plan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Week {currentWeek} Plan: Building Awareness</CardTitle>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                Options
              </Button>
            </div>
            <CardDescription>Focus on understanding your triggers and developing coping strategies</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="daily">
              <TabsList className="mb-4">
                <TabsTrigger value="daily">Daily Tasks</TabsTrigger>
                <TabsTrigger value="weekly">Weekly Goals</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>

              <TabsContent value="daily" className="space-y-4">
                <div className="space-y-4">
                  <WeeklyTaskItem
                    title="Morning Meditation"
                    description="10-minute guided meditation for clarity and focus"
                    frequency="Daily"
                    completed={5}
                    total={7}
                  />
                  <WeeklyTaskItem
                    title="Trigger Journal"
                    description="Document situations, emotions, and thoughts that trigger cravings"
                    frequency="Daily"
                    completed={4}
                    total={7}
                  />
                  <WeeklyTaskItem
                    title="Physical Activity"
                    description="30 minutes of walking, yoga, or exercise"
                    frequency="5x per week"
                    completed={3}
                    total={5}
                  />
                  <WeeklyTaskItem
                    title="Support Group Meeting"
                    description="Attend virtual or in-person support group"
                    frequency="3x per week"
                    completed={2}
                    total={3}
                  />
                  <WeeklyTaskItem
                    title="Mindful Eating"
                    description="Practice being present during meals without distractions"
                    frequency="Daily"
                    completed={6}
                    total={7}
                  />
                </div>
              </TabsContent>

              <TabsContent value="weekly" className="space-y-4">
                <div className="space-y-4">
                  <WeeklyGoalItem
                    title="Identify Personal Triggers"
                    description="Create a comprehensive list of situations, emotions, and environments that trigger cravings"
                    status="In Progress"
                    progress={65}
                  />
                  <WeeklyGoalItem
                    title="Develop Two New Coping Strategies"
                    description="Research and practice at least two healthy coping mechanisms for dealing with cravings"
                    status="In Progress"
                    progress={40}
                  />
                  <WeeklyGoalItem
                    title="Connect with Support Network"
                    description="Reach out to at least three people who can provide support during your recovery"
                    status="Completed"
                    progress={100}
                  />
                  <WeeklyGoalItem
                    title="Create a Safe Environment"
                    description="Remove triggers from your home and establish a recovery-friendly space"
                    status="In Progress"
                    progress={80}
                  />
                </div>
              </TabsContent>

              <TabsContent value="resources" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ResourceCard
                    title="Understanding Addiction Triggers"
                    type="Article"
                    author="Dr. Sarah Johnson"
                    time="15 min read"
                  />
                  <ResourceCard
                    title="Mindfulness for Recovery"
                    type="Video"
                    author="Michael Chen, LMFT"
                    time="22 min"
                  />
                  <ResourceCard title="Morning Meditation Guide" type="Audio" author="Lisa Rodriguez" time="10 min" />
                  <ResourceCard
                    title="Building Healthy Habits"
                    type="Worksheet"
                    author="Recovery Experts"
                    time="Interactive"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Milestones & Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Recovery Milestones</CardTitle>
            <CardDescription>Track your achievements and upcoming goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

              <div className="space-y-8">
                <MilestoneItem
                  title="Begin Recovery Journey"
                  description="Take the first step toward a healthier life"
                  date="March 15, 2025"
                  status="completed"
                />
                <MilestoneItem
                  title="One Week Sober"
                  description="Complete 7 consecutive days of sobriety"
                  date="March 22, 2025"
                  status="completed"
                />
                <MilestoneItem
                  title="Two Weeks Sober"
                  description="Complete 14 consecutive days of sobriety"
                  date="March 29, 2025"
                  status="current"
                />
                <MilestoneItem
                  title="One Month Sober"
                  description="Complete 30 consecutive days of sobriety"
                  date="April 14, 2025"
                  status="upcoming"
                />
                <MilestoneItem
                  title="Three Months Sober"
                  description="Complete 90 consecutive days of sobriety"
                  date="June 13, 2025"
                  status="upcoming"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Milestones
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}

function WeeklyTaskItem({
  title,
  description,
  frequency,
  completed,
  total,
}: {
  title: string
  description: string
  frequency: string
  completed: number
  total: number
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border">
      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
        <ListTodo className="h-5 w-5 text-blue-600" />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Badge variant="outline">{frequency}</Badge>
        </div>
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-medium">
              {completed}/{total}
            </span>
          </div>
          <Progress value={(completed / total) * 100} className="h-2" />
        </div>
      </div>
    </div>
  )
}

function WeeklyGoalItem({
  title,
  description,
  status,
  progress,
}: {
  title: string
  description: string
  status: string
  progress: number
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border">
      <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
        <Flag className="h-5 w-5 text-purple-600" />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Badge
            variant={status === "Completed" ? "default" : "outline"}
            className={status === "Completed" ? "bg-green-600" : ""}
          >
            {status}
          </Badge>
        </div>
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </div>
  )
}

function ResourceCard({
  title,
  type,
  author,
  time,
}: {
  title: string
  type: string
  author: string
  time: string
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center
            ${
              type === "Article"
                ? "bg-blue-100"
                : type === "Video"
                  ? "bg-red-100"
                  : type === "Audio"
                    ? "bg-green-100"
                    : "bg-amber-100"
            }
          `}
          >
            {type === "Article" ? (
              <BookOpen className="h-5 w-5 text-blue-600" />
            ) : type === "Video" ? (
              <Video className="h-5 w-5 text-red-600" />
            ) : type === "Audio" ? (
              <Music className="h-5 w-5 text-green-600" />
            ) : (
              <FileText className="h-5 w-5 text-amber-600" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {type}
              </Badge>
              <span className="text-xs text-muted-foreground">{author}</span>
              <div className="flex items-center gap-1 ml-auto">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{time}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" className="w-full">
          View Resource
        </Button>
      </CardFooter>
    </Card>
  )
}

function MilestoneItem({
  title,
  description,
  date,
  status,
}: {
  title: string
  description: string
  date: string
  status: "completed" | "current" | "upcoming"
}) {
  return (
    <div className="relative pl-10">
      <div
        className={`absolute left-0 top-1.5 h-8 w-8 rounded-full flex items-center justify-center border-4 
        ${
          status === "completed"
            ? "bg-green-600 border-green-100"
            : status === "current"
              ? "bg-blue-600 border-blue-100"
              : "bg-white border-gray-200"
        }
      `}
      >
        {status === "completed" && <CheckCircle2 className="h-4 w-4 text-white" />}
        {status === "current" && <Star className="h-4 w-4 text-white" />}
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex items-center gap-2 mt-1">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{date}</span>
          {status === "completed" && <Badge className="ml-2 bg-green-600">Completed</Badge>}
          {status === "current" && <Badge className="ml-2">In Progress</Badge>}
        </div>
      </div>
    </div>
  )
}

// These components are referenced but not defined above
function BookOpen(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}

function Video(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
  )
}

function Music(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  )
}

function FileText(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  )
}

