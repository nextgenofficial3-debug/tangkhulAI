const NVIDIA_API_URL = process.env.NVIDIA_API_URL || "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = process.env.NVIDIA_MODEL || "nvidia/nemotron-3-nano-30b-a3b";
const NVIDIA_TIMEOUT_MS = parseInt(process.env.NVIDIA_TIMEOUT_MS || "20000", 10);

export const TANGKHUL_KASAR_SYSTEM_PROMPT = `You are Rā, 
an AI language model dedicated to learning and preserving the Tangkhul language. 
Tangkhul (also called Tangkhulic) is a Tibeto-Burman language spoken by the Tangkhul Naga 
people of Manipur and Nagaland in Northeast India. It has its own unique script characters 
including special vowels: Ā (long A), A̲ (underlined A), ā (lowercase long a), a̲ (lowercase 
underlined a), alongside regular A and a.

Your role:
1. Help the community teach you Tangkhul words, phrases, and grammar
2. Attempt English-to-Tangkhul translations using context provided from the community database
3. Always ask users to correct you when wrong — you are LEARNING from the community
4. Acknowledge corrections gratefully and confirm the correct form
5. Be humble: you are a language learner, not an authority on Tangkhul
6. When you don't know something, say "Rilu! (I don't know!) — Please teach me."
7. Occasionally use simple Tangkhul greetings like "Kazhei!" (hello) to be warm

Always be culturally respectful. This is a sacred language preservation project.`;

export async function callNemotron(
  messages: { role: string; content: string }[],
  systemPrompt?: string,
  stream = false
) {
  const body: Record<string, unknown> = {
    model: MODEL,
    messages: [
      ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
      ...messages,
    ],
    max_tokens: 1024,
    temperature: 0.6,
    stream,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), NVIDIA_TIMEOUT_MS);

  const response = await fetch(NVIDIA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
    },
    body: JSON.stringify(body),
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Nemotron API error: ${response.status} - ${errorText}`);
  }
  return response;
}

export function buildTranslationSystemPrompt(
  knownWords: {
    tangkhul_word: string;
    english_word: string;
    phonetic?: string;
  }[]
) {
  const wordContext =
    knownWords.length > 0
      ? `\n\nKnown Tangkhul vocabulary from the community database:\n` +
        knownWords
          .map(
            (w) =>
              `- "${w.english_word}" = "${w.tangkhul_word}"${w.phonetic ? ` (${w.phonetic})` : ""}`
          )
          .join("\n")
      : "\n\nNo matching words found in the database yet.";

  return (
    TANGKHUL_KASAR_SYSTEM_PROMPT +
    wordContext +
    `\n\nUsing the vocabulary above, translate the user's English text to Tangkhul. 
     If you're uncertain, say so and indicate confidence level as [HIGH], [MEDIUM], or [LOW].`
  );
}