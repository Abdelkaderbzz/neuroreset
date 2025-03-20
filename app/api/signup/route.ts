import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, email, password, confirmPassword } = await req.json();

    if (!username || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    const { data: usernameData, error: usernameError } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username)
      .single();

    if (usernameData) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
    });
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 401 });
    }

    const { data: profileData, error: profileError } = await supabase
      .from("users")
      .insert([
        {
          id: authData.user?.id,
          name: username,
          username,
          email,
        },
      ])
      .single();
    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Signup successful",
      data: { authData, profileData },
    });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: "Failed to sign up." }, { status: 500 });
  }
}
