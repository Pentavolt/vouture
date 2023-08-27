import { Ionicons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import { OpaqueColorValue } from "react-native";

interface BackButtonProps {
  navigation: NavigationProp<any>;
  color?: string | OpaqueColorValue;
}

export default function BackButton({
  color = "white",
  navigation,
}: BackButtonProps) {
  return (
    <Ionicons
      size={26}
      style={{ marginHorizontal: 12 }}
      name="chevron-back"
      color={color}
      onPress={() => navigation.goBack()}
    />
  );
}
