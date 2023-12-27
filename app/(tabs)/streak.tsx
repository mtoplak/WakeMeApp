import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Database from "../../database";

const StreakScreen = () => {
  const [streak, setStreak] = useState<number>(0);
  const [highest, setHighest] = useState<number>(0);

  const fetchStreakCount = async () => {
    try {
      const storedStreakData = await Database.getStreak();
      const data = JSON.parse(storedStreakData as string).rows._array;
      console.log(data);
      const current = data[0]?.currentStreak;
      const highest = data[0]?.highestStreak;
      setStreak(current);
      setHighest(highest);
    } catch (error) {
      console.error("Error fetching streak counts:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStreakCount();
    }, [])
  );

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={styles.heading}>Streak Counter</Text>
      <Text style={styles.streakMessage}>{`Your current streak is: ${streak}! Keep it going! 🚀`}</Text>
      <Text style={styles.streakMessage}>{`Your highest streak is: ${highest}! Dont give up now! 🚀`}</Text>

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
