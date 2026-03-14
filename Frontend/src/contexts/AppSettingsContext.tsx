import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { dictionary } from "../i18n/translations";
import { Language, ThemeMode, QuizType } from "../types";
import { themes } from "../theme/themes";

interface AppSettingsContextValue {
  language: Language;
  themeMode: ThemeMode;
  username: string;
  avatar: string;
  profileColor: string;
  clientId: string;
  profilePalette: string[];
  isHydrated: boolean;
  isRTL: boolean;
  headingFont: string;
  bodyFont: string;
  setLanguage: (lang: Language) => Promise<void>;
  setThemeMode: (theme: ThemeMode) => Promise<void>;
  setProfile: (username: string, avatar: string, profileColor: string) => Promise<void>;
  t: (key: keyof typeof dictionary.en.ui) => string;
  quizTypeLabel: (type: QuizType) => string;
  theme: ReturnType<typeof getTheme>;
}

const STORAGE_KEYS = {
  language: "glowquiz.language",
  themeMode: "glowquiz.themeMode",
  username: "glowquiz.username",
  avatar: "glowquiz.avatar"
  ,
  profileColor: "glowquiz.profileColor",
  clientId: "glowquiz.clientId"
};

const PROFILE_PALETTE = [
  "#7DF9FF",
  "#FF7A59",
  "#FFD166",
  "#4ADE80",
  "#F472B6",
  "#60A5FA",
  "#C084FC",
  "#F97316"
];

function getTheme(mode: ThemeMode) {
  return themes[mode];
}

const AppSettingsContext = createContext<AppSettingsContextValue | undefined>(
  undefined
);

export function AppSettingsProvider({
  children
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [language, setLanguageState] = useState<Language>("en");
  const [themeMode, setThemeModeState] = useState<ThemeMode>("dark");
  const [username, setUsername] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("🎯");
  const [profileColor, setProfileColor] = useState<string>("#7DF9FF");
  const [clientId, setClientId] = useState<string>("");
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    async function hydrate() {
      try {
        const [storedLanguage, storedTheme, storedUsername, storedAvatar, storedProfileColor, storedClientId] =
          await AsyncStorage.multiGet([
            STORAGE_KEYS.language,
            STORAGE_KEYS.themeMode,
            STORAGE_KEYS.username,
            STORAGE_KEYS.avatar,
            STORAGE_KEYS.profileColor,
            STORAGE_KEYS.clientId
          ]);

        const lang = storedLanguage[1] as Language | null;
        const mode = storedTheme[1] as ThemeMode | null;

        if (lang === "en" || lang === "ar") {
          setLanguageState(lang);
        }
        if (mode === "light" || mode === "dark") {
          setThemeModeState(mode);
        }
        if (storedUsername[1]) {
          setUsername(storedUsername[1]);
        }
        if (storedAvatar[1]) {
          setAvatar(storedAvatar[1]);
        }
        if (storedProfileColor[1] && PROFILE_PALETTE.includes(storedProfileColor[1])) {
          setProfileColor(storedProfileColor[1]);
        }

        if (storedClientId[1]) {
          setClientId(storedClientId[1]);
        } else {
          const generated = `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
          setClientId(generated);
          await AsyncStorage.setItem(STORAGE_KEYS.clientId, generated);
        }
      } catch {
        // Keep default state if storage is unavailable.
      } finally {
        setIsHydrated(true);
      }
    }

    hydrate();
  }, []);

  async function setLanguage(lang: Language): Promise<void> {
    setLanguageState(lang);
    await AsyncStorage.setItem(STORAGE_KEYS.language, lang);
  }

  async function setThemeMode(theme: ThemeMode): Promise<void> {
    setThemeModeState(theme);
    await AsyncStorage.setItem(STORAGE_KEYS.themeMode, theme);
  }

  async function setProfile(nextUsername: string, nextAvatar: string, nextProfileColor: string): Promise<void> {
    setUsername(nextUsername.trim());
    setAvatar(nextAvatar.trim() || "🎯");
    setProfileColor(nextProfileColor);
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.username, nextUsername.trim()],
      [STORAGE_KEYS.avatar, nextAvatar.trim() || "🎯"],
      [STORAGE_KEYS.profileColor, nextProfileColor]
    ]);
  }

  const value = useMemo<AppSettingsContextValue>(() => {
    return {
      language,
      themeMode,
      username,
      avatar,
      profileColor,
      clientId,
      profilePalette: PROFILE_PALETTE,
      isHydrated,
      isRTL: language === "ar",
      headingFont: language === "ar" ? "Cairo_700Bold" : "Baloo2_700Bold",
      bodyFont: language === "ar" ? "Cairo_400Regular" : "Baloo2_700Bold",
      setLanguage,
      setThemeMode,
      setProfile,
      t: (key) => dictionary[language].ui[key],
      quizTypeLabel: (type) => dictionary[language].quizTypeNames[type],
      theme: getTheme(themeMode)
    };
  }, [language, themeMode, username, avatar, profileColor, clientId, isHydrated]);

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings(): AppSettingsContextValue {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error("useAppSettings must be used within AppSettingsProvider");
  }
  return context;
}
