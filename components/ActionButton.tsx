import { Ionicons } from "@expo/vector-icons";
import { Circle, Text, View } from "tamagui";

interface ActionButtonProps {
  text: string;
  onPress: () => void;
  iconName: keyof typeof Ionicons.glyphMap;
}

export default function ActionButton({
  iconName,
  onPress,
  text,
}: ActionButtonProps) {
  return (
    <View space="$2" width={"auto"} alignSelf="flex-start" alignItems="center">
      <Circle
        pressStyle={{ backgroundColor: "$gray2Light" }}
        backgroundColor={"$gray3Light"}
        justifyContent="center"
        alignItems="center"
        height={50}
        width={50}
        onPress={onPress}
      >
        <Ionicons name={iconName} size={22} />
      </Circle>
      <Text fontFamily={"$span"} color={"black"}>
        {text}
      </Text>
    </View>
  );
}
