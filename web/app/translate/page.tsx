"use client";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { TangkhulKeyboard } from "@/components/TangkhulKeyboard";
import { ArrowRight, Copy, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";

export default function TranslatePage() {
  const [englishText, setEnglishText] = useState("");
  const [translation, setTranslation] = useState("");
  const [confidence, setConfidence] = useState<"HIGH" | "MEDIUM" | "LOW" | null>(null);
  const [matchedCount, setMatchedCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const englishRef = useRef<HTMLTextAreaElement>(null);

  const handleTranslate = async () => {
    if (!englishText.trim()) return;
    setLoading(true);
    setFeedback(null);
    setTranslation("");

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ english_text: englishText.trim() }),
      });
      const data = await res.json();
      setTranslation(data.translation);
      setMatchedCount(data.matched_words_count ?? 0);

      const confMatch = data.translation?.match(/\[(HIGH|MEDIUM|LOW)\]/);
      if (confMatch) {
        setConfidence(confMatch[1]);
      } else {
        setConfidence(null);
      }
    } catch {
      setTranslation("Rilu! Translation failed. Please try again.");
      setConfidence("LOW");
    }
    setLoading(false);
  };

  const copyText = () => {
    navigator.clipboard.writeText(translation);
  };

  const submitFeedback = async (isCorrect: boolean) => {
    setFeedback(isCorrect);
    await supabase.from("translations_feedback").insert({
      english_input: englishText,
      tangkhul_output: translation,
      is_correct: isCorrect,
    });
  };

  const confidenceColors = {
    HIGH: "bg-[#4CAF50]/20 text-[#4CAF50] border-[#4CAF50]/40",
    MEDIUM: "bg-[#c9a84c]/20 text-[#c9a84c] border-[#c9a84c]/40",
    LOW: "bg-[#8B2635]/20 text-[#e8c97a] border-[#8B2635]/40",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-wide">
          <span className="text-[#c9a84c]">Translate</span> to Tangkhul
        </h1>
        <p className="text-[#a89f85] mt-2">Test English → Tangkhul using the community database and AI.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#1e3523] border border-[#2d4a33] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#a89f85] mb-3">English</h3>
          <textarea
            ref={englishRef}
            value={englishText}
            onChange={(e) => setEnglishText(e.target.value)}
            rows={6}
            className="w-full bg-[#0f1a12] border border-[#2d4a33] rounded-lg px-4 py-3 text-[#f0ead8] focus:border-[#c9a84c] outline-none resize-none"
            placeholder="Enter English text to translate..."
          />
          <TangkhulKeyboard targetRef={englishRef} onChange={setEnglishText} />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleTranslate}
              disabled={loading || !englishText.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-[#c9a84c] text-[#0f1a12] font-semibold py-2.5 px-4 rounded-lg hover:bg-[#e8c97a] transition-colors disabled:opacity-50"
            >
              {loading ? "Translating..." : "Translate →"}
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => {
                setEnglishText("");
                setTranslation("");
                setConfidence(null);
                setFeedback(null);
              }}
              className="px-3 py-2.5 border border-[#2d4a33] text-[#a89f85] rounded-lg hover:text-[#f0ead8] transition-colors"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        <div className="bg-[#1e3523] border border-[#2d4a33] rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-[#a89f85]">Tangkhul</h3>
            {confidence && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full border ${confidenceColors[confidence]}`}
              >
                {confidence}
              </span>
            )}
          </div>
          <div className="min-h-[160px]">
            {translation ? (
              <p className="tangkhul-text text-[#c9a84c] text-lg font-medium leading-relaxed">
                {translation.replace(/\[(HIGH|MEDIUM|LOW)\]/g, "")}
              </p>
            ) : (
              <p className="text-[#a89f85] text-sm">
                {loading ? "Consulting the spirits..." : "Translation will appear here..."}
              </p>
            )}
          </div>
          {translation && (
            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[#2d4a33]">
              <button
                onClick={copyText}
                className="flex items-center gap-1.5 text-xs text-[#a89f85] hover:text-[#c9a84c] transition-colors"
              >
                <Copy size={14} /> Copy
              </button>
              <button
                onClick={() => submitFeedback(true)}
                className={`flex items-center gap-1.5 text-xs transition-colors ${
                  feedback === true ? "text-[#4CAF50]" : "text-[#a89f85] hover:text-[#4CAF50]"
                }`}
              >
                <ThumbsUp size={14} /> Correct
              </button>
              <button
                onClick={() => submitFeedback(false)}
                className={`flex items-center gap-1.5 text-xs transition-colors ${
                  feedback === false ? "text-[#8B2635]" : "text-[#a89f85] hover:text-[#8B2635]"
                }`}
              >
                <ThumbsDown size={14} /> Wrong
              </button>
              {confidence === "LOW" && (
                <a href="/teach" className="flex items-center gap-1.5 text-xs text-[#c9a84c] hover:text-[#e8c97a] transition-colors ml-auto">
                  Help improve this! Teach the correct word →
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#1a2e1e] border border-[#2d4a33] rounded-lg p-5">
        <h3 className="text-sm font-medium text-[#c9a84c] mb-2">How it works</h3>
        <p className="text-sm text-[#a89f85] leading-relaxed">
          We search our community database for matching words, then pass them to
          Rā (Nemotron 3 Nano 30B) as context. The more words you contribute,
          the better translations become.
        </p>
        {matchedCount > 0 && (
          <p className="text-xs text-[#a89f85] mt-2">
            Found {matchedCount} matching word{matchedCount !== 1 ? "s" : ""} in the dataset.
          </p>
        )}
      </div>
    </div>
  );
}