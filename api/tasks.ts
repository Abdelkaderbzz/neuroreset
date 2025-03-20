import { supabase } from "@/lib/supabase";
import { handleSupabaseOperation } from "@/lib/supabase-utils";
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

export async function createTask(
  task: {
    title: string;
    description: string;
    time: string;
    priority: EPriority;
  },
  user_id: string
) {
  const { data, error } = await supabase
    .from("tasks")
    .insert([{ ...task, user_id }])
    .select();

  if (error) {
    console.error("Error creating task:", error);
    return null;
  }

  return data;
}

export async function getAllTasks(user_id: string) {
  return handleSupabaseOperation(async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user_id)
      .order("createdat", { ascending: true });

    if (error) throw error;
    return data || [];
  }, "Error fetching appointments");
}
export async function getAllTaskCompleted() {
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
    .from("tasks")
    .update(updates)
    .eq("id", taskId)
    .select();

  if (error) {
    console.error("Error updating task:", error);
    return null;
  }

  return data;
}
// export async function markTaskAsCompleted(taskId: string, user_id: string) {
//   const { data: completedData, error: completedError } = await supabase
//     .from("completed_tasks")
//     .insert([{ task_id: taskId }])
//     .select();

//   if (completedError) {
//     console.error("Error marking task as completed:", completedError);
//     return null;
//   }

//   // const { data: taskData, error: taskError } = await supabase
//   //   .from('tasks')
//   //   .update({ status: 'Completed' })
//   //   .eq('id', taskId)
//   //   .select();

//   // if (taskError) {
//   //   console.error('Error updating task status:', taskError);
//   //   return null;
//   // }

//   return completedData;
// }
export async function markTaskAsCompleted(taskId: string, user_id: string) {
  // Mark the task as completed
  const { data: completedData, error: completedError } = await supabase
    .from("completed_tasks")
    .insert([{ task_id: taskId, user_id: user_id }])
    .select();

  if (completedError) {
    console.error("Error marking task as completed:", completedError);
    return null;
  }

  // Get today's date range
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0); // Start of the day (00:00:00.000)

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999); // End of the day (23:59:59.999)

  // Check if this is the first task completed today
  const { data: todayTasks, error: todayTasksError } = await supabase
    .from("completed_tasks")
    .select("*", { count: "exact" })
    .eq("user_id", user_id)
    .gte("completed_at", startOfDay.toISOString()) // Tasks completed after the start of the day
    .lt("completed_at", endOfDay.toISOString()); // Tasks completed before the end of the day

  if (todayTasksError) {
    console.error("Error fetching today's tasks:", todayTasksError);
    return null;
  }

  // Get yesterday's date range
  const startOfYesterday = new Date();
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  startOfYesterday.setHours(0, 0, 0, 0); // Start of yesterday (00:00:00.000)

  const endOfYesterday = new Date();
  endOfYesterday.setDate(endOfYesterday.getDate() - 1);
  endOfYesterday.setHours(23, 59, 59, 999); // End of yesterday (23:59:59.999)

  // Check if there was a task completed yesterday
  const { data: yesterdayTasks, error: yesterdayTasksError } = await supabase
    .from("completed_tasks")
    .select("*", { count: "exact" })
    .eq("user_id", user_id)
    .gte("completed_at", startOfYesterday.toISOString()) // Tasks completed after the start of yesterday
    .lt("completed_at", endOfYesterday.toISOString()); // Tasks completed before the end of yesterday

  if (yesterdayTasksError) {
    console.error("Error fetching yesterday's tasks:", yesterdayTasksError);
    return null;
  }

  // Fetch the current streak for the user
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("streak")
    .eq("id", user_id)
    .single();

  if (userError) {
    console.error("Error fetching user data:", userError);
    return null;
  }

  let newStreak = 0;

  // If there was a task completed yesterday, increment the streak
  if (yesterdayTasks && yesterdayTasks.length > 0) {
    newStreak = (userData.streak || 0) + 1;
  } else {
    // Otherwise, reset the streak to 0
    newStreak = 1;
  }

  // Update the user's streak in the users table
  const { data: updatedUser, error: updateError } = await supabase
    .from("users")
    .update({ streak: newStreak })
    .eq("id", user_id)
    .select();
  if (updateError) {
    console.error("Error updating user streak:", updateError);
    return null;
  }

  return completedData;
}
export async function getCompletedTasksToday(user_id: string) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from("completed_tasks")
    .select("*", { count: "exact" })
    .eq("user_id", user_id)
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
export async function getWeeklyTaskData(
  user_id: string
): Promise<Array<{ day: string; completed: number; total: number }>> {
  const totalTasks = await getAllTasks(user_id);
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

  const weeklyData: { [key: string]: { completed: number; total: number } } =
    {};

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
    completion: Math.round((counts.completed / counts.total) * 7 * 100),
  }));

  return monthlyData;
}
