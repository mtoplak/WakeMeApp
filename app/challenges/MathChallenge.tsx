import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";

const MathChallenge = () => {
  const [answer, setAnswer] = useState("");
  const [triesLeft, setTriesLeft] = useState(3);

  const checkAnswer = () => {
    const correctAnswer = "3";

    if (answer == correctAnswer) {
      Alert.alert("Congratulations!", "You solved the equation!");
    } else {
      setTriesLeft(triesLeft - 1);
      Alert.alert("Incorrect", `Try again! Tries left: ${triesLeft - 1}`);
      setAnswer("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.equationText}>∛(9^2 / log₂(8)) =</Text>
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
