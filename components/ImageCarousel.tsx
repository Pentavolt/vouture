import ImageCarouselItem from "./ImageCarouselItem";
import { Attachment } from "../generated/gql/graphql";
import { View } from "tamagui";
import { ListRenderItemInfo, useWindowDimensions } from "react-native";
import { Ref } from "react";
import { FlatList, TapGestureHandler } from "react-native-gesture-handler";
import { useSharedValue, withTiming } from "react-native-reanimated";

interface ImageCarouselProps {
  attachments: Attachment[];
  innerRef: Ref<any>;
}

export default function ImageCarousel({
  attachments,
  innerRef,
}: ImageCarouselProps) {
  const { width } = useWindowDimensions();
  const fade = useSharedValue(1);

  const onSingleTap = () => {
    if (fade.value) fade.value = withTiming(0, { duration: 300 });
    else fade.value = withTiming(1, { duration: 300 });
  };

  const renderItem = ({ item }: ListRenderItemInfo<Attachment>) => (
    <ImageCarouselItem fade={fade} attachment={item} />
  );

  return (
    <TapGestureHandler
      waitFor={innerRef}
      numberOfTaps={1}
      onActivated={onSingleTap}
    >
      <View flex={1}>
        <FlatList<Attachment>
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          snapToAlignment="end"
          snapToInterval={width}
          keyExtractor={(_, idx) => idx.toString()}
          data={attachments}
          renderItem={renderItem}
          decelerationRate={"fast"}
        />
      </View>
    </TapGestureHandler>
  );
}
