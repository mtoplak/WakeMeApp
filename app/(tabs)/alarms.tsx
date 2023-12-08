import React, { useState, useCallback } from "react";
import { View, Text, FlatList, Animated, StyleSheet } from "react-native";
import Database from "../../database";
import { useFocusEffect } from "expo-router";
import { RectButton } from "react-native-gesture-handler";
import { Swipeable } from "react-native-gesture-handler";

const Alarms = () => {
  const [alarms, setAlarms] = useState([]);

  useFocusEffect(
    useCallback(() => {
      read_db();
    }, [])
  );

  const read_db = async () => {
    try {
      const all = await Database.getAll();
      const dbArray = JSON.parse(all).rows._array;
      setAlarms(dbArray);
    } catch (error) {
      console.error("Error reading alarms from database:", error);
    }
  };

  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
      extrapolate: "clamp",
    });

    function handleDelete(id: any): void {
      throw new Error("Function not implemented.");
    }

    return (
      <RectButton
        style={styles.rightAction}
        onPress={() => handleDelete(item.id)}
      >
        <Animated.Text
          style={[
            styles.actionText,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          Delete
        </Animated.Text>
      </RectButton>
    );
  };

  const renderAlarmItem = ({ item }) => (
    <Swipeable
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX)
      }
      onSwipeableRightOpen={() => console.log(item.id)}
    >
      <View style={styles.listItem}>
        <Text>{`Alarm name (to do) ${item.id}`}</Text>
        <Text>{`Challenge: ${item.dailyChallenge}`}</Text>
        <Text>{`${parseInt(item.hours)}:${parseInt(item.minutes)}`}</Text>
        <Text>{`Sound: ${item.sound}`}</Text>
      </View>
    </Swipeable>
  );

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <FlatList
        data={alarms}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAlarmItem}
        contentContainerStyle={{ width: "100%" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: "white",
    padding: 13,
    width: "100%",
    marginBottom: 10,
  },
  swipeableContainer: {
    width: "100%",
  },
  rightAction: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
  },
  actionText: {
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
    padding: 10,
  },
});

export default Alarms;
