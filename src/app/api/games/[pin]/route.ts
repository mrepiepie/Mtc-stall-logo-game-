export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

type RouteContext = {
  params: Promise<{ pin: string }>;
};

type QuestionId = string;

type GameRow = {
  id: number;
  status: string;
  round: number;
  logos: unknown;
  players: string[];
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { pin } = await params;

  if (!/^\d{6}$/.test(pin)) {
    return NextResponse.json(
      { success: false, error: "Game not found" },
      { status: 404 },
    );
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data: game, error: gameError } = await supabase
      .from("active_game")
      .select("id, status, round, logos, players")
      .eq("id", Number(pin))
      .maybeSingle<GameRow>();

    if (gameError) {
      return NextResponse.json(
        { success: false, error: "Failed to load game" },
        { status: 500 },
      );
    }

    if (!game) {
      return NextResponse.json(
        { success: false, error: "Game not found" },
        { status: 404 },
      );
    }

    if (!Array.isArray(game.logos) || game.logos.length === 0 || !game.logos.every((id): id is QuestionId => typeof id === "string")) {
      return NextResponse.json(
        { success: false, error: "Failed to load game" },
        { status: 500 },
      );
    }

    const questionIds = game.logos;
    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select("id, answer, image_url, difficulty")
      .in("id", questionIds);

    if (questionsError) {
      return NextResponse.json(
        { success: false, error: "Failed to load game" },
        { status: 500 },
      );
    }

    const questionsById = new Map(questions.map((question) => [String(question.id), question]));
    const orderedQuestions = questionIds
      .map((questionId) => questionsById.get(questionId))
      .filter((question): question is NonNullable<typeof question> => question !== undefined);

    if (orderedQuestions.length !== questionIds.length) {
      return NextResponse.json(
        { success: false, error: "Failed to load game" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      gamePin: game.id,
      status: game.status,
      round: game.round,
      questions: orderedQuestions,
      players: game.players || [],
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to load game" },
      { status: 500 },
    );
  }
}
