import { Tabs } from "expo-router";
import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";

export default () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          headerTitle: "Create Alarm",
          tabBarActiveTintColor: "black",
          tabBarIcon: ({}) => <Entypo name="home" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="alarms"
        options={{
          tabBarLabel: "My Alarms",
          headerTitle: "My Alarms",
          tabBarActiveTintColor: "black",
          tabBarIcon: ({}) => <Ionicons name="alarm" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="streak"
        options={{
          tabBarLabel: "My Streak",
          headerTitle: "My Streak",
          tabBarActiveTintColor: "black",
          tabBarIcon: ({}) => (
            <FontAwesome5 name="fire" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "Settings",
          headerTitle: "Settings",
          tabBarActiveTintColor: "black",
          tabBarIcon: ({}) => (
            <Ionicons name="settings-sharp" size={24} color="black" />
          ),
        }}
      />
    </Tabs>
  );
};
