import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Database from "../database";

const StreakScreen = () => {
  const [streak, setStreak] = useState<number>(0);
  const [highest, setHighest] = useState<number>(0);

  const fetchStreakCount = async () => {
    try {
      const storedStreakData = await Database.getStreak();
      const data = JSON.parse(storedStreakData as string).rows._array;
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
    <View style={styles.container}>
      <View style={styles.streakContainer}>
        {highest > 0 ? (
          <Text
            style={styles.highestStreakMessage}
          >{`Your all-time high is ${highest} days!\ Keep it up!`}</Text>
        ) : (
          <Text style={styles.highestStreakMessage}>
            You haven't reached a high enough streak yet. Keep going! 😢
          </Text>
        )}

        {streak > 0 ? (
          <>
            <Text style={styles.streakNumber}>{`${streak}`}</Text>
            <Text style={styles.bigStreakMessage}>{`day streak`}</Text>
          </>
        ) : (
          <Text style={styles.noStreakMessage}>Start a new streak today!</Text>
        )}
      </View>
      <ImageBackground
        source={require("../../assets/images/fire.gif")}
        style={styles.image}
        resizeMode="contain"
      ></ImageBackground>
      <Text style={styles.additionalText}>
        Keep your Perfect Streak Flame by waking up on time every day.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1f2129",
  },
  streakContainer: {
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    marginBottom: 10,
  },
  streakNumber: {
    fontSize: 70,
    textAlign: "center",
    marginBottom: 0,
    marginTop: 10,
    fontWeight: "bold",
    color: "#FF5D2E",
  },
  bigStreakMessage: {
    fontSize: 40,
    textAlign: "center",
    marginTop: 0,
    marginBottom: 15,
    fontWeight: "bold",
    color: "#FF5D2E",
  },
  noStreakMessage: {
    fontSize: 30,
    textAlign: "center",
    marginTop: 50,
    marginBottom: 15,
    fontWeight: "bold",
    color: "#FF5D2E",
  },
  highestStreakMessage: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 15,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#000000",
    borderStyle: "solid",
    borderColor: "#FF5D2E",
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  additionalText: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

export default StreakScreen;
