import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const QuoteScreen = () => {
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
      <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
        This is quote
      </Text>
    </LinearGradient>
  );
};

export default QuoteScreen;
