import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableHighlight, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Notification from "expo-notifications";
import { Audio } from "expo-av";
import MyContext from "../context/SoundContext";
const Buzzer = require("../../assets/audio/Buzzer.mp3");
const Barking_Cat = require("../../assets/audio/BarkingCat.mp3");
const Rick_Roll = require("../../assets/audio/RickRoll.mp3");
const Default = require("../../assets/audio/Default.mp3");

const AlarmScreen = () => {
  const [time, setTime] = useState("");
  const [challenge, setChallenge] = useState("");
  const [sound, setSound] = useState<any>();
  const { setPlayingSound } = useContext(MyContext);
  const lastNotificationResponse = Notification.useLastNotificationResponse();

  useEffect(() => {
    // console.log("Last Notification Response:", lastNotificationResponse);
    if (lastNotificationResponse) {
      const { time, challenge, ringtone } =
        lastNotificationResponse.notification.request.content.data;
      setTime(time);
      setChallenge(challenge);
      playSound(ringtone);
    }

    return () => {
      if (sound) {
        sound.stopAsync();
        sound.unloadAsync();
      }
    };
  }, [lastNotificationResponse]);

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
          await sound.unloadAsync();
          router.back();
        },
        style: "cancel",
      },
    ]);
  };

  const handleStop = async () => {
    console.log("Stop button pressed");
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
