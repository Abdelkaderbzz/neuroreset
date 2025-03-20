"use client";

import { supabase } from "@/lib/supabase";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

// Define types for our data
export interface Task {
  id: string;
  title: string;
  description: string;
  time: string;
  priority?: "low" | "medium" | "high";
  completed: boolean;
  date: string; // ISO date string
}

export interface MoodEntry {
  id: string;
  mood: number;
  note?: string;
  date: string; // ISO date string
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPrivate: boolean;
  date: string; // ISO date string
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  completed: boolean;
  category: "sobriety" | "health" | "relationships" | "personal" | "other";
}

export interface UserSettings {
  notifications: boolean;
  darkMode: boolean;
  reminderTime: string;
  emergencyContacts: {
    name: string;
    phone: string;
    relationship: string;
  }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  emergency_contact: string;
  bio: string;
  sobrietyDate: string;
  recovery_type: string;
  avatar?: string;
  streak: number;
}

interface AppContextType {
  // User data
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "date">) => void;
  updateTask: (id: string, task: Partial<Omit<Task, "id">>) => void;
  deleteTask: (id: string) => void;

  // Mood tracking
  moodEntries: MoodEntry[];
  addMoodEntry: (entry: Omit<MoodEntry, "id" | "date">) => void;

  // Journal
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, "id" | "date">) => void;
  updateJournalEntry: (
    id: string,
    entry: Partial<Omit<JournalEntry, "id">>
  ) => void;
  deleteJournalEntry: (id: string) => void;

  // Goals
  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id">) => void;
  updateGoal: (id: string, goal: Partial<Omit<Goal, "id">>) => void;
  deleteGoal: (id: string) => void;

  // Settings
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;

  // App state
  isLoading: boolean;
  error: string | null;

  // Stats
  streakCount: number;
  completedTasksToday: number;
  totalTasksToday: number;
}

// Sample data
const sampleTasks: Task[] = [
  {
    id: "task-1",
    title: "Morning Meditation",
    description: "10-minute guided meditation for clarity",
    time: "8:00 AM",
    priority: "high",
    completed: false,
    date: new Date().toISOString(),
  },
  {
    id: "task-2",
    title: "Journal Entry",
    description: "Record your thoughts, feelings, and triggers",
    time: "12:00 PM",
    priority: "medium",
    completed: false,
    date: new Date().toISOString(),
  },
  {
    id: "task-3",
    title: "Physical Activity",
    description: "30 minutes of walking, yoga, or exercise",
    time: "5:00 PM",
    priority: "medium",
    completed: false,
    date: new Date().toISOString(),
  },
  {
    id: "task-4",
    title: "Support Group Meeting",
    description: "Virtual community check-in",
    time: "7:00 PM",
    priority: "high",
    completed: false,
    date: new Date().toISOString(),
  },
  {
    id: "task-5",
    title: "Evening Reflection",
    description: "Review your day and plan for tomorrow",
    time: "9:00 PM",
    priority: "low",
    completed: false,
    date: new Date().toISOString(),
  },
];

const sampleMoodEntries: MoodEntry[] = [
  {
    id: "mood-1",
    mood: 3,
    note: "Feeling okay, had some cravings but managed them",
    date: "2025-03-11T10:30:00Z",
  },
  {
    id: "mood-2",
    mood: 4,
    note: "Great day! Completed all my tasks",
    date: "2025-03-12T14:15:00Z",
  },
  {
    id: "mood-3",
    mood: 2,
    note: "Difficult day, struggled with triggers",
    date: "2025-03-13T18:45:00Z",
  },
  {
    id: "mood-4",
    mood: 3,
    note: "Better than yesterday, meditation helped",
    date: "2025-03-14T09:20:00Z",
  },
  {
    id: "mood-5",
    mood: 5,
    note: "Excellent day, feeling strong and positive",
    date: "2025-03-15T16:10:00Z",
  },
  {
    id: "mood-6",
    mood: 4,
    note: "Good day overall, enjoyed group session",
    date: "2025-03-16T11:30:00Z",
  },
  {
    id: "mood-7",
    mood: 3,
    note: "Relaxing day, some anxiety but manageable",
    date: "2025-03-17T20:00:00Z",
  },
];

