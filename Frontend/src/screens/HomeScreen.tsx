import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { GlassPanel } from "../components/GlassPanel";
import { PrimaryButton } from "../components/PrimaryButton";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { QUESTIONS } from "@/data/questions";
import { QuizType } from "../types";
import { computeQuestionOfDay } from "../utils/quizHelpers";

interface Props {
  onStartQuiz: (quizType: QuizType) => void;
  onOpenSettings: () => void;
  onOpenLeaderboard: () => void;
}

const QUIZ_TYPES: QuizType[] = [
  "emoji",
  "movie_series",
  "gaming",
  "trick",
  "country",
  "pop_culture",
  "reverse",
  "life_sim",
  "rapid_fire"
];

export function HomeScreen({
  onStartQuiz,
  onOpenSettings,
  onOpenLeaderboard
}: Props): JSX.Element {
  const { t, theme, headingFont, bodyFont, isRTL, username, avatar, profileColor, quizTypeLabel, language } =
    useAppSettings();

  const dailyQuestion = computeQuestionOfDay(QUESTIONS);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <GlassPanel style={styles.topPanel}>
        <Text
          style={{
            fontSize: 34,
            color: theme.textPrimary,
            fontFamily: headingFont,
            textAlign: isRTL ? "right" : "left"
          }}
        >
          {t("appTitle")}
        </Text>
        <Text
          style={{
            marginTop: 2,
            fontSize: 16,
            color: profileColor,
            fontFamily: bodyFont,
            textAlign: isRTL ? "right" : "left"
          }}
        >
          {avatar} {username}
        </Text>

        <View style={styles.navRow}>
          <PrimaryButton label={t("settings")} onPress={onOpenSettings} style={styles.navButton} />
          <PrimaryButton
            label={t("leaderboard")}
            onPress={onOpenLeaderboard}
            style={styles.navButton}
            variant="outline"
          />
        </View>
      </GlassPanel>

      <GlassPanel style={styles.dailyPanel}>
        <Text
          style={{
            color: theme.textPrimary,
            fontFamily: headingFont,
            fontSize: 20,
            textAlign: isRTL ? "right" : "left"
          }}
        >
          {t("dailyChallenge")}
        </Text>
        <Text
          style={{
            color: theme.textSecondary,
            marginTop: 8,
            fontFamily: bodyFont,
            textAlign: isRTL ? "right" : "left",
            writingDirection: isRTL ? "rtl" : "ltr"
          }}
        >
          {dailyQuestion.question[language]}
        </Text>
        <PrimaryButton
          label={`${t("startGame")} • ${quizTypeLabel(dailyQuestion.type)}`}
          onPress={() => onStartQuiz(dailyQuestion.type)}
          style={{ marginTop: 12 }}
        />
      </GlassPanel>

      <Text
        style={{
          color: theme.textPrimary,
          fontFamily: headingFont,
          fontSize: 22,
          marginBottom: 10,
          textAlign: isRTL ? "right" : "left"
        }}
      >
        {t("pickQuizType")}
      </Text>

      <View style={styles.grid}>
        {QUIZ_TYPES.map((type) => (
          <Pressable
            key={type}
            onPress={() => onStartQuiz(type)}
            style={({ pressed }) => [
              styles.quizCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                opacity: pressed ? 0.84 : 1
              }
            ]}
          >
            <Text
              style={{
                color: theme.textPrimary,
                fontFamily: headingFont,
                fontSize: 16,
                textAlign: isRTL ? "right" : "left"
              }}
            >
              {quizTypeLabel(type)}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text
        style={{
          marginTop: 14,
          textAlign: "center",
          color: theme.textSecondary,
          fontFamily: bodyFont,
          fontSize: 12
        }}
      >
        {t("developedBy")}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32
  },
  topPanel: {
    marginBottom: 12
  },
  navRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14
  },
  navButton: {
    flex: 1
  },
  dailyPanel: {
    marginBottom: 12
  },
  grid: {
    gap: 10
  },
  quizCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14
  }
});
