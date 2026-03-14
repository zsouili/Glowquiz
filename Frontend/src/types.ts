export type Language = "en" | "ar";

export type ThemeMode = "light" | "dark";

export type QuizType =
  | "emoji"
  | "movie_series"
  | "gaming"
  | "trick"
  | "country"
  | "pop_culture"
  | "reverse"
  | "life_sim"
  | "rapid_fire";

export type QuizRule = "pick_correct" | "pick_wrong";

export interface LocalizedText {
  en: string;
  ar: string;
}

export interface QuizOption {
  id: string;
  text: LocalizedText;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  type: QuizType;
  rule: QuizRule;
  question: LocalizedText;
  options: QuizOption[];
  timerSeconds?: number;
  explanation?: LocalizedText;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar: string;
  profileColor: string;
  score: number;
  dateISO: string;
  quizType: QuizType;
}

export type LeaderboardPeriod = "daily" | "weekly" | "all";
