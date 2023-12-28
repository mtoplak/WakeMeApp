import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableHighlight, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Audio } from "expo-av";
import SoundContext from "../context/SoundContext";
import Database from "../../database";
const Buzzer = require("../../assets/audio/Buzzer.mp3");
const Barking_Cat = require("../../assets/audio/BarkingCat.mp3");
const Rick_Roll = require("../../assets/audio/RickRoll.mp3");
const Default = require("../../assets/audio/Default.mp3");

const AlarmScreen = () => {
  const [time, setTime] = useState("");
  const [challenge, setChallenge] = useState("");
  const [sound, setSound] = useState<any>();
  const { setPlayingSound } = useContext(SoundContext);

  useEffect(() => {
    Database.getLatestAlarm((alarm: any) => {
      if (alarm) {
        setTime(`${alarm.hours}:${alarm.minutes}`);
        setChallenge(alarm.dailyChallenge);
        playSound(alarm.sound);
      }
    });

    return () => {
      if (sound) {
        sound.stopAsync();
        sound.unloadAsync();
      }
    };
  }, []);

  async function playSound(ring: any) {
    let ringtoneModule;

    switch (ring) {
      case "Buzzer":
        ringtoneModule = Buzzer;
        break;
      case "Barking Cat":
        ringtoneModule = Barking_Cat;
        break;
      case "Rick Roll":
        ringtoneModule = Rick_Roll;
        break;
      default:
        ringtoneModule = Default;
        break;
    }
    const { sound } = await Audio.Sound.createAsync(ringtoneModule, {
      shouldPlay: true,
      isLooping: true,
    });
    setSound(sound);
    setPlayingSound(sound);
  }

  const handleSnooze = () => {
    Alert.alert("Snooze", "You will lose your streak", [
      {
        text: "OK",
        onPress: async () => {
          await sound.stopAsync();
          await sound.unloadAsync();
          router.back();
        },
        style: "cancel",
      },
    ]);
  };

  const handleStop = async () => {
    console.log("Stop button pressed");
    // Database.updatePassed(1);
    await sound.unloadAsync();
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
