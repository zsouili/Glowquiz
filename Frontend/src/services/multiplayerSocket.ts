import { io, Socket } from "socket.io-client";
import { MultiplayerRoomState, QuizType } from "../types";

const MULTIPLAYER_URL = "http://localhost:4000";

let socket: Socket | null = null;

interface PlayerIdentity {
  id: string;
  username: string;
  avatar: string;
  profileColor: string;
}

interface JoinPayload {
  roomCode: string;
  quizType: QuizType;
  player: PlayerIdentity;
}

export function getMultiplayerSocket(): Socket {
  if (!socket) {
    socket = io(MULTIPLAYER_URL, { transports: ["websocket"] });
  }
  return socket;
}

export function subscribeRoomState(handler: (state: MultiplayerRoomState) => void): () => void {
  const instance = getMultiplayerSocket();
  instance.on("room:state", handler);
  return () => {
    instance.off("room:state", handler);
  };
}

export function createRoom(payload: JoinPayload): void {
  getMultiplayerSocket().emit("room:create", payload);
}

export function joinRoom(payload: JoinPayload): void {
  getMultiplayerSocket().emit("room:join", payload);
}

export function leaveRoom(roomCode: string, playerId: string): void {
  getMultiplayerSocket().emit("room:leave", { roomCode, playerId });
}

export function startMatch(roomCode: string): void {
  getMultiplayerSocket().emit("room:start", { roomCode });
}

export function sendReaction(roomCode: string, playerId: string, emoji: string): void {
  getMultiplayerSocket().emit("room:reaction", { roomCode, playerId, emoji });
}

export function updateLiveScore(roomCode: string, playerId: string, delta: number): void {
  getMultiplayerSocket().emit("room:score", { roomCode, playerId, delta });
}
