import { Ionicons } from "@expo/vector-icons";
import { Animated, PanResponder, useWindowDimensions } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Circle, View, XStack } from "tamagui";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Tag } from "../../generated/gql/graphql";
import { hasExceeded } from "../../lib/utils";

interface ClothingLabelProps {
  tag: Omit<Tag, "id" | "post" | "postId" | "createdAt">;
  onClose?: () => void;
  onMove?: ({ x, y }: { x: number; y: number }) => void;
}

// Note: If onClose is undefined, we assume that you are in view-only mode.
export default function ClothingLabel({
  tag,
  onClose,
  onMove,
}: ClothingLabelProps) {
  // TODO: Add restriction zone for placement.
  const [dimension, setDimension] = useState<{
    height: number;
    width: number;
  }>();

  const { height, width } = useWindowDimensions();
  const pan = useRef(new Animated.ValueXY({ x: tag.x, y: tag.y }));
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => pan.current.extractOffset(),
      onPanResponderRelease: () => pan.current.flattenOffset(),
      onPanResponderMove: Animated.event(
        [null, { dx: pan.current.x, dy: pan.current.y }],
        { useNativeDriver: false }
      ),
    })
  );

  useEffect(() => {
    if (onMove) pan.current.addListener(({ x, y }) => onMove({ x, y }));
    return () => pan.current.removeAllListeners();
  }, []);

  return (
    <Animated.View
      {...(onClose ? panResponder.current.panHandlers : null)}
      style={{
        height: 30,
        zIndex: 99,
        position: "absolute",
        ...(!onClose
          ? { top: tag.y, left: tag.x }
          : {
              transform: [
                {
                  translateX: Animated.diffClamp(
                    pan.current.x,
                    0,
                    width - (dimension?.width ?? 0)
                  ),
                },
                {
                  translateY: Animated.diffClamp(
                    pan.current.y,
                    100,
                    height - (dimension?.height ?? 0)
                  ),
                },
              ],
            }),
      }}
    >
      <XStack
        onLayout={(e) => {
          setDimension({
            height: e.nativeEvent.layout.height,
            width: e.nativeEvent.layout.width,
          });
        }}
      >
        <TouchableOpacity
          onPress={onClose}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Circle size={"$0.75"} backgroundColor={"$gray4Dark"} />
          <View height={2} width={20} backgroundColor={"$gray4Dark"} />
          <Button
            size={"$2"}
            backgroundColor={"$gray4Dark"}
            iconAfter={onClose ? <Ionicons name="close" /> : null}
            textProps={{
              numberOfLines: 2,
              ellipsizeMode: "tail",
            }}
          >
            {tag.brand.name}
          </Button>
        </TouchableOpacity>
      </XStack>
    </Animated.View>
  );
}

// Note: Reanimated only supports class components in createAnimatedComponent.
// See: https://github.com/software-mansion/react-native-reanimated/discussions/1527
export class AnimatableClothingLabel extends React.Component<ClothingLabelProps> {
  constructor(props: ClothingLabelProps) {
    super(props);
  }
  render() {
    return <ClothingLabel {...this.props} />;
  }
}
