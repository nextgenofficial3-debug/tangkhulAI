import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const secret = process.env.AUTOTUNE_SECRET;

    if (!secret || authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: words } = await supabase.from("words")
      .select("tangkhul_word, english_word, phonetic, part_of_speech, example_tangkhul, example_english")
      .eq("verified", true);

    const { data: corrections } = await supabase.from("corrections")
      .select("corrected_tangkhul, corrected_english, original_text");

    const trainingData: Record<string, unknown>[] = [];

    if (words) {
      words.forEach((w) => {
        trainingData.push({
          messages: [
            {
              role: "system",
              content:
                "You are Rā, an AI learning the Tangkhul language. Respond accurately.",
            },
            {
              role: "user",
              content: `What is the Tangkhul word for "${w.english_word}"?`,
            },
            {
              role: "assistant",
              content: `The Tangkhul word for "${w.english_word}" is "${w.tangkhul_word}".${w.phonetic ? ` It is pronounced [${w.phonetic}].` : ""}`,
            },
          ],
        });

        if (w.example_tangkhul && w.example_english) {
          trainingData.push({
            messages: [
              {
                role: "system",
                content:
"You are Rā, an AI learning the Tangkhul language.",
              },
              {
                role: "user",
                content: `Show me an example sentence in Tangkhul using "${w.tangkhul_word}".`,
              },
              {
                role: "assistant",
                content: `Here is an example sentence:\nTangkhul: ${w.example_tangkhul}\nEnglish: ${w.example_english}`,
              },
            ],
          });
        }
      });
    }

    if (corrections) {
      corrections.forEach((c) => {
        trainingData.push({
          messages: [
            {
              role: "system",
              content:
                "You are Rā, an AI learning the Tangkhul language.",
            },
            {
              role: "user",
              content: `I think the correct form is: "${c.corrected_tangkhul}"${c.corrected_english ? ` (${c.corrected_english})` : ""}. Previously it was: "${c.original_text}".`,
            },
            {
              role: "assistant",
              content: `Thank you for the correction. I will use "${c.corrected_tangkhul}"${c.corrected_english ? ` meaning "${c.corrected_english}"` : ""} from now on.`,
            },
          ],
        });
      });
    }

    const { data: versionData, error: versionError } = await supabase.from("model_versions")
      .insert({
        version_number: 1,
        words_count: words?.length ?? 0,
        corrections_count: corrections?.length ?? 0,
        status: "pending",
      })
      .select()
      .single();

    if (versionError) {
      return NextResponse.json({ error: versionError.message }, { status: 500 });
    }

    return NextResponse.json({
      version_number: versionData.version_number,
      words_count: words?.length ?? 0,
      corrections_count: corrections?.length ?? 0,
      training_examples: trainingData.length,
      status: "ready",
    });
  } catch (error) {
    console.error("Autotune API error:", error);
    return NextResponse.json(
      { error: "Failed to process autotune request" },
      { status: 500 }
    );
  }
}