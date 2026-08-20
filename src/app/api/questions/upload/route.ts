import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedTypes = new Map([
  ["image/png", ".png"],
  ["image/jpeg", ".jpg"],
  ["image/webp", ".webp"],
]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0 || !allowedTypes.has(file.type) || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "Please select a PNG, JPG, or WEBP image up to 5 MB." },
        { status: 400 },
      );
    }

    const extension = allowedTypes.get(file.type);
    const filePath = `${crypto.randomUUID()}${extension}`;
    const supabase = createServerSupabaseClient();
    const fileData = await file.arrayBuffer();
    const { error } = await supabase.storage
      .from("question-images")
      .upload(filePath, fileData, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return NextResponse.json(
        { success: false, error: "Unable to upload image. Please try again." },
        { status: 500 },
      );
    }

    const { data } = supabase.storage.from("question-images").getPublicUrl(filePath);

    return NextResponse.json({ success: true, image_url: data.publicUrl });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to upload image. Please try again." },
      { status: 500 },
    );
  }
}
