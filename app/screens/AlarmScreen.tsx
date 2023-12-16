import React, { useEffect, useState } from "react";
import { View, Text, TouchableHighlight, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Notification from "expo-notifications";

const AlarmScreen = () => {
  const [time, setTime] = useState("");
  const [challenge, setChallenge] = useState("");

  const lastNotificationResponse = Notification.useLastNotificationResponse();

  useEffect(() => {
    // console.log("Last Notification Response:", lastNotificationResponse);
    if (lastNotificationResponse) {
      const { time, challenge } =
        lastNotificationResponse.notification.request.content.data;
      setTime(time);
      setChallenge(challenge);
    }
  }, [lastNotificationResponse]);

  const handleSnooze = () => {
    Alert.alert("Snooze", "You will lose your streak", [
      {
        text: "OK",
        onPress: () => {
          router.back();
        },
        style: "cancel",
      },
    ]);
  };

  const handleStop = () => {
    console.log("Stop button pressed");
    router.replace(`/challenges/${challenge}Challenge`);
  };

  return (
    <LinearGradient
      colors={["#3498db", "#e74c3c"]}
      style={{
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <View style={{ alignItems: "center", marginBottom: 40 }}>
        <Text style={{ fontSize: 80, fontWeight: "bold", color: "white" }}>
          {time}
        </Text>
      </View>
      <View style={{ width: "80%" }}>
        <TouchableHighlight
          underlayColor="transparent"
          style={{
            padding: 15,
            borderRadius: 50,
            marginBottom: 80,
            marginTop: 80,
            alignItems: "center",
            borderColor: "white",
            borderWidth: 1,
          }}
          onPress={handleSnooze}
        >
          <View>
            <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
              Snooze
            </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor="transparent"
          style={{
            padding: 20,
            borderRadius: 50,
            alignItems: "center",
            borderColor: "white",
            borderWidth: 1,
          }}
          onPress={handleStop}
        >
          <View>
            <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
              Stop
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    </LinearGradient>
  );
};

export default AlarmScreen;
