"use client"

import { useEffect } from "react"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Frown, Meh, Smile, SmilePlus, Calendar, Clock, Info, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Skeleton } from "@/components/ui/skeleton"

// Sample data for the mood chart
const weekData = [
  { day: "Mon", mood: 3, note: "Feeling okay, had some cravings but managed them" },
  { day: "Tue", mood: 4, note: "Great day! Completed all my tasks" },
  { day: "Wed", mood: 2, note: "Difficult day, struggled with triggers" },
  { day: "Thu", mood: 3, note: "Better than yesterday, meditation helped" },
  { day: "Fri", mood: 5, note: "Excellent day, feeling strong and positive" },
  { day: "Sat", mood: 4, note: "Good day overall, enjoyed group session" },
  { day: "Sun", mood: 3, note: "Relaxing day, some anxiety but manageable" },
]

const monthData = [
  { date: "Week 1", avgMood: 3.2 },
  { date: "Week 2", avgMood: 3.8 },
  { date: "Week 3", avgMood: 2.9 },
  { date: "Week 4", avgMood: 4.1 },
]

type MoodOption = {
  value: number
  icon: React.ReactNode
  label: string
  color: string
}

const moodOptions: MoodOption[] = [
  {
    value: 1,
    icon: <Frown className="h-8 w-8" />,
    label: "Struggling",
    color: "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300",
  },
  {
    value: 2,
    icon: <Frown className="h-8 w-8" />,
    label: "Difficult",
    color: "bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-300",
  },
  {
    value: 3,
    icon: <Meh className="h-8 w-8" />,
    label: "Okay",
    color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-300",
  },
  {
    value: 4,
    icon: <Smile className="h-8 w-8" />,
    label: "Good",
    color: "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300",
  },
  {
    value: 5,
    icon: <SmilePlus className="h-8 w-8" />,
    label: "Great",
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300",
  },
]

const moodFormSchema = z.object({
  mood: z.number().min(1).max(5),
  note: z.string().max(200, "Note must be less than 200 characters").optional(),
})

type MoodFormValues = z.infer<typeof moodFormSchema>

export function MoodTracker() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<MoodFormValues>({
    resolver: zodResolver(moodFormSchema),
    defaultValues: {
      mood: 0,
      note: "",
    },
  })

  const selectedMood = form.watch("mood")

  const handleMoodSubmit = (values: MoodFormValues) => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)

      // Reset form after a delay
      setTimeout(() => {
        form.reset()
        setShowSuccess(false)
      }, 2000)
    }, 1000)
  }

  const getMoodColor = (mood: number): string => {
    const option = moodOptions.find((opt) => opt.value === mood)
    return option ? option.color : ""
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border rounded-md p-3 shadow-md">
          <p className="font-medium">{data.day || data.date}</p>
          {data.mood && <p className="text-sm">Mood: {moodOptions.find((m) => m.value === data.mood)?.label}</p>}
          {data.avgMood && <p className="text-sm">Average Mood: {data.avgMood.toFixed(1)}</p>}
          {data.note && <p className="text-sm mt-1">{data.note}</p>}
        </div>
      )
    }
    return null
  }

  // Simulate loading state for charts
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Mood Tracker</CardTitle>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Info className="h-4 w-4" />
                    <span className="sr-only">About mood tracking</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Tracking your mood helps identify patterns and triggers in your recovery journey.
                  </p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
        </div>
        <CardDescription>Track how you're feeling to identify patterns in your recovery journey</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="log">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="log">Log Mood</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="log" className="space-y-4 pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleMoodSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="mood"
                  render={({ field }) => (
                    <FormItem>
                      <div className="text-sm font-medium mb-2">How are you feeling today?</div>
                      <div className="grid grid-cols-5 gap-2">
                        {moodOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => field.onChange(option.value)}
                            className={cn(
                              "flex flex-col items-center justify-center p-3 rounded-md border transition-all",
                              field.value === option.value
                                ? `${option.color} border-2 border-primary`
                                : "hover:border-primary",
                            )}
                          >
                            <div className="mb-1">{option.icon}</div>
                            <span className="text-xs font-medium">{option.label}</span>
                          </button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedMood > 0 && (
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem className="animate-in fade-in-50 duration-300">
                        <div className="text-sm font-medium">Add a note (optional)</div>
                        <FormControl>
                          <Textarea
                            placeholder="How are you feeling? Any triggers or victories today?"
                            className="h-20 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {showSuccess ? (
                  <div className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 p-3 rounded-md text-center animate-in fade-in-50 duration-300">
                    Mood logged successfully!
                  </div>
                ) : (
                  selectedMood > 0 && (
                    <Button type="submit" className="w-full animate-in fade-in-50 duration-300" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging...
                        </>
                      ) : (
                        "Log Mood"
                      )}
                    </Button>
                  )
                )}

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  <span>•</span>
                  <Calendar className="h-4 w-4" />
                  <span>{new Date().toLocaleDateString([], { month: "short", day: "numeric" })}</span>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="history" className="pt-4">
            <Tabs defaultValue="week">
              <TabsList className="mb-4">
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>

              <TabsContent value="week">
                <div className="h-[300px] w-full">
                  {isLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weekData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="day" />
                        <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="mood" radius={[4, 4, 0, 0]} barSize={30} fill="var(--primary)" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="mt-4 space-y-3">
                  <h4 className="text-sm font-medium">Recent Entries</h4>
                  <div className="space-y-2">
                    {isLoading
                      ? Array(3)
                          .fill(0)
                          .map((_, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 border rounded-md">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div className="flex-1">
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-3/4 mt-1" />
                              </div>
                            </div>
                          ))
                      : weekData.slice(0, 3).map((entry, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 border rounded-md">
                            <div
                              className={cn(
                                "h-10 w-10 rounded-full flex items-center justify-center",
                                getMoodColor(entry.mood),
                              )}
                            >
                              {moodOptions.find((m) => m.value === entry.mood)?.icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{entry.day}</span>
                                <span className="text-xs text-muted-foreground">
                                  {moodOptions.find((m) => m.value === entry.mood)?.label}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{entry.note}</p>
                            </div>
                          </div>
                        ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="month">
                <div className="h-[300px] w-full">
                  {isLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="avgMood"
                          stroke="var(--primary)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="mt-4 p-3 border rounded-md bg-muted/30">
                  <h4 className="text-sm font-medium mb-2">Monthly Summary</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Average Mood</p>
                      <p className="text-xl font-bold">3.5/5</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Most Common</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300 flex items-center justify-center">
                          <Smile className="h-4 w-4" />
                        </div>
                        <span className="font-medium">Good</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="outline" className="w-full">
          View Full Mood History
        </Button>
      </CardFooter>
    </Card>
  )
}

