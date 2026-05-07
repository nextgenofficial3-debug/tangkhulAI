"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase, type Word, type Category } from "@/lib/supabase";
import { WordCard } from "@/components/WordCard";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 24;

export default function DatasetPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPOS, setSelectedPOS] = useState("");
  const [sort, setSort] = useState("newest");
  const [stats, setStats] = useState({ words: 0, pos: 0, contributors: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    supabase.from("categories").select("*").order("name").then(({ data }) => {
      if (data) setCategories(data);
    });
    Promise.all([
      supabase.from("words").select("part_of_speech, contributor_name"),
      supabase.from("words").select("*", { count: "exact", head: true }),
    ]).then(([wordsRes, countRes]) => {
      if (wordsRes.data) {
        const posSet = new Set<string>();
        const contribSet = new Set<string>();
        wordsRes.data.forEach((w) => {
          if (w.part_of_speech) posSet.add(w.part_of_speech);
          contribSet.add(w.contributor_name);
        });
        setStats({ words: countRes.count ?? 0, pos: posSet.size, contributors: contribSet.size });
      }
    });
  }, []);

  const fetchWords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from("words").select("*", { count: "exact" });

      if (searchTerm) {
        query = query.or(
          `tangkhul_word.ilike.%${searchTerm}%,english_word.ilike.%${searchTerm}%`
        );
      }
      if (selectedCategory) {
        query = query.eq("category", selectedCategory);
      }
      if (selectedPOS) {
        query = query.eq("part_of_speech", selectedPOS);
      }

      switch (sort) {
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        case "a-z-tangkhul":
          query = query.order("tangkhul_word", { ascending: true });
          break;
        case "a-z-english":
          query = query.order("english_word", { ascending: true });
          break;
        case "most-viewed":
          query = query.order("view_count", { ascending: false });
          break;
      }

      const from = page * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, count, error: fetchError } = await query;
      if (fetchError) throw fetchError;

      setWords((data || []) as Word[]);
      setTotalCount(count || 0);
      if (data && data.length > 0) {
        setLastUpdated(data[0].created_at);
      }
    } catch (err) {
      console.error("Dataset fetch error:", err);
      setError("Could not load dataset. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [page, sort, searchTerm, selectedCategory, selectedPOS]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const handleSearch = () => {
    setPage(0);
    setSearchTerm(searchTerm);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setPage(0);
  };

  const handlePOSChange = (value: string) => {
    setSelectedPOS(value);
    setPage(0);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(0);
  };

  const exportCSV = async () => {
    const { data } = await supabase.from("words").select("*").order("created_at", { ascending: false });
    if (!data) return;

    const headers = [
      "tangkhul_word",
      "english_word",
      "phonetic",
      "part_of_speech",
      "category",
      "example_tangkhul",
      "example_english",
      "grammar_notes",
      "contributor_name",
      "verified",
      "view_count",
      "created_at",
    ];

    const csvContent = [
      headers.join(","),
      ...data.map((row: Record<string, unknown>) =>
        headers
          .map((h) => {
            const val = String(row[h] ?? "");
            return val.includes(",") || val.includes('"') || val.includes("\n")
              ? `"${val.replace(/"/g, '""')}"`
              : val;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tangkhul-dataset-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-wide">
          Dataset <span className="text-[#c9a84c]">Showcase</span>
        </h1>
        <p className="text-[#a89f85] mt-2">Explore everything the community has built so far.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Words", value: stats.words },
          { label: "Parts of Speech", value: stats.pos },
          { label: "Contributors", value: stats.contributors },
          { label: "Last Updated", value: lastUpdated ? new Date(lastUpdated).toLocaleDateString() : "—" },
        ].map((s) => (
          <div key={s.label} className="bg-[#1e3523] border border-[#2d4a33] rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-[#c9a84c]">{s.value}</p>
            <p className="text-xs text-[#a89f85]">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-6 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-[#a89f85] mb-1">Search</label>
          <div className="relative">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search Tangkhul or English..."
              className="w-full bg-[#0f1a12] border border-[#2d4a33] rounded-lg pl-9 pr-3 py-2 text-sm text-[#f0ead8] focus:border-[#c9a84c] outline-none"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a89f85]" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-[#a89f85] mb-1">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="bg-[#0f1a12] border border-[#2d4a33] rounded-lg px-3 py-2 text-sm text-[#f0ead8] focus:border-[#c9a84c] outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-[#a89f85] mb-1">Part of Speech</label>
          <select
            value={selectedPOS}
            onChange={(e) => handlePOSChange(e.target.value)}
            className="bg-[#0f1a12] border border-[#2d4a33] rounded-lg px-3 py-2 text-sm text-[#f0ead8] focus:border-[#c9a84c] outline-none"
          >
            <option value="">All</option>
            {["Noun", "Verb", "Adjective", "Adverb", "Phrase", "Greeting", "Number", "Other"].map(
              (p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label className="block text-xs text-[#a89f85] mb-1">Sort</label>
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-[#0f1a12] border border-[#2d4a33] rounded-lg px-3 py-2 text-sm text-[#f0ead8] focus:border-[#c9a84c] outline-none"
          >
            <option value="newest">Newest</option>
            <option value="a-z-tangkhul">A-Z (Tangkhul)</option>
            <option value="a-z-english">A-Z (English)</option>
            <option value="most-viewed">Most Viewed</option>
          </select>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 bg-[#1a2e1e] border border-[#2d4a33] text-[#a89f85] hover:text-[#c9a84c] px-3 py-2 rounded-lg text-sm transition-colors"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#a89f85]">Loading...</div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-[#a89f85] mb-4">{error}</p>
          <button
            onClick={fetchWords}
            className="text-[#c9a84c] hover:underline text-sm"
          >
            Try again
          </button>
        </div>
      ) : words.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#2d4a33] rounded-xl">
          <p className="text-lg text-[#a89f85] mb-2">
            No words yet
          </p>
          <p className="text-sm text-[#6b8a6e] mb-6">
            The dataset is empty — be the first to contribute!
          </p>
          <a
            href="/teach"
            className="inline-block bg-[#c9a84c] text-[#0f1a12] px-6 py-2.5 rounded-lg font-medium hover:bg-[#d4b75a] transition-colors"
          >
            Add a word
          </a>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {words.map((word) => (
              <WordCard key={word.id} word={word} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="p-2 border border-[#2d4a33] rounded-lg text-[#a89f85] hover:text-[#c9a84c] disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 7) {
                  pageNum = i;
                } else if (page < 3) {
                  pageNum = i;
                } else if (page > totalPages - 4) {
                  pageNum = totalPages - 7 + i;
                } else {
                  pageNum = page - 3 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                      pageNum === page
                        ? "bg-[#c9a84c] text-[#0f1a12] font-medium"
                        : "text-[#a89f85] hover:text-[#c9a84c]"
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="p-2 border border-[#2d4a33] rounded-lg text-[#a89f85] hover:text-[#c9a84c] disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}