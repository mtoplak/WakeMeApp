import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";

const QuoteScreen: React.FC = () => {
  const [quote, setQuote] = useState({
    quote: "Loading quote...",
    author: "Anonymous",
  });
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
        setQuote({
          quote: "Mornings are like nature in spring… humming with the sounds of life and the promise of a fresh new day!",
          author: "LeAura Alderson",
        });
      } else {
        setQuote({
          quote: "Error fetching quote",
          author: "Anonymous",
        });
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
    <LinearGradient colors={["#1f2129", "#FF5D2E"]} style={styles.container}>
      <Text style={styles.quoteText}>{quote.quote}</Text>
      <Text style={styles.authorText}>- {quote.author}</Text>
      <TouchableOpacity onPress={redirectToStreakPage} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Check your streak</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  quoteText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  authorText: {
    color: "white",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 4,
    marginBottom: 24,
  },
  buttonContainer: {
    padding: 15,
    borderRadius: 50,
    marginTop: 50,
    borderWidth: 1,
    borderColor: "white",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default QuoteScreen;
