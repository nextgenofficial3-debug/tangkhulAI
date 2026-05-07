import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const items = [
  { route: "/more/about", icon: "info-circle" as const, label: "About", desc: "Our story, mission & technology" },
  { route: "/more/contributors", icon: "users" as const, label: "Contributors", desc: "Community wall of honor" },
  { route: "/more/evolution", icon: "rocket" as const, label: "Evolution", desc: "Model training progress" },
  { route: "/more/translate", icon: "globe" as const, label: "Translate", desc: "English → Tangkhul translation" },
];

export default function MoreScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>More</Text>
        <Text style={styles.subtitle}>Explore everything Tangkhul AI</Text>
      </View>
      <View style={styles.grid}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.card}
            onPress={() => router.push(item.route as any)}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrap}>
              <FontAwesome name={item.icon} size={22} color="#c9a84c" />
            </View>
            <Text style={styles.cardTitle}>{item.label}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1a12" },
  header: { padding: 20, paddingBottom: 8 },
  title: { fontSize: 26, fontWeight: "bold", color: "#f0ead8" },
  subtitle: { fontSize: 14, color: "#a89f85", marginTop: 4 },
  grid: { padding: 16, gap: 12 },
  card: {
    backgroundColor: "#1e3523",
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: "#2d4a33",
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1a2e1e",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#f0ead8" },
  cardDesc: { fontSize: 12, color: "#a89f85", marginTop: 2 },
});