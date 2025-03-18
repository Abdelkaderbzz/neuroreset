import { supabase } from "@/lib/supabase";
import { handleSupabaseOperation } from "@/lib/supabase-utils";
import { useEffect, useState } from "react";
export enum EPriority {
  High = "High",
  Medium = "Medium",
  Low = "Low",
}

export interface Task {
  id: number;
  title: string;
  description: string;
  time: string;
  priority: EPriority;
}

export async function createTask(task: {
  title: string;
  description: string;
  time: string;
  priority: EPriority;
}) {
  const { data, error } = await supabase.from("tasks").insert([task]).select();

  if (error) {
    console.error("Error creating task:", error);
    return null;
  }

  return data;
}

export async function getAllTasks() {
  return handleSupabaseOperation(async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("createdat", { ascending: true });

    if (error) throw error;
    console.log({data})
    return data || [];
  }, "Error fetching appointments");
}
export async function getAllTaskCompleted(){
    return handleSupabaseOperation(async () => {
      const { data, error } = await supabase
        .from("completed_tasks")
        .select("*")
        .order("completed_at", { ascending: true });
      if (error) throw error;
      return data || [];
    }, "Error fetching appointments");
  }
export async function deleteTask(id: string) {
  return handleSupabaseOperation(async () => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) throw error;
    return true;
  }, `Error deleting task with id ${id}`);
}
export async function editTask(taskId: string, updates: Partial<Task>) {
  const { data, error } = await supabase
    .from("Tasks")
    .update(updates)
    .eq("id", taskId)
    .select();

  if (error) {
    console.error("Error updating task:", error);
    return null;
  }

  return data;
}
export async function markTaskAsCompleted(taskId: string) {
  const { data: completedData, error: completedError } = await supabase
    .from("completed_tasks")
    .insert([{ task_id: taskId }])
    .select();

  if (completedError) {
    console.error("Error marking task as completed:", completedError);
    return null;
  }

  // const { data: taskData, error: taskError } = await supabase
  //   .from('tasks')
  //   .update({ status: 'Completed' })
  //   .eq('id', taskId)
  //   .select();

  // if (taskError) {
  //   console.error('Error updating task status:', taskError);
  //   return null;
  // }

  return completedData;
}
export async function getCompletedTasksToday() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from("completed_tasks")
    .select("*", { count: "exact" })
    .gte("completed_at", startOfDay.toISOString())
    .lt("completed_at", endOfDay.toISOString());

  if (error) {
    console.error("Error fetching completed tasks:", error);
    return null;
  }
  return data;
}
export async function confirmDeletionTask(taskId: string) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  const { data, error } = await supabase
    .from("completed_tasks")
    .delete()
    .eq("task_id", taskId)
    .gte("completed_at", startOfDay.toISOString())
    .lt("completed_at", endOfDay.toISOString());

  if (error) {
    console.error("Error confirming deletion:", error);
    return false;
  }

  return true;
}
export async function getWeeklyTaskData(): Promise<
  Array<{ day: string; completed: number; total: number }>
> {
    const totalTasks = await getAllTasks();
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const endOfWeek = new Date(now);
  endOfWeek.setHours(23, 59, 59, 999);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const { data: tasks, error } = await supabase
    .from("completed_tasks")
    .select("*")
    .gte("completed_at", startOfWeek.toISOString())
    .lte("completed_at", endOfWeek.toISOString());

  if (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Failed to fetch tasks");
  }

  const dayMap: { [key: string]: { completed: number; total: number } } = {
    Sun: { completed: 0, total: 0 },
    Mon: { completed: 0, total: 0 },
    Tue: { completed: 0, total: 0 },
    Wed: { completed: 0, total: 0 },
    Thu: { completed: 0, total: 0 },
    Fri: { completed: 0, total: 0 },
    Sat: { completed: 0, total: 0 },
  };

  tasks.forEach((task) => {
    const completedAt = new Date(task.completed_at);
    const day = completedAt.toLocaleDateString("en-US", { weekday: "short" });

    dayMap[day].total += 1;

    if (task.completed) {
      dayMap[day].completed += 1;
    }
  });

  const weeklyData = Object.entries(dayMap).map(([day, counts]) => ({
    day,
    completed: counts.total,
    total: totalTasks.length,
  }));

  return weeklyData;
}


  export async function getMonthlyTaskData(): Promise<
  Array<{ week: string; completion: number }>
> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const { data: tasks, error } = await supabase
    .from("completed_tasks")
    .select("*")
    .gte("completed_at", startOfMonth.toISOString())
    .lte("completed_at", endOfMonth.toISOString());

  if (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Failed to fetch tasks");
  }

  const weeklyData: { [key: string]: { completed: number; total: number } } = {};

  tasks.forEach((task) => {
    const completedAt = new Date(task.completed_at);
    const weekNumber = Math.ceil(completedAt.getDate() / 7);
    const weekKey = `Week ${weekNumber}`;

    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = { completed: 0, total: 0 };
    }

    weeklyData[weekKey].total += 1;

    weeklyData[weekKey].completed += 1;
  });

  const monthlyData = Object.entries(weeklyData).map(([week, counts]) => ({
    week,
    completion: Math.round((counts.completed / counts.total * 7) * 100),
  }));

  return monthlyData;
}