"use client";
import { useState, useEffect } from "react";
import { supabase, type ModelVersion } from "@/lib/supabase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Clock, Activity, Brain } from "lucide-react";

export default function EvolutionPage() {
  const [versions, setVersions] = useState<ModelVersion[]>([]);
  const [wordHistory, setWordHistory] = useState<{ date: string; words: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: v } = await supabase.from("model_versions")
        .select("*")
        .order("version_number", { ascending: false });
      if (v) setVersions(v as ModelVersion[]);

      const { data: w } = await supabase.from("words")
        .select("created_at")
        .order("created_at", { ascending: true });

      if (w) {
        const dateMap: Record<string, number> = {};
        w.forEach((word) => {
          const date = new Date(word.created_at).toLocaleDateString();
          dateMap[date] = (dateMap[date] || 0) + 1;
        });
        setWordHistory(
          Object.entries(dateMap).map(([date, words]) => ({
            date,
            words,
          }))
        );
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const lastVersion = versions[0];
  const nextTraining = lastVersion
    ? new Date(new Date(lastVersion.trained_at).getTime() + 12 * 60 * 60 * 1000).toLocaleString()
    : "—";
  const lastTraining = lastVersion ? new Date(lastVersion.trained_at).toLocaleString() : "—";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-wide">
          Model <span className="text-[#c9a84c]">Evolution</span>
        </h1>
        <p className="text-[#a89f85] mt-2">
          Watch Rā grow smarter with every community contribution.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1e3523] border border-[#2d4a33] rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <Brain size={18} className="text-[#c9a84c]" />
            <span className="text-xs text-[#a89f85] uppercase tracking-wider">Status</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#4CAF50] animate-pulse-subtle" />
            <span className="text-[#f0ead8] font-medium">Ready</span>
          </div>
        </div>
        <div className="bg-[#1e3523] border border-[#2d4a33] rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} className="text-[#c9a84c]" />
            <span className="text-xs text-[#a89f85] uppercase tracking-wider">Last Training</span>
          </div>
          <p className="text-[#f0ead8] font-medium text-sm">{lastTraining}</p>
        </div>
        <div className="bg-[#1e3523] border border-[#2d4a33] rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={18} className="text-[#c9a84c]" />
            <span className="text-xs text-[#a89f85] uppercase tracking-wider">Next Training</span>
          </div>
          <p className="text-[#f0ead8] font-medium text-sm">{nextTraining}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#1e3523] border border-[#2d4a33] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#a89f85] mb-4">Words Contributed Over Time</h3>
          {wordHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={wordHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d4a33" />
                <XAxis dataKey="date" tick={{ fill: "#a89f85", fontSize: 10 }} />
                <YAxis tick={{ fill: "#a89f85", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    background: "#1a2e1e",
                    border: "1px solid #2d4a33",
                    borderRadius: 8,
                    color: "#f0ead8",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="words"
                  stroke="#c9a84c"
                  strokeWidth={2}
                  dot={{ fill: "#c9a84c", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-[#a89f85] text-sm">
              No data yet. Start contributing!
            </div>
          )}
        </div>

        <div className="bg-[#1e3523] border border-[#2d4a33] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#a89f85] mb-4">Model Versions</h3>
          {versions.length > 0 ? (
            <div className="space-y-3">
              {versions.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between border-b border-[#2d4a33] pb-2 last:border-0"
                >
                  <div>
                    <span className="text-sm font-medium text-[#c9a84c]">
                      v{v.version_number}
                    </span>
                    <span
                      className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                        v.status === "ready"
                          ? "bg-[#4CAF50]/20 text-[#4CAF50]"
                          : v.status === "training"
                            ? "bg-[#c9a84c]/20 text-[#c9a84c]"
                            : "bg-[#a89f85]/20 text-[#a89f85]"
                      }`}
                    >
                      {v.status}
                    </span>
                  </div>
                  <span className="text-xs text-[#a89f85]">
                    {v.words_count} words · {v.corrections_count} corrections
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-[#a89f85] text-sm">
              No model versions yet. The first training run will appear after the auto-tune pipeline runs.
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#1e3523] border border-[#2d4a33] rounded-lg p-6">
        <h3 className="text-sm font-medium text-[#a89f85] mb-4">The Model is Learning</h3>
        {versions.length > 0 ? (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-[#1a2e1e] rounded-lg p-4">
                <p className="text-2xl font-bold text-[#c9a84c]">
                  {versions.reduce((sum, v) => sum + v.words_count, 0)}
                </p>
                <p className="text-xs text-[#a89f85]">Total words trained</p>
              </div>
              <div className="bg-[#1a2e1e] rounded-lg p-4">
                <p className="text-2xl font-bold text-[#c9a84c]">
                  {versions.reduce((sum, v) => sum + v.corrections_count, 0)}
                </p>
                <p className="text-xs text-[#a89f85]">Total corrections trained</p>
              </div>
              <div className="bg-[#1a2e1e] rounded-lg p-4">
                <p className="text-2xl font-bold text-[#c9a84c]">{versions.length}</p>
                <p className="text-xs text-[#a89f85]">Model versions</p>
              </div>
            </div>
            <p className="text-xs text-[#a89f85] mt-2 text-center">
              Every 12 hours, the model automatically retrains on all new data.
            </p>
          </div>
        ) : (
          <div className="text-center py-8 text-[#a89f85] text-sm">
            No training data yet. Contribute words and corrections to start the learning process!
          </div>
        )}
      </div>
    </div>
  );
}