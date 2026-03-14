# GlowQuiz

A fun bilingual (English/Arabic) React Native quiz game built with Expo.

## Features

- English and Arabic language toggle with persistence
- 9 quiz types with bilingual questions and options
- Username profile with emoji avatar and custom profile color
- Light and dark themes with gradient backgrounds
- Animated floating particles and smooth transitions
- Scoring, feedback, timers, random order, and leaderboard
- Question of the day and optional avatar emoji
- Online multiplayer room structure with live player scores (Socket.IO backend)
- Daily / weekly / all-time leaderboard filters

## Run

```bash
npm install
npm run start
```

Open on Android/iOS simulator or Expo Go.

## Web

```bash
npm run web
```

## Production Web Build

```bash
npm run build:web
```

The generated static web output is in `dist`.

## Backend (for Multiplayer + Leaderboard Sync)

From the workspace root:

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:4000`.
