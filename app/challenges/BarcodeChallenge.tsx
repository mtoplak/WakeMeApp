import { BarCodeScanner } from "expo-barcode-scanner";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button } from "react-native";
import Database from "../../database";
import { router } from "expo-router";

const BarcodeChallenge = () => {
  const [remainingTime, setRemainingTime] = useState(60);
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (remainingTime > 0) {
        setRemainingTime(remainingTime - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const handleBarCodeScanned = ({ type, data }: { type: any; data: any }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    console.log(type);
    console.log(data);

    Database.updatePassed(1);
    router.back();
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.time}>
        Remaining Time: {formatTime(remainingTime)}
      </Text>
      <TouchableOpacity style={styles.checkA} onPress={() => setScanned(false)}>
        <Text style={styles.button}>Scan Barcode</Text>
      </TouchableOpacity>
      <View style={styles.barcodeContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.scanner}
        />
      </View>
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
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
  },
  barcodeContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 50,
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
