import { Platform } from "react-native";

function trimTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

export function getBackendBaseUrl(): string {
  const fromEnv =
    (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
      ?.EXPO_PUBLIC_BACKEND_URL;
  if (fromEnv && fromEnv.trim()) {
    return trimTrailingSlash(fromEnv.trim());
  }

  if (Platform.OS === "web" && typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol === "https:" ? "https" : "http";
    const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
    if (isLocal) {
      return `${protocol}://${hostname}:4000`;
    }

    // In production web, do not force :4000 (often blocked/unavailable).
    return `${protocol}://${hostname}`;
  }

  // Default for local simulators when no env var is provided.
  return "http://localhost:4000";
}

export function hasCustomBackendUrl(): boolean {
  const fromEnv =
    (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
      ?.EXPO_PUBLIC_BACKEND_URL;
  return Boolean(fromEnv && fromEnv.trim());
}
