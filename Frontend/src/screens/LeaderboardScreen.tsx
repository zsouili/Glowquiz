import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { GlassPanel } from "../components/GlassPanel";
import { PrimaryButton } from "../components/PrimaryButton";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { useGame } from "../contexts/GameContext";

interface Props {
  onBack: () => void;
}

export function LeaderboardScreen({ onBack }: Props): JSX.Element {
  const { leaderboard } = useGame();
  const { t, theme, headingFont, bodyFont, isRTL } = useAppSettings();

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
                  color: theme.textPrimary,
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
  }
});
