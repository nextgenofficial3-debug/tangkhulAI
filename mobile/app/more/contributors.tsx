import { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { supabase } from "@/lib/supabase";

interface Contributor {
  id: string;
  name: string;
  contact?: string;
  region?: string;
  message?: string;
  created_at: string;
}

export default function ContributorsScreen() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase
      .from("contributors")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) setContributors(data as Contributor[]);
      });
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Required", "Your name is required.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("contributors").insert({
      name: name.trim(),
      contact: email.trim() || null,
      region: region.trim() || null,
      email_consent: email.trim() ? true : false,
    });
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Thank you!", "Your mark has been left on this project.");
      setContributors((prev) => [
        { id: "", name: name.trim(), contact: email.trim() || undefined, region: region.trim() || undefined, created_at: new Date().toISOString() },
        ...prev,
      ]);
      setName("");
      setEmail("");
      setRegion("");
    }
    setSubmitting(false);
  };

  const renderContributor = ({ item }: { item: Contributor }) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.name}>{item.name}</Text>
          {item.region && <Text style={styles.meta}>{item.region}</Text>}
          {item.message && <Text style={styles.message}>"{item.message}"</Text>}
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={contributors}
      renderItem={renderContributor}
      keyExtractor={(item) => item.id || item.name + item.created_at}
      ListHeaderComponent={
        <>
          <View style={styles.hero}>
            <Text style={styles.title}>
              Contributor <Text style={styles.gold}>Wall</Text>
            </Text>
            <Text style={styles.quote}>
              To every person who has shared a word, a phrase, a story in Tangkhul — you are not just contributing to a dataset. You are keeping a language alive.
            </Text>
            <Text style={styles.thankYou}>Thank you. 🙏</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Leave Your Mark</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name *" placeholderTextColor="#a89f85" />
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email address" placeholderTextColor="#6b8a6e" keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={styles.input} value={region} onChangeText={setRegion} placeholder="Village / District / Region (optional)" placeholderTextColor="#a89f85" />
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting || !name.trim()}>
              <Text style={styles.submitText}>{submitting ? "Saving..." : "Leave Your Mark →"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.countRow}>
            <Text style={styles.countTitle}>
              Contributors <Text style={styles.gold}>({contributors.length})</Text>
            </Text>
          </View>
        </>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No contributors yet. Be the first!</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1a12" },
  content: { padding: 16, paddingBottom: 40 },
  hero: { backgroundColor: "#1a2e1e", borderRadius: 8, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: "#2d4a33", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  gold: { color: "#c9a84c" },
  quote: { fontSize: 14, color: "#e8c97a", textAlign: "center", lineHeight: 20, marginBottom: 12 },
  thankYou: { fontSize: 16, color: "#c9a84c", fontWeight: "600" },
  formCard: { backgroundColor: "#1e3523", borderRadius: 8, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#2d4a33" },
  formTitle: { fontSize: 16, fontWeight: "600", color: "#f0ead8", marginBottom: 12 },
  input: { backgroundColor: "#0f1a12", borderWidth: 1, borderColor: "#2d4a33", borderRadius: 8, padding: 12, color: "#f0ead8", fontSize: 14, marginBottom: 8 },
  submitBtn: { backgroundColor: "#c9a84c", borderRadius: 8, padding: 12, alignItems: "center", marginTop: 4 },
  submitText: { color: "#0f1a12", fontWeight: "700", fontSize: 15 },
  countRow: { marginBottom: 12 },
  countTitle: { fontSize: 16, fontWeight: "600", color: "#f0ead8" },
  card: { backgroundColor: "#1e3523", borderRadius: 8, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: "#2d4a33" },
  cardRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#2d4a33", alignItems: "center", justifyContent: "center", marginRight: 12 },
  avatarText: { fontSize: 14, fontWeight: "bold", color: "#c9a84c" },
  cardInfo: { flex: 1 },
  name: { fontSize: 15, color: "#f0ead8", fontWeight: "500" },
  meta: { fontSize: 12, color: "#a89f85", marginTop: 2 },
  message: { fontSize: 13, color: "#e8c97a", fontStyle: "italic", marginTop: 2 },
  empty: { padding: 40, alignItems: "center" },
  emptyText: { color: "#a89f85", fontSize: 14 },
});