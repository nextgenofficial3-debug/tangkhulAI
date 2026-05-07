"use client";
import Image from "next/image";
import Link from "next/link";

const chars = [
  { char: "Ā", name: "Long A", note: "uppercase" },
  { char: "A̲", name: "Underlined A", note: "uppercase" },
  { char: "ā", name: "Long a", note: "lowercase" },
  { char: "a̲", name: "Underlined a", note: "lowercase" },
  { char: "A", name: "Standard A", note: "uppercase" },
  { char: "a", name: "Standard a", note: "lowercase" },
];

const phases = [
  {
    phase: "Phase 1",
    title: "Community Dataset Collection",
    status: "ACTIVE",
    statusColor: "bg-[#4CAF50]/20 text-[#4CAF50] border-[#4CAF50]/40",
    desc: "Building the world's largest Tangkhul language corpus through community contributions.",
  },
  {
    phase: "Phase 2",
    title: "Fine-tuned Tangkhul AI Model",
    status: "COMING SOON",
    statusColor: "bg-[#c9a84c]/20 text-[#c9a84c] border-[#c9a84c]/40",
    desc: "Release of the first Tangkhul-specialized AI model trained on community data.",
  },
  {
    phase: "Phase 3",
    title: "Tangkhul Speech & Voice",
    status: "PLANNED",
    statusColor: "bg-[#a89f85]/20 text-[#a89f85] border-[#a89f85]/40",
    desc: "Tangkhul speech recognition, text-to-speech, and voice AI.",
  },
  {
    phase: "Phase 4",
    title: "Discover Ukhrul Integration",
    status: "VISION",
    statusColor: "bg-[#3B1FA8]/20 text-[#C4B5FD] border-[#3B1FA8]/40",
    desc: "Full Tangkhul language AI embedded into the Discover Ukhrul App.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-[#1a2e1e] border-b border-[#2d4a33] py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-[#c9a84c] font-medium tracking-widest uppercase mb-4">Our Story</p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-wide mb-4">
            Preserving a language,{" "}
            <span className="text-[#c9a84c]">one word at a time.</span>
          </h1>
          <p className="text-lg text-[#a89f85] max-w-2xl mx-auto">
            Built by the community, for the community.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-6">
          The <span className="text-[#c9a84c]">Tangkhul</span> Language
        </h2>
        <div className="bg-[#1e3523] border border-[#2d4a33] rounded-lg p-6 md:p-8 text-[#a89f85] space-y-4 leading-relaxed">
          <p>
            Tangkhul (also called Tangkhulic) is a Tibeto-Burman language spoken by the Tangkhul
            Naga people, primarily in the Ukhrul and Kamjong districts of Manipur, India, as well
            as in parts of Nagaland. With approximately 150,000 speakers, it is one of the major
            Naga languages.
          </p>
          <p>
            Like many indigenous languages, Tangkhul faces the threat of language shift as younger
            generations increasingly use English, Hindi, and Meiteilon. The language has its own
            unique script characters including special vowels:
          </p>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 my-6">
            {chars.map((c) => (
              <div
                key={c.char}
                className="bg-[#0f1a12] border border-[#2d4a33] rounded-lg p-4 text-center"
              >
                <p className="text-2xl font-semibold text-[#c9a84c]">{c.char}</p>
                <p className="text-xs text-[#a89f85] mt-1">{c.name}</p>
                <p className="text-[10px] text-[#a89f85] opacity-60">{c.note}</p>
              </div>
            ))}
          </div>

          <p>
            This project is a community-driven effort to preserve Tangkhul in digital form &mdash;
            not as a static archive, but as a living, learning AI that grows with every contribution.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-6">
          Our <span className="text-[#c9a84c]">Mission</span>
        </h2>
        <div className="bg-[#1e3523] border border-[#2d4a33] rounded-lg p-6 md:p-8 text-[#a89f85] space-y-4 leading-relaxed">
          <p>
            Our mission is to create the world&apos;s largest open-source Tangkhul language dataset
            and use it to train AI models that can understand, speak, and teach Tangkhul.
          </p>
          <p>
            This dataset will be used to fine-tune large language models &mdash; creating a digital
            guardian for the Tangkhul language that future generations can interact with.
          </p>
          <p>
            Every word, correction, and translation you contribute brings us closer to a future
            where Tangkhul is not just preserved, but actively thriving in the digital age.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: "Speakers", value: "150,000" },
            { label: "Categories", value: "18" },
            { label: "Years Documented", value: "~130" },
            { label: "Communities", value: "1" },
          ].map((s) => (
            <div key={s.label} className="bg-[#1e3523] border border-[#2d4a33] rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#c9a84c]">{s.value}</p>
              <p className="text-xs text-[#a89f85] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-6">
          The <span className="text-[#c9a84c]">Technology</span>
        </h2>
        <div className="bg-[#1e3523] border border-[#2d4a33] rounded-lg p-6 md:p-8 text-[#a89f85] space-y-4 leading-relaxed">
          <p>
            Tangkhul AI is powered by <strong className="text-[#f0ead8]">Nemotron 3 Nano 30B A3B</strong> &mdash;
            NVIDIA&apos;s most efficient open reasoning model, available through NVIDIA NIM. Think of it as a
            highly capable AI brain that learns new languages rapidly with a 1 million token context window.
          </p>
          <p>
            <strong className="text-[#f0ead8]">Fine-tuning</strong> is the process of teaching a general AI
            model to specialize in a specific domain &mdash; in this case, the Tangkhul language. Every 12
            hours, the model automatically retrains on all new community contributions, gradually improving
            its Tangkhul abilities.
          </p>
          <p>
            The more words, corrections, and translations you provide, the smarter Rā becomes.
            You are literally teaching an AI to speak your language.
          </p>
        </div>

        <div className="mt-6 bg-[#1a2e1e] border border-[#2d4a33] rounded-lg p-5">
          <p className="text-sm font-medium text-[#c9a84c] mb-3">Auto-tune Pipeline</p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#a89f85]">
            <span className="bg-[#2d4a33] px-3 py-1.5 rounded">Community contributes</span>
            <span className="text-[#c9a84c]">→</span>
            <span className="bg-[#2d4a33] px-3 py-1.5 rounded">Supabase stores</span>
            <span className="text-[#c9a84c]">→</span>
            <span className="bg-[#2d4a33] px-3 py-1.5 rounded">Every 12hrs: Nemotron retrains</span>
            <span className="text-[#c9a84c]">→</span>
            <span className="bg-[#2d4a33] px-3 py-1.5 rounded text-[#f0ead8]">Rā improves</span>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-6">
          The <span className="text-[#c9a84c]">Builder</span>
        </h2>
        <div className="bg-[#1e3523] border border-[#2d4a33] rounded-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="shrink-0">
              <Image
                src="/team/jihal.jpg"
                alt="Jihal Shimray — Founder & CEO"
                width={120}
                height={120}
                className="rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const el = document.getElementById("jihal-initials");
                  if (el) el.style.display = "flex";
                }}
              />
              <div
                id="jihal-initials"
                style={{ display: "none" }}
                className="w-[120px] h-[120px] rounded-full bg-[#3B1FA8] flex items-center justify-center text-white text-2xl font-bold"
              >
                JS
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-[#f0ead8]">Jihal Shimray</h3>
              <p className="text-sm text-[#a89f85]">Founder &amp; CEO &middot; eX Holding</p>
              <p className="text-sm text-[#a89f85] mt-3 leading-relaxed">
                Building at the intersection of culture, technology, and community.
                Tangkhul AI is part of the upcoming Discover Ukhrul App &mdash; a platform
                to celebrate and digitize the culture of Ukhrul, Manipur.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                {[
                  { handle: "@itsnextgenfounder", url: "https://instagram.com/itsnextgenfounder", label: "Personal" },
                  { handle: "@hashtagdropee", url: "https://instagram.com/hashtagdropee", label: "Brand" },
                  { handle: "@ex_holdings", url: "https://instagram.com/ex_holdings", label: "Company" },
                ].map((link) => (
                  <a
                    key={link.handle}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-[#c9a84c] hover:text-[#e8c97a] transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                    <span>{link.handle}</span>
                    <span className="text-xs text-[#a89f85]">({link.label})</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm text-[#a89f85] mt-4 text-center">
          The true heroes are the community contributors who share their knowledge of Tangkhul.
          Every name on the{" "}
          <Link href="/contributors" className="text-[#c9a84c] hover:text-[#e8c97a] transition-colors underline">
            Contributor Wall
          </Link>{" "}
          is part of this team.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-6">
          Part of Something <span className="text-[#c9a84c]">Bigger</span>
        </h2>
        <div className="bg-[#1e3523] border border-[#c9a84c]/20 rounded-lg p-6 md:p-8 text-[#a89f85] space-y-4 leading-relaxed">
          <p>
            Tangkhul AI is being developed by Hashtagdropee as a foundational component of
            the upcoming <strong className="text-[#f0ead8]">Discover Ukhrul App</strong> &mdash; a
            comprehensive platform to showcase and celebrate the culture, tourism, food, and people
            of Ukhrul, Manipur.
          </p>
          <p>
            The Tangkhul language AI will be embedded into Discover Ukhrul, giving the app
            a culturally authentic voice that speaks the language of the land.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="text-sm font-semibold text-[#c9a84c]">Tangkhul AI</span>
            <span className="text-[#c9a84c] text-lg">→</span>
            <span className="text-sm text-[#a89f85]">Discover Ukhrul</span>
            <span className="text-xs text-[#a89f85] bg-[#2d4a33] px-2 py-0.5 rounded">coming soon</span>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-6">
          The Road <span className="text-[#c9a84c]">Ahead</span>
        </h2>
        <div className="space-y-4">
          {phases.map((p, i) => (
            <div key={p.phase} className="bg-[#1e3523] border border-[#2d4a33] rounded-lg p-5">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="text-xs font-bold text-[#a89f85] tracking-wider">
                  {p.phase}
                </span>
                <h3 className="text-[#f0ead8] font-semibold flex-1">{p.title}</h3>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full border ${p.statusColor}`}
                >
                  {p.status}
                </span>
              </div>
              <p className="text-sm text-[#a89f85]">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}