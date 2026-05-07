import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";

export default function TranslateScreen() {
  const [englishText, setEnglishText] = useState("");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!englishText.trim()) return;
    setLoading(true);
    setTranslation("");

    try {
      const res = await fetch(
        process.env.EXPO_PUBLIC_API_URL
          ? `${process.env.EXPO_PUBLIC_API_URL}/api/translate`
          : "http://localhost:3000/api/translate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ english_text: englishText.trim() }),
        }
      );
      const data = await res.json();
      setTranslation(data.translation || "Rilu! Translation failed.");
    } catch {
      setTranslation("Rilu! Could not reach the server.");
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>
        Translate to <Text style={styles.gold}>Tangkhul</Text>
      </Text>
      <Text style={styles.subtitle}>Test English → Tangkhul using the community database and AI.</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>English</Text>
        <TextInput
          style={styles.input}
          value={englishText}
          onChangeText={setEnglishText}
          placeholder="Enter English text to translate..."
          placeholderTextColor="#a89f85"
          multiline
          textAlignVertical="top"
        />
        <TouchableOpacity
          style={[styles.translateBtn, (!englishText.trim() || loading) && styles.disabled]}
          onPress={handleTranslate}
          disabled={!englishText.trim() || loading}
        >
          <Text style={styles.translateBtnText}>
            {loading ? "Translating..." : "Translate →"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Tangkhul</Text>
        <View style={styles.resultBox}>
          {translation ? (
            <Text style={styles.resultText}>
              {translation.replace(/\[(HIGH|MEDIUM|LOW)\]/g, "")}
            </Text>
          ) : (
            <Text style={styles.placeholderText}>
              {loading ? "Consulting the spirits..." : "Translation will appear here..."}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>How it works</Text>
        <Text style={styles.infoBody}>
          We search the community database for matching words, then pass them to Rā (Nemotron 3 Nano 30B) as context. The more words you contribute, the better translations become.
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
  card: { backgroundColor: "#1e3523", borderRadius: 8, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#2d4a33" },
  cardLabel: { fontSize: 13, color: "#a89f85", marginBottom: 8, fontWeight: "500" },
  input: { backgroundColor: "#0f1a12", borderWidth: 1, borderColor: "#2d4a33", borderRadius: 8, padding: 12, color: "#f0ead8", fontSize: 15, minHeight: 120 },
  translateBtn: { backgroundColor: "#c9a84c", borderRadius: 8, padding: 14, alignItems: "center", marginTop: 12 },
  disabled: { opacity: 0.5 },
  translateBtnText: { color: "#0f1a12", fontWeight: "700", fontSize: 16 },
  resultBox: { backgroundColor: "#0f1a12", borderWidth: 1, borderColor: "#2d4a33", borderRadius: 8, padding: 12, minHeight: 100 },
  resultText: { color: "#c9a84c", fontSize: 17, fontWeight: "500", lineHeight: 24 },
  placeholderText: { color: "#a89f85", fontSize: 14, fontStyle: "italic" },
  infoCard: { backgroundColor: "#1a2e1e", borderRadius: 8, padding: 16, borderWidth: 1, borderColor: "#2d4a33" },
  infoTitle: { fontSize: 14, color: "#c9a84c", fontWeight: "600", marginBottom: 4 },
  infoBody: { fontSize: 13, color: "#a89f85", lineHeight: 18 },
});