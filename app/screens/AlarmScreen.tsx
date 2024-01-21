import React, { useEffect, useState } from "react";
import { View, Text, TouchableHighlight, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Audio } from "expo-av";
import Database from "../database";
import * as Notifications from "expo-notifications";
const Buzzer = require("../../assets/audio/Buzzer.mp3");
const Barking_Cat = require("../../assets/audio/BarkingCat.mp3");
const Rick_Roll = require("../../assets/audio/RickRoll.mp3");
const Default = require("../../assets/audio/Default.mp3");

const AlarmScreen = () => {
  const [sound, setSound] = useState<any>();
  const [alarm, setAlarm] = useState<any>();

  useEffect(() => {
    Database.getLatestAlarm((alarm: any) => {
      if (alarm) {
        setAlarm(alarm);
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
      volume: 1,
    });
    setSound(sound);
  }

  const handleSnooze = () => {
    Alert.alert("Snooze", "You will lose your streak", [
      {
        text: "OK",
        onPress: async () => {
          await sound.stopAsync();
          await sound.unloadAsync();
          await Notifications.dismissAllNotificationsAsync();
          await scheduleNewNotification();
          router.back();
        },
        style: "cancel",
      },
    ]);
    Database.resetStreak();
  };

  const handleStop = async () => {
    await sound.unloadAsync();
    await Notifications.dismissAllNotificationsAsync();
    await scheduleNewNotification();
    router.replace(`/challenges/${alarm.dailyChallenge}Challenge`);
  };

  const scheduleNewNotification = async () => {
    const selectedTime = new Date();
    const tomorrow = new Date(selectedTime.getTime() + 24 * 60 * 60 * 1000);
    const alarmDate = new Date(tomorrow);

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: "ALARM",
        body: "Tap here to deactivate alarm and solve challenge",
        data: {
          url: "screens/AlarmScreen",
          time: alarm.hours + ":" + alarm.minutes,
          challenge: alarm.dailyChallenge,
          ringtone: alarm.sound,
        },
        badge: 1,
      },
      trigger: {
        date: alarmDate,
      },
    });
    Database.updateNotificationId(alarm.id, identifier);
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
          {alarm && `${alarm.hours}:${alarm.minutes}`}
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
