import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { pin, playerName, guess, timeLeft, maxTime } = await request.json();

    if (!pin || !playerName || typeof guess !== "string") {
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    
    let retries = 5;
    let pointsAwarded = 0;
    let isCorrect = false;

    while (retries > 0) {
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

      // Only fetch the question on the first try
      if (retries === 5) {
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
        isCorrect = (normTarget === normGuess);

        if (isCorrect) {
          let basePoints = 100;
          if (question.difficulty === 'EASY') basePoints = 50;
          if (question.difficulty === 'HARD') basePoints = 150;
          pointsAwarded = Math.max(10, Math.floor(basePoints * (timeLeft / (maxTime || 10))));
        }
      }

      // Update scores and guesses
      const newScores = { ...(game.scores || {}) };
      newScores[playerName] = (newScores[playerName] || 0) + pointsAwarded;

      const newGuesses = { ...currentGuesses };
      newGuesses[playerName] = {
        isCorrect,
        points: pointsAwarded,
        guess: guess
      };

      // Attempt optimistic update
      let updateQuery = supabase
        .from("active_game")
        .update({ scores: newScores, guesses: newGuesses })
        .eq("id", Number(pin));
        
      if (game.guesses) {
        updateQuery = updateQuery.eq("guesses", JSON.stringify(game.guesses));
      } else {
        updateQuery = updateQuery.is("guesses", null);
      }
      
      const { data: updated, error: updateError } = await updateQuery.select("id");

      // Check if update was successful
      if (!updateError && updated && updated.length === 1) {
        return NextResponse.json({ success: true, isCorrect, pointsAwarded });
      }

      // Failed due to concurrency, retry
      retries--;
      if (retries > 0) {
        // Wait between 50ms to 150ms before retrying
        await new Promise(r => setTimeout(r, Math.random() * 100 + 50));
      }
    }

    return NextResponse.json({ success: false, error: "High traffic. Failed to save guess, please try again." }, { status: 409 });

  } catch (err) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
