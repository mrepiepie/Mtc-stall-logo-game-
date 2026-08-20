import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { pin, round } = await request.json();
    if (!pin || typeof round !== "number") {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    
    // Clear guesses for the new round and update round number and status
    const { error } = await supabase
      .from("active_game")
      .update({ 
        round: round, 
        status: "playing",
        guesses: {} // reset round guesses
      })
      .eq("id", Number(pin));

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