const sampleJournalEntries: JournalEntry[] = [
  {
    id: "journal-1",
    title: "First day of recovery",
    content:
      "Today marks the beginning of my recovery journey. I'm feeling a mix of anxiety and hope. The onboarding process was helpful in setting realistic goals. I'm committed to taking this one day at a time.",
    tags: ["Day 1", "Beginning", "Hope"],
    isPrivate: true,
    date: "2025-03-12T08:30:00Z",
  },
  {
    id: "journal-2",
    title: "Identifying triggers",
    content:
      "I spent some time today reflecting on my triggers. Social gatherings with old friends seem to be the most challenging. I'm going to work on developing strategies to handle these situations better. The meditation session this morning was really helpful in clearing my mind.",
    tags: ["Triggers", "Awareness", "Meditation"],
    isPrivate: true,
    date: "2025-03-13T19:15:00Z",
  },
  {
    id: "journal-3",
    title: "Small victory today",
    content:
      "I successfully avoided a situation that would have been triggering. Instead of going to the usual Friday happy hour, I attended an online support group meeting. It felt empowering to make this choice. I'm proud of myself for prioritizing my recovery.",
    tags: ["Victory", "Support Group", "Choices"],
    isPrivate: false,
    date: "2025-03-14T21:45:00Z",
  },
];

const sampleGoals: Goal[] = [
  {
    id: "goal-1",
    title: "30 Days Sober",
    description: "Complete 30 consecutive days without alcohol",
    targetDate: "2025-04-15T00:00:00Z",
    progress: 25,
    completed: false,
    category: "sobriety",
  },
  {
    id: "goal-2",
    title: "Daily Meditation Habit",
    description: "Meditate for at least 10 minutes every day for 21 days",
    targetDate: "2025-04-05T00:00:00Z",
    progress: 40,
    completed: false,
    category: "health",
  },
  {
    id: "goal-3",
    title: "Reconnect with Family",
    description: "Have meaningful conversations with family members",
    targetDate: "2025-05-01T00:00:00Z",
    progress: 15,
    completed: false,
    category: "relationships",
  },
];

const defaultUserProfile: UserProfile = {
  id: '',
  name: "Alex Johnson",
  email: "alex@example.com",
  sobrietyDate: "2025-03-10T00:00:00Z",
  recovery_type: "Alcohol",
  avatar: "/placeholder.svg?height=128&width=128",
  streak: 0,
  phone: '+216 12345678',
  emergency_contact: '+216 12345678',
  bio: 'I am a recovering addict and I am here to help you on your journey to sobriety.'
};

const defaultUserSettings: UserSettings = {
  notifications: true,
  darkMode: false,
  reminderTime: "20:00",
  emergencyContacts: [
    {
      name: "Dr. Sarah Johnson",
      phone: "555-123-4567",
      relationship: "Therapist",
    },
    {
      name: "James Wilson",
      phone: "555-987-6543",
      relationship: "Sponsor",
    },
  ],
};

