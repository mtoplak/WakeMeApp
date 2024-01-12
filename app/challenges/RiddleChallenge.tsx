import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { updateStreakCount } from "../streakLogic";
import Database from "../../database";
import QuoteScreen from "../screens/QuoteScreen";

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

  useEffect(() => {
    fetchRandomWord();
  }, []);

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
        router.back();
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
            triesLeft === 1 ? "Hint: " + wordData.hint : "You can do it!"
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
          <Text style={styles.triesText}>{`You are on Try (${
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
    color: "#757575",
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

export default RiddleChallenge;
