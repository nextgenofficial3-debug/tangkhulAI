import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { callNemotron, buildTranslationSystemPrompt } from "@/lib/nemotron";

export async function POST(req: NextRequest) {
  try {
    const { english_text } = await req.json();

    if (!english_text) {
      return NextResponse.json({ error: "english_text is required" }, { status: 400 });
    }

    const words = english_text.split(/\s+/);
    const matchPromises = words.map((word: string) =>
      supabase
        .from("words")
        .select("tangkhul_word, english_word, phonetic")
        .or(
          `english_word.ilike.%${word}%,tangkhul_word.ilike.%${word}%`
        )
        .limit(5)
    );

    const results = await Promise.all(matchPromises);
    const matchedWords = results
      .flatMap((r) => r.data ?? [])
      .filter(
        (v, i, a) => a.findIndex((t) => t.tangkhul_word === v.tangkhul_word) === i
      );

    const systemPrompt = buildTranslationSystemPrompt(matchedWords);

    const res = await callNemotron(
      [{ role: "user", content: `Translate this to Tangkhul: "${english_text}"` }],
      systemPrompt,
      false
    );

    const data = await res.json();
    const translation = data.choices?.[0]?.message?.content || "Rilu! Translation failed.";

    return NextResponse.json({
      translation,
      matched_words_count: matchedWords.length,
    });
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json(
      { error: "Failed to process translation request" },
      { status: 500 }
    );
  }
}