// Create context with default values
const AppContext = createContext<AppContextType>({
  // User data
  profile: defaultUserProfile,
  updateProfile: () => {},

  // Tasks
  tasks: [],
  addTask: () => {},
  updateTask: () => {},
  deleteTask: () => {},

  // Mood tracking
  moodEntries: [],
  addMoodEntry: () => {},

  // Journal
  journalEntries: [],
  addJournalEntry: () => {},
  updateJournalEntry: () => {},
  deleteJournalEntry: () => {},

  // Goals
  goals: [],
  addGoal: () => {},
  updateGoal: () => {},
  deleteGoal: () => {},

  // Settings
  settings: defaultUserSettings,
  updateSettings: () => {},

  // App state
  isLoading: false,
  error: null,

  // Stats
  streakCount: 0,
  completedTasksToday: 0,
  totalTasksToday: 0,
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  // State for user data
  const [profileId, setProfileId] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserProfile>(defaultUserProfile);
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [moodEntries, setMoodEntries] =
    useState<MoodEntry[]>(sampleMoodEntries);
  const [journalEntries, setJournalEntries] =
    useState<JournalEntry[]>(sampleJournalEntries);
  const [goals, setGoals] = useState<Goal[]>(sampleGoals);
  const [settings, setSettings] = useState<UserSettings>(defaultUserSettings);

  useEffect(() => {
    // This code will only run in the browser
    const id = localStorage.getItem("user_id");
    setProfileId(id);
  }, []);
  // App state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const updateProfile = async () => {
      if (profileId) {
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select()
          .eq("id", profileId);
        setProfile(profileData?.[0] || defaultUserProfile);
        localStorage.setItem(
          "neuroReset_profile",
          JSON.stringify(profileData?.[0])
        );
      }
    };
    updateProfile();
  }, [profileId]);
  // Load data from localStorage on initial render
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call or loading from localStorage
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Load from localStorage if available
        const storedProfile = localStorage.getItem("neuroReset_profile");
        const storedTasks = localStorage.getItem("neuroReset_tasks");
        const storedMoodEntries = localStorage.getItem(
          "neuroReset_moodEntries"
        );
        const storedJournalEntries = localStorage.getItem(
          "neuroReset_journalEntries"
        );
        const storedGoals = localStorage.getItem("neuroReset_goals");
        const storedSettings = localStorage.getItem("neuroReset_settings");

        if (storedProfile) setProfile(JSON.parse(storedProfile));
        if (storedTasks) setTasks(JSON.parse(storedTasks));
        if (storedMoodEntries) setMoodEntries(JSON.parse(storedMoodEntries));
        if (storedJournalEntries)
          setJournalEntries(JSON.parse(storedJournalEntries));
        if (storedGoals) setGoals(JSON.parse(storedGoals));
        if (storedSettings) setSettings(JSON.parse(storedSettings));

        setIsLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load your data. Please refresh the page.");
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("neuroReset_profile", JSON.stringify(profile));
      localStorage.setItem("neuroReset_tasks", JSON.stringify(tasks));
      localStorage.setItem(
        "neuroReset_moodEntries",
        JSON.stringify(moodEntries)
      );
      localStorage.setItem(
        "neuroReset_journalEntries",
        JSON.stringify(journalEntries)
      );
      localStorage.setItem("neuroReset_goals", JSON.stringify(goals));
      localStorage.setItem("neuroReset_settings", JSON.stringify(settings));
    }
  }, [isLoading, profile, tasks, moodEntries, journalEntries, goals, settings]);

  // Calculate stats
  const today = new Date().toISOString().split("T")[0];
  const todaysTasks = tasks.filter((task) => task.date.startsWith(today));
  const completedTasksToday = todaysTasks.filter(
    (task) => task.completed
  ).length;
  const totalTasksToday = todaysTasks.length;

  // Calculate streak
  const calculateStreak = () => {
    // In a real app, this would be more sophisticated
    return 7; // Placeholder
  };

  const streakCount = calculateStreak();

  // User profile functions
  const updateProfile = (newProfileData: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...newProfileData }));
  };

  // Task functions
  const addTask = (task: Omit<Task, "id" | "date">) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      date: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id: string, taskUpdate: Partial<Omit<Task, "id">>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...taskUpdate } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Mood tracking functions
  const addMoodEntry = (entry: Omit<MoodEntry, "id" | "date">) => {
    const newEntry: MoodEntry = {
      ...entry,
      id: `mood-${Date.now()}`,
      date: new Date().toISOString(),
    };
    setMoodEntries((prev) => [...prev, newEntry]);
  };

  // Journal functions
  const addJournalEntry = (entry: Omit<JournalEntry, "id" | "date">) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: `journal-${Date.now()}`,
      date: new Date().toISOString(),
    };
    setJournalEntries((prev) => [...prev, newEntry]);
  };

  const updateJournalEntry = (
    id: string,
    entryUpdate: Partial<Omit<JournalEntry, "id">>
  ) => {
    setJournalEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, ...entryUpdate } : entry
      )
    );
  };

  const deleteJournalEntry = (id: string) => {
    setJournalEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  // Goal functions
  const addGoal = (goal: Omit<Goal, "id">) => {
    const newGoal: Goal = {
      ...goal,
      id: `goal-${Date.now()}`,
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const updateGoal = (id: string, goalUpdate: Partial<Omit<Goal, "id">>) => {
    setGoals((prev) =>
      prev.map((goal) => (goal.id === id ? { ...goal, ...goalUpdate } : goal))
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  // Settings functions
  const updateSettings = (settingsUpdate: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...settingsUpdate }));
  };

  const contextValue: AppContextType = {
    // User data
    profile,
    updateProfile,

    // Tasks
    tasks,
    addTask,
    updateTask,
    deleteTask,

    // Mood tracking
    moodEntries,
    addMoodEntry,

    // Journal
    journalEntries,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,

    // Goals
    goals,
    addGoal,
    updateGoal,
    deleteGoal,

    // Settings
    settings,
    updateSettings,

    // App state
    isLoading,
    error,

    // Stats
    streakCount,
    completedTasksToday,
    totalTasksToday,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
