import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { pin, playerName } = await request.json();

    if (!pin || !playerName || typeof playerName !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid input" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();
    
    // 1. Fetch current game
    const { data: game, error: lookupError } = await supabase
      .from("active_game")
      .select("id, status, players, logos")
      .eq("id", Number(pin))
      .single();

    if (lookupError || !game) {
      return NextResponse.json(
        { success: false, error: "Game not found" },
        { status: 404 }
      );
    }

    if (game.status !== "waiting") {
      return NextResponse.json(
        { success: false, error: "Game has already started" },
        { status: 403 }
      );
    }

    // 2. Append player (make sure it's an array)
    const currentPlayers = Array.isArray(game.players) ? game.players : [];
    
    // Avoid exact duplicates (though multiple 'Sanjit' could be tricky, we'll allow it for now or just append)
    const newPlayers = [...currentPlayers, playerName.trim()];

    // 3. Update the game row
    const { error: updateError } = await supabase
      .from("active_game")
      .update({ players: newPlayers })
      .eq("id", Number(pin));

    if (updateError) {
      return NextResponse.json(
        { success: false, error: "Failed to join game" },
        { status: 500 }
      );
    }

    const { data: qs } = await supabase.from('questions').select('id, answer');
    const formats = (game.logos || []).map((id: string) => qs?.find((q: any) => q.id === id)?.answer || '');
    return NextResponse.json({ success: true, gamePin: pin, formats });

  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
