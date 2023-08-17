import { useFonts } from "expo-font";
import { TamaguiProvider } from "tamagui";
import config from "./tamagui.config";
import { NavigationProvider } from "./lib/navigation";
import { AuthProvider } from "./lib/hooks";
import { Suspense, useEffect, useRef } from "react";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import { ApolloProvider } from "@apollo/client";
import { client } from "./lib/apollo";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import { registerPushNotifications } from "./lib/notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const [loaded] = useFonts({
    Satoshi: require("./lib/fonts/satoshi/Satoshi-Regular.otf"),
    "Satoshi Bold": require("./lib/fonts/satoshi/Satoshi-Bold.otf"),
    "Satoshi Medium": require("./lib/fonts/satoshi/Satoshi-Medium.otf"),
  });

  useEffect(() => {
    registerPushNotifications();
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) =>
        console.log(notification)
      );

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(responseListener.current!);
      Notifications.removeNotificationSubscription(
        notificationListener.current!
      );
    };
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ApolloProvider client={client}>
        <TamaguiProvider config={config}>
          <AuthProvider>
            <Suspense>
              <ToastProvider>
                <NavigationProvider colorScheme={"light"} />
                <ToastViewport />
              </ToastProvider>
            </Suspense>
          </AuthProvider>
        </TamaguiProvider>
      </ApolloProvider>
    </GestureHandlerRootView>
  );
}
