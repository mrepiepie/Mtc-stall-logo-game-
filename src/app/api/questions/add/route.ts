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

  const { question_text, answer, points } = body as {
    question_text?: unknown;
    answer?: unknown;
    points?: unknown;
  };

  if (typeof question_text !== "string" || !question_text.trim()) {
    return NextResponse.json(
      { success: false, error: "Question text is required" },
      { status: 400 },
    );
  }

  if (typeof answer !== "string" || !answer.trim()) {
    return NextResponse.json(
      { success: false, error: "Answer is required" },
      { status: 400 },
    );
  }

  if (typeof points !== "number" || !Number.isFinite(points) || points <= 0) {
    return NextResponse.json(
      { success: false, error: "Points must be a positive number" },
      { status: 400 },
    );
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("questions")
      .insert({
        question_text: question_text.trim(),
        answer: answer.trim().toLowerCase(),
        points,
        question_type: "text",
        image_url: null,
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
