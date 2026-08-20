import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { pin, playerName, guess, timeLeft, maxTime } = await request.json();

    if (!pin || !playerName || typeof guess !== "string") {
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    
    // Fetch current game state
    const { data: game, error: lookupError } = await supabase
      .from("active_game")
      .select("id, status, round, logos, scores, guesses")
      .eq("id", Number(pin))
      .single();

    if (lookupError || !game) {
      return NextResponse.json({ success: false, error: "Game not found" }, { status: 404 });
    }

    if (game.status !== "playing") {
      return NextResponse.json({ success: false, error: "Not accepting guesses right now" }, { status: 403 });
    }

    // Check if player already guessed this round
    const currentGuesses = game.guesses || {};
    if (currentGuesses[playerName]) {
      return NextResponse.json({ success: false, error: "Already guessed" }, { status: 403 });
    }

    // Fetch the correct answer for the current round
    const currentLogoId = game.logos[game.round - 1]; // round is 1-indexed
    const { data: question } = await supabase
      .from("questions")
      .select("answer, difficulty")
      .eq("id", currentLogoId)
      .single();

    if (!question) {
      return NextResponse.json({ success: false, error: "Question not found" }, { status: 500 });
    }

    // Calculate score
    const normTarget = question.answer.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normGuess = guess.toLowerCase().replace(/[^a-z0-9]/g, '');
    const isCorrect = normTarget === normGuess;

    let pointsAwarded = 0;
    if (isCorrect) {
      // Base points based on difficulty (default 100)
      let basePoints = 100;
      if (question.difficulty === 'EASY') basePoints = 50;
      if (question.difficulty === 'HARD') basePoints = 150;

      // Speed bonus: score = max_points * (time_remaining / total_time)
      // Minimum 10 points for getting it right even at the last second
      pointsAwarded = Math.max(10, Math.floor(basePoints * (timeLeft / (maxTime || 10))));
    }

    // Update scores and guesses
    const newScores = { ...game.scores };
    newScores[playerName] = (newScores[playerName] || 0) + pointsAwarded;

    const newGuesses = { ...game.guesses };
    newGuesses[playerName] = {
      isCorrect,
      points: pointsAwarded,
      guess: guess
    };

    const { error: updateError } = await supabase
      .from("active_game")
      .update({ scores: newScores, guesses: newGuesses })
      .eq("id", Number(pin));

    if (updateError) {
      return NextResponse.json({ success: false, error: "Failed to save guess" }, { status: 500 });
    }

    return NextResponse.json({ success: true, isCorrect, pointsAwarded });

  } catch (err) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
