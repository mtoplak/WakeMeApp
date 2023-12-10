import React from "react";
import { View, Text, TouchableHighlight } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const alarmTime = new Date();
alarmTime.setHours(8);
alarmTime.setMinutes(30);

const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours < 10 ? "0" + hours : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }`;
};

const AlarmScreen = () => {
  const handleSnooze = () => {
    console.log("Snooze button pressed");
  };

  const handleStop = () => {
    console.log("Stop button pressed");
    router.replace("/challenges/BarcodeChallenge");
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
          {formatTime(alarmTime)}
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
