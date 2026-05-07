import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";

const CHARS = [
  ["A", "Ā", "A̲"],
  ["a", "ā", "a̲"],
];

interface Props {
  onInsert: (char: string) => void;
}

export function TangkhulKeyboard({ onInsert }: Props) {
  const handlePress = (char: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onInsert(char);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tangkhul characters</Text>
      {CHARS.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((char) => (
            <TouchableOpacity
              key={char}
              style={styles.btn}
              onPress={() => handlePress(char)}
              activeOpacity={0.6}
            >
              <Text style={styles.char}>{char}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a2e1e",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#2d4a33",
  },
  label: {
    color: "#a89f85",
    fontSize: 11,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },
  btn: {
    width: 52,
    height: 52,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#c9a84c",
    alignItems: "center",
    justifyContent: "center",
  },
  char: {
    color: "#c9a84c",
    fontSize: 20,
    fontWeight: "600",
  },
});