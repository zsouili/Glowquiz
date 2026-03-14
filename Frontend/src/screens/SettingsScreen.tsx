import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { GlassPanel } from "../components/GlassPanel";
import { PrimaryButton } from "../components/PrimaryButton";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { ThemeMode } from "../types";

interface Props {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: Props): JSX.Element {
  const {
    language,
    setLanguage,
    setThemeMode,
    t,
    themeMode,
    headingFont,
    bodyFont,
    theme,
    isRTL,
    username,
    avatar,
    setProfile,
    profileColor,
    profilePalette
  } = useAppSettings();

  const [localName, setLocalName] = useState(username);
  const [localAvatar, setLocalAvatar] = useState(avatar);
  const [localProfileColor, setLocalProfileColor] = useState(profileColor);

  async function handleSaveProfile(): Promise<void> {
    if (!localName.trim()) {
      return;
    }
    await setProfile(localName, localAvatar, localProfileColor);
  }

  async function handleSetTheme(mode: ThemeMode): Promise<void> {
    await setThemeMode(mode);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <GlassPanel style={styles.panel}>
        <Text
          style={{
            fontFamily: headingFont,
            color: theme.textPrimary,
            fontSize: 30,
            textAlign: isRTL ? "right" : "left"
          }}
        >
          {t("settings")}
        </Text>

        <Text
          style={[
            styles.label,
            { color: theme.textPrimary, fontFamily: bodyFont, textAlign: isRTL ? "right" : "left" }
          ]}
        >
          {t("language")}
        </Text>
        <View style={styles.row}>
          <PrimaryButton
            label={t("english")}
            variant={language === "en" ? "solid" : "outline"}
            onPress={() => setLanguage("en")}
            style={styles.rowButton}
          />
          <PrimaryButton
            label={t("arabic")}
            variant={language === "ar" ? "solid" : "outline"}
            onPress={() => setLanguage("ar")}
            style={styles.rowButton}
          />
        </View>

        <Text
          style={[
            styles.label,
            { color: theme.textPrimary, fontFamily: bodyFont, textAlign: isRTL ? "right" : "left" }
          ]}
        >
          {t("theme")}
        </Text>

        <View style={styles.row}>
          <PrimaryButton
            label={t("lightMode")}
            variant={themeMode === "light" ? "solid" : "outline"}
            onPress={() => handleSetTheme("light")}
            style={styles.rowButton}
          />
          <PrimaryButton
            label={t("darkMode")}
            variant={themeMode === "dark" ? "solid" : "outline"}
            onPress={() => handleSetTheme("dark")}
            style={styles.rowButton}
          />
        </View>

        <Text
          style={[
            styles.label,
            { color: theme.textPrimary, fontFamily: bodyFont, textAlign: isRTL ? "right" : "left" }
          ]}
        >
          {t("username")}
        </Text>
        <TextInput
          value={localName}
          onChangeText={setLocalName}
          style={[
            styles.input,
            {
              borderColor: theme.border,
              color: theme.textPrimary,
              fontFamily: bodyFont,
              textAlign: isRTL ? "right" : "left"
            }
          ]}
          placeholder={t("usernamePlaceholder")}
          placeholderTextColor={theme.textSecondary}
        />

        <Text
          style={[
            styles.label,
            { color: theme.textPrimary, fontFamily: bodyFont, textAlign: isRTL ? "right" : "left" }
          ]}
        >
          {t("avatarEmoji")}
        </Text>
        <TextInput
          value={localAvatar}
          onChangeText={setLocalAvatar}
          style={[
            styles.input,
            {
              borderColor: theme.border,
              color: theme.textPrimary,
              fontFamily: bodyFont,
              textAlign: "center"
            }
          ]}
          maxLength={2}
        />

        <Text
          style={[
            styles.label,
            { color: theme.textPrimary, fontFamily: bodyFont, textAlign: isRTL ? "right" : "left" }
          ]}
        >
          {t("profileColor")}
        </Text>
        <View style={styles.paletteRow}>
          {profilePalette.map((color) => {
            const selected = color === localProfileColor;
            return (
              <Pressable
                key={color}
                onPress={() => setLocalProfileColor(color)}
                style={[
                  styles.colorSwatch,
                  {
                    backgroundColor: color,
                    borderColor: selected ? theme.textPrimary : theme.border,
                    borderWidth: selected ? 2 : 1
                  }
                ]}
              />
            );
          })}
        </View>

        <PrimaryButton label={t("saveProfile")} onPress={handleSaveProfile} />

        <Text
          style={{
            marginTop: 14,
            color: theme.textSecondary,
            fontFamily: bodyFont,
            textAlign: "center"
          }}
        >
          {t("saveSettings")}
        </Text>

        <PrimaryButton
          label={t("backHome")}
          onPress={onBack}
          variant="outline"
          style={{ marginTop: 14 }}
        />

        <Text
          style={{
            marginTop: 16,
            textAlign: "center",
            color: theme.textSecondary,
            fontFamily: bodyFont,
            fontSize: 12
          }}
        >
          {t("developedBy")}
        </Text>
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
  panel: {
    gap: 8
  },
  label: {
    marginTop: 6,
    fontSize: 14
  },
  row: {
    flexDirection: "row",
    gap: 10
  },
  rowButton: {
    flex: 1
  },
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12
  },
  paletteRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 6
  },
  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: 999
  }
});
