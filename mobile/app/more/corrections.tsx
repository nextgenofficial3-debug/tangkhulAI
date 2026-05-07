import { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { supabase } from "@/lib/supabase";

interface Correction {
  id: string;
  original_ai_response: string;
  corrected_text: string;
  context_message?: string;
  contributor_name?: string;
  created_at: string;
}

export default function CorrectionsScreen() {
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("chat_corrections").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("chat_corrections").select("*", { count: "exact", head: true }),
    ]).then(([{ data }, countRes]) => {
      if (data) setCorrections(data as Correction[]);
      setTotal(countRes.count ?? 0);
      setLoading(false);
    });
  }, []);

  const renderItem = ({ item }: { item: Correction }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.badge}>CORRECTION</Text>
        <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.label}>Corrected to:</Text>
      <Text style={styles.corrected}>{item.corrected_text}</Text>
      <Text style={styles.label}>Original:</Text>
      <Text style={styles.original}>{item.original_ai_response}</Text>
      {item.context_message && (
        <>
          <Text style={styles.label}>Note:</Text>
          <Text style={styles.note}>{item.context_message}</Text>
        </>
      )}
      {item.contributor_name && (
        <Text style={styles.contributor}>by {item.contributor_name}</Text>
      )}
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={corrections}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={styles.headerBar}>
          <Text style={styles.title}>Corrections</Text>
          <Text style={styles.subtitle}>Every correction makes Rā smarter</Text>
          <View style={styles.totalCard}>
            <Text style={styles.totalNum}>{total}</Text>
            <Text style={styles.totalLabel}>total corrections</Text>
          </View>
        </View>
      }
      ListEmptyComponent={
        loading ? (
          <View style={styles.center}><Text style={styles.emptyText}>Loading...</Text></View>
        ) : (
          <View style={styles.center}><Text style={styles.emptyText}>No corrections yet. Chat with Rā and correct it!</Text></View>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1a12" },
  content: { padding: 16, paddingBottom: 40 },
  headerBar: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "bold", color: "#f0ead8" },
  subtitle: { fontSize: 14, color: "#a89f85", marginTop: 4, marginBottom: 12 },
  totalCard: { backgroundColor: "#1e3523", borderRadius: 8, padding: 14, alignItems: "center", borderWidth: 1, borderColor: "#2d4a33" },
  totalNum: { fontSize: 28, fontWeight: "bold", color: "#c9a84c" },
  totalLabel: { fontSize: 12, color: "#a89f85", marginTop: 2 },
  card: { backgroundColor: "#1e3523", borderRadius: 8, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: "#2d4a33" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  badge: { fontSize: 10, fontWeight: "600", color: "#c9a84c", letterSpacing: 1 },
  date: { fontSize: 11, color: "#6b8a6e" },
  label: { fontSize: 11, color: "#6b8a6e", marginTop: 6, marginBottom: 2, letterSpacing: 0.5 },
  corrected: { fontSize: 16, color: "#4CAF50", fontWeight: "500" },
  original: { fontSize: 13, color: "#e8c97a", lineHeight: 18 },
  note: { fontSize: 13, color: "#a89f85", fontStyle: "italic" },
  contributor: { fontSize: 11, color: "#a89f85", marginTop: 8, textAlign: "right" },
  center: { padding: 40, alignItems: "center" },
  emptyText: { color: "#a89f85", fontSize: 14 },
});