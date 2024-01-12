import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router"; 

interface Quote {
  contents: {
    quote: string;
  };
}

const QuoteScreen: React.FC = () => {
  const [quote, setQuote] = useState<string | null>("Loading quote...");

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      const response = await fetch(
        "https://dummyjson.com/quotes/random"
      );
      const data = await response.json();
  
      if (data && data.quote) {
        const { quote } = data;
        setQuote(quote);
      } else {
        throw new Error("No quotes found");
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
  
      if (isError(error)) {
        setQuote(error.message);
      } else {
        setQuote("Error fetching quote");
      }
    }
  };
  
  
  const isError = (obj: any): obj is Error => {
    return obj instanceof Error && typeof obj.message === "string";
  };

  /*const redirectToHomePage = () => {
    router.replace("(tabs)/streak");

  };*/

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
    <Text style={{ color: "white", fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
        {quote}
    </Text>
    {/*<TouchableOpacity
        onPress={redirectToHomePage}
        style={{
          marginTop: 20,
          backgroundColor: "black",
          padding: 10,
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>Check your streak</Text>
      </TouchableOpacity>*/}
    </LinearGradient>
  );
};

export default QuoteScreen;
