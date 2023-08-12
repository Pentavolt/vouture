import { Ionicons } from "@expo/vector-icons";
import { Toast, useToastState } from "@tamagui/toast";
import { OpaqueColorValue, useWindowDimensions } from "react-native";
import { ColorTokens } from "tamagui";
import { ThemeValueFallback, XStack, YStack } from "tamagui";

interface ToasterProps {
  iconName: keyof typeof Ionicons.glyphMap;
  backgroundColor?:
    | ThemeValueFallback
    | ColorTokens
    | OpaqueColorValue
    | undefined;
  color?: string | OpaqueColorValue | undefined;
}

export default function Toaster({
  backgroundColor = "white",
  color = "#2C2C2C",
  iconName,
}: ToasterProps) {
  const { width } = useWindowDimensions();
  const currentToast = useToastState();

  if (!currentToast) return null;
  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={0}
      width={width - 26}
      marginHorizontal="$3"
      opacity={1}
      scale={1}
      borderRadius={5}
      animation={"quick"}
      viewportName={currentToast.viewportName}
      backgroundColor={backgroundColor}
      shadowColor="#2C2C2C"
      shadowOffset={{
        width: 0,
        height: 1,
      }}
      shadowOpacity={0.22}
      shadowRadius={2.22}
      elevation={8}
      padding="$3"
    >
      <XStack alignItems="center" space="$3">
        <Ionicons size={20} color={color} name={iconName} />
        <YStack>
          <Toast.Title fontFamily={"$heading"} color={color}>
            {currentToast.title}
          </Toast.Title>
          {!!currentToast.message && (
            <Toast.Description color={color}>
              {currentToast.message}
            </Toast.Description>
          )}
        </YStack>
      </XStack>
    </Toast>
  );
}
