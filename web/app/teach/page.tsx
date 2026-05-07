"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { TangkhulKeyboard } from "@/components/TangkhulKeyboard";
import { CheckCircle, AlertCircle, BookOpen } from "lucide-react";

const partsOfSpeech = [
  "Noun",
  "Verb",
  "Adjective",
  "Adverb",
  "Phrase",
  "Greeting",
  "Number",
  "Other",
];

const encouragements = [
  "Every word you teach is a seed planted for future generations.",
  "Language is the thread that weaves a people together.",
  "Thank you for being part of this journey.",  "Your contribution echoes in eternity.",
  "Each word you add brings us closer to a living digital archive.",
];

interface Category {
  id: number;
  group_name: string;
  name: string;
  emoji?: string;
}

interface Word {
  tangkhul_word: string;
  english_word: string;
  contributor_name: string;
}

export default function TeachPage() {
  const [tangkhulWord, setTangkhulWord] = useState("");
  const [englishWord, setEnglishWord] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState("");
  const [category, setCategory] = useState("");
  const [exampleTangkhul, setExampleTangkhul] = useState("");
  const [exampleEnglish, setExampleEnglish] = useState("");
  const [grammarNotes, setGrammarNotes] = useState("");
  const [contributorName, setContributorName] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [groupedCategories, setGroupedCategories] = useState<Record<string, Category[]>>({});
  const [recentWords, setRecentWords] = useState<Word[]>([]);
  const [wordsToday, setWordsToday] = useState(0);
  const [encouragementIdx, setEncouragementIdx] = useState(0);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const tangkhulRef = useRef<HTMLInputElement>(null);
  const exampleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const name = localStorage.getItem("tangkhul_contributor_name");
    if (name) setContributorName(name);

    supabase.from("categories")
      .select("*")
      .order("group_name")
      .order("name")
      .then(({ data }) => {
        if (data) {
          setCategories(data);
          const grouped: Record<string, Category[]> = {};
          data.forEach((c) => {
            if (!grouped[c.group_name]) grouped[c.group_name] = [];
            grouped[c.group_name].push(c);
          });
          setGroupedCategories(grouped);
        }
      });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    supabase.from("words")
      .select("*", { count: "exact" })
      .gte("created_at", todayStart.toISOString())
      .then(({ count }) => setWordsToday(count ?? 0));

    supabase.from("words")
      .select("tangkhul_word, english_word, contributor_name")
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => setRecentWords(data ?? []));

    const encInterval = setInterval(() => {
      setEncouragementIdx((prev) => (prev + 1) % encouragements.length);
    }, 10000);
    return () => clearInterval(encInterval);
  }, []);

  const handleSubmit = async () => {
    if (!tangkhulWord.trim() || !englishWord.trim() || !contributorName.trim()) {
      setMessage({ type: "error", text: "Tangkhul word, English word, and contributor name are required." });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    const { data: dupes } = await supabase.from("words")
      .select("contributor_name, tangkhul_word")
      .ilike("tangkhul_word", tangkhulWord.trim())
      .ilike("english_word", englishWord.trim());

    if (dupes && dupes.length > 0) {
      const sameContributor = dupes.find(
        (d) => d.contributor_name.toLowerCase() === contributorName.trim().toLowerCase()
      );
      if (sameContributor) {
        setMessage({
          type: "error",
          text: "You already contributed this exact word! Try a different word or variation.",
        });
        setSubmitting(false);
        return;
      }
      setMessage({
        type: "error",
        text: `This word was already contributed by ${dupes[0].contributor_name}! You can still add a variation or different example sentence.`,
      });
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("words").insert({
      tangkhul_word: tangkhulWord.trim(),
      english_word: englishWord.trim(),
      phonetic: phonetic.trim() || null,
      part_of_speech: partOfSpeech || null,
      category: category || null,
      example_tangkhul: exampleTangkhul.trim() || null,
      example_english: exampleEnglish.trim() || null,
      grammar_notes: grammarNotes.trim() || null,
      contributor_name: contributorName.trim(),
    });

    if (error) {
      setMessage({ type: "error", text: `Error saving: ${error.message}` });
    } else {
      setMessage({ type: "success", text: "Word saved to the dataset!" });
      setTangkhulWord("");
      setEnglishWord("");
      setPhonetic("");
      setPartOfSpeech("");
      setCategory("");
      setExampleTangkhul("");
      setExampleEnglish("");
      setGrammarNotes("");
      setWordsToday((prev) => prev + 1);
      setRecentWords((prev) => [
        { tangkhul_word: tangkhulWord.trim(), english_word: englishWord.trim(), contributor_name: contributorName.trim() },
        ...prev.slice(0, 4),
      ]);
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-wide">
          Teach a <span className="text-[#c9a84c]">Word</span>
        </h1>
        <p className="text-[#a89f85] mt-2">Share your knowledge of Tangkhul with the world.</p>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-lg mb-6 ${
            message.type === "success"
              ? "bg-[#4CAF50]/10 border border-[#4CAF50]/30 text-[#4CAF50]"
              : "bg-[#8B2635]/10 border border-[#8B2635]/30 text-[#e8c97a]"
          }`}
        >
          {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-5">
          <div>
            <label className="block text-sm text-[#a89f85] mb-1">Tangkhul word *</label>
            <input
              ref={tangkhulRef}
              value={tangkhulWord}
              onChange={(e) => setTangkhulWord(e.target.value)}
              lang="tkt"
              className="tangkhul-text w-full bg-[#0f1a12] border border-[#2d4a33] rounded-lg px-4 py-3 text-[#f0ead8] focus:border-[#c9a84c] outline-none"
              placeholder="Enter the Tangkhul word"
            />
            <TangkhulKeyboard targetRef={tangkhulRef} onChange={setTangkhulWord} />
          </div>

          <div>
            <label className="block text-sm text-[#a89f85] mb-1">English word *</label>
            <input
              value={englishWord}
              onChange={(e) => setEnglishWord(e.target.value)}
              className="w-full bg-[#0f1a12] border border-[#2d4a33] rounded-lg px-4 py-3 text-[#f0ead8] focus:border-[#c9a84c] outline-none"
              placeholder="Enter the English translation"
            />
          </div>

          <div>
            <label className="block text-sm text-[#a89f85] mb-1">
              Phonetic pronunciation <span className="text-xs">(optional)</span>
            </label>
            <input
              value={phonetic}
              onChange={(e) => setPhonetic(e.target.value)}
              placeholder="e.g. ka-zhei"
              className="w-full bg-[#0f1a12] border border-[#2d4a33] rounded-lg px-4 py-3 text-[#f0ead8] focus:border-[#c9a84c] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-[#a89f85] mb-2">Part of speech</label>
            <div className="flex flex-wrap gap-2">
              {partsOfSpeech.map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => setPartOfSpeech(partOfSpeech === pos ? "" : pos)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    partOfSpeech === pos
                      ? "bg-[#c9a84c] text-[#0f1a12] border-[#c9a84c] font-medium"
                      : "bg-transparent text-[#a89f85] border-[#2d4a33] hover:border-[#c9a84c]/50"
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#a89f85] mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0f1a12] border border-[#2d4a33] rounded-lg px-4 py-3 text-[#f0ead8] focus:border-[#c9a84c] outline-none"
            >
              <option value="">Select a category</option>
              {Object.entries(groupedCategories).map(([group, cats]) => (
                <optgroup key={group} label={group}>
                  {cats.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.emoji} {c.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-[#a89f85] mb-1">
              Example sentence in Tangkhul <span className="text-xs">(optional)</span>
            </label>
            <textarea
              ref={exampleRef}
              value={exampleTangkhul}
              onChange={(e) => setExampleTangkhul(e.target.value)}
              lang="tkt"
              rows={3}
              className="tangkhul-text w-full bg-[#0f1a12] border border-[#2d4a33] rounded-lg px-4 py-3 text-[#f0ead8] focus:border-[#c9a84c] outline-none resize-none"
            />
            <TangkhulKeyboard targetRef={exampleRef} onChange={setExampleTangkhul} />
          </div>

          <div>
            <label className="block text-sm text-[#a89f85] mb-1">
              Example sentence in English <span className="text-xs">(optional)</span>
            </label>
            <textarea
              value={exampleEnglish}
              onChange={(e) => setExampleEnglish(e.target.value)}
              rows={3}
              className="w-full bg-[#0f1a12] border border-[#2d4a33] rounded-lg px-4 py-3 text-[#f0ead8] focus:border-[#c9a84c] outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-[#a89f85] mb-1">
              Grammar notes <span className="text-xs">(optional)</span>
            </label>
            <textarea
              value={grammarNotes}
              onChange={(e) => setGrammarNotes(e.target.value)}
              rows={2}
              className="w-full bg-[#0f1a12] border border-[#2d4a33] rounded-lg px-4 py-3 text-[#f0ead8] focus:border-[#c9a84c] outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-[#a89f85] mb-1">Contributor name *</label>
            <input
              value={contributorName}
              onChange={(e) => {
                setContributorName(e.target.value);
                localStorage.setItem("tangkhul_contributor_name", e.target.value);
              }}
              className="w-full bg-[#0f1a12] border border-[#2d4a33] rounded-lg px-4 py-3 text-[#f0ead8] focus:border-[#c9a84c] outline-none"
              placeholder="Your name or pseudonym"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-[#c9a84c] text-[#0f1a12] font-semibold py-3 px-6 rounded-lg hover:bg-[#e8c97a] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? "Saving..." : "Save to Dataset →"}
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1e3523] border border-[#2d4a33] rounded-lg p-6">
            <h3 className="text-sm font-medium text-[#a89f85] uppercase tracking-wider mb-3">Preview</h3>
            {tangkhulWord || englishWord ? (
              <div className="space-y-2">
                <p className="tangkhul-text text-[#c9a84c] text-xl font-semibold">{tangkhulWord || "—"}</p>
                {phonetic && <p className="text-sm text-[#a89f85]">[{phonetic}]</p>}
                <p className="text-[#f0ead8]">{englishWord || "—"}</p>
                {partOfSpeech && (
                  <span className="inline-block text-xs px-2 py-1 rounded-full bg-[#2d4a33] text-[#e8c97a]">{partOfSpeech}</span>
                )}
                {exampleTangkhul && (
                  <div className="border-t border-[#2d4a33] pt-2 mt-2">
                    <p className="text-sm text-[#e8c97a] italic">{exampleTangkhul}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-[#a89f85] text-sm">Start typing to see a preview...</p>
            )}
          </div>

          <div className="bg-[#1e3523] border border-[#2d4a33] rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={16} className="text-[#c9a84c]" />
              <span className="text-sm text-[#a89f85]">Words added today</span>
            </div>
            <p className="text-3xl font-bold text-[#c9a84c]">{wordsToday}</p>
          </div>

          <div className="bg-[#1e3523] border border-[#2d4a33] rounded-lg p-6">
            <h3 className="text-sm text-[#a89f85] mb-3">Recent contributions</h3>
            <div className="space-y-3">
              {recentWords.map((w, i) => (
                <div key={i} className="border-b border-[#2d4a33] pb-2 last:border-0">
                  <p className="tangkhul-text text-[#c9a84c] text-sm">{w.tangkhul_word}</p>
                  <p className="text-xs text-[#a89f85]">{w.english_word} &middot; {w.contributor_name}</p>
                </div>
              ))}
              {recentWords.length === 0 && (
                <p className="text-xs text-[#a89f85]">No contributions yet. Be the first!</p>
              )}
            </div>
          </div>

          <div className="bg-[#1a2e1e] border border-[#2d4a33] rounded-lg p-4">
            <p className="text-sm text-[#e8c97a] italic">{encouragements[encouragementIdx]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}