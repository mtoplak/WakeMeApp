import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker as SelectPicker } from "@react-native-picker/picker";
import Database from "../../database";
import { ScrollView } from "react-native-gesture-handler";
import * as Notification from "expo-notifications";
// import Constants from "expo-constants";

Notification.setNotificationHandler({
  handleNotification: async (notification) => {
    //console.log(notification)
    return {
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowAlert: true,
    };
  },
  handleError: () => {},
  handleSuccess: () => {},
});

const HomePage = () => {
  const [selectedSound, setSelectedSound] = useState("Barking Cat");
  const [selectedChallenge, setSelectedChallenge] = useState("Barcode");
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const soundPickerRef = useRef();
  const challengePickerRef = useRef();

  useEffect(() => {
    const configurePushNotifications = async () => {
      if (Platform.OS === "android") {
        // define in which channel notification should be recieved there (only required for android)
        Notification.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notification.AndroidImportance.DEFAULT, // notification priority
        });
      }
      const { status } = await Notification.getPermissionsAsync();
      let finalStatus = status;

      // ask user for notification permission
      if (finalStatus !== "granted") {
        const { status } = await Notification.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert(
          "Permission Required",
          "Push notifications need a permission."
        );
        return;
      }

      // get pushTokenData after get permission
      // const pushTokenData = await Notification.getExpoPushTokenAsync({
      //   projectId: Constants?.expoConfig?.extra?.eas?.projectId,
      // });
      // console.log("TOKEN = ", pushTokenData);
    };
    configurePushNotifications();
  }, []);

  useEffect(() => {
    // will excute whenever notification recieved on the device
    const subscription = Notification.addNotificationReceivedListener(
      (notification) => {
        console.log("notification recieved");
        console.log(notification);
        console.log(notification.request.content.data.userName);
      }
    );

    const responseSubscripion =
      Notification.addNotificationResponseReceivedListener((response) => {
        console.log("notification response");
        // console.log(response);
        console.log(response.notification.request.content.data);
      });
    return () => {
      // will remove when the component is removed.
      subscription.remove();
      responseSubscripion.remove();
    };
  }, []);

  const handleTimeChange = (event: any, date: Date | undefined) => {
    if (date !== undefined) {
      setShowTimePicker(Platform.OS === "ios"); // Hide picker immediately on iOS
      setSelectedTime(date);
    }
  };

  const handleSaveAlarm = async () => {
    // Parse selectedTime to extract hours and minutes
    const parsedTime = new Date(selectedTime);
    const now = new Date();
    let alarmDate = new Date(selectedTime);

    // Check if the specified time has already passed for today
    if (parsedTime < now) {
      // If yes, schedule for tomorrow
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
          userName: "MAC",
          url: "screens/AlarmScreen",
          time: hours + ":" + minutes,
          challenge: selectedChallenge,
          ringtone: selectedSound,
        },
        badge: 1,
      },
      trigger: {
        date: alarmDate,
      },
    });
    Database.add(hours, minutes, selectedSound, selectedChallenge, identifier);
  };

  const scrollViewRef = useRef<ScrollView | null>(null);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    // Check if the scroll direction is downward (offsetY is increasing)
    if (offsetY > 0) {
      // Allow scrolling
      return;
    }

    // Prevent scrolling upward
    scrollViewRef.current!.scrollTo({ x: 0, y: 0, animated: false });
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      <View style={styles.container}>
        <View style={styles.centeredContainer}>
          <Text style={[styles.label, { marginTop: 10 }]}>
            Select Challenge
          </Text>

          <DateTimePicker
            value={selectedTime}
            mode="time"
            display="spinner"
            onChange={handleTimeChange}
            minuteInterval={1}
            is24Hour={true}
            textColor="black"
          />

          <View>
            <Text style={styles.label}>Select Sound</Text>
            <SelectPicker
              ref={soundPickerRef}
              selectedValue={selectedSound}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedSound(itemValue)
              }
              itemStyle={{ fontSize: 16 }}
            >
              <SelectPicker.Item label="Default Sound" value="Default" />
              <SelectPicker.Item label="Barking Cat" value="Barking Cat" />
              <SelectPicker.Item
                label="Never Gonna Give You Up"
                value="Rick Roll"
              />
              <SelectPicker.Item label="Buzzer" value="Buzzer" />
            </SelectPicker>
            <Text style={styles.label}>Select Challenge</Text>
            <SelectPicker
              ref={challengePickerRef}
              selectedValue={selectedChallenge}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedChallenge(itemValue)
              }
              itemStyle={{ fontSize: 16 }}
            >
              <SelectPicker.Item label="Riddle Challenge" value="Riddle" />
              <SelectPicker.Item label="Barcode Scan" value="Barcode" />
              <SelectPicker.Item label="Math Challenge" value="Math" />
            </SelectPicker>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveAlarm}>
            <Text style={styles.saveButtonText}>Save Alarm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
  },
  heading: {
    fontSize: 40,
    fontWeight: "bold",
    marginTop: 10,
    alignSelf: "center",
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
  },
  pickerButton: {
    backgroundColor: "#3498db",
    borderRadius: 15,
    alignItems: "center",
  },
  pickerButtonText: {
    color: "white",
    fontSize: 18,
  },
  saveButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 70,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HomePage;
