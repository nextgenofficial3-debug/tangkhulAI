"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { TangkhulKeyboard } from "@/components/TangkhulKeyboard";
import { ChatBubble } from "@/components/ChatBubble";
import { Send, Keyboard, Trash2 } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Yo! I am Rā — a language spirit that learns from you.\n\nI know very little Tangkhul right now. Will you teach me? \nTry asking me to translate something to Tangkhul, then correct me if I'm wrong.\nEvery correction makes me smarter. 🙏",
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contributorName, setContributorName] = useState("");
  const [correctionsToday, setCorrectionsToday] = useState(0);
  const [stats, setStats] = useState({ words: 0, corrections: 0 });
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const name = localStorage.getItem("tangkhul_contributor_name");
    if (name) setContributorName(name);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    supabase.from("chat_corrections")
      .select("*", { count: "exact" })
      .gte("created_at", todayStart.toISOString())
      .then(({ count }) => setCorrectionsToday(count ?? 0));

    Promise.all([
      supabase.from("learned_pairs").select("*", { count: "exact", head: true }),
      supabase.from("chat_corrections").select("*", { count: "exact", head: true }),
    ]).then(([learnedPairs, chatCorrections]) => {
      setStats({
        words: learnedPairs.count ?? 0,
        corrections: chatCorrections.count ?? 0,
      });
    });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setShowKeyboard(false);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          contributor_name: contributorName || "Anonymous",
        }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Matheimanei\ (I don't know!) — Please teach me. I had trouble reaching my AI spirit. Try again?",
        },
      ]);
    }
    setLoading(false);
  };

  const handleCorrection = async (corrected: string, note: string) => {
    if (!contributorName) {
      const name = prompt("Please enter your name to save corrections:") || "Anonymous";
      setContributorName(name);
      localStorage.setItem("tangkhul_contributor_name", name);
    }

    await supabase.from("chat_corrections").insert({
      original_ai_response: messages[messages.length - 1]?.content || "",
      corrected_text: corrected,
      context_message: note,
      contributor_name: contributorName || "Anonymous",
    });

    setCorrectionsToday((prev) => prev + 1);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Ningshihair! I've learned from your correction. I'll remember: "${corrected}"${
          note ? ` (${note})` : ""
        }`,
      },
    ]);
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#4CAF50] animate-pulse-subtle" />
          <div>
            <h1 className="text-lg font-semibold">
              Tangkhul <span className="text-[#c9a84c]">Rā</span>
            </h1>
            <p className="text-xs text-[#a89f85]">Taught today: {correctionsToday} corrections</p>
          </div>
        </div>
        <div className="text-xs text-[#a89f85] text-right">
          <p>Dataset: {stats.words} words</p>
          <p>{stats.corrections} corrections</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin rounded-lg border border-[#2d4a33] bg-[#0f1a12] p-4 mb-4">
        {messages.map((msg, i) => (
          <ChatBubble
            key={i}
            message={msg.content}
            isAi={msg.role === "assistant"}
            onCorrect={
              msg.role === "assistant" && i === messages.length - 1
                ? handleCorrection
                : undefined
            }
          />
        ))}
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="bg-[#1a2e1e] border border-[#2d4a33] rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse-subtle" />
                <span className="text-xs text-[#a89f85]">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="relative">
        {showKeyboard && (
          <div className="mb-2 animate-fade-in">
            <TangkhulKeyboard targetRef={inputRef} onChange={setInput} />
          </div>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => setShowKeyboard(!showKeyboard)}
            className={`p-3 rounded-lg border transition-colors ${
              showKeyboard
                ? "bg-[#c9a84c] text-[#0f1a12] border-[#c9a84c]"
                : "bg-transparent text-[#a89f85] border-[#2d4a33] hover:border-[#c9a84c]/50"
            }`}
          >
            <Keyboard size={18} />
          </button>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-[#0f1a12] border border-[#2d4a33] rounded-lg px-4 py-3 text-[#f0ead8] focus:border-[#c9a84c] outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="p-3 bg-[#c9a84c] text-[#0f1a12] rounded-lg hover:bg-[#e8c97a] transition-colors disabled:opacity-50"
          >
            <Send size={18} />
          </button>
          <button
            onClick={clearChat}
            className="p-3 text-[#a89f85] border border-[#2d4a33] rounded-lg hover:text-[#f0ead8] hover:border-[#8B2635] transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}