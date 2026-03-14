# GlowQuiz Backend

Node.js backend for GlowQuiz multiplayer and leaderboard sync.

## Features

- REST API leaderboard endpoints (`/api/leaderboard`)
- Period filtering (`daily`, `weekly`, `all`)
- Socket.IO real-time private rooms
- Room create/join/leave/start events
- Live score updates + emoji reaction events

## Run

```bash
npm install
npm run dev
```

Server starts on `http://localhost:4000`.

## API

- `GET /api/health`
- `GET /api/leaderboard?period=daily|weekly|all`
- `POST /api/leaderboard`

## Notes

This is a starter backend structure designed to be easy to extend with:

- persistent database storage
- authentication
- robust room ownership and reconnect logic
- anti-cheat and game state validation
