import { Ionicons } from "@expo/vector-icons";
import { Ref } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

interface HeartOverlayProps {
  innerRef: Ref<any>;
  scale: SharedValue<number>;
  onActivated: () => void;
}

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

export default function HeartOverlay({ scale }: HeartOverlayProps) {
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: Math.max(scale.value, 0) }],
  }));

  return (
    <Animated.View
      style={{
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
      }}
    >
      <AnimatedIcon name="heart" color={"#ef4444"} style={style} size={100} />
    </Animated.View>
  );
}
