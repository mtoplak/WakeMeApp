import { Tabs } from "expo-router";
import { Image } from "react-native";

export default () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          headerTitle: "Create Alarm",
          // tabBarIcon: ({}) => <Image source={require("./alarm.png")} />, spremeni v svg
        }}
      />
      <Tabs.Screen
        name="alarms"
        options={{
          tabBarLabel: "My Alarms",
          headerTitle: "My Alarms",
          // tabBarIcon: ({}) => <Image source={require("./alarm.png")} />, spremeni v svg
        }}
      />
      <Tabs.Screen
        name="streak"
        options={{
          tabBarLabel: "My Streak",
          headerTitle: "My Streak",
          // tabBarIcon: ({}) => <Image source={require("./streak.png")} />, spremeni v svg
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "Settings",
          headerTitle: "Settings",
          // tabBarIcon: ({}) => <Image source={require("./settings.png")} />, spremeni v svg
        }}
      />
    </Tabs>
  );
};
