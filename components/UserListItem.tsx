import { ReactNode } from "react";
import { Avatar, ListItem, Paragraph, Text, XStack, YStack } from "tamagui";

interface UserListItemProps {
  user: { image: string; username: string };
  subtitle: string;
  onPress: () => void;
  children?: ReactNode;
  pressTheme?: boolean;
}

export default function UserListItem({
  children,
  onPress,
  subtitle,
  user,
  pressTheme = false,
}: UserListItemProps) {
  return (
    <ListItem
      pressTheme={pressTheme}
      borderRadius={"$3"}
      flex={1}
      backgroundColor={"$background"}
      onPress={onPress}
    >
      <XStack alignItems="center" space>
        <Avatar circular size={"$3"}>
          <Avatar.Image source={{ uri: user.image }} />
          <Avatar.Fallback backgroundColor={"red"} />
        </Avatar>
        <YStack flexGrow={1}>
          <Text>{user.username}</Text>
          <Paragraph color={"$gray7Light"}>{subtitle}</Paragraph>
        </YStack>
        {children}
      </XStack>
    </ListItem>
  );
}
