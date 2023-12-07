import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker as SelectPicker } from "@react-native-picker/picker";

const HomePage = () => {
  const [selectedSound, setSelectedSound] = useState("barkingCat");
  const [selectedChallenge, setSelectedChallenge] = useState("barcode");
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const soundPickerRef = useRef();
  const challengePickerRef = useRef();

  const handleTimeChange = (event, date) => {
    if (date !== undefined) {
      setShowTimePicker(Platform.OS === "ios"); // Hide picker immediately on iOS
      setSelectedTime(date);
    }
  };

  const handleSaveAlarm = () => {
    console.log("Alarm settings saved");
  };
  return (
    <View style={styles.container}>
      <View style={styles.centeredContainer}>
        <Text style={styles.label}>Select Challenge</Text>

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
            <SelectPicker.Item label="Default Sound" value="defaultSound" />
            <SelectPicker.Item label="Barking Cat" value="barkingCat" />
            <SelectPicker.Item
              label="Never Gonna Give You Up"
              value="neverGonnaGiveYouUp"
            />
            <SelectPicker.Item label="Buzzer" value="buzzer" />
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
            <SelectPicker.Item label="Riddle Challenge" value="riddle" />
            <SelectPicker.Item label="Barcode Scan" value="barcode" />
            <SelectPicker.Item label="Maths Challenge" value="maths" />
          </SelectPicker>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveAlarm}>
          <Text style={styles.saveButtonText}>Save Alarm</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HomePage;
