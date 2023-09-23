import { Ionicons } from "@expo/vector-icons";
import { Animated, PanResponder, useWindowDimensions } from "react-native";
import { Component, useEffect, useMemo, useRef, useState } from "react";
import { Button, Circle, View, XStack } from "tamagui";
import { Tag } from "../../generated/gql/graphql";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ClothingLabelProps {
  tag: Omit<Tag, "id" | "attachment" | "attachmentId" | "createdAt">;
  photoHeight: number;
  photoWidth: number;
  windowHeight: number;
  onClose?: () => void;
  onMove?: ({ relX, relY }: { relX: number; relY: number }) => void;
}

// Note: If onClose is undefined, we assume that you are in view-only mode.
export default function ClothingLabel({
  tag,
  photoHeight,
  photoWidth,
  windowHeight,
  onClose,
  onMove,
}: ClothingLabelProps) {
  const [dimension, setDimension] = useState<{
    height: number;
    width: number;
  }>();

  const { width } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const space = windowHeight - top - bottom - photoHeight;
  const minY = space / 2;
  const maxY = minY + photoHeight - (dimension?.height ?? 0);
  const pan = useRef(
    new Animated.ValueXY({
      x: tag.x * photoWidth,
      y: tag.y * (maxY - minY) + minY,
    })
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => !!onClose,
        onPanResponderGrant: () => pan.current.extractOffset(),
        onPanResponderRelease: () => pan.current.flattenOffset(),
        onPanResponderMove: (event, gestureState) => {
          // TODO: The actual width of the boundary should be width - (dimension?.width ?? 0).
          if (
            gestureState.moveX > width ||
            gestureState.moveX < 0 ||
            gestureState.moveY > maxY ||
            gestureState.moveY < minY
          ) {
            if (gestureState.moveX < 0) pan.current.x.setValue(0);
            if (gestureState.moveX > width) {
              pan.current.x.setOffset(width);
            }

            if (gestureState.moveY > maxY) pan.current.y.setValue(maxY);
            if (gestureState.moveY < minY) pan.current.y.setValue(minY);
            if (gestureState.moveX < 0 || gestureState.moveX > width) {
              pan.current.x.setOffset(0);
            }
          } else {
            return Animated.event(
              [null, { dx: pan.current.x, dy: pan.current.y }],
              { useNativeDriver: false }
            )(event, gestureState);
          }
        },
      }),
    [dimension]
  );

  useEffect(() => {
    if (onMove) {
      pan.current.addListener(({ x, y }) => {
        if (x > width || x < 0 || y > maxY || y < minY) return;
        onMove({ relX: x / width, relY: (y - minY) / (maxY - minY) });
      });
    }

    return () => pan.current.removeAllListeners();
  }, []);

  return (
    <Animated.View
      {...(onClose ? panResponder.panHandlers : null)}
      style={{
        zIndex: 99,
        position: "absolute",
        ...(!onClose
          ? { top: tag.y * (maxY - minY) + minY, left: tag.x * width }
          : {
              transform: [
                {
                  translateX: pan.current.x.interpolate({
                    inputRange: [0, width - (dimension?.width ?? 0)],
                    outputRange: [0, width - (dimension?.width ?? 0)],
                    extrapolate: "clamp",
                  }),
                },
                {
                  translateY: pan.current.y.interpolate({
                    inputRange: [minY, maxY],
                    outputRange: [minY, maxY],
                    extrapolate: "clamp",
                  }),
                },
              ],
            }),
      }}
    >
      <XStack
        alignItems="center"
        onPress={onClose}
        onLayout={(e) => {
          setDimension({
            height: e.nativeEvent.layout.height,
            width: e.nativeEvent.layout.width,
          });
        }}
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
      </XStack>
    </Animated.View>
  );
}

// Note: Reanimated only supports class components in createAnimatedComponent.
// See: https://github.com/software-mansion/react-native-reanimated/discussions/1527
export class AnimatableClothingLabel extends Component<ClothingLabelProps> {
  constructor(props: ClothingLabelProps) {
    super(props);
  }
  render() {
    return <ClothingLabel {...this.props} />;
  }
}
