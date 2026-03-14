import React from "react";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { useFonts, Baloo2_700Bold } from "@expo-google-fonts/baloo-2";
import {
  Cairo_400Regular,
  Cairo_700Bold
} from "@expo-google-fonts/cairo";
import { AppSettingsProvider } from "./src/contexts/AppSettingsContext";
import { GameProvider } from "./src/contexts/GameContext";
import { Root } from "./src/screens/Root";

export default function App(): JSX.Element {
  const [fontsLoaded] = useFonts({
    Baloo2_700Bold,
    Cairo_400Regular,
    Cairo_700Bold
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1E1E2F"
        }}
      >
        <ActivityIndicator size="large" color="#7DF9FF" />
      </View>
    );
  }

  return (
    <AppSettingsProvider>
      <GameProvider>
        <StatusBar style="light" />
        <Root />
      </GameProvider>
    </AppSettingsProvider>
  );
}
