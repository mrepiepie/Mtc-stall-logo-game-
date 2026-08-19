import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function PUT(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { id, answer, image_url, difficulty } = body as {
    id?: unknown;
    answer?: unknown;
    image_url?: unknown;
    difficulty?: unknown;
  };

  if (
    typeof id !== "string" ||
    !id.trim() ||
    typeof answer !== "string" ||
    !answer.trim() ||
    typeof image_url !== "string" ||
    !image_url.trim()
  ) {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  const normalizedDifficulty = typeof difficulty === "string" ? difficulty.trim().toLowerCase() : "";

  if (!['easy', 'medium', 'hard'].includes(normalizedDifficulty)) {
    return NextResponse.json(
      { success: false, error: "Invalid difficulty" },
      { status: 400 },
    );
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("questions")
      .update({
        answer: answer.trim().toLowerCase(),
        image_url: image_url.trim(),
        difficulty: normalizedDifficulty,
      })
      .eq("id", id.trim())
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { success: false, error: "Failed to update question" },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, question: data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update question" },
      { status: 500 },
    );
  }
}
