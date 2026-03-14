import React, { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { GlassPanel } from "../components/GlassPanel";
import { PrimaryButton } from "../components/PrimaryButton";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { useGame } from "../contexts/GameContext";
import { QUESTIONS } from "@/data/questions";
import { QuizQuestion, QuizType } from "../types";
import { getTimerForQuestion, shuffleQuestions } from "../utils/quizHelpers";

interface Props {
  quizType: QuizType;
  onExit: () => void;
}

export function QuizScreen({ quizType, onExit }: Props): JSX.Element {
  const { language, t, theme, headingFont, bodyFont, isRTL, quizTypeLabel, username, avatar } =
    useAppSettings();
  const { addResult } = useGame();

  const questions = useMemo<QuizQuestion[]>(() => {
    const subset = QUESTIONS.filter((question) => question.type === quizType);
    return shuffleQuestions(subset);
  }, [quizType]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState<string>("");
  const [pointsDelta, setPointsDelta] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [finished, setFinished] = useState(false);
  const [savedResult, setSavedResult] = useState(false);

  const question = questions[index];

  useEffect(() => {
    setIndex(0);
    setScore(0);
    setSelectedId(null);
    setLocked(false);
    setFeedback("");
    setPointsDelta(0);
    setFinished(false);
    setSavedResult(false);
  }, [quizType]);

  useEffect(() => {
    if (!question || locked || finished) {
      setTimeLeft(0);
      return;
    }

    const timerStart = getTimerForQuestion(question);
    if (!timerStart) {
      setTimeLeft(0);
      return;
    }

    setTimeLeft(timerStart);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [question, locked, finished]);

  function getIsCorrect(optionId: string): boolean {
    const option = question.options.find((item) => item.id === optionId);
    return Boolean(option?.isCorrect);
  }

  function submitOption(optionId: string): void {
    if (!question || locked || finished) {
      return;
    }

    const correct = getIsCorrect(optionId);
    const delta = correct ? 10 : -5;

    setSelectedId(optionId);
    setLocked(true);
    setPointsDelta(delta);
    setScore((prev) => prev + delta);
    setFeedback(correct ? t("correct") : t("wrong"));
  }

  function handleTimeOut(): void {
    if (!question || locked || finished) {
      return;
    }

    setLocked(true);
    setSelectedId(null);
    setPointsDelta(-5);
    setScore((prev) => prev - 5);
    setFeedback(t("wrong"));
  }

  async function moveNext(): Promise<void> {
    if (index === questions.length - 1) {
      setFinished(true);
      if (!savedResult) {
        await addResult({
          username,
          avatar,
          score,
          quizType
        });
        setSavedResult(true);
      }
      return;
    }

    setIndex((prev) => prev + 1);
    setLocked(false);
    setSelectedId(null);
    setFeedback("");
    setPointsDelta(0);
  }

  function restartQuiz(): void {
    setIndex(0);
    setScore(0);
    setLocked(false);
    setSelectedId(null);
    setFeedback("");
    setPointsDelta(0);
    setFinished(false);
    setSavedResult(false);
  }

  if (!question) {
    return (
      <GlassPanel>
        <Text style={{ color: theme.textPrimary, fontFamily: headingFont }}>No questions.</Text>
        <PrimaryButton label={t("backHome")} onPress={onExit} style={{ marginTop: 12 }} />
      </GlassPanel>
    );
  }

  if (finished) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <GlassPanel>
          <Text
            style={{
              color: theme.textPrimary,
              fontFamily: headingFont,
              fontSize: 30,
              textAlign: "center"
            }}
          >
            {quizTypeLabel(quizType)}
          </Text>
          <Text
            style={{
              color: theme.textSecondary,
              fontFamily: bodyFont,
              fontSize: 18,
              marginTop: 10,
              textAlign: "center"
            }}
          >
            {t("finalScore")}: {score}
          </Text>

          <PrimaryButton
            label={t("playAgain")}
            onPress={restartQuiz}
            style={{ marginTop: 16 }}
          />
          <PrimaryButton
            label={t("backHome")}
            variant="outline"
            onPress={onExit}
            style={{ marginTop: 10 }}
          />
        </GlassPanel>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <GlassPanel>
        <Text
          style={{
            color: theme.textPrimary,
            fontFamily: headingFont,
            fontSize: 27,
            textAlign: isRTL ? "right" : "left"
          }}
        >
          {quizTypeLabel(quizType)}
        </Text>

        <View style={styles.metaRow}>
          <Text style={{ color: theme.textSecondary, fontFamily: bodyFont }}>
            {t("score")}: {score}
          </Text>
          <Text style={{ color: theme.textSecondary, fontFamily: bodyFont }}>
            {index + 1}/{questions.length}
          </Text>
          {timeLeft > 0 && (
            <Text style={{ color: theme.accent, fontFamily: headingFont }}>
              {t("timer")}: {timeLeft}
            </Text>
          )}
        </View>

        {question.rule === "pick_wrong" && (
          <Text
            style={{
              marginTop: 8,
              color: theme.danger,
              fontFamily: bodyFont,
              textAlign: isRTL ? "right" : "left",
              writingDirection: isRTL ? "rtl" : "ltr"
            }}
          >
            {t("pickWrongRule")}
          </Text>
        )}

        <Text
          style={{
            marginTop: 10,
            color: theme.textPrimary,
            fontFamily: bodyFont,
            fontSize: 20,
            textAlign: isRTL ? "right" : "left",
            writingDirection: isRTL ? "rtl" : "ltr"
          }}
        >
          {question.question[language]}
        </Text>

        <View style={{ marginTop: 14, gap: 10 }}>
          {question.options.map((option) => {
            const picked = selectedId === option.id;
            const shouldReveal = locked;
            const isRightOption = option.isCorrect;
            const backgroundColor = shouldReveal
              ? isRightOption
                ? theme.success
                : picked
                  ? theme.danger
                  : theme.accentSoft
              : theme.accentSoft;

            return (
              <Pressable
                key={option.id}
                disabled={locked}
                onPress={() => submitOption(option.id)}
                style={({ pressed }) => [
                  styles.option,
                  {
                    borderColor: theme.border,
                    backgroundColor,
                    opacity: pressed ? 0.86 : 1
                  }
                ]}
              >
                <Text
                  style={{
                    color: theme.textPrimary,
                    fontFamily: bodyFont,
                    fontSize: 16,
                    textAlign: isRTL ? "right" : "left",
                    writingDirection: isRTL ? "rtl" : "ltr"
                  }}
                >
                  {option.text[language]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {feedback ? (
          <Text
            style={{
              marginTop: 12,
              color: pointsDelta >= 0 ? theme.success : theme.danger,
              fontFamily: headingFont,
              textAlign: isRTL ? "right" : "left"
            }}
          >
            {feedback} ({t("pointsEarned")}: {pointsDelta > 0 ? `+${pointsDelta}` : pointsDelta})
          </Text>
        ) : null}

        {question.explanation && locked ? (
          <Text
            style={{
              marginTop: 4,
              color: theme.textSecondary,
              fontFamily: bodyFont,
              textAlign: isRTL ? "right" : "left",
              writingDirection: isRTL ? "rtl" : "ltr"
            }}
          >
            {question.explanation[language]}
          </Text>
        ) : null}

        <View style={styles.actions}>
          <PrimaryButton
            label={index === questions.length - 1 ? t("finishQuiz") : t("nextQuestion")}
            onPress={moveNext}
            style={styles.actionButton}
            disabled={!locked}
          />
          <PrimaryButton
            label={t("backHome")}
            variant="outline"
            onPress={onExit}
            style={styles.actionButton}
          />
        </View>
      </GlassPanel>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    flexGrow: 1,
    justifyContent: "center"
  },
  metaRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  option: {
    borderWidth: 1,
    borderRadius: 14,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  actions: {
    marginTop: 16,
    gap: 10
  },
  actionButton: {
    width: "100%"
  }
});
