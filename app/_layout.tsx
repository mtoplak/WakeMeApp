import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";

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

const StackLayout = () => {
  useNotificationObserver();

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
          }}
        />
        <Stack.Screen
          name="challenges/BarcodeChallenge"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
};

export default StackLayout;
