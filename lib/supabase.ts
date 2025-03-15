import { createClient } from "@supabase/supabase-js"

// Check if environment variables are defined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase environment variables. Please check your .env.local file or Vercel environment variables.",
  )
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "")

// Helper function to check if Supabase is configured properly
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("profiles").select("count", { count: "exact", head: true })

    if (error) {
      throw error
    }

    return { success: true, message: "Successfully connected to Supabase" }
  } catch (error: any) {
    console.error("Supabase connection error:", error)
    return {
      success: false,
      message: error?.message || "Failed to connect to Supabase",
      details: error,
    }
  }
}

