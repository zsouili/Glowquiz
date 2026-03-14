import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { GlassPanel } from "../components/GlassPanel";
import { PrimaryButton } from "../components/PrimaryButton";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { useGame } from "../contexts/GameContext";
import { LeaderboardPeriod } from "../types";

interface Props {
  onBack: () => void;
}

export function LeaderboardScreen({ onBack }: Props): JSX.Element {
  const { getLeaderboardByPeriod, syncLeaderboardFromServer } = useGame();
  const { t, theme, headingFont, bodyFont, isRTL } = useAppSettings();
  const [period, setPeriod] = useState<LeaderboardPeriod>("all");

  useEffect(() => {
    void syncLeaderboardFromServer();
    // Intentionally run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const leaderboard = useMemo(() => getLeaderboardByPeriod(period), [getLeaderboardByPeriod, period]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <GlassPanel>
        <Text
          style={{
            color: theme.textPrimary,
            fontFamily: headingFont,
            fontSize: 30,
            textAlign: isRTL ? "right" : "left"
          }}
        >
          {t("leaderboard")}
        </Text>

        <View style={styles.periodRow}>
          <PrimaryButton
            label={t("daily")}
            onPress={() => setPeriod("daily")}
            variant={period === "daily" ? "solid" : "outline"}
            style={styles.periodButton}
          />
          <PrimaryButton
            label={t("weekly")}
            onPress={() => setPeriod("weekly")}
            variant={period === "weekly" ? "solid" : "outline"}
            style={styles.periodButton}
          />
          <PrimaryButton
            label={t("allTime")}
            onPress={() => setPeriod("all")}
            variant={period === "all" ? "solid" : "outline"}
            style={styles.periodButton}
          />
        </View>

        {leaderboard.length === 0 && (
          <Text
            style={{
              marginTop: 14,
              color: theme.textSecondary,
              fontFamily: bodyFont,
              textAlign: isRTL ? "right" : "left"
            }}
          >
            {t("noLeaderboardYet")}
          </Text>
        )}

        <View style={{ marginTop: 12, gap: 8 }}>
          {leaderboard.map((entry, index) => (
            <View
              key={entry.id}
              style={[
                styles.row,
                {
                  borderColor: theme.border,
                  backgroundColor: theme.accentSoft
                }
              ]}
            >
              <Text style={{ color: theme.textPrimary, fontFamily: headingFont, width: 30 }}>
                {index + 1}
              </Text>
              <Text
                style={{
                  color: entry.profileColor || theme.accent,
                  fontFamily: bodyFont,
                  flex: 1,
                  textAlign: isRTL ? "right" : "left"
                }}
              >
                {entry.avatar} {entry.username}
              </Text>
              <Text style={{ color: theme.textPrimary, fontFamily: headingFont }}>
                {entry.score}
              </Text>
            </View>
          ))}
        </View>

        <PrimaryButton
          label={t("backHome")}
          variant="outline"
          onPress={onBack}
          style={{ marginTop: 16 }}
        />
      </GlassPanel>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20
  },
  row: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  periodRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 8
  },
  periodButton: {
    flex: 1
  }
});
