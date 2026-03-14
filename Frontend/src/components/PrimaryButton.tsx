import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { useAppSettings } from "../contexts/AppSettingsContext";

interface Props {
  label: string;
  onPress: () => void;
  variant?: "solid" | "outline";
  style?: ViewStyle;
  disabled?: boolean;
}

export function PrimaryButton({
  label,
  onPress,
  variant = "solid",
  style,
  disabled
}: Props): JSX.Element {
  const { theme, headingFont } = useAppSettings();

  const isSolid = variant === "solid";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isSolid ? theme.accent : "transparent",
          borderColor: theme.accent,
          opacity: disabled ? 0.5 : pressed ? 0.84 : 1
        },
        style
      ]}
    >
      <Text
        style={{
          color: isSolid ? "#101014" : theme.accent,
          fontFamily: headingFont,
          fontSize: 16
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1.5,
    borderRadius: 14,
    minHeight: 46,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center"
  }
});
