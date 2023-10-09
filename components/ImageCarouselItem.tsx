import FastImage from "react-native-fast-image";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { AnimatableClothingLabel } from "./post/ClothingLabel";
import { StyleSheet, useWindowDimensions } from "react-native";
import { Tag } from "../generated/gql/graphql";
import { View } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CarouselItemProps {
  fade: SharedValue<number>;
  attachment: {
    id: number;
    tags: Tag[];
    url: string;
    height: number;
    width: number;
  };
}

const AnimatedClothingLabel = Animated.createAnimatedComponent(
  AnimatableClothingLabel
);

export default function ImageCarouselItem({
  attachment,
  fade,
}: CarouselItemProps) {
  const { height, width } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const style = useAnimatedStyle(() => ({
    opacity: fade.value,
  }));

  return (
    <View flex={1} width={width}>
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          flex: 1,
          zIndex: 1,
        }}
      >
        {attachment.tags.map((tag, idx) => {
          const aspectRatio = attachment.height / attachment.width;
          const actualHeight = aspectRatio * width;
          return (
            <AnimatedClothingLabel
              key={idx}
              photoWidth={width}
              photoHeight={actualHeight}
              windowHeight={height - 60}
              tag={tag}
              style={style}
            />
          );
        })}
      </Animated.View>
      <FastImage
        resizeMode="contain"
        source={{ uri: attachment.url }}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </View>
  );
}
