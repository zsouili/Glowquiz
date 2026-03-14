import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ThemeMode } from "../types";

const { width, height } = Dimensions.get("window");

interface ParticleConfig {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

interface Props {
  mode: ThemeMode;
}

export function AnimatedBackground({ mode }: Props): JSX.Element {
  const darkOpacity = useRef(new Animated.Value(mode === "dark" ? 1 : 0)).current;

  const particles = useMemo<ParticleConfig[]>(() => {
    return Array.from({ length: 14 }).map((_, index) => ({
      id: index,
      x: Math.random() * width,
      size: 8 + Math.random() * 18,
      duration: 5000 + Math.random() * 5000,
      delay: Math.random() * 2500
    }));
  }, []);

  useEffect(() => {
    Animated.timing(darkOpacity, {
      toValue: mode === "dark" ? 1 : 0,
      duration: 420,
      useNativeDriver: true
    }).start();
  }, [mode, darkOpacity]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={["#FFD6A5", "#FDFFB6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View style={[StyleSheet.absoluteFill, { opacity: darkOpacity }]}> 
        <LinearGradient
          colors={["#1E1E2F", "#4E2A84"]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {particles.map((particle) => (
        <FloatingParticle key={particle.id} mode={mode} config={particle} />
      ))}
    </View>
  );
}

function FloatingParticle({
  config,
  mode
}: {
  config: ParticleConfig;
  mode: ThemeMode;
}): JSX.Element {
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(config.delay),
        Animated.timing(drift, {
          toValue: 1,
          duration: config.duration,
          useNativeDriver: true
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true
        })
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [config.delay, config.duration, drift]);

  const translateY = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [height + 30, -50]
  });

  const translateX = drift.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [config.x, config.x + 25, config.x - 15]
  });

  const opacity = drift.interpolate({
    inputRange: [0, 0.2, 0.8, 1],
    outputRange: [0, 0.5, 0.45, 0]
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: config.size,
        height: config.size,
        borderRadius: config.size / 2,
        backgroundColor: mode === "dark" ? "#7DF9FF" : "#FF7A59",
        opacity,
        transform: [{ translateY }, { translateX }]
      }}
    />
  );
}
