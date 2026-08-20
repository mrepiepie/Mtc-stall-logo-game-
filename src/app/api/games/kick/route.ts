import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { pin, playerName } = await request.json();

    if (!pin || !playerName) {
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    
    // Fetch current game
    const { data: game, error: lookupError } = await supabase
      .from("active_game")
      .select("id, players")
      .eq("id", Number(pin))
      .single();

    if (lookupError || !game) {
      return NextResponse.json({ success: false, error: "Game not found" }, { status: 404 });
    }

    const currentPlayers = Array.isArray(game.players) ? game.players : [];
    const newPlayers = currentPlayers.filter(p => p !== playerName);

    // Update the game row
    const { error: updateError } = await supabase
      .from("active_game")
      .update({ players: newPlayers })
      .eq("id", Number(pin));

    if (updateError) {
      return NextResponse.json({ success: false, error: "Failed to kick player" }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
