import React, { useMemo, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from "react-native";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { QuizType } from "../types";
import { HomeScreen } from "./HomeScreen";
import { LeaderboardScreen } from "./LeaderboardScreen";
import { QuizScreen } from "./QuizScreen";
import { SettingsScreen } from "./SettingsScreen";
import { WelcomeScreen } from "./WelcomeScreen";

type Screen = "welcome" | "home" | "quiz" | "settings" | "leaderboard";

export function Root(): JSX.Element {
  const { isHydrated, themeMode, username } = useAppSettings();
  const [screen, setScreen] = useState<Screen>("welcome");
  const [selectedType, setSelectedType] = useState<QuizType>("emoji");

  const activeScreen = useMemo<Screen>(() => {
    if (!username.trim()) {
      return "welcome";
    }
    if (screen === "welcome") {
      return "home";
    }
    return screen;
  }, [screen, username]);

  if (!isHydrated) {
    return (
      <SafeAreaView style={styles.root}>
        <AnimatedBackground mode={themeMode} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#7DF9FF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <AnimatedBackground mode={themeMode} />
      <View style={styles.content}>
        {activeScreen === "welcome" && (
          <WelcomeScreen onContinue={() => setScreen("home")} />
        )}

        {activeScreen === "home" && (
          <HomeScreen
            onStartQuiz={(quizType) => {
              setSelectedType(quizType);
              setScreen("quiz");
            }}
            onOpenSettings={() => setScreen("settings")}
            onOpenLeaderboard={() => setScreen("leaderboard")}
          />
        )}

        {activeScreen === "quiz" && (
          <QuizScreen
            quizType={selectedType}
            onExit={() => setScreen("home")}
          />
        )}

        {activeScreen === "settings" && (
          <SettingsScreen onBack={() => setScreen("home")} />
        )}

        {activeScreen === "leaderboard" && (
          <LeaderboardScreen onBack={() => setScreen("home")} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#1E1E2F"
  },
  content: {
    flex: 1,
    padding: 16
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
