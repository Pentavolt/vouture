import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { client } from "./apollo";
import { UpdateMeDocument } from "../generated/gql/graphql";

export const registerPushNotifications = async () => {
  if (!Device.isDevice) {
    return alert("Must use physical device for Push Notifications");
  }

  const { status: currentStatus } = await Notifications.getPermissionsAsync();
  if (currentStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
  }

  const token = await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas.projectId,
  });

  client
    .mutate({
      mutation: UpdateMeDocument,
      variables: { data: { notificationToken: { set: token.data } } },
    })
    .catch((e) => console.error(e));

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
};
