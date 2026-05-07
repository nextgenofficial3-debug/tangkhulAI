import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { TangkhulKeyboard } from "@/components/TangkhulKeyboard";

const partsOfSpeech = [
  "Noun", "Verb", "Adjective", "Adverb",
  "Phrase", "Greeting", "Number", "Other",
];

export default function TeachScreen() {
  const [tangkhulWord, setTangkhulWord] = useState("");
  const [englishWord, setEnglishWord] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState("");
  const [category, setCategory] = useState("");
  const [contributorName, setContributorName] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("categories").select("*").order("name").then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);

  const handleSubmit = async () => {
    if (!tangkhulWord.trim() || !englishWord.trim() || !contributorName.trim()) {
      Alert.alert("Required", "Tangkhul word, English word, and contributor name are required.");
      return;
    }

    const { data: dupes } = await supabase
      .from("words")
      .select("contributor_name")
      .ilike("tangkhul_word", tangkhulWord.trim())
      .ilike("english_word", englishWord.trim());

    if (dupes && dupes.length > 0) {
      const sameContributor = dupes.find(
        (d) => d.contributor_name.toLowerCase() === contributorName.trim().toLowerCase()
      );
      if (sameContributor) {
        Alert.alert("Duplicate", "You already contributed this exact word!");
        return;
      }
      Alert.alert(
        "Already exists",
        `This word was already contributed by ${dupes[0].contributor_name}!`
      );
      return;
    }

    const { error } = await supabase.from("words").insert({
      tangkhul_word: tangkhulWord.trim(),
      english_word: englishWord.trim(),
      phonetic: phonetic.trim() || null,
      part_of_speech: partOfSpeech || null,
      category: category || null,
      contributor_name: contributorName.trim(),
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Saved!", "Word saved to the dataset.");
      setTangkhulWord("");
      setEnglishWord("");
      setPhonetic("");
      setPartOfSpeech("");
      setCategory("");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>
          Teach a <Text style={styles.gold}>Word</Text>
        </Text>

        {/* Word */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>WORD</Text>
          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>Tangkhul *</Text>
              <TextInput
                style={styles.input}
                value={tangkhulWord}
                onChangeText={setTangkhulWord}
                placeholder="e.g. kazhei"
                placeholderTextColor="#6b8a6e"
              />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>English *</Text>
              <TextInput
                style={styles.input}
                value={englishWord}
                onChangeText={setEnglishWord}
                placeholder="e.g. hello"
                placeholderTextColor="#6b8a6e"
              />
            </View>
          </View>
          <TangkhulKeyboard onInsert={(char) => setTangkhulWord((prev) => prev + char)} />
          <View style={{ marginTop: 12 }}>
            <Text style={styles.label}>Phonetic</Text>
            <TextInput
              style={styles.input}
              value={phonetic}
              onChangeText={setPhonetic}
              placeholder="e.g. ka-zhei"
              placeholderTextColor="#6b8a6e"
            />
          </View>
        </View>

        {/* Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DETAILS</Text>
          <Text style={styles.label}>Part of speech</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            <View style={styles.chipRow}>
              {partsOfSpeech.map((pos) => (
                <TouchableOpacity
                  key={pos}
                  style={[styles.chip, partOfSpeech === pos && styles.chipActive]}
                  onPress={() => setPartOfSpeech(partOfSpeech === pos ? "" : pos)}
                >
                  <Text style={[styles.chipText, partOfSpeech === pos && styles.chipTextActive]}>
                    {pos}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <Text style={[styles.label, { marginTop: 12 }]}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            <View style={styles.chipRow}>
              {categories.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.chip, category === c.name && styles.chipActive]}
                  onPress={() => setCategory(category === c.name ? "" : c.name)}
                >
                  <Text style={[styles.chipText, category === c.name && styles.chipTextActive]}>
                    {c.emoji} {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* You */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>YOU</Text>
          <TextInput
            style={styles.input}
            value={contributorName}
            onChangeText={setContributorName}
            placeholder="Your name"
            placeholderTextColor="#6b8a6e"
          />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Save to Dataset →</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1a12" },
  content: { padding: 16, paddingBottom: 40 },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  gold: { color: "#c9a84c" },
  section: { backgroundColor: "#1a2e1e", borderRadius: 10, padding: 14, marginTop: 14, borderWidth: 1, borderColor: "#2d4a33" },
  sectionTitle: { fontSize: 11, fontWeight: "700", color: "#6b8a6e", letterSpacing: 1, marginBottom: 10 },
  row: { flexDirection: "row", gap: 10 },
  half: { flex: 1 },
  label: { color: "#a89f85", fontSize: 12, marginBottom: 5 },
  input: {
    backgroundColor: "#0f1a12",
    borderWidth: 1,
    borderColor: "#2d4a33",
    borderRadius: 8,
    padding: 11,
    color: "#f0ead8",
    fontSize: 15,
  },
  chipScroll: { marginTop: 4 },
  chipRow: { flexDirection: "row", gap: 6, paddingVertical: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2d4a33",
    backgroundColor: "#0f1a12",
  },
  chipActive: { backgroundColor: "#c9a84c", borderColor: "#c9a84c" },
  chipText: { color: "#a89f85", fontSize: 13 },
  chipTextActive: { color: "#0f1a12", fontWeight: "600" },
  submitBtn: {
    backgroundColor: "#c9a84c",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: { color: "#0f1a12", fontWeight: "700", fontSize: 16 },
});