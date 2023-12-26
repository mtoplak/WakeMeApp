import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getStreakCount } from "../streakLogic";

const StreakScreen = () => {
  const [streak, setStreak] = useState(0);

  const getCurrentStreakMessage = () => {
    return `Your current streak is: ${streak}! Keep it going! 🚀`;
  };

  const fetchStreakCount = async () => {
    const storedStreak = await getStreakCount();
    setStreak(storedStreak);
  };

  useFocusEffect(
    useCallback(() => {
      fetchStreakCount();
    }, [])
  );

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={styles.heading}>Streak Counter</Text>
      <Text style={styles.streakMessage}>{getCurrentStreakMessage()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 70,
  },
  streakMessage: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 100,
    fontWeight: "bold",
    paddingHorizontal: 20,
  },
});

export default StreakScreen;
