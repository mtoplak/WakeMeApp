import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";

const QuoteScreen: React.FC = () => {
  const [quote, setQuote] = useState({ quote: "Loading quote...", author: "" });
  const navigation = useNavigation();

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      const response = await fetch("https://zenquotes.io/api/today");
      const data = await response.json();

      if (data) {
        setQuote({ quote: data[0].q, author: data[0].a });
      } else {
        throw new Error("No quotes found");
      }
    } catch (error) {
      console.error("Error fetching quote:", error);

      if (isError(error)) {
        setQuote({ quote: error.message, author: "" });
      } else {
        setQuote({ quote: "Error fetching quote", author: "" });
      }
    }
  };

  const isError = (obj: any): obj is Error => {
    return obj instanceof Error && typeof obj.message === "string";
  };

  const redirectToStreakPage = () => {
    navigation.navigate("(tabs)", { screen: "streak" });
  };

  return (
    <LinearGradient colors={["#3498db", "#e74c3c"]} style={styles.container}>
      <Text style={styles.quoteText}>{quote.quote}</Text>
      <Text style={styles.authorText}>{quote.author}</Text>
      <TouchableOpacity
        onPress={redirectToStreakPage}
        style={styles.buttonContainer}
      >
        <Text style={styles.buttonText}>Check your streak</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  quoteText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  authorText: {
    color: "white",
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 20,
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});

export default QuoteScreen;
