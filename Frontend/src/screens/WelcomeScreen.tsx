import React, { useState } from "react";
import {
  I18nManager,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { GlassPanel } from "../components/GlassPanel";
import { PrimaryButton } from "../components/PrimaryButton";
import { useAppSettings } from "../contexts/AppSettingsContext";

interface Props {
  onContinue: () => void;
}

export function WelcomeScreen({ onContinue }: Props): JSX.Element {
  const {
    language,
    setLanguage,
    setProfile,
    t,
    headingFont,
    bodyFont,
    theme,
    isRTL,
    username,
    avatar,
    profileColor,
    profilePalette
  } = useAppSettings();

  const [localName, setLocalName] = useState(username);
  const [localAvatar, setLocalAvatar] = useState(avatar || "🎯");
  const [localProfileColor, setLocalProfileColor] = useState(profileColor);

  async function handleContinue(): Promise<void> {
    if (!localName.trim()) {
      return;
    }
    await setProfile(localName, localAvatar, localProfileColor);
    onContinue();
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <GlassPanel>
        <Text
          style={[
            styles.title,
            { color: theme.textPrimary, fontFamily: headingFont, textAlign: "center" }
          ]}
        >
          {t("appTitle")}
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: theme.textSecondary,
              fontFamily: bodyFont,
              textAlign: "center",
              writingDirection: isRTL ? "rtl" : "ltr"
            }
          ]}
        >
          {t("selectLanguage")}
        </Text>

        <Text
          style={[
            styles.hint,
            {
              color: theme.textSecondary,
              fontFamily: bodyFont,
              textAlign: "center",
              writingDirection: isRTL ? "rtl" : "ltr"
            }
          ]}
        >
          {t("chooseLanguageHint")}
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
            onPress={() => {
              if (!I18nManager.isRTL) {
                // Screen-level RTL styles are used, so no forced app reload required.
              }
              setLanguage("ar");
            }}
            style={styles.rowButton}
          />
        </View>

        <Text
          style={[
            styles.label,
            {
              color: theme.textPrimary,
              fontFamily: bodyFont,
              textAlign: isRTL ? "right" : "left"
            }
          ]}
        >
          {t("username")}
        </Text>
        <TextInput
          value={localName}
          onChangeText={setLocalName}
          placeholder={t("usernamePlaceholder")}
          placeholderTextColor={theme.textSecondary}
          style={[
            styles.input,
            {
              color: theme.textPrimary,
              borderColor: theme.border,
              fontFamily: bodyFont,
              textAlign: isRTL ? "right" : "left"
            }
          ]}
        />

        <Text
          style={[
            styles.label,
            {
              color: theme.textPrimary,
              fontFamily: bodyFont,
              textAlign: isRTL ? "right" : "left"
            }
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

        <Text
          style={[
            styles.label,
            {
              color: theme.textPrimary,
              fontFamily: bodyFont,
              textAlign: isRTL ? "right" : "left"
            }
          ]}
        >
          {t("avatarEmoji")}
        </Text>
        <TextInput
          value={localAvatar}
          onChangeText={setLocalAvatar}
          maxLength={2}
          style={[
            styles.input,
            {
              color: theme.textPrimary,
              borderColor: theme.border,
              fontFamily: bodyFont,
              textAlign: "center"
            }
          ]}
        />

        <PrimaryButton
          label={t("startGame")}
          onPress={handleContinue}
          style={styles.startButton}
          disabled={!localName.trim()}
        />

        <Text
          style={[
            styles.credit,
            { color: theme.textSecondary, fontFamily: bodyFont }
          ]}
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
  title: {
    fontSize: 40,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 22,
    marginBottom: 8
  },
  hint: {
    fontSize: 14,
    marginBottom: 18
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18
  },
  rowButton: {
    flex: 1
  },
  label: {
    fontSize: 14,
    marginBottom: 6
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 46,
    paddingHorizontal: 12,
    marginBottom: 14
  },
  paletteRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14
  },
  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: 999
  },
  startButton: {
    marginTop: 4
  },
  credit: {
    textAlign: "center",
    marginTop: 18,
    fontSize: 12
  }
});
