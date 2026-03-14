import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { GlassPanel } from "../components/GlassPanel";
import { PrimaryButton } from "../components/PrimaryButton";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { MultiplayerRoomState, QuizType } from "../types";
import {
  createRoom,
  getMultiplayerUrl,
  joinRoom,
  leaveRoom,
  sendReaction,
  startMatch,
  subscribeConnectionStatus,
  subscribeRoomState
} from "../services/multiplayerSocket";
import { hasCustomBackendUrl } from "../services/backendConfig";

interface Props {
  onBack: () => void;
}

const ROOM_CODE_REGEX = /^[A-Z0-9]{4,8}$/;

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

export function MultiplayerScreen({ onBack }: Props): JSX.Element {
  const { t, theme, bodyFont, headingFont, username, avatar, profileColor, clientId, quizTypeLabel, isRTL } =
    useAppSettings();

  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [selectedType, setSelectedType] = useState<QuizType>("rapid_fire");
  const [roomState, setRoomState] = useState<MultiplayerRoomState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState("");

  const playerId = useMemo(() => clientId, [clientId]);

  useEffect(() => {
    const unsubscribe = subscribeRoomState((state) => {
      setRoomState(state);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeConnectionStatus(
      () => {
        setIsConnected(true);
        setConnectionMessage("");
      },
      () => {
        setIsConnected(false);
        setConnectionMessage("Disconnected from multiplayer server");
      },
      (message) => {
        setIsConnected(false);
        setConnectionMessage(message || "Unable to connect");
      }
    );

    return unsubscribe;
  }, []);

  function handleCreateRoom(): void {
    const roomCode = Math.random().toString(36).slice(2, 7).toUpperCase();
    createRoom({
      roomCode,
      quizType: selectedType,
      player: { id: playerId, username, avatar, profileColor }
    });
  }

  function handleJoinRoom(): void {
    const roomCode = roomCodeInput.trim().toUpperCase();
    if (!ROOM_CODE_REGEX.test(roomCode)) {
      return;
    }

    joinRoom({
      roomCode,
      quizType: selectedType,
      player: { id: playerId, username, avatar, profileColor }
    });
  }

  function handleLeaveRoom(): void {
    if (!roomState) {
      return;
    }
    leaveRoom(roomState.roomCode, playerId);
    setRoomState(null);
  }

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
          {t("multiplayer")}
        </Text>

        <Text style={{ color: isConnected ? theme.success : theme.danger, fontFamily: bodyFont, marginTop: 8 }}>
          {isConnected ? "Connected" : "Not connected"}
        </Text>
        <Text style={{ color: theme.textSecondary, fontFamily: bodyFont, fontSize: 12 }}>
          Server: {getMultiplayerUrl()}
        </Text>
        {!isConnected && !hasCustomBackendUrl() ? (
          <Text style={{ color: theme.textSecondary, fontFamily: bodyFont, fontSize: 12, marginTop: 4 }}>
            Tip: set EXPO_PUBLIC_BACKEND_URL to your backend public URL.
          </Text>
        ) : null}
        {connectionMessage ? (
          <Text style={{ color: theme.danger, fontFamily: bodyFont, marginTop: 4 }}>{connectionMessage}</Text>
        ) : null}

        {!roomState && (
          <>
            <Text style={[styles.label, { color: theme.textPrimary, fontFamily: bodyFont }]}>
              {t("pickQuizType")}
            </Text>
            <View style={styles.typeGrid}>
              {QUIZ_TYPES.map((type) => (
                <Pressable
                  key={type}
                  onPress={() => setSelectedType(type)}
                  style={({ pressed }) => [
                    styles.typeCard,
                    {
                      borderColor: theme.border,
                      backgroundColor: selectedType === type ? theme.accentSoft : theme.card,
                      opacity: pressed ? 0.85 : 1
                    }
                  ]}
                >
                  <Text style={{ color: theme.textPrimary, fontFamily: bodyFont }}>
                    {quizTypeLabel(type)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <PrimaryButton label={t("createRoom")} onPress={handleCreateRoom} style={{ marginTop: 12 }} />

            <Text style={[styles.label, { color: theme.textPrimary, fontFamily: bodyFont }]}>
              {t("roomCode")}
            </Text>
            <TextInput
              value={roomCodeInput}
              onChangeText={(value) => setRoomCodeInput(value.toUpperCase())}
              placeholder={t("roomCodePlaceholder")}
              placeholderTextColor={theme.textSecondary}
              style={[
                styles.input,
                { borderColor: theme.border, color: theme.textPrimary, fontFamily: bodyFont }
              ]}
              autoCapitalize="characters"
              maxLength={8}
            />
            <PrimaryButton label={t("joinRoom")} variant="outline" onPress={handleJoinRoom} />
          </>
        )}

        {roomState && (
          <>
            <Text style={[styles.roomCode, { color: theme.accent, fontFamily: headingFont }]}> 
              {t("roomCode")}: {roomState.roomCode}
            </Text>
            <Text style={{ color: theme.textSecondary, fontFamily: bodyFont, marginTop: 6 }}>
              {t("lobby")}: {quizTypeLabel(roomState.quizType)}
            </Text>

            <Text style={[styles.label, { color: theme.textPrimary, fontFamily: headingFont }]}>
              {t("liveScores")}
            </Text>

            <View style={{ gap: 8 }}>
              {roomState.players.map((player) => (
                <View key={player.id} style={[styles.row, { borderColor: theme.border, backgroundColor: theme.accentSoft }]}> 
                  <Text style={{ color: player.profileColor, fontFamily: bodyFont, flex: 1 }}>
                    {player.avatar} {player.username} {player.isHost ? "(Host)" : ""}
                  </Text>
                  <Text style={{ color: theme.textPrimary, fontFamily: headingFont }}>{player.score}</Text>
                </View>
              ))}
            </View>

            <View style={styles.reactionRow}>
              {["🔥", "👏", "😎", "😂"].map((emoji) => (
                <PrimaryButton
                  key={emoji}
                  label={`${t("emojiReaction")}: ${emoji}`}
                  variant="outline"
                  onPress={() => sendReaction(roomState.roomCode, playerId, emoji)}
                  style={styles.reactionButton}
                />
              ))}
            </View>

            <Text style={{ marginTop: 8, color: theme.textSecondary, fontFamily: bodyFont }}>
              {t("waitingPlayers")}
            </Text>

            <PrimaryButton label={t("startMatch")} onPress={() => startMatch(roomState.roomCode)} style={{ marginTop: 12 }} />
            <PrimaryButton
              label={t("leaveRoom")}
              variant="outline"
              onPress={handleLeaveRoom}
              style={{ marginTop: 8 }}
            />
          </>
        )}

        <PrimaryButton label={t("backHome")} variant="outline" onPress={onBack} style={{ marginTop: 16 }} />
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
  label: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 14
  },
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 8
  },
  typeGrid: {
    gap: 8
  },
  typeCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 10
  },
  roomCode: {
    marginTop: 10,
    fontSize: 20
  },
  row: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center"
  },
  reactionRow: {
    marginTop: 12,
    gap: 6
  },
  reactionButton: {
    width: "100%"
  }
});
