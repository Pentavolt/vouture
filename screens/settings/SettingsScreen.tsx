import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../lib/hooks";
import { ListItem, YGroup, YStack } from "tamagui";
import { PreferencesStackScreenProps } from "../../lib/navigation/types";

export default function SettingsScreen({
  navigation,
}: PreferencesStackScreenProps<"Settings">) {
  const { logout } = useAuth();
  return (
    <YStack padding={"$3"} space>
      <YGroup alignSelf="center" bordered size="$4">
        <YGroup.Item>
          <ListItem
            hoverTheme
            pressTheme
            icon={<Ionicons name="person" />}
            fontSize={15}
            onPress={() => navigation.navigate("ProfileSettings")}
          >
            Profile
          </ListItem>
        </YGroup.Item>
        <YGroup.Item>
          <ListItem
            hoverTheme
            pressTheme
            fontSize={15}
            icon={<Ionicons name="lock-closed" />}
            onPress={() => navigation.navigate("Privacy")}
          >
            Privacy
          </ListItem>
        </YGroup.Item>
        <YGroup.Item>
          <ListItem
            hoverTheme
            pressTheme
            fontSize={15}
            icon={<Ionicons name="time" />}
          >
            History
          </ListItem>
        </YGroup.Item>
        <YGroup.Item>
          <ListItem
            hoverTheme
            pressTheme
            icon={<Ionicons name="log-out" />}
            fontSize={15}
            onPress={logout}
          >
            Logout
          </ListItem>
        </YGroup.Item>
      </YGroup>
    </YStack>
  );
}
