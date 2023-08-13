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
      <YGroup alignSelf="center" size="$4">
        <YGroup.Item>
          <ListItem
            themeInverse
            pressTheme
            icon={<Ionicons color={"#5D5D5D"} name="person" size={18} />}
            iconAfter={<Ionicons size={18} name="chevron-forward" />}
            fontSize={16}
            fontFamily={"$span"}
            onPress={() => navigation.navigate("ProfileSettings")}
          >
            Profile
          </ListItem>
        </YGroup.Item>
        <YGroup.Item>
          <ListItem
            themeInverse
            pressTheme
            fontSize={16}
            fontFamily={"$span"}
            icon={<Ionicons color={"#5D5D5D"} name="lock-closed" size={18} />}
            onPress={() => navigation.navigate("Privacy")}
            iconAfter={<Ionicons size={18} name="chevron-forward" />}
          >
            Privacy
          </ListItem>
        </YGroup.Item>
        <YGroup.Item>
          <ListItem
            themeInverse
            pressTheme
            fontSize={16}
            fontFamily={"$span"}
            icon={<Ionicons color={"#5D5D5D"} name="time" size={18} />}
            iconAfter={<Ionicons size={18} name="chevron-forward" />}
          >
            History
          </ListItem>
        </YGroup.Item>
        <YGroup.Item>
          <ListItem
            themeInverse
            pressTheme
            icon={<Ionicons color={"#5D5D5D"} name="log-out" size={18} />}
            iconAfter={<Ionicons size={18} name="chevron-forward" />}
            fontSize={16}
            fontFamily={"$span"}
            onPress={logout}
          >
            Logout
          </ListItem>
        </YGroup.Item>
      </YGroup>
    </YStack>
  );
}
