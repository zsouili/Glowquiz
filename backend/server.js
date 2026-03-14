const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const leaderboard = [];
const rooms = new Map();

function getPeriodStart(period) {
  const now = new Date();
  if (period === "daily") {
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).getTime();
  }
  if (period === "weekly") {
    const day = now.getUTCDay();
    const diffToMonday = day === 0 ? 6 : day - 1;
    const monday = new Date(now);
    monday.setUTCDate(now.getUTCDate() - diffToMonday);
    monday.setUTCHours(0, 0, 0, 0);
    return monday.getTime();
  }
  return 0;
}

function emitRoomState(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) {
    return;
  }

  const payload = {
    roomCode,
    quizType: room.quizType,
    status: room.status,
    players: room.players
  };

  io.to(roomCode).emit("room:state", payload);
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/leaderboard", (req, res) => {
  const period = req.query.period || "all";
  const start = getPeriodStart(period);

  const filtered = leaderboard
    .filter((entry) => new Date(entry.dateISO).getTime() >= start)
    .sort((a, b) => b.score - a.score)
    .slice(0, 100);

  res.json(filtered);
});

app.post("/api/leaderboard", (req, res) => {
  const entry = req.body;
  if (!entry || !entry.username || typeof entry.score !== "number") {
    return res.status(400).json({ error: "Invalid leaderboard entry" });
  }

  const normalized = {
    id: entry.id || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    username: entry.username,
    avatar: entry.avatar || "🎯",
    profileColor: entry.profileColor || "#7DF9FF",
    score: entry.score,
    dateISO: entry.dateISO || new Date().toISOString(),
    quizType: entry.quizType || "emoji"
  };

  leaderboard.push(normalized);
  leaderboard.sort((a, b) => b.score - a.score);
  if (leaderboard.length > 2000) {
    leaderboard.splice(2000);
  }

  return res.status(201).json({ ok: true, entry: normalized });
});

io.on("connection", (socket) => {
  socket.on("room:create", (payload) => {
    const { roomCode, quizType, player } = payload || {};
    if (!roomCode || !player || !player.id) {
      socket.emit("room:error", { message: "Invalid room payload" });
      return;
    }

    const normalizedRoomCode = String(roomCode).toUpperCase();
    const existing = rooms.get(normalizedRoomCode);
    if (!existing) {
      rooms.set(normalizedRoomCode, {
        quizType: quizType || "rapid_fire",
        status: "lobby",
        players: [
          {
            id: player.id,
            username: player.username,
            avatar: player.avatar,
            profileColor: player.profileColor || "#7DF9FF",
            score: 0,
            isHost: true
          }
        ]
      });
    }

    socket.join(normalizedRoomCode);
    emitRoomState(normalizedRoomCode);
  });

  socket.on("room:join", (payload) => {
    const { roomCode, player } = payload || {};
    const normalizedRoomCode = String(roomCode || "").toUpperCase();
    const room = rooms.get(normalizedRoomCode);
    if (!room || !player || !player.id) {
      socket.emit("room:error", { message: "Room not found. Check room code." });
      return;
    }

    const exists = room.players.some((member) => member.id === player.id);
    if (!exists) {
      room.players.push({
        id: player.id,
        username: player.username,
        avatar: player.avatar,
        profileColor: player.profileColor || "#7DF9FF",
        score: 0,
        isHost: false
      });
    }

    socket.join(normalizedRoomCode);
    emitRoomState(normalizedRoomCode);
  });

  socket.on("room:leave", ({ roomCode, playerId }) => {
    const normalizedRoomCode = String(roomCode || "").toUpperCase();
    const room = rooms.get(normalizedRoomCode);
    if (!room) {
      return;
    }

    room.players = room.players.filter((member) => member.id !== playerId);

    if (room.players.length === 0) {
      rooms.delete(normalizedRoomCode);
      return;
    }

    if (!room.players.some((member) => member.isHost)) {
      room.players[0].isHost = true;
    }

    emitRoomState(normalizedRoomCode);
  });

  socket.on("room:start", ({ roomCode }) => {
    const normalizedRoomCode = String(roomCode || "").toUpperCase();
    const room = rooms.get(normalizedRoomCode);
    if (!room) {
      socket.emit("room:error", { message: "Room not found" });
      return;
    }

    room.status = "in_game";
    emitRoomState(normalizedRoomCode);
  });

  socket.on("room:reaction", ({ roomCode, playerId, emoji }) => {
    const normalizedRoomCode = String(roomCode || "").toUpperCase();
    const room = rooms.get(normalizedRoomCode);
    if (!room) {
      return;
    }

    io.to(normalizedRoomCode).emit("room:reaction", { playerId, emoji });
  });

  socket.on("room:score", ({ roomCode, playerId, delta }) => {
    const normalizedRoomCode = String(roomCode || "").toUpperCase();
    const room = rooms.get(normalizedRoomCode);
    if (!room) {
      return;
    }

    const player = room.players.find((member) => member.id === playerId);
    if (!player) {
      return;
    }

    player.score += Number(delta || 0);
    emitRoomState(normalizedRoomCode);
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`GlowQuiz backend running on http://localhost:${PORT}`);
});
