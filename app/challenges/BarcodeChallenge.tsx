import { BarCodeScanner } from "expo-barcode-scanner";
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import Database from "../../database";
import { router } from "expo-router";
import MyContext from "../context/SoundContext";
import { Audio } from "expo-av";
const Buzzer = require("../../assets/audio/Buzzer.mp3");
const Barking_Cat = require("../../assets/audio/BarkingCat.mp3");
const Rick_Roll = require("../../assets/audio/RickRoll.mp3");
const Default = require("../../assets/audio/Default.mp3");

const BarcodeChallenge = () => {
  const [remainingTime, setRemainingTime] = useState(60);
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [scanned, setScanned] = useState(false);
  const [isClicked, setIsClicked] = useState(true);
  const [sound, setSound] = useState<any>();
  const { playingSound } = useContext(MyContext);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };
    playSound(playingSound);

    getBarCodeScannerPermissions();

    return () => {
      if (sound) {
        sound.stopAsync();
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (remainingTime > 0) {
        setRemainingTime(remainingTime - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  async function playSound(ring: any) {
    let ringtoneModule;

    switch (ring) {
      case "Buzzer":
        ringtoneModule = Buzzer;
        break;
      case "Barking Cat":
        ringtoneModule = Barking_Cat;
        break;
      case "Rick Roll":
        ringtoneModule = Rick_Roll;
        break;
      default:
        ringtoneModule = Default;
        break;
    }
    const { sound } = await Audio.Sound.createAsync(ringtoneModule, {
      shouldPlay: true,
      isLooping: true,
    });
    setSound(sound);
  }

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const handleBarCodeScanned = async ({
    type,
    data,
  }: {
    type: any;
    data: any;
  }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    console.log(type);
    console.log(data);
    Alert.alert("Barcode Scanned", "You have passed the challenge!");
    Database.updatePassed(1);
    Database.updateStreak();
    await sound.unloadAsync();
    router.back();
    // router.replace(`/screens/QuoteScreen`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  if (remainingTime === 0) {
    Alert.alert("Time has expired", "Please try again tomorrow.");
    Database.resetStreak();
    router.back();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.time}>
        Remaining Time: {formatTime(remainingTime)}
      </Text>
      {!isClicked && (
        <View style={styles.barcodeContainer}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={styles.scanner}
          />
        </View>
      )}
      <TouchableOpacity
        style={styles.checkA}
        onPress={() => {
          setScanned(false);
          setIsClicked(false);
        }}
      >
        <Text style={styles.button}>Scan Barcode</Text>
      </TouchableOpacity>
      {scanned && (
        <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 50,
    paddingBottom: 100,
  },
  barcodeContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 80,
  },
  time: {
    fontSize: 16,
    marginBottom: 20,
  },
  checkA: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  button: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  scanner: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    width: "100%",
    height: "50%",
    alignSelf: "center",
  },
});

export default BarcodeChallenge;
