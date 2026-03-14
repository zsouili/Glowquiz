import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LeaderboardEntry, QuizType } from "../types";

interface GameContextValue {
  leaderboard: LeaderboardEntry[];
  addResult: (payload: {
    username: string;
    avatar: string;
    score: number;
    quizType: QuizType;
  }) => Promise<void>;
}

const LEADERBOARD_KEY = "glowquiz.leaderboard";

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
          setLeaderboard(parsed);
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
    score: number;
    quizType: QuizType;
  }): Promise<void> {
    const entry: LeaderboardEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      username: payload.username,
      avatar: payload.avatar,
      score: payload.score,
      quizType: payload.quizType,
      dateISO: new Date().toISOString()
    };

    const next = [...leaderboard, entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 40);

    setLeaderboard(next);
    await AsyncStorage.setItem(LEADERBOARD_KEY, JSON.stringify(next));
  }

  const value = useMemo<GameContextValue>(() => {
    return {
      leaderboard,
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
