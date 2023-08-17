import { TouchableOpacity } from "react-native";
import { Avatar, Text, XStack, YStack } from "tamagui";
import { getTimeAgo } from "../lib/time";
import { Notification } from "../generated/gql/graphql";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { InboxStackParamList } from "../lib/navigation/types";

interface NotificationItemProps {
  index: number;
  notification: Notification;
}

export default function NotificationItem({
  index,
  notification,
}: NotificationItemProps) {
  const navigation = useNavigation<NavigationProp<InboxStackParamList>>();

  const renderNotificationString = (notification: Notification) => {
    if (notification.type.name === "Like") {
      return `${notification.notifier.username} has liked your post.`;
    }

    if (notification.type.name === "Comment") {
      return `${notification.notifier.username} has left a comment on your post.`;
    }

    if (notification.type.name === "Follow") {
      return `${notification.notifier.username} started following you.`;
    }
  };

  return (
    <TouchableOpacity
      onPress={() =>
        notification.postId
          ? navigation.navigate("Details", { postId: notification.postId })
          : null
      }
    >
      <XStack
        backgroundColor={"white"}
        flex={1}
        space="$3"
        paddingHorizontal="$3"
        paddingVertical="$2.5"
        alignItems="center"
        {...(index === 0
          ? { borderTopLeftRadius: 5, borderTopRightRadius: 5 }
          : {})}
      >
        <Avatar circular>
          <Avatar.Image source={{ uri: notification.notifier.image }} />
          <Avatar.Fallback />
        </Avatar>
        <YStack>
          <Text fontFamily={"$span"} color={"black"}>
            {renderNotificationString(notification)}
          </Text>
          <Text fontFamily={"$body"} color={"$gray7Dark"}>
            {getTimeAgo(notification.createdAt)}
          </Text>
        </YStack>
      </XStack>
    </TouchableOpacity>
  );
}
