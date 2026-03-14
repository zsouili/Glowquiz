import { LeaderboardEntry } from "../types";
import { getBackendBaseUrl } from "./backendConfig";

const API_BASE_URL = getBackendBaseUrl();

export async function fetchLeaderboard(period: "daily" | "weekly" | "all"): Promise<LeaderboardEntry[]> {
  const response = await fetch(`${API_BASE_URL}/api/leaderboard?period=${period}`);
  if (!response.ok) {
    throw new Error("Failed to fetch leaderboard");
  }
  return (await response.json()) as LeaderboardEntry[];
}

export async function submitLeaderboardEntry(entry: LeaderboardEntry): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/leaderboard`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(entry)
  });

  if (!response.ok) {
    throw new Error("Failed to submit leaderboard entry");
  }
}
