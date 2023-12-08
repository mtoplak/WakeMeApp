import { View, Text, Button } from "react-native";
import Database from "../../database";

const Settings = () => {
  const submit_alarm = () => {
    let time = [0, 0];
    let ampm = "am";
    Database.add(time[0] + (ampm == "pm" ? 12 : 0), time[1]);
    console.log("submitted alarm");
  };

  const read_db = () => {
    Database.getAll().then((all) => {
      let db_array = JSON.parse(all).rows._array;
      console.log(db_array);
      let output = db_array.map((el, i) => {
        console.log(el);
      });
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Settings to do</Text>
      <Button title="Submit Alarm" onPress={submit_alarm} />
      <Button title="get all" onPress={read_db} />
    </View>
  );
};

export default Settings;
