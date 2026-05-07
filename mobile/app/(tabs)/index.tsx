import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const [stats, setStats] = useState({ words: 0, corrections: 0, contributors: 0 });
  const [recent, setRecent] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const [words, corrections, contributors] = await Promise.all([
        supabase.from("words").select("*", { count: "exact", head: true }),
        supabase.from("corrections").select("*", { count: "exact", head: true }),
        supabase.from("contributors").select("*", { count: "exact", head: true }),
      ]);
      setStats({
        words: words.count ?? 0,
        corrections: corrections.count ?? 0,
        contributors: contributors.count ?? 0,
      });

      const { data } = await supabase
        .from("words")
        .select("tangkhul_word, english_word, contributor_name")
        .order("created_at", { ascending: false })
        .limit(5);
      if (data) setRecent(data);
    }
    load();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.title}>
          TANGKHUL <Text style={styles.gold}>AI</Text>
        </Text>
        <Text style={styles.tagline}>Preserve. Teach. Evolve.</Text>
        <Text style={styles.subtitle}>
          A community-powered pre-training dataset to save the Tangkhul language.
        </Text>
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => router.push("/(tabs)/teach")}
        >
          <Text style={styles.ctaText}>Start Teaching →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        {[
          { label: "Words", value: stats.words },
          { label: "Corrections", value: stats.corrections },
          { label: "Contributors", value: stats.contributors },
        ].map((s) => (
          <View key={s.label} style={styles.statCard}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {recent.map((w, i) => (
          <View key={i} style={styles.recentItem}>
            <Text style={styles.tangkhulWord}>{w.tangkhul_word}</Text>
            <Text style={styles.recentMeta}>
              {w.english_word} · {w.contributor_name}
            </Text>
          </View>
        ))}
        {recent.length === 0 && (
          <Text style={styles.emptyText}>No contributions yet. Be the first!</Text>
        )}
      </View>

      <View style={styles.quickLinks}>
        <TouchableOpacity
          style={styles.linkCard}
          onPress={() => router.push("/(tabs)/chat")}
        >
          <Text style={styles.linkTitle}>💬 Chat with AI</Text>
          <Text style={styles.linkDesc}>Correct the AI as it learns Tangkhul</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkCard}
          onPress={() => router.push("/(tabs)/dataset")}
        >
          <Text style={styles.linkTitle}>📚 Browse Dataset</Text>
          <Text style={styles.linkDesc}>Explore all community contributions</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1a12" },
  content: { padding: 16 },
  hero: { alignItems: "center", paddingVertical: 32 },
  title: { fontSize: 32, fontWeight: "bold", letterSpacing: 4 },
  gold: { color: "#c9a84c" },
  tagline: { fontSize: 20, color: "#e8c97a", marginTop: 8, fontStyle: "italic" },
  subtitle: { fontSize: 14, color: "#a89f85", textAlign: "center", marginTop: 12, lineHeight: 20, paddingHorizontal: 16 },
  ctaBtn: { backgroundColor: "#c9a84c", paddingHorizontal: 32, paddingVertical: 14, borderRadius: 8, marginTop: 24 },
  ctaText: { color: "#0f1a12", fontWeight: "700", fontSize: 16 },
  statsRow: { flexDirection: "row", gap: 8, marginVertical: 16 },
  statCard: { flex: 1, backgroundColor: "#1e3523", borderRadius: 8, padding: 12, alignItems: "center", borderWidth: 1, borderColor: "#2d4a33" },
  statValue: { fontSize: 24, fontWeight: "bold", color: "#c9a84c" },
  statLabel: { fontSize: 11, color: "#a89f85", marginTop: 4 },
  section: { backgroundColor: "#1e3523", borderRadius: 8, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#2d4a33" },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#f0ead8", marginBottom: 12 },
  recentItem: { borderBottomWidth: 1, borderBottomColor: "#2d4a33", paddingVertical: 8 },
  tangkhulWord: { fontSize: 16, color: "#c9a84c", fontWeight: "500" },
  recentMeta: { fontSize: 12, color: "#a89f85", marginTop: 2 },
  emptyText: { color: "#a89f85", fontSize: 13, textAlign: "center", paddingVertical: 16 },
  quickLinks: { gap: 8, marginBottom: 24 },
  linkCard: { backgroundColor: "#1e3523", borderRadius: 8, padding: 16, borderWidth: 1, borderColor: "#2d4a33" },
  linkTitle: { fontSize: 16, fontWeight: "600", color: "#f0ead8", marginBottom: 4 },
  linkDesc: { fontSize: 13, color: "#a89f85" },
});