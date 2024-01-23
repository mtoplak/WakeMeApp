import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Animated,
  StyleSheet,
  Switch,
} from "react-native";
import Database from "../database";
import { useFocusEffect } from "expo-router";
import { RectButton } from "react-native-gesture-handler";
import { Swipeable } from "react-native-gesture-handler";
import * as Notification from "expo-notifications";

const Alarms = () => {
  const [alarms, setAlarms] = useState([]);

  useFocusEffect(
    useCallback(() => {
      read_db();
    }, [])
  );

  const onToggleSwitch = async (id: number, active: number) => {
    if (active == 1) {
      Database.updateActive(id, 0);
      const identifier: string = await Database.updateNotificationId(id, "");
      await Notification.cancelScheduledNotificationAsync(identifier);
    } else {
      Database.updateActive(id, 1);
      const alarmToUpdate: any = await Database.getOne(id);

      // Schedule notification again
      const alarm = JSON.parse(alarmToUpdate).rows._array[0];
      const selectedTime = new Date();
      selectedTime.setHours(alarm.hours);
      selectedTime.setMinutes(alarm.minutes);
      const parsedTime = new Date(selectedTime);
      const now = new Date();
      let alarmDate = new Date(selectedTime);

      if (parsedTime < now) {
        alarmDate.setDate(now.getDate() + 1);
      }

      let hours: number | string = alarmDate.getHours();
      let minutes: number | string = alarmDate.getMinutes();

      hours = hours < 10 ? `0${hours}` : hours.toString();
      minutes = minutes < 10 ? `0${minutes}` : minutes.toString();
      console.log(
        `${alarmDate.toISOString().slice(0, 10)}T${hours}:${minutes}:00`
      );
      const identifier = await Notification.scheduleNotificationAsync({
        content: {
          title: "ALARM",
          body: "Tap here to deactivate alarm and solve challenge",
          data: {
            url: "screens/AlarmScreen",
            time: hours + ":" + minutes,
            challenge: alarm.dailyChallenge,
            ringtone: alarm.sound,
          },
          badge: 1,
        },
        trigger: {
          date: alarmDate,
        },
      });

      Database.updateNotificationId(id, identifier);
    }
    read_db();
  };

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

    const handleDelete = async (id: any) => {
      const identifier = await Database.delete(id);
      await Notification.cancelScheduledNotificationAsync(identifier);
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
    return (
      <Swipeable
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, item)
        }
      >
        <View style={styles.listItem}>
          <View style={styles.leftContainer}>
            <Text style={styles.alarmTimeText}>
              {`${item.hours}:${item.minutes}`}
            </Text>
          </View>
          <View style={styles.rightContainer}>
            <Text>{item.name !== "" ? item.name : `Alarm ${item.id}`}</Text>
            <Text>{`Challenge: ${item.dailyChallenge}`}</Text>
            <Text>{`Sound: ${item.sound}`}</Text>
          </View>
          <Switch
            value={item.active == 1 ? true : false}
            onValueChange={() => onToggleSwitch(item.id, item.active)}
            trackColor={{ true: "#4CD964" }}
          />
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
