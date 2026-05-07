# Tangkhul AI

A community-powered pre-training dataset platform to preserve the Tangkhul language (Tibeto-Burman, spoken in Manipur & Nagaland, Northeast India).

**Stack:** Next.js 14 (web) + Expo (mobile) + Supabase + NVIDIA Nemotron 3 Nano 30B A3B

## Monorepo Structure

```
tangkhul-ai/
├── web/          # Next.js 14 web app (deploy to Vercel)
│   ├── app/      # Pages and API routes
│   ├── components/  # Reusable React components
│   ├── lib/      # Supabase client, Nemotron API
│   └── ...
├── mobile/       # Expo React Native app (iOS + Android)
│   ├── app/      # Expo Router screens
│   ├── components/  # Native components
│   ├── lib/      # Supabase client
│   └── ...
└── README.md
```

## Setup Instructions

### 1. Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor and run the SQL schema from the prompt (see `SUPABASE DATABASE SCHEMA` section in the full prompt)
3. Copy your project URL and anon key

### 2. NVIDIA NIM

1. Sign up for NVIDIA NIM at [build.nvidia.com](https://build.nvidia.com)
2. Get your API key for the Nemotron 3 Nano 30B A3B model

### 3. Web App

```bash
cd web
npm install
cp .env.local.example .env.local
```

Fill in `.env.local`:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NVIDIA_API_KEY` | Your NVIDIA NIM API key |
| `AUTOTUNE_SECRET` | Random string for auto-tune cron protection |
| `RESEND_API_KEY` | (Optional) For email notifications |

Run development server:

```bash
npm run dev
```

### 4. Mobile App

```bash
cd mobile
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `EXPO_PUBLIC_NVIDIA_API_KEY` | Your NVIDIA NIM API key |

Run the app:

```bash
npx expo start
```

Use the Expo Go app on your phone to scan the QR code, or press `a` for Android / `i` for iOS simulator.

### 5. Vercel Deployment

```bash
cd web
npx vercel
```

Set all environment variables in Vercel dashboard. The `vercel.json` includes a cron job that calls `/api/autotune` every 12 hours.

## Features

- **Word Teacher** — Contribute Tangkhul words, phrases, and grammar to the dataset
- **AI Chat Trainer** — Chat with Tangkhul Kasar and correct its responses
- **Translation Tool** — English → Tangkhul translation using community data + AI
- **Dataset Showcase** — Browse, search, and export the community dataset
- **Contributor Wall** — Leave your mark on this preservation project
- **Model Evolution Dashboard** — Watch the AI grow with every contribution
- **Tangkhul Keyboard** — Special character input (Ā, A̲, ā, a̲) on web and mobile

## Design System

- Primary: `#0f1a12` (deep forest night)
- Secondary: `#1a2e1e` (forest green)
- Card: `#1e3523`
- Gold accent: `#c9a84c`
- Text: `#f0ead8` (warm cream)
- Tangkhul text: 1.2x size, weight 500
- "Tangkhul" brand word in gold

## License

This project is open source and built with love for the Tangkhul people. Kadü.
