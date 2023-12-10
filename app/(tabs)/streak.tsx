import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";

const Streak = () => {
  const [streakHistory, setStreakHistory] = useState<boolean[]>([]);

  useEffect(() => {
    const randomStreakHistory = Array.from(
      { length: 7 },
      () => Math.random() > 0.5
    );
    setStreakHistory(randomStreakHistory);
  }, []);

  const renderDayItem = ({ item, index }: { item: any; index: number }) => {
    const dayStatus = item ? "✅" : "❌";
    const dayName = getDayName(index);

    return (
      <View style={styles.dayItem}>
        <Text>{`${dayName}: ${dayStatus}`}</Text>
      </View>
    );
  };

  const getCurrentStreakMessage = () => {
    const currentStreak = calculateCurrentStreak();
    if (currentStreak === 0) {
      return `You're on a ${currentStreak} day streak! You can do better! 🤔`;
    }
    return `You're on day ${currentStreak} of your streak! Keep it going! 🚀`;
  };

  const calculateCurrentStreak = () => {
    let currentStreak = 0;

    for (let i = streakHistory.length - 1; i >= 0; i--) {
      if (streakHistory[i]) {
        currentStreak++;
      } else {
        break;
      }
    }

    return currentStreak;
  };

  const getDayName = (index: number) => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayIndex = (new Date().getDay() + index) % 7;
    return daysOfWeek[dayIndex];
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* <View style={styles.container}> */}
      <Text style={styles.heading}>Streak Counter</Text>

      <FlatList
        data={streakHistory}
        renderItem={renderDayItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.streakContainer}
      />

      <Image
        source={{
          uri: "https://media.istockphoto.com/id/1514092477/vector/lit-fire-emoji-vector-illustration.jpg?s=612x612&w=0&k=20&c=ry7BOl115td1-xKAcjQhPEZZq18vcIEJLGsZEr1RJEM=",
        }}
        style={styles.image}
      />

      <Text style={styles.streakMessage}>{getCurrentStreakMessage()}</Text>
      {/* </View> */}
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
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 70,
  },
  streakContainer: {
    alignItems: "center",
  },
  dayItem: {
    marginVertical: 8,
  },
  streakMessage: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 100,
    fontWeight: "bold",
    paddingHorizontal: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default Streak;
