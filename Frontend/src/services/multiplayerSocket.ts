import { io, Socket } from "socket.io-client";
import { MultiplayerRoomState, QuizType } from "../types";
import { getBackendBaseUrl } from "./backendConfig";

const MULTIPLAYER_URL = getBackendBaseUrl();

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
    socket = io(MULTIPLAYER_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 8,
      timeout: 10000
    });
  }
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
}

export function getMultiplayerUrl(): string {
  return MULTIPLAYER_URL;
}

export function subscribeConnectionStatus(
  onConnected: () => void,
  onDisconnected: () => void,
  onError: (message: string) => void
): () => void {
  const instance = getMultiplayerSocket();

  const handleConnect = () => onConnected();
  const handleDisconnect = () => onDisconnected();
  const handleError = (error: Error) => onError(error.message || "Connection error");

  instance.on("connect", handleConnect);
  instance.on("disconnect", handleDisconnect);
  instance.on("connect_error", handleError);

  return () => {
    instance.off("connect", handleConnect);
    instance.off("disconnect", handleDisconnect);
    instance.off("connect_error", handleError);
  };
}

export function subscribeRoomState(handler: (state: MultiplayerRoomState) => void): () => void {
  const instance = getMultiplayerSocket();
  instance.on("room:state", handler);
  return () => {
    instance.off("room:state", handler);
  };
}

export function subscribeRoomErrors(handler: (message: string) => void): () => void {
  const instance = getMultiplayerSocket();
  const wrapped = (payload: { message?: string }) => {
    handler(payload?.message || "Room error");
  };
  instance.on("room:error", wrapped);
  return () => {
    instance.off("room:error", wrapped);
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
