import {
  getAllTaskCompleted,
  getMonthlyTaskData,
  getWeeklyTaskData,
} from "@/api";
import { useState, useEffect } from "react";

export function useMonthlyTaskData() {
  const [monthlyData, setMonthlyData] = useState<
    Array<{ week: string; completion: number }>
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMonthlyTaskData();
        setMonthlyData(data);
      } catch (error) {
        console.error("Error fetching monthly data:", error);
      }
    };

    fetchData();
  }, []);

  return monthlyData;
}
export function useWeeklyTaskData() {
  const [weeklyData, setWeeklyData] = useState<
    Array<{ day: string; completed: number; total: number }>
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWeeklyTaskData();
        setWeeklyData(data);
      } catch (error) {
        console.error("Error fetching weekly data:", error);
      }
    };

    fetchData();
  }, []);

  return weeklyData;
}

export function useTaskCompleted() {
  const [taskCompleted, setTaskCompleted] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllTaskCompleted();
        setTaskCompleted(data);
      } catch (error) {
        console.error("Error fetching completed tasks:", error);
      }
    };
    fetchData();
  }, []);
  return { count: taskCompleted.length, tasks: taskCompleted };
}
