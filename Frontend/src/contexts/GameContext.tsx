import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LeaderboardEntry, LeaderboardPeriod, QuizType } from "../types";
import { getBackendBaseUrl } from "../services/backendConfig";

interface GameContextValue {
  leaderboard: LeaderboardEntry[];
  getLeaderboardByPeriod: (period: LeaderboardPeriod) => LeaderboardEntry[];
  syncLeaderboardFromServer: () => Promise<void>;
  addResult: (payload: {
    username: string;
    avatar: string;
    profileColor: string;
    score: number;
    quizType: QuizType;
  }) => Promise<void>;
}

const LEADERBOARD_KEY = "glowquiz.leaderboard";
const API_BASE_URL = getBackendBaseUrl();

function periodStartDate(period: LeaderboardPeriod): Date {
  const now = new Date();
  if (period === "daily") {
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  }
  if (period === "weekly") {
    const day = now.getUTCDay();
    const diffToMonday = day === 0 ? 6 : day - 1;
    const monday = new Date(now);
    monday.setUTCDate(now.getUTCDate() - diffToMonday);
    monday.setUTCHours(0, 0, 0, 0);
    return monday;
  }
  return new Date(0);
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    async function hydrateLeaderboard() {
      try {
        const raw = await AsyncStorage.getItem(LEADERBOARD_KEY);
        if (!raw) {
          return;
        }
        const parsed = JSON.parse(raw) as LeaderboardEntry[];
        if (Array.isArray(parsed)) {
          setLeaderboard(
            parsed.map((entry) => ({
              ...entry,
              profileColor: entry.profileColor || "#7DF9FF"
            }))
          );
        }
      } catch {
        // Keep empty leaderboard on parsing/storage issues.
      }
    }

    hydrateLeaderboard();
  }, []);

  async function addResult(payload: {
    username: string;
    avatar: string;
    profileColor: string;
    score: number;
    quizType: QuizType;
  }): Promise<void> {
    const entry: LeaderboardEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      username: payload.username,
      avatar: payload.avatar,
      profileColor: payload.profileColor,
      score: payload.score,
      quizType: payload.quizType,
      dateISO: new Date().toISOString()
    };

    const next = [...leaderboard, entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 40);

    setLeaderboard(next);
    await AsyncStorage.setItem(LEADERBOARD_KEY, JSON.stringify(next));

    // Best effort remote sync. App still works offline if backend is unavailable.
    try {
      await fetch(`${API_BASE_URL}/api/leaderboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry)
      });
    } catch {
      // no-op: keep local-first leaderboard flow
    }
  }

  async function syncLeaderboardFromServer(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leaderboard?period=all`);
      if (!response.ok) {
        return;
      }
      const data = (await response.json()) as LeaderboardEntry[];
      if (!Array.isArray(data)) {
        return;
      }
      setLeaderboard(data);
      await AsyncStorage.setItem(LEADERBOARD_KEY, JSON.stringify(data));
    } catch {
      // Keep local cache when server is offline.
    }
  }

  function getLeaderboardByPeriod(period: LeaderboardPeriod): LeaderboardEntry[] {
    const start = periodStartDate(period).getTime();
    return leaderboard
      .filter((entry) => new Date(entry.dateISO).getTime() >= start)
      .sort((a, b) => b.score - a.score);
  }

  const value = useMemo<GameContextValue>(() => {
    return {
      leaderboard,
      getLeaderboardByPeriod,
      syncLeaderboardFromServer,
      addResult
    };
  }, [leaderboard]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used inside GameProvider");
  }
  return context;
}
