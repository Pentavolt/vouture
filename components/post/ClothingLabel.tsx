import { Ionicons } from "@expo/vector-icons";
import { Animated, PanResponder, useWindowDimensions } from "react-native";
import { Component, useEffect, useMemo, useRef, useState } from "react";
import { Button, Circle, View, XStack } from "tamagui";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Tag } from "../../generated/gql/graphql";

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
  const minY = (windowHeight - photoHeight) / 2;
  const maxY = photoHeight + (windowHeight - photoHeight) / 2;
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
              pan.current.x.setValue(width);
            }

            console.log(gestureState.moveY < minY);
            if (gestureState.moveY > maxY) pan.current.y.setValue(maxY);
            if (gestureState.moveY < minY) pan.current.y.setValue(minY);
            if (gestureState.moveX < 0 || gestureState.moveX > width) {
              pan.current.x.setOffset(0);
            }

            if (gestureState.moveY < minY || gestureState.moveY > maxY) {
              pan.current.y.setOffset(0);
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
        if (x > width || x < 0 || y > maxY! || y < minY!) return;
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
                    inputRange: [minY, maxY - (dimension?.height ?? 0)],
                    outputRange: [minY, maxY - (dimension?.height ?? 0)],
                    extrapolate: "clamp",
                  }),
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
export class AnimatableClothingLabel extends Component<ClothingLabelProps> {
  constructor(props: ClothingLabelProps) {
    super(props);
  }
  render() {
    return <ClothingLabel {...this.props} />;
  }
}
