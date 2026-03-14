import { ThemeMode } from "../types";

export interface AppTheme {
  mode: ThemeMode;
  gradient: [string, string];
  card: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentSoft: string;
  success: string;
  danger: string;
  border: string;
}

export const themes: Record<ThemeMode, AppTheme> = {
  light: {
    mode: "light",
    gradient: ["#FFD6A5", "#FDFFB6"],
    card: "rgba(255,255,255,0.78)",
    textPrimary: "#2F2544",
    textSecondary: "#5B4D73",
    accent: "#FF7A59",
    accentSoft: "#FFE9D6",
    success: "#13B67A",
    danger: "#E5484D",
    border: "rgba(47,37,68,0.16)"
  },
  dark: {
    mode: "dark",
    gradient: ["#1E1E2F", "#4E2A84"],
    card: "rgba(24,24,40,0.68)",
    textPrimary: "#F9F7FF",
    textSecondary: "#C3B7E6",
    accent: "#7DF9FF",
    accentSoft: "rgba(125,249,255,0.12)",
    success: "#4ADE80",
    danger: "#FB7185",
    border: "rgba(125,249,255,0.3)"
  }
};
