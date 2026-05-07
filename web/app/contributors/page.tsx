"use client";
import { useState, useEffect, useRef } from "react";
import { supabase, type Contributor } from "@/lib/supabase";
import { ContributorCard } from "@/components/ContributorCard";
import { TangkhulKeyboard } from "@/components/TangkhulKeyboard";

export default function ContributorsPage() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [region, setRegion] = useState("");
  const [message, setMessage] = useState("");
  const [emailConsent, setEmailConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    supabase.from("contributors")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data, count }) => {
        if (data) setContributors(data as Contributor[]);
        setTotalCount(count ?? 0);
      });
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setSubmitMsg({ type: "error", text: "Your name is required." });
      return;
    }
    setSubmitting(true);
    setSubmitMsg(null);

    const { error } = await supabase.from("contributors").insert({
      name: name.trim(),
      contact: contact.trim() || null,
      region: region.trim() || null,
      message: message.trim() || null,
      email_consent: emailConsent,
    });

    if (error) {
      setSubmitMsg({ type: "error", text: `Error: ${error.message}` });
    } else {
      setSubmitMsg({ type: "success", text: "Thank you! Your mark has been left on this project." });
      setContributors((prev) => [
        {
          id: "",
          name: name.trim(),
          contact: contact.trim() || undefined,
          region: region.trim() || undefined,
          message: message.trim() || undefined,
          email_consent: emailConsent,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      setTotalCount((prev) => prev + 1);
      setName("");
      setContact("");
      setRegion("");
      setMessage("");
      setEmailConsent(false);
    }
    setSubmitting(false);
  };

  const displayed = showAll ? contributors : contributors.slice(0, 8);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <section className="bg-[#1a2e1e] border border-[#2d4a33] rounded-lg p-8 mb-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide mb-4">
          Contributor <span className="text-[#c9a84c]">Wall</span>
        </h1>
        <p className="text-[#e8c97a] text-lg leading-relaxed max-w-3xl mx-auto mb-4">
          To every person who has shared a word, a phrase, a story in Tangkhul —
          you are not just contributing to a dataset. You are keeping a language alive.
          Your name, your knowledge, your culture will echo in an AI that speaks your tongue.
        </p>
        <p className="text-[#c9a84c] font-semibold text-lg">Thank you. 🙏</p>
      </section>

      <div className="bg-[#1e3523] border border-[#2d4a33] rounded-lg p-6 mb-10">
        <h2 className="text-lg font-semibold text-[#f0ead8] mb-4">Leave Your Mark</h2>

        {submitMsg && (
          <div
            className={`px-4 py-3 rounded-lg mb-4 text-sm ${
              submitMsg.type === "success"
                ? "bg-[#4CAF50]/10 border border-[#4CAF50]/30 text-[#4CAF50]"
                : "bg-[#8B2635]/10 border border-[#8B2635]/30 text-[#e8c97a]"
            }`}
          >
            {submitMsg.text}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#a89f85] mb-1">Your name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0f1a12] border border-[#2d4a33] rounded-lg px-4 py-2.5 text-[#f0ead8] focus:border-[#c9a84c] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-[#a89f85] mb-1">
              Email <span className="text-xs">(optional — for Phase 2 updates)</span>
            </label>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              type="email"
              className="w-full bg-[#0f1a12] border border-[#2d4a33] rounded-lg px-4 py-2.5 text-[#f0ead8] focus:border-[#c9a84c] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-[#a89f85] mb-1">
              Village / District / Region <span className="text-xs">(optional)</span>
            </label>
            <input
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-[#0f1a12] border border-[#2d4a33] rounded-lg px-4 py-2.5 text-[#f0ead8] focus:border-[#c9a84c] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-[#a89f85] mb-1">
              A message or word in Tangkhul <span className="text-xs">(optional)</span>
            </label>
            <textarea
              ref={messageRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              lang="tkt"
              rows={3}
              className="tangkhul-text w-full bg-[#0f1a12] border border-[#2d4a33] rounded-lg px-4 py-2.5 text-[#f0ead8] focus:border-[#c9a84c] outline-none resize-none"
            />
            <TangkhulKeyboard targetRef={messageRef} onChange={setMessage} />
          </div>
          <label className="flex items-center gap-2 text-sm text-[#a89f85] cursor-pointer">
            <input
              type="checkbox"
              checked={emailConsent}
              onChange={(e) => setEmailConsent(e.target.checked)}
              className="accent-[#c9a84c]"
            />
            Notify me when Phase 2 launches
          </label>
          <button
            onClick={handleSubmit}
            disabled={submitting || !name.trim()}
            className="bg-[#c9a84c] text-[#0f1a12] font-semibold py-2.5 px-6 rounded-lg hover:bg-[#e8c97a] transition-colors disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Leave Your Mark →"}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          Contributors <span className="text-[#c9a84c]">({totalCount})</span>
        </h2>
        <span className="text-sm text-[#a89f85]">and counting 🌱</span>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {displayed.map((c) => (
          <ContributorCard key={c.id || c.name + c.created_at} contributor={c} />
        ))}
      </div>

      {contributors.length > 8 && !showAll && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(true)}
            className="text-sm text-[#c9a84c] hover:text-[#e8c97a] transition-colors"
          >
            Show all {contributors.length} contributors →
          </button>
        </div>
      )}

      {contributors.length === 0 && (
        <div className="text-center py-12 text-[#a89f85]">
          No contributors yet. Be the first to leave your mark!
        </div>
      )}
    </div>
  );
}