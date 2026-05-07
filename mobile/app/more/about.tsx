import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from "react-native";

const phases = [
  { phase: "Phase 1", title: "Community Dataset Collection", status: "ACTIVE", color: "#4CAF50", desc: "Building the world's largest Tangkhul language corpus through community contributions." },
  { phase: "Phase 2", title: "Fine-tuned Tangkhul AI Model", status: "COMING SOON", color: "#c9a84c", desc: "Release of the first Tangkhul-specialized AI model trained on community data." },
  { phase: "Phase 3", title: "Tangkhul Speech & Voice", status: "PLANNED", color: "#a89f85", desc: "Tangkhul speech recognition, text-to-speech, and voice AI." },
  { phase: "Phase 4", title: "Discover Ukhrul Integration", status: "VISION", color: "#3B1FA8", desc: "Full Tangkhul language AI embedded into the Discover Ukhrul App." },
];

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.badge}>OUR STORY</Text>
        <Text style={styles.title}>
          Preserving a language,{"\n"}<Text style={styles.gold}>one word at a time.</Text>
        </Text>
        <Text style={styles.subtitle}>Built by the community, for the community.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>The Tangkhul Language</Text>
        <Text style={styles.body}>
          Tangkhul is a Tibeto-Burman language spoken by the Tangkhul Naga people, primarily in Ukhrul and Kamjong districts of Manipur, India. With approximately 150,000 speakers, it is one of the major Naga languages.
        </Text>
        <Text style={styles.body}>
          Like many indigenous languages, Tangkhul faces language shift as younger generations increasingly use English, Hindi, and Meiteilon.
        </Text>
        <Text style={styles.body}>
          This project is a community-driven effort to preserve Tangkhul in digital form — not as a static archive, but as a living, learning AI.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.body}>
          Our mission is to create the world's largest open-source Tangkhul language dataset and use it to train AI models that can understand, speak, and teach Tangkhul. Every word, correction, and translation brings us closer to a future where Tangkhul thrives in the digital age.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>The Technology</Text>
        <Text style={styles.body}>
          Tangkhul AI is powered by Nemotron 3 Nano 30B A3B — NVIDIA's efficient open reasoning model with a 1M token context window. The model auto-retrains every 12 hours on all new community contributions.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>The Builder</Text>
        <View style={styles.builderRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JS</Text>
          </View>
          <View style={styles.builderInfo}>
            <Text style={styles.builderName}>Jihal Shimray</Text>
            <Text style={styles.builderRole}>Founder & CEO · eX Holding</Text>
          </View>
        </View>
        <Text style={styles.body}>
          Building at the intersection of culture, technology, and community. Tangkhul AI is part of the upcoming Discover Ukhrul App.
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL("https://instagram.com/itsnextgenfounder")}>
          <Text style={styles.link}>@itsnextgenfounder (Personal)</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL("https://instagram.com/hashtagdropee")}>
          <Text style={styles.link}>@hashtagdropee (Brand)</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL("https://instagram.com/ex_holdings")}>
          <Text style={styles.link}>@ex_holdings (Company)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>The Road Ahead</Text>
        {phases.map((p, i) => (
          <View key={p.phase} style={styles.phaseCard}>
            <View style={styles.phaseHeader}>
              <Text style={styles.phaseLabel}>{p.phase}</Text>
              <Text style={styles.phaseTitle}>{p.title}</Text>
              <View style={[styles.statusBadge, { backgroundColor: p.color + "20", borderColor: p.color + "40" }]}>
                <Text style={[styles.statusText, { color: p.color }]}>{p.status}</Text>
              </View>
            </View>
            <Text style={styles.phaseDesc}>{p.desc}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1a12" },
  content: { padding: 16, paddingBottom: 40 },
  hero: { alignItems: "center", paddingVertical: 24, paddingHorizontal: 8 },
  badge: { fontSize: 11, color: "#c9a84c", fontWeight: "600", letterSpacing: 2, marginBottom: 12 },
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center", lineHeight: 34 },
  gold: { color: "#c9a84c" },
  subtitle: { fontSize: 16, color: "#a89f85", marginTop: 8, textAlign: "center" },
  card: { backgroundColor: "#1e3523", borderRadius: 8, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#2d4a33" },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#f0ead8", marginBottom: 8 },
  body: { fontSize: 14, color: "#a89f85", lineHeight: 20, marginBottom: 8 },
  builderRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#3B1FA8", alignItems: "center", justifyContent: "center", marginRight: 12 },
  avatarText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  builderInfo: { flex: 1 },
  builderName: { fontSize: 16, fontWeight: "600", color: "#f0ead8" },
  builderRole: { fontSize: 12, color: "#a89f85", marginTop: 2 },
  link: { fontSize: 13, color: "#c9a84c", marginBottom: 4, marginTop: 4 },
  phaseCard: { backgroundColor: "#1a2e1e", borderRadius: 8, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: "#2d4a33" },
  phaseHeader: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 6, marginBottom: 6 },
  phaseLabel: { fontSize: 10, color: "#a89f85", fontWeight: "bold", letterSpacing: 1 },
  phaseTitle: { fontSize: 14, fontWeight: "600", color: "#f0ead8", flex: 1 },
  statusBadge: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  statusText: { fontSize: 10, fontWeight: "500" },
  phaseDesc: { fontSize: 13, color: "#a89f85", lineHeight: 18 },
});