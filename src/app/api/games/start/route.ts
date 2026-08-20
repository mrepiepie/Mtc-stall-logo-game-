import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { pin } = await request.json();

    if (!pin) {
      return NextResponse.json({ success: false, error: "Missing PIN" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    
    const { error: updateError } = await supabase
      .from("active_game")
      .update({ status: "playing" })
      .eq("id", Number(pin));

    if (updateError) {
      return NextResponse.json(
        { success: false, error: "Failed to start game" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, gamePin: pin });

  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
