import { useState, useRef, useEffect } from "react";
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

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME: Message = {
  role: "assistant",
  content:
    "Kazhei! I am Rā — a language spirit that learns from you.\n\nI know very little Tangkhul right now. Will you teach me?\nTry asking me to translate something to Tangkhul, then correct me if I'm wrong.\nEvery correction makes me smarter. 🙏",
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setShowKeyboard(false);
    setLoading(true);

    try {
      const res = await fetch(
        process.env.EXPO_PUBLIC_NVIDIA_API_URL || "https://integrate.api.nvidia.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_NVIDIA_API_KEY}`,
          },
          body: JSON.stringify({
            model: process.env.EXPO_PUBLIC_NVIDIA_MODEL || "nvidia/nemotron-3-nano-30b-a3b",
          messages: [
            {
              role: "system",
              content:
                "You are Rā, an AI learning the Tangkhul language. Be humble, ask for corrections, and use greetings like Kazhei!",
            },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: input.trim() },
          ],
          max_tokens: 1024,
          temperature: 0.6,
        }),
      });

      const data = await res.json();
      const content =
        data.choices?.[0]?.message?.content || "Rilu! I could not process that.";
      setMessages((prev) => [...prev, { role: "assistant", content }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Rilu! I had trouble reaching my AI spirit. Please try again.",
        },
      ]);
    }
    setLoading(false);
  };

  const clearChat = () => {
    setMessages([WELCOME]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <View style={styles.statusDot} />
        <Text style={styles.headerTitle}>
          Tangkhul <Text style={styles.gold}>Rā</Text>
        </Text>
        <TouchableOpacity onPress={clearChat}>
          <Text style={styles.clearBtn}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
      >
        {messages.map((msg, i) => (
          <View
            key={i}
            style={[
              styles.bubble,
              msg.role === "user" ? styles.userBubble : styles.aiBubble,
            ]}
          >
            {msg.role === "assistant" && (
              <View style={styles.avatarRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>Rā</Text>
                </View>
                <Text style={styles.avatarName}>Rā</Text>
              </View>
            )}
            <Text style={styles.bubbleText}>{msg.content}</Text>
          </View>
        ))}
        {loading && (
          <View style={[styles.bubble, styles.aiBubble]}>
            <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        )}
      </ScrollView>

      {showKeyboard && (
        <TangkhulKeyboard
          onInsert={(char) => setInput((prev) => prev + char)}
        />
      )}

      <View style={styles.inputRow}>
        <TouchableOpacity
          style={styles.keyboardBtn}
          onPress={() => setShowKeyboard(!showKeyboard)}
        >
          <Text style={styles.keyboardBtnText}>⌨</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor="#a89f85"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
          onPress={sendMessage}
          disabled={!input.trim() || loading}
        >
          <Text style={styles.sendText}>→</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1a12" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2d4a33",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
    marginRight: 8,
  },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: "600", color: "#f0ead8" },
  gold: { color: "#c9a84c" },
  clearBtn: { color: "#a89f85", fontSize: 14 },
  chatArea: { flex: 1 },
  chatContent: { padding: 12, paddingBottom: 20 },
  bubble: { maxWidth: "85%", marginBottom: 12, borderRadius: 8, padding: 12 },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#1e3523",
    borderWidth: 1,
    borderColor: "rgba(201,168,76,0.4)",
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#1a2e1e",
    borderWidth: 1,
    borderColor: "#2d4a33",
  },
  avatarRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#2d4a33",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 10, fontWeight: "bold", color: "#c9a84c" },
  avatarName: { fontSize: 11, color: "#c9a84c", marginLeft: 6, fontWeight: "500" },
  bubbleText: { color: "#f0ead8", fontSize: 14, lineHeight: 20 },
  loadingText: { color: "#a89f85", fontSize: 13, fontStyle: "italic" },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#2d4a33",
    gap: 6,
  },
  keyboardBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2d4a33",
    alignItems: "center",
    justifyContent: "center",
  },
  keyboardBtnText: { fontSize: 20 },
  input: {
    flex: 1,
    backgroundColor: "#0f1a12",
    borderWidth: 1,
    borderColor: "#2d4a33",
    borderRadius: 8,
    padding: 10,
    color: "#f0ead8",
    fontSize: 14,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#c9a84c",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { opacity: 0.5 },
  sendText: { color: "#0f1a12", fontSize: 18, fontWeight: "bold" },
});