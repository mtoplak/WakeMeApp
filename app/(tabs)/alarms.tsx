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
      const all: any = await Database.getAll();
      const dbArray = JSON.parse(all).rows._array;
      setAlarms(dbArray);
    } catch (error) {
      console.error("Error reading alarms from database:", error);
    }
  };

  const renderRightActions = (progress: any, dragX: any, item: any) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100],
      outputRange: [0, 0, 1],
      extrapolate: "clamp",
    });

    const handleDelete = (id: any) => {
      Database.delete(id);
      read_db();
    };

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

  const renderAlarmItem = ({ item }: { item: any }) => {
    const padNumber = (num: number) => num.toString().padStart(2, "0");

    return (
      <Swipeable
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, item)
        }
      >
        <View style={styles.listItem}>
          <View style={styles.leftContainer}>
            <Text style={styles.alarmTimeText}>
              {`${padNumber(parseInt(item.hours))}:${padNumber(
                parseInt(item.minutes)
              )}`}
            </Text>
          </View>

          <View style={styles.rightContainer}>
            <Text>{`Alarm name (to do) ${item.id}`}</Text>
            <Text>{`Challenge: ${item.dailyChallenge}`}</Text>
            <Text>{`Sound: ${item.sound}`}</Text>
          </View>
        </View>
      </Swipeable>
    );
  };

  return alarms.length === 0 ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>You haven't set any alarms yet</Text>
    </View>
  ) : (
    <View>
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
    width: "100%",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  swipeableContainer: {
    width: "100%",
  },
  rightAction: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    marginTop: 10,
  },
  actionText: {
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
    padding: 10,
  },
  leftContainer: {
    marginRight: 10,
  },
  alarmTimeText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  rightContainer: {
    flex: 1,
  },
});

export default Alarms;
