import { randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

const REQUIRED_QUESTION_COUNT = 10;
const MAX_PIN_ATTEMPTS = 20;

function shuffleQuestions<T>(questions: T[]) {
  const shuffled = [...questions];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function createGamePin() {
  return randomInt(100000, 1000000);
}

export async function POST() {
  try {
    const supabase = createServerSupabaseClient();
    const { data: availableQuestions, error: questionsError } = await supabase
      .from("questions")
      .select("id, answer, image_url, difficulty");

    if (questionsError) {
      return NextResponse.json(
        { success: false, error: "Failed to load questions" },
        { status: 500 },
      );
    }

    if (!availableQuestions || availableQuestions.length < REQUIRED_QUESTION_COUNT) {
      return NextResponse.json(
        { success: false, error: "At least 10 questions are required" },
        { status: 400 },
      );
    }

    const selectedQuestions = shuffleQuestions(availableQuestions).slice(0, REQUIRED_QUESTION_COUNT);
    const selectedQuestionIds = selectedQuestions.map((question) => question.id);

    for (let attempt = 0; attempt < MAX_PIN_ATTEMPTS; attempt += 1) {
      const gamePin = createGamePin();
      const { data: existingGame, error: lookupError } = await supabase
        .from("active_game")
        .select("id")
        .eq("id", gamePin)
        .maybeSingle();

      if (lookupError) {
        return NextResponse.json(
          { success: false, error: "Failed to create game" },
          { status: 500 },
        );
      }

      if (existingGame) {
        continue;
      }

      const { data: createdGame, error: insertError } = await supabase
        .from("active_game")
        .insert({
          id: gamePin,
          status: "waiting",
          round: 1,
          logos: selectedQuestionIds,
        })
        .select("id, status, round, logos")
        .single();

      if (!insertError && createdGame) {
        return NextResponse.json({
          success: true,
          gamePin,
          round: 1,
          questions: selectedQuestions,
        });
      }
    }

    return NextResponse.json(
      { success: false, error: "Unable to generate a unique game PIN" },
      { status: 500 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create game" },
      { status: 500 },
    );
  }
}
