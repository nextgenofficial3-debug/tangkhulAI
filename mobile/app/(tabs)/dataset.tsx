import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { supabase } from "@/lib/supabase";

interface LearnedPair {
  id: number;
  tangkhul: string;
  english: string;
  category?: string;
  confidence?: number;
  created_at: string;
}

export default function DatasetScreen() {
  const [words, setWords] = useState<LearnedPair[]>([]);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ words: 0, categories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWords();
    loadStats();
  }, []);

  const loadWords = async () => {
    setLoading(true);
    let query = supabase
      .from("learned_pairs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (search.trim()) {
      query = query.or(
        `tangkhul.ilike.%${search}%,english.ilike.%${search}%`
      );
    }

    const { data } = await query;
    if (data) setWords(data as LearnedPair[]);
    setLoading(false);
  };

  const loadStats = async () => {
    const [wordsRes, catRes] = await Promise.all([
      supabase.from("learned_pairs").select("*", { count: "exact", head: true }),
      supabase.from("learned_pairs").select("category"),
    ]);

    const catSet = new Set<string>();
    catRes.data?.forEach((w) => {
      if (w.category) catSet.add(w.category);
    });

    setStats({
      words: wordsRes.count ?? 0,
      categories: catSet.size,
    });
  };

  const renderWord = ({ item }: { item: LearnedPair }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.tangkhulWord}>{item.tangkhul}</Text>
      </View>
      <Text style={styles.english}>{item.english}</Text>
      {item.category && <Text style={styles.category}>{item.category}</Text>}
      {item.confidence !== undefined && <Text style={styles.contributor}>Confidence: {item.confidence}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statVal}>{stats.words}</Text>
          <Text style={styles.statLabel}>Pairs</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statVal}>{stats.categories}</Text>
          <Text style={styles.statLabel}>Categories</Text>
        </View>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search translations..."
          placeholderTextColor="#a89f85"
          onSubmitEditing={loadWords}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={loadWords}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={words}
          renderItem={renderWord}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No translations found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1a12" },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
  },
  stat: {
    flex: 1,
    backgroundColor: "#1e3523",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2d4a33",
  },
  statVal: { fontSize: 20, fontWeight: "bold", color: "#c9a84c" },
  statLabel: { fontSize: 11, color: "#a89f85", marginTop: 2 },
  searchRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#0f1a12",
    borderWidth: 1,
    borderColor: "#2d4a33",
    borderRadius: 8,
    padding: 10,
    color: "#f0ead8",
    fontSize: 14,
  },
  searchBtn: {
    backgroundColor: "#c9a84c",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  searchBtnText: { color: "#0f1a12", fontWeight: "600", fontSize: 14 },
  list: { padding: 12, gap: 8 },
  card: {
    backgroundColor: "#1e3523",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#2d4a33",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  tangkhulWord: {
    fontSize: 18,
    color: "#c9a84c",
    fontWeight: "600",
  },
  posBadge: {
    fontSize: 11,
    color: "#e8c97a",
    backgroundColor: "#2d4a33",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
  },
  phonetic: { fontSize: 13, color: "#a89f85", marginTop: 2, fontStyle: "italic" },
  english: { fontSize: 15, color: "#f0ead8", marginTop: 4 },
  category: {
    fontSize: 11,
    color: "#a89f85",
    backgroundColor: "#1a2e1e",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 6,
    overflow: "hidden",
  },
  contributor: { fontSize: 11, color: "#a89f85", marginTop: 6 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#a89f85", fontSize: 14 },
  emptyText: { color: "#a89f85", fontSize: 14 },
});