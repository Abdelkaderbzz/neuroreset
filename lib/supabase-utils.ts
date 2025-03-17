import { supabase } from "./supabase"

// Error handling wrapper
export async function handleSupabaseOperation(operation: () => Promise<any>, errorMessage: string) {
  try {
    return await operation()
  } catch (error) {
    console.error(`${errorMessage}:`, error)
    throw error
  }
}

// Appointments
export async function getAppointments() {
  return handleSupabaseOperation(async () => {
    const { data, error } = await supabase.from("appointments").select("*").order("date", { ascending: true })

    if (error) throw error
    return data || []
  }, "Error fetching appointments")
}

export async function getAppointmentById(id: string) {
  return handleSupabaseOperation(async () => {
    const { data, error } = await supabase.from("appointments").select("*").eq("id", id).single()

    if (error) throw error
    return data
  }, `Error fetching appointment with id ${id}`)
}

export async function getUpcomingAppointments(limit = 3) {
  return handleSupabaseOperation(async () => {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .gte("date", new Date().toISOString())
      .order("date", { ascending: true })
      .limit(limit)

    if (error) throw error
    return data || []
  }, "Error fetching upcoming appointments")
}

// Resources
export async function getResources(
  options: {
    searchQuery?: string
    category?: string | null
    type?: string | null
  } = {},
) {
  return handleSupabaseOperation(async () => {
    let query = supabase.from("resources").select("*")

    if (options.searchQuery) {
      query = query.or(`title.ilike.%${options.searchQuery}%,description.ilike.%${options.searchQuery}%`)
    }

    if (options.category) {
      query = query.eq("category", options.category)
    }

    if (options.type) {
      query = query.eq("type", options.type)
    }

    const { data, error } = await query.order("title")

    if (error) throw error
    return data || []
  }, "Error fetching resources")
}

export async function getResourceById(id: string) {
  return handleSupabaseOperation(async () => {
    const { data, error } = await supabase.from("resources").select("*").eq("id", id).single()

    if (error) throw error
    return data
  }, `Error fetching resource with id ${id}`)
}

export async function getSavedResources() {
  return handleSupabaseOperation(async () => {
    const { data, error } = await supabase.from("resources").select("*").eq("saved", true).limit(5)

    if (error) throw error
    return data || []
  }, "Error fetching saved resources")
}

export async function getRecommendedResources() {
  return handleSupabaseOperation(async () => {
    const { data, error } = await supabase.from("resources").select("*").eq("recommended", true).limit(3)

    if (error) throw error
    return data || []
  }, "Error fetching recommended resources")
}

// Resource Categories
export async function getResourceCategories() {
  return handleSupabaseOperation(async () => {
    const { data, error } = await supabase.from("resource_categories").select("*").order("name")

    if (error) throw error
    return data || []
  }, "Error fetching resource categories")
}

// User Profile
export async function getUserProfile() {
  return handleSupabaseOperation(async () => {
    const { data, error } = await supabase.from("profiles").select("*").single()

    if (error) throw error
    return data
  }, "Error fetching user profile")
}

// Emergency Contacts
export async function getEmergencyContacts() {
  return handleSupabaseOperation(async () => {
    const { data, error } = await supabase.from("emergency_contacts").select("*").order("name")

    if (error) throw error
    return data || []
  }, "Error fetching emergency contacts")
}

export async function addEmergencyContact(contact: any) {
  return handleSupabaseOperation(async () => {
    const { data, error } = await supabase.from("emergency_contacts").insert([contact]).select()

    if (error) throw error
    return data?.[0] || null
  }, "Error adding emergency contact")
}

export async function deleteEmergencyContact(id: string) {
  return handleSupabaseOperation(async () => {
    const { error } = await supabase.from("emergency_contacts").delete().eq("id", id)

    if (error) throw error
    return true
  }, `Error deleting emergency contact with id ${id}`)
}

// Toggle resource saved status
export async function toggleResourceSaved(id: string, saved: boolean) {
  return handleSupabaseOperation(async () => {
    const { data, error } = await supabase.from("resources").update({ saved }).eq("id", id).select()

    if (error) throw error
    return data?.[0] || null
  }, `Error updating saved status for resource with id ${id}`)
}

