import React from "react";
import { View, ViewStyle, StyleSheet } from "react-native";
import { useAppSettings } from "../contexts/AppSettingsContext";

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function GlassPanel({ children, style }: Props): JSX.Element {
  const { theme } = useAppSettings();

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          shadowColor: theme.mode === "dark" ? "#7DF9FF" : "#FF8FA3"
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 6
  }
});
