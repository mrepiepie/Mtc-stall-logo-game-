import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(request: Request) {
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

  const { answer, image_url, difficulty } = body as {
    answer?: unknown;
    image_url?: unknown;
    difficulty?: unknown;
  };

  if (typeof answer !== "string" || !answer.trim()) {
    return NextResponse.json(
      { success: false, error: "Answer is required" },
      { status: 400 },
    );
  }

  if (typeof image_url !== "string" || !image_url.trim()) {
    return NextResponse.json(
      { success: false, error: "Image URL is required" },
      { status: 400 },
    );
  }

  const normalizedDifficulty = typeof difficulty === "string" ? difficulty.trim().toLowerCase() : "";

  if (!normalizedDifficulty || !["easy", "medium", "hard"].includes(normalizedDifficulty)) {
    return NextResponse.json(
      { success: false, error: "Difficulty must be easy, medium, or hard" },
      { status: 400 },
    );
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("questions")
      .insert({
        answer: answer.trim().toLowerCase(),
        image_url: image_url.trim(),
        difficulty: normalizedDifficulty,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: "Failed to create question" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, question: data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create question" },
      { status: 500 },
    );
  }
}
