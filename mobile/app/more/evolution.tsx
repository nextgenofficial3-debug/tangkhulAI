import { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { supabase } from "@/lib/supabase";

interface ModelVersion {
  id: string;
  version_number: number;
  status: string;
  words_count: number;
  corrections_count: number;
  trained_at: string;
}

export default function EvolutionScreen() {
  const [versions, setVersions] = useState<ModelVersion[]>([]);
  const [totalWords, setTotalWords] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [vRes, wRes] = await Promise.all([
        supabase.from("model_versions").select("*").order("version_number", { ascending: false }),
        supabase.from("words").select("*", { count: "exact", head: true }),
      ]);
      if (vRes.data) setVersions(vRes.data as ModelVersion[]);
      setTotalWords(wRes.count ?? 0);
      setLoading(false);
    }
    load();
  }, []);

  const lastVersion = versions[0];
  const lastTraining = lastVersion ? new Date(lastVersion.trained_at).toLocaleString() : "—";
  const nextTraining = lastVersion
    ? new Date(new Date(lastVersion.trained_at).getTime() + 12 * 60 * 60 * 1000).toLocaleString()
    : "—";
  const totalTrainedWords = versions.reduce((s, v) => s + v.words_count, 0);
  const totalCorrections = versions.reduce((s, v) => s + v.corrections_count, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>
        Model <Text style={styles.gold}>Evolution</Text>
      </Text>
      <Text style={styles.subtitle}>Watch Rā grow smarter with every contribution.</Text>

      <View style={styles.statRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Status</Text>
          <View style={styles.statusRow}>
            <View style={styles.dot} />
            <Text style={styles.statValue}>Ready</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Last Training</Text>
          <Text style={styles.statValueSmall}>{lastTraining}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Next Training</Text>
          <Text style={styles.statValueSmall}>{nextTraining}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Training Summary</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalWords}</Text>
            <Text style={styles.summaryLabel}>Total words in DB</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalTrainedWords}</Text>
            <Text style={styles.summaryLabel}>Words trained</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalCorrections}</Text>
            <Text style={styles.summaryLabel}>Corrections</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Model Versions</Text>
        {versions.length > 0 ? (
          versions.map((v) => (
            <View key={v.id} style={styles.versionRow}>
              <View style={styles.versionLeft}>
                <Text style={styles.versionNum}>v{v.version_number}</Text>
                <View style={[styles.statusBadge, { backgroundColor: v.status === "ready" ? "#4CAF5020" : "#c9a84c20", borderColor: v.status === "ready" ? "#4CAF5040" : "#c9a84c40" }]}>
                  <Text style={[styles.statusBadgeText, { color: v.status === "ready" ? "#4CAF50" : "#c9a84c" }]}>{v.status}</Text>
                </View>
              </View>
              <Text style={styles.versionRight}>{v.words_count} words · {v.corrections_count} corrections</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No model versions yet. The first training run will appear after the auto-tune pipeline runs.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>How it works</Text>
        <Text style={styles.body}>
          Every 12 hours, the model automatically retrains on all new community contributions. The more words and corrections you provide, the smarter Rā becomes.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1a12" },
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 4 },
  gold: { color: "#c9a84c" },
  subtitle: { fontSize: 14, color: "#a89f85", marginBottom: 16 },
  statRow: { gap: 8, marginBottom: 16 },
  statCard: { backgroundColor: "#1e3523", borderRadius: 8, padding: 12, borderWidth: 1, borderColor: "#2d4a33", marginBottom: 8 },
  statLabel: { fontSize: 11, color: "#a89f85", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#4CAF50" },
  statValue: { fontSize: 16, fontWeight: "600", color: "#f0ead8" },
  statValueSmall: { fontSize: 13, color: "#f0ead8", fontWeight: "500" },
  card: { backgroundColor: "#1e3523", borderRadius: 8, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#2d4a33" },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#f0ead8", marginBottom: 12 },
  summaryRow: { flexDirection: "row", gap: 8 },
  summaryItem: { flex: 1, backgroundColor: "#1a2e1e", borderRadius: 8, padding: 12, alignItems: "center" },
  summaryValue: { fontSize: 22, fontWeight: "bold", color: "#c9a84c" },
  summaryLabel: { fontSize: 11, color: "#a89f85", marginTop: 4, textAlign: "center" },
  versionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#2d4a33", paddingVertical: 10 },
  versionLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  versionNum: { fontSize: 14, fontWeight: "600", color: "#c9a84c" },
  statusBadge: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  statusBadgeText: { fontSize: 10, fontWeight: "500" },
  versionRight: { fontSize: 11, color: "#a89f85" },
  emptyText: { color: "#a89f85", fontSize: 13, textAlign: "center", paddingVertical: 20 },
  body: { fontSize: 14, color: "#a89f85", lineHeight: 20 },
});