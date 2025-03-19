"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Task, useAppContext } from "@/contexts/app-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle2,
  Edit3,
  Heart,
  MessageSquare,
  Sparkles,
  Trophy,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { TaskItem } from "@/components/task-item";
import { MoodTracker } from "@/components/mood-tracker";
import { JournalEntry } from "@/components/journal-entry";
import { CrisisSupport } from "@/components/crisis-support";
import { ProgressVisualization } from "@/components/progress-visualization";
import { AddTaskDialog } from "@/components/add-task-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  confirmDeletionTask,
  deleteTask,
  editTask,
  getAllTasks,
  getCompletedTasksToday,
  markTaskAsCompleted,
} from "@/api";

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    // tasks,
    addTask,
    updateTask,
    // deleteTask,
    streakCount,
    // completedTasksToday,
    // totalTasksToday,
    isLoading,
    profile,
  } = useAppContext();

  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [completedTask, setCompletedTask] = useState<any[] | null>([]);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const totalTasksToday = tasks.length;
  const completedTasksToday = completedTask?.length || 0;
  // Simulate crisis alert after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCrisisAlert(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    async function fetchTasks() {
      const t = await getAllTasks(profile.id);
      const c = await getCompletedTasksToday();

      setTasks(
        t.map((task: Task) => ({
          ...task,
          completed: c?.find((t) => t.task_id === task.id) ? true : false,
        }))
      );
      setCompletedTask(c);
    }
    fetchTasks();
  }, [profile.id]);
  const handleTaskComplete = (id: string, completed: boolean) => {
    if (completed) {
      markTaskAsCompleted(id);
      const taskToAdd = tasks.find((task) => task.id === id);
      setCompletedTask((prev) => [
        ...(prev || []),
        { ...taskToAdd, task_id: id },
      ]);
    } else {
      confirmDeletionTask(id);
      setCompletedTask((prev) =>
        (prev || [])?.filter((task) => task.task_id !== id)
      );
    }

    // updateTask(id, { completed });

    if (completed) {
      toast({
        title: "Task Completed",
        description: "Great job! Keep up the good work.",
        variant: "success",
      });
    }
  };

  const handleAddTask = (taskData: any) => {
    // addTask({
    //   title: taskData.title,
    //   description: taskData.description,
    //   time: taskData.time,
    //   priority: taskData.priority,
    //   completed: false,
    // });
    setTasks((prev) => [...prev, taskData]);
    toast({
      title: "Task Added",
      description: "Your new task has been added to your recovery plan.",
    });
  };

  const handleEditTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setEditingTask(task);
    }
  };

  const handleUpdateTask = (taskData: any) => {
    if (editingTask) {
      editTask(editingTask.id, {
        title: taskData.title,
        description: taskData.description,
        time: taskData.time,
        priority: taskData.priority,
      });
      setEditingTask(null);
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? taskData : t))
      );

      toast({
        title: "Task Updated",
        description: "Your task has been updated successfully.",
      });
    }
  };

  const handleDeleteTask = (id: string) => {
    // deleteTask(id);
    deleteTask(id).then(() => {
      toast({
        title: "Task Deleted",
        description: "Your task has been removed from your recovery plan.",
      });
      setTasks((prev) => prev.filter((t) => t.id !== id));
    });
  };

  const handleCrisisSupport = () => {
    setShowCrisisAlert(false);
    // Scroll to crisis support section
    document
      .getElementById("crisis-support")
      ?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <DashboardLayout>
      {showCrisisAlert && (
        <AlertDialog open={showCrisisAlert} onOpenChange={setShowCrisisAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <AlertDialogTitle>Need immediate support?</AlertDialogTitle>
              </div>
              <AlertDialogDescription>
                We've noticed you might be experiencing a difficult moment.
                Would you like to access our crisis support resources?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>I'm okay</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={handleCrisisSupport}
              >
                Get Support
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <div className="flex flex-col gap-6">
        {/* Welcome Section */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {profile.name.split(" ")[0]}
              </h1>
              <p className="text-muted-foreground">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isLoading ? (
              Array(3)
                .fill(0)
                .map((_, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <Skeleton className="h-4 w-32 mb-2" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                        <Skeleton className="h-12 w-12 rounded-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Current Streak
                        </p>
                        <h3 className="text-2xl font-bold">
                          {streakCount} days
                        </h3>
                      </div>
                      <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Daily Progress
                        </p>
                        <h3 className="text-2xl font-bold">
                          {completedTasksToday}/{totalTasksToday} tasks
                        </h3>
                      </div>
                      <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <Progress
                      value={(completedTasksToday / totalTasksToday) * 100}
                      className="h-2 mt-4"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Next Session
                        </p>
                        <h3 className="text-2xl font-bold">Tomorrow, 3 PM</h3>
                      </div>
                      <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Daily Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Today's Recovery Plan</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/recovery-plan")}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    View Full Plan
                  </Button>
                </div>
                <CardDescription>
                  Complete these tasks to maintain your progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 rounded-lg border"
                        >
                          <Skeleton className="h-4 w-4 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <Skeleton className="h-5 w-40 mb-2" />
                                <Skeleton className="h-4 w-60" />
                              </div>
                              <Skeleton className="h-8 w-8 rounded-md" />
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Skeleton className="h-4 w-20" />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        id={task.id}
                        title={task.title}
                        description={task.description}
                        time={task.time}
                        priority={task.priority}
                        completed={task.completed}
                        onComplete={handleTaskComplete}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {editingTask ? (
                  <AddTaskDialog
                    onAddTask={handleUpdateTask}
                    editTask={editingTask}
                    onEditComplete={() => setEditingTask(null)}
                  />
                ) : (
                  <AddTaskDialog onAddTask={handleAddTask} />
                )}
              </CardFooter>
            </Card>

            <ProgressVisualization />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MoodTracker />
              <JournalEntry />
            </div>
          </div>

          {/* Right Column - Support & Resources */}
          <div className="space-y-6">
            <div id="crisis-support">
              <CrisisSupport />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Support Resources</CardTitle>
                <CardDescription>
                  Get help when you need it most
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-20 w-full rounded-md" />
                    <Skeleton className="h-20 w-full rounded-md" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      <h4 className="font-medium">Upcoming Sessions</h4>
                      <div className="bg-muted/30 p-3 rounded-md">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Dr. Sarah Johnson</p>
                            <p className="text-sm text-muted-foreground">
                              Tomorrow, 3:00 PM
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Join
                          </Button>
                        </div>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-md">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Group Session</p>
                            <p className="text-sm text-muted-foreground">
                              Friday, 6:00 PM
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Join
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium">Community Support</h4>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => router.push("/community")}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat with Peers
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => router.push("/resources")}
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Recovery Resources
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>
                    Milestones in your recovery journey
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/goals")}
                >
                  View Goals
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(3)
                      .fill(0)
                      .map((_, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div>
                            <Skeleton className="h-5 w-40 mb-1" />
                            <Skeleton className="h-4 w-60" />
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="font-medium">One Week Streak</p>
                        <p className="text-sm text-muted-foreground">
                          Completed 7 consecutive days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">Task Master</p>
                        <p className="text-sm text-muted-foreground">
                          Completed 25 recovery tasks
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <Heart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium">Self-Care Champion</p>
                        <p className="text-sm text-muted-foreground">
                          Completed 10 wellness activities
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">First Milestone</p>
                        <p className="text-sm text-muted-foreground">
                          Reached 30 days sober
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/goals")}
                >
                  View All Achievements
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
