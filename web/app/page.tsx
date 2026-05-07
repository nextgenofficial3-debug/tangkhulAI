"use client";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, MessageCircle, Languages, Library } from "lucide-react";
import { supabase } from "@/lib/supabase";

const features = [
  {
    icon: <BookOpen size={28} />,
    title: "Teach a Word",
    desc: "Add vocabulary, phrases and grammar to the growing dataset",
    href: "/teach",
  },
  {
    icon: <MessageCircle size={28} />,
    title: "Chat & Train",
    desc: "Correct the AI as it learns to speak Tangkhul",
    href: "/chat",
  },
  {
    icon: <Languages size={28} />,
    title: "Translate",
    desc: "Test English → Tangkhul using the community database",
    href: "/translate",
  },
  {
    icon: <Library size={28} />,
    title: "Browse Dataset",
    desc: "Explore everything the community has built so far",
    href: "/dataset",
  },
];

const encouragements = [
  "Every word you teach is a seed planted for future generations.",
  "Language is the thread that weaves a people together.",
  "Thank you for being part of this journey.",  "Your contribution echoes in eternity.",
];

export default function LandingPage() {
  const [stats, setStats] = useState({ words: 0, corrections: 0, contributors: 0, categories: 0 });
  const [taglineIdx, setTaglineIdx] = useState(0);

  useEffect(() => {
    async function loadStats() {
      const [words, corrections, contributors, categories] = await Promise.all([
        supabase.from("words").select("*", { count: "exact", head: true }),
        supabase.from("corrections").select("*", { count: "exact", head: true }),
        supabase.from("contributors").select("*", { count: "exact", head: true }),
        supabase.from("categories").select("*", { count: "exact", head: true }),
      ]);
      setStats({
        words: words.count ?? 0,
        corrections: corrections.count ?? 0,
        contributors: contributors.count ?? 0,
        categories: categories.count ?? 0,
      });
    }
    loadStats();
    const tagInterval = setInterval(() => {
      setTaglineIdx((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(tagInterval);
  }, []);

  const taglines = ["Preserve.", "Teach.", "Evolve."];

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="grain-bg absolute inset-0" />
        <svg className="absolute bottom-0 left-0 w-full h-48 opacity-10" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#c9a84c" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,202.7C960,181,1056,139,1152,133.3C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-[0.2em] mb-6">
            TANGKHUL <span className="text-[#c9a84c]">AI</span>
          </h1>
          <div className="h-12 mb-4">
            <span key={taglineIdx} className="text-3xl md:text-4xl text-[#e8c97a] font-light animate-fade-in inline-block">
              {taglines[taglineIdx]}
            </span>
          </div>
          <p className="max-w-2xl mx-auto text-[#a89f85] text-lg leading-relaxed mb-10">
            A community-powered pre-training dataset to save the Tangkhul language.
            Every word you contribute trains an AI that speaks your language.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/teach"
              className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0f1a12] px-6 py-3 rounded-lg font-semibold hover:bg-[#e8c97a] transition-colors"
            >
              Teach a Word <ArrowRight size={18} />
            </a>
            <a
              href="/chat"
              className="inline-flex items-center gap-2 border border-[#c9a84c] text-[#c9a84c] px-6 py-3 rounded-lg font-semibold hover:bg-[#c9a84c]/10 transition-colors"
            >
              Chat with AI <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-[#2d4a33] bg-[#1a2e1e] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Words Contributed", value: stats.words },
              { label: "Corrections Made", value: stats.corrections },
              { label: "Contributors", value: stats.contributors },
              { label: "Categories", value: stats.categories },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-[#c9a84c]">{s.value}</p>
                <p className="text-sm text-[#a89f85]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <a
                key={f.title}
                href={f.href}
                className="bg-[#1e3523] border border-[#2d4a33] rounded-lg p-6 hover:border-[#c9a84c]/40 transition-all group"
              >
                <div className="text-[#c9a84c] mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-[#f0ead8] mb-2">{f.title}</h3>
                <p className="text-sm text-[#a89f85] leading-relaxed">{f.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}