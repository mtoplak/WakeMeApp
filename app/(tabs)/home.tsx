import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker as SelectPicker } from "@react-native-picker/picker";
import Database from "../database";
import { ScrollView } from "react-native-gesture-handler";
import * as Notification from "expo-notifications";
// import Constants from "expo-constants";

Notification.setNotificationHandler({
  handleNotification: async (notification) => {
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
  const [alarmName, setAlarmName] = useState("");

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

      // get pushTokenData after getting permission
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
        console.log("notification received");
        console.log(notification);
      }
    );

    const responseSubscripion =
      Notification.addNotificationResponseReceivedListener((response) => {
        // console.log("notification response");
        // console.log(response.notification.request.content.data);
      });
    return () => {
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
        title: alarmName || "ALARM",
        body: "Tap here to deactivate alarm and solve challenge",
        data: {
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
    Database.add(
      hours,
      minutes,
      selectedSound,
      selectedChallenge,
      identifier,
      alarmName
    );
    setAlarmName("");
  };

  const scrollViewRef = useRef<ScrollView | null>(null);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    if (offsetY > 0) {
      return;
    }
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
            Enter Alarm Name
          </Text>
        </View>
        <TextInput
          style={styles.inputName}
          value={alarmName}
          onChangeText={(text) => setAlarmName(text)}
          placeholder="Type your alarm name here"
          placeholderTextColor="#757575"
        />
        <View style={styles.centeredContainer}>
          <Text style={[styles.label, { marginTop: 10 }]}>
            Select Time
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
    justifyContent: "center",
    padding: 20,
    paddingLeft: 30,
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
  input: {
    height: 40,
    borderColor: "#BDBDBD",
    borderWidth: 1,
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 15,
    width: "100%",
    borderRadius: 8,
    color: "#333",
    backgroundColor: "#F5F5F5",
  },
  pickerButtonText: {
    color: "white",
    fontSize: 18,
  },
  saveButton: {
    backgroundColor: "#1f2129",
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
  inputName: {
    marginTop: 10,
    height: 40,
    borderColor: "#BDBDBD",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: "90%",
    borderRadius: 5,
    color: "#333",
  },
});

export default HomePage;
