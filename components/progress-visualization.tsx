"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Info, TrendingUp } from "lucide-react"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useMonthlyTaskData, useTaskCompleted, useWeeklyTaskData } from "@/hooks/tasks"
import { useAppContext } from "@/contexts/app-context"



const categoryData = [
  { name: "Meditation", value: 28 },
  { name: "Physical Activity", value: 22 },
  { name: "Journaling", value: 18 },
  { name: "Support Group", value: 15 },
  { name: "Self-Care", value: 17 },
]

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899"]

export function ProgressVisualization() {
  const { profile } = useAppContext();
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      if (payload[0].name === "completed") {
        const data = payload[0].payload
        return (
          <div className="bg-background border rounded-md p-3 shadow-md">
            <p className="font-medium">{data.day}</p>
            <p className="text-sm">
              Completed: {data.completed} of {data.total}
            </p>
            <p className="text-sm">Completion Rate: {Math.round((data.completed / data.total) * 100)}%</p>
          </div>
        )
      } else if (payload[0].name === "completion") {
        return (
          <div className="bg-background border rounded-md p-3 shadow-md">
            <p className="font-medium">{label}</p>
            <p className="text-sm">Completion Rate: {payload[0].value}%</p>
          </div>
        )
      }
    }
    return null
  }

  const PieCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md p-3 shadow-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">Tasks Completed: {payload[0].value}</p>
          <p className="text-sm">Percentage: {Math.round((payload[0].value / 100) * 100)}%</p>
        </div>
      )
    }
    return null
  }
  const weeklyData = useWeeklyTaskData();
  const monthlyData = useMonthlyTaskData();
  const { count:totalTaskCompleted, tasks } = useTaskCompleted();
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Recovery Progress</CardTitle>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Visualize your recovery journey progress over time and by category.</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>85% Overall</span>
          </Badge>
        </div>
        <CardDescription>Track your task completion and recovery milestones</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly">
          <TabsList className="mb-4">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="completed" name="completed" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 border rounded-md">
                <div className="text-sm text-muted-foreground">Weekly Completion</div>
                <div className="text-2xl font-bold mt-1">74%</div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">+12% from last week</span>
                </div>
              </div>
              <div className="p-3 border rounded-md">
                <div className="text-sm text-muted-foreground">Streak</div>
                <div className="text-2xl font-bold mt-1">{profile?.streak || 0} days</div>
                <div className="text-xs text-muted-foreground mt-1">Current best: 14 days</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monthly">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="week" />
                  <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="completion"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="p-3 border rounded-md">
                <div className="text-sm text-muted-foreground">Monthly Average</div>
                <div className="text-2xl font-bold mt-1">79%</div>
              </div>
              <div className="p-3 border rounded-md">
                <div className="text-sm text-muted-foreground">Best Week</div>
                <div className="text-2xl font-bold mt-1">Week 4</div>
              </div>
              <div className="p-3 border rounded-md">
                <div className="text-sm text-muted-foreground">Tasks Completed</div>
                <div className="text-2xl font-bold mt-1">{totalTaskCompleted}</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieCustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 p-3 border rounded-md">
              <h4 className="font-medium mb-2">Category Insights</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[0] }} />
                    <span className="text-sm">Meditation</span>
                  </div>
                  <div className="text-sm font-medium">28%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[1] }} />
                    <span className="text-sm">Physical Activity</span>
                  </div>
                  <div className="text-sm font-medium">22%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[2] }} />
                    <span className="text-sm">Journaling</span>
                  </div>
                  <div className="text-sm font-medium">18%</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

