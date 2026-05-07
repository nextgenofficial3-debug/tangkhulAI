# Tangkhul AI — Neural Language Intelligence

> *Preserving Tangkhul, one word at a time.*

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-a78bfa.svg)](LICENSE.md)
[![Community Contributions: Open](https://img.shields.io/badge/Contributions-Open-6ee7b7.svg)](#contributing)
[![Built With: NVIDIA NIM](https://img.shields.io/badge/Powered%20by-NVIDIA%20NIM-76b900.svg)](https://build.nvidia.com/)

---

## 🌱 Why This Exists

The **Tangkhul Naga people** of Manipur, northeast India, speak a language that is over a thousand years old — rich with tonal expression, proverbs, kinship terms, and oral history that has never been fully digitized.

As of 2026, the **Tangkhul language has almost zero presence** in any major AI system. It is not in GPT, not in Gemini, not in any voice assistant. If you type "translate to Tangkhul" anywhere, you get nothing useful.

This project exists to change that.

**Tangkhul AI** is a community-powered **pre-training dataset collection platform**. Every English ↔ Tangkhul word pair contributed here goes into a structured training corpus. Once we collect enough high-quality, categorized pairs, this dataset will be used to fine-tune a language model that *truly understands Tangkhul* — so future generations can use AI in their mother tongue, not just English.

This is not just a translator. It is a **language preservation movement**.

---

## 🎯 What We're Building Towards

The collected dataset will power:

| Target | Description |
|---|---|
| 🤖 **AI Fine-Tuning** | A custom Tangkhul language model via NVIDIA NIM / HuggingFace |
| 📱 **Mobile Keyboard** | Tangkhul autocomplete & swipe keyboard for Android/iOS |
| 🔍 **Search Integration** | Tangkhul-aware search for local platforms |
| 🎙️ **Voice Assistant** | "Hey AI, speak in Tangkhul" — a real, accurate response |
| 📖 **Digital Dictionary** | The first community-verified Tangkhul digital dictionary |
| 🌐 **Web Localization** | Making websites readable in Tangkhul |

---

## ✨ Current Features

### 🔄 Bidirectional Translation
- **Tangkhul → English** and **English → Tangkhul**
- Powered by NVIDIA NIM (nemotron model) with few-shot prompting
- Confidence scoring and grammar note output

### ✍️ Community Teaching Panel
- Anyone can submit a word or phrase pair — **no login required**
- Optional category tagging: Days, Months, Slangs, Food, Proverbs, Greetings, etc.
- Optional grammar notes for linguistic accuracy
- All pairs stored in `data/learned_pairs.json`

### 📊 Live Stats Dashboard
- Learned pairs count, translation attempts, confidence level, top categories

### ⚡ Auto Fine-Tuning (Every 15 Hours)
- The system automatically re-ranks learned pairs by usage frequency
- Higher-frequency pairs are promoted to the top of the few-shot prompt context
- This means the AI continuously improves as the community contributes

### 📱 Progressive Web App (PWA)
- Install directly to your phone's home screen
- Works offline for basic functions
- App shortcuts for Translate and Teach

### 👥 Contributor Registry
- Leave your name, email or phone, and suggestions
- You'll be credited in the final dataset release
- Saved in `data/contributors.json`

### 🔒 Data Security
- Direct HTTP access to `/data/` is blocked
- Training JSON files are never exposed via API without authorization

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- NVIDIA NIM API Key (free at [build.nvidia.com](https://build.nvidia.com/))

### Setup

```bash
# Clone the project
git clone https://github.com/itsnextgenfounder/tangkhul-ai.git
cd tangkhul-ai

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your NVIDIA_API_KEY

# Start the server
npm start
# → App running at http://localhost:3000
```

### Environment Variables

```env
NVIDIA_API_KEY=your_key_here
NVIDIA_MODEL=nvidia/nemotron-3-nano-30b-a3b
PORT=3000
```

---

## 📁 Project Structure

```
tangkhul-ai/
├── public/
│   ├── index.html        # Main UI (glassmorphism, editorial design)
│   ├── style.css         # Celestial Linguistic System design tokens
│   ├── app.js            # Frontend logic, translation, teach, history
│   ├── manifest.json     # PWA manifest
│   └── sw.js             # Service worker (offline support)
├── data/
│   ├── learned_pairs.json   # Community-contributed translation pairs
│   ├── training_log.json    # Translation history / usage logs
│   └── contributors.json    # Contributor registry
├── server.js             # Express API (translate, learn, finetune, contribute)
├── .env                  # Environment config (not committed)
├── README.md             # This file
├── LICENSE.md            # Creative Commons BY-NC 4.0
└── INTELLECTUAL_PROPERTY.md  # Prior art & IP declaration
```

---

## 🤝 Contributing

This is an **open community project**. Here's how you can help:

### Add Word Pairs
Visit the app → **Teach tab** → add a Tangkhul/English pair with a category.

### Suggest Categories
Have a category idea (e.g., "Traditional Songs", "Farming Terms")? Open an issue or use the Suggestions form in the About drawer.

### Report Mistranslations
If the AI translates something incorrectly, note the pair and submit a correction via the Teach tab.

### Spread the Word
Share this with Tangkhul speakers, diaspora communities, linguists, and anyone who cares about language preservation.

---

## 📊 Dataset Format

Each learned pair is stored as:

```json
{
  "tangkhul": "Nang meikhou ring",
  "english": "You are beautiful",
  "grammar": "adjective follows noun",
  "category": "Greetings & Farewells",
  "uses": 4,
  "timestamp": "2026-05-06T03:00:00.000Z"
}
```

The `uses` field is incremented when this pair is used in a successful translation — driving the fine-tune re-ranking.

---

## 🧠 Technical Notes

- **Translation Engine**: NVIDIA NIM with few-shot prompting using learned pairs
- **Fine-Tune Strategy**: Frequency-based re-ranking (not gradient descent) — the top 20 most-used pairs are injected into every prompt as examples
- **Storage**: File-based JSON (suitable for community scale; MongoDB/Supabase recommended for production scale)
- **PWA**: Web App Manifest + Service Worker for home screen install + offline access

---

## 🙏 Credits

**Developer:** Jihal Shimray (NextGen Founder)
Instagram: [@itsnextgenfounder](https://www.instagram.com/itsnextgenfounder)

*Built with deep respect for the Tangkhul people and their language — may every word preserved here carry forward what centuries have shaped.*

---

## 📄 License

This project's **code** is licensed under [MIT](LICENSE.md).

The **translation dataset** (`data/learned_pairs.json`) is licensed under [Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/) — free to use for research and preservation, not for commercial resale.

See [INTELLECTUAL_PROPERTY.md](INTELLECTUAL_PROPERTY.md) for the full IP and prior art declaration.
