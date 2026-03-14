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
    const protocol = window.location.protocol === "https:" ? "https" : "http";
    return `${protocol}://${window.location.hostname}:4000`;
  }

  // Default for local simulators when no env var is provided.
  return "http://localhost:4000";
}
