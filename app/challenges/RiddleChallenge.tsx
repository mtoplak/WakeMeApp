import React, { useState, useEffect } from "react";
import { router, useNavigation } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import Database from "../database";
import { Audio } from "expo-av";
const Buzzer = require("../../assets/audio/Buzzer.mp3");
const Barking_Cat = require("../../assets/audio/BarkingCat.mp3");
const Rick_Roll = require("../../assets/audio/RickRoll.mp3");
const Default = require("../../assets/audio/Default.mp3");

const RiddleChallenge = () => {
  const [answer, setAnswer] = useState("");
  const [triesLeft, setTriesLeft] = useState(3);
  const [wordData, setWordData] = useState({
    word: "",
    hint: "",
    category: "",
    numLetters: 0,
    numSyllables: 0,
  });
  const [scrambledWord, setScrambledWord] = useState("");
  const [loading, setLoading] = useState(true);
  const [sound, setSound] = useState<any>();
  const navigation = useNavigation();

  useEffect(() => {
    fetchRandomWord();
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

  const fetchRandomWord = async () => {
    try {
      const response = await fetch(
        "https://www.wordgamedb.com/api/v1/words/random"
      );
      const data = await response.json();
      setWordData(data);
      let shuffledWord = shuffleWord(data.word);
      const lowercaseAnswer = data.word.toLowerCase();

      while (shuffledWord.toLowerCase() === lowercaseAnswer) {
        shuffledWord = shuffleWord(data.word);
      }

      setWordData(data);
      setScrambledWord(shuffledWord);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching random word:", error);
      setLoading(false);
      setWordData({
        word: "cactus",
        hint: "Doesn't need a lot of water",
        category: "plant",
        numLetters: 6,
        numSyllables: 2,
      });
      setScrambledWord(shuffleWord("cactus"));
    }
  };

  const shuffleWord = (word: string) => {
    return word
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  };

  const checkAnswer = () => {
    if (answer.toLowerCase() === wordData.word.toLowerCase()) {
      Database.updateStreak();
      if (sound) {
        sound.stopAsync();
        sound.unloadAsync();
      }
      Alert.alert("Congratulations!", "You solved the riddle!", [
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
        Alert.alert(
          `The answer was ${wordData.word}`,
          "You failed! Try again tommorow"
        );
        Database.resetStreak();
        if (sound) {
          sound.stopAsync();
          sound.unloadAsync();
        }
        navigation.navigate("(tabs)", { screen: "streak" });
      }
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Text style={styles.hintText}>{`${
            triesLeft === 1
              ? "Hint: " + wordData.hint
              : "Unscramble the letters to solve the riddle!"
          }`}</Text>
          <Text
            style={styles.categoryText}
          >{`Category: ${wordData.category}`}</Text>
          <Text
            style={styles.riddleText}
          >{`Scrambled Letters: ${scrambledWord}`}</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Answer"
            placeholderTextColor="#757575"
            onChangeText={(text) => setAnswer(text)}
            value={answer}
          />
          <Text style={styles.triesText}>{`You are on try (${
            3 - triesLeft + 1
          }/3)`}</Text>
          <TouchableOpacity style={styles.checkA} onPress={checkAnswer}>
            <Text style={styles.checkAText}>Check Answer</Text>
          </TouchableOpacity>
        </>
      )}
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
  hintText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 16,
    color: "#757575",
    marginBottom: 10,
  },
  riddleText: {
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
    backgroundColor: "#1f2129",
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

export default RiddleChallenge;
