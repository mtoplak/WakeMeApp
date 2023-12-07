import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";

const RiddleChallenge = () => {
  const [answer, setAnswer] = useState("");
  const [triesLeft, setTriesLeft] = useState(3);

  const checkAnswer = () => {
    const correctAnswer = "Keyboard";

    if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
      Alert.alert("Congratulations!", "You solved the riddle!");
    } else {
      setTriesLeft(triesLeft - 1);
      Alert.alert("Incorrect", `Try again! Tries left: ${triesLeft - 1}`);
      setAnswer("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.riddleText}>What has keys but can't open locks?</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Answer"
        placeholderTextColor="#757575"
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
