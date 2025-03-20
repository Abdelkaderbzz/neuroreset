import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });
    const {data: profileData} = await supabase.from("users").select("*").eq("email", email.trim()).single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ data: { user: data.user, profile: profileData } });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: "Failed to login." }, { status: 500 });
  }
}
