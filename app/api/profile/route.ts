import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
         const {id, ...profile} = await req.json();

      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .update(profile)
        .eq("id", id)
      if (profileError) {
        return NextResponse.json(
          { error: profileError.message },
          { status: 500 }
        );
      }
  
      return NextResponse.json({
        message: "Profile updated successfully",
        data: profileData,
      });
    } catch (error) {
      console.error("Error in API route:", error);
      return NextResponse.json({ error: "Failed to sign up." }, { status: 500 });
    }
  }