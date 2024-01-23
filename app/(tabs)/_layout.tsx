import { Tabs } from "expo-router";
import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";

export default () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#1f2129",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          headerTitle: "Create Alarm",
          tabBarActiveTintColor: "white",
          tabBarIcon: ({}) => <Entypo name="home" size={24} color="#faf7f9" />,
        }}
      />
      <Tabs.Screen
        name="alarms"
        options={{
          tabBarLabel: "My Alarms",
          headerTitle: "My Alarms",
          tabBarActiveTintColor: "white",
          tabBarIcon: ({}) => <Ionicons name="alarm" size={24} color="white" />,
        }}
      />
      <Tabs.Screen
        name="streak"
        options={{
          tabBarLabel: "My Streak",
          headerTitle: "My Streak Journey",
          tabBarActiveTintColor: "white",
          tabBarIcon: ({}) => (
            <FontAwesome5 name="fire" size={24} color="white" />
          ),
        }}
      />
    </Tabs>
  );
};
