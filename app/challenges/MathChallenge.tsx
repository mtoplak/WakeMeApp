import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import Database from "../database";
import { router } from "expo-router";
import { Audio } from "expo-av";
import { useNavigation } from "expo-router";
const Buzzer = require("../../assets/audio/Buzzer.mp3");
const Barking_Cat = require("../../assets/audio/BarkingCat.mp3");
const Rick_Roll = require("../../assets/audio/RickRoll.mp3");
const Default = require("../../assets/audio/Default.mp3");

const MathChallenge: React.FC = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState("");
  const [triesLeft, setTriesLeft] = useState(3);
  const [sound, setSound] = useState<any>();
  const navigation = useNavigation();

  useEffect(() => {
    generateMathProblem();
  }, []);

  useEffect(() => {
    Database.getLatestAlarm((alarm: any) => {
      if (alarm) {
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

  const generateRandomNumber = (): number => Math.floor(Math.random() * 12) + 1;

  const generateMathProblem = (): void => {
    setNum1(generateRandomNumber());
    setNum2(generateRandomNumber());
  };

  const checkAnswer = (): void => {
    const correctAnswer = num1 * num2;

    if (parseInt(answer) === correctAnswer) {
      if (sound) {
        sound.stopAsync();
        sound.unloadAsync();
      }
      Alert.alert("Congratulations!", "You solved the math problem!", [
        {
          text: "Continue",
          onPress: () => {
            router.push("screens/QuoteScreen");
          },
        },
      ]);
    } else {
      setTriesLeft(triesLeft - 1);
      Alert.alert("Incorrect", `Try again! Tries left: ${triesLeft - 1}`);
      setAnswer("");

      if (triesLeft === 1) {
        if (sound) {
          sound.stopAsync();
          sound.unloadAsync();
        }
        Alert.alert("Out of Tries", "You failed! Try again tomorrow.", [
          {
            text: "OK",
            onPress: async () => {
              Database.resetStreak();
              navigation.navigate("(tabs)", { screen: "streak" });
            },
          },
        ]);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.equationText}>{`${num1} x ${num2} = ?`}</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Answer"
        placeholderTextColor="#757575"
        keyboardType="numeric"
        onChangeText={(text) => setAnswer(text)}
        value={answer}
      />
      <Text style={styles.triesText}>{`Try (${triesLeft}/3)`}</Text>
      <TouchableOpacity style={styles.checkA} onPress={checkAnswer}>
        <Text style={styles.checkAText}>Check Answer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  equationText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 40,
    borderColor: "#BDBDBD",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: "90%",
    borderRadius: 5,
    color: "#333",
  },
  triesText: {
    fontSize: 16,
    color: "#757575",
    marginBottom: 20,
  },
  checkA: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  checkAText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default MathChallenge;
