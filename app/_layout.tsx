import { Stack, router } from "expo-router";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import Database from "./database";

function useNotificationObserver() {
  useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      console.log(notification.request.content.data);
      const url = notification.request.content.data?.url;
      if (url) {
        router.push(url);
      }
    }

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        return;
      }
      redirect(response?.notification);
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        redirect(response.notification);
      }
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}

function useAlarmChecker() {
  useEffect(() => {
    const intervalId = setInterval(() => {
      checkAlarms();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  async function checkAlarms() {
    try {
      let alarms: any = await Database.getAllActive();
      alarms = JSON.parse(alarms).rows._array;
      const currentDateTime = new Date();
      const currentHours = currentDateTime.getHours();
      const currentMinutes = currentDateTime.getMinutes();

      alarms.forEach((alarm: any) => {
        const { hours, minutes } = alarm;
        if (
          parseInt(hours) === currentHours &&
          parseInt(minutes) === currentMinutes
        ) {
          router.push("screens/AlarmScreen");
        }
      });
    } catch (error) {
      console.error("Error checking alarms:", error);
    }
  }
}

const StackLayout = () => {
  useNotificationObserver();
  useAlarmChecker();

  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screens/AlarmScreen"
          options={{
            headerShown: false,
            headerLeft: () => undefined,
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="challenges/BarcodeChallenge"
          options={{
            headerShown: false,
            headerLeft: () => undefined,
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="challenges/RiddleChallenge"
          options={{
            headerShown: false,
            headerLeft: () => undefined,
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="challenges/MathChallenge"
          options={{
            headerShown: false,
            headerLeft: () => undefined,
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="screens/QuoteScreen"
          options={{
            headerShown: false,
            headerLeft: () => undefined,
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
      </Stack>
    </>
  );
};

export default StackLayout;
