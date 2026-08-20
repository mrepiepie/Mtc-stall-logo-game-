import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("questions")
      .select("id, answer, image_url, difficulty");

    if (error) {
      return NextResponse.json(
        { success: false, error: "Failed to load questions" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, questions: data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to load questions" },
      { status: 500 },
    );
  }
}
