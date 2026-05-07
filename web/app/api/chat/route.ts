import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { callNemotron, TANGKHUL_KASAR_SYSTEM_PROMPT } from "@/lib/nemotron";

export async function POST(req: NextRequest) {
  try {
    const { messages, contributor_name } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages array is required" }, { status: 400 });
    }

    const { data: wordContext } = await supabase
      .from("words")
      .select("tangkhul_word, english_word, phonetic")
      .order("created_at", { ascending: false })
      .limit(150);

    const vocabularyContext = wordContext && wordContext.length > 0
      ? '\n\nCommunity vocabulary database:\n' +
        wordContext.map(w =>
          `- "${w.english_word}" = "${w.tangkhul_word}"${w.phonetic ? ` [${w.phonetic}]` : ''}`
        ).join('\n')
      : '\n\nThe community vocabulary database is currently empty.';

    let systemPrompt = TANGKHUL_KASAR_SYSTEM_PROMPT + vocabularyContext;

    const res = await callNemotron(messages, systemPrompt, false);
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "Rilu! I could not process that.";

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}