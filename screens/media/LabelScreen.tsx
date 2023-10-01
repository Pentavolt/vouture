import "react-native-get-random-values";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  ListRenderItemInfo,
  ViewToken,
  ViewabilityConfig,
  useWindowDimensions,
} from "react-native";
import { Button, View, XStack, YStack } from "tamagui";
import { CameraStackScreenProps } from "../../lib/navigation/types";
import { useCallback, useRef, useState } from "react";
import { Brand } from "../../generated/gql/graphql";
import FastImage from "react-native-fast-image";
import ClothingLabel from "../../components/post/ClothingLabel";
import { useBottomSheetBack } from "../../lib/hooks";
import { useToastController } from "@tamagui/toast";
import Toaster from "../../components/Toaster";
import { nanoid } from "nanoid";
import BrandSheet from "../../components/BrandSheet";
import { SafeAreaView } from "react-native-safe-area-context";

interface Label {
  id: string;
  brand: Brand;
  brandId: number;
  relX: number;
  relY: number;
}

export default function LabelScreen({
  route,
  navigation,
}: CameraStackScreenProps<"Labeling">) {
  const activeIndex = useRef<number>(0);
  const toast = useToastController();
  const { photos } = route.params;
  const { height, width } = useWindowDimensions();
  const positions = useRef<Array<Label[]>>(new Array(photos.length).fill([]));
  const [permission, requestPermission] = MediaLibrary.usePermissions();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [tags, setTags] = useState<Array<Label[]>>(
    new Array(photos.length).fill([])
  );

  useBottomSheetBack(open, () => setOpen(false));

  const viewabilityConfig: ViewabilityConfig = {
    itemVisiblePercentThreshold: 100,
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (!viewableItems.length) return;
      if (viewableItems[0].index === null) return;
      activeIndex.current = viewableItems[0].index;
    },
    []
  );

  const onSelect = (brand: Brand) => {
    setOpen(false);
    const id = nanoid(8);
    setTags((curr) =>
      curr.map((tag, idx) =>
        idx === activeIndex.current
          ? [
              ...curr[activeIndex.current],
              {
                id,
                brand,
                brandId: brand.id,
                relX: 0,
                relY: 0,
              },
            ]
          : tag
      )
    );

    positions.current[activeIndex.current] = [
      ...positions.current[activeIndex.current],
      {
        id,
        brand,
        brandId: brand.id,
        relX: 0,
        relY: 0,
      },
    ];
  };

  const renderItem = ({
    item,
  }: ListRenderItemInfo<(typeof route.params.photos)[0]>) => (
    <View width={width} backgroundColor={"black"} alignItems="center">
      <FastImage
        source={{ uri: item.uri }}
        style={{
          aspectRatio: item.height / item.width,
          height: 600,
          maxWidth: "100%",
        }}
        resizeMode="contain"
      />
    </View>
  );

  const saveMedia = async () => {
    if (!permission) await requestPermission();
    if (!permission?.granted) {
      return toast?.show("Unable to save", {
        native: false,
        message:
          "To save images, please grant access to the media library in system settings.",
      });
    }

    if (!photos[activeIndex.current]) return;
    await MediaLibrary.saveToLibraryAsync(photos[activeIndex.current].uri);
    return toast?.show("Photo saved", {
      message: "Your image has successfully been saved.",
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <View flex={1} backgroundColor={"black"}>
        <Toaster backgroundColor={"$green4Light"} iconName="download-outline" />
        <FlatList
          data={photos}
          renderItem={renderItem}
          contentContainerStyle={{ alignItems: "center" }}
          keyExtractor={(_, idx) => idx.toString()}
          onMomentumScrollBegin={() =>
            photos.length > 1 ? setIsLoading(true) : null
          }
          onMomentumScrollEnd={() =>
            photos.length > 1 ? setIsLoading(false) : null
          }
          horizontal={true}
          bounces={false}
          decelerationRate={0.99}
          snapToAlignment="start"
          snapToInterval={width}
          pagingEnabled
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          showsHorizontalScrollIndicator={false}
        />
        {!isLoading &&
          tags[activeIndex.current]?.map((tag, idx) => {
            const actualPosition = positions.current[activeIndex.current].find(
              (position) => position.id == tag.id
            );

            const aspectRatio =
              photos[activeIndex.current].height /
              photos[activeIndex.current].width;
            const actualHeight = aspectRatio * width;
            return (
              <ClothingLabel
                key={idx}
                photoHeight={actualHeight > 600 ? 600 : actualHeight}
                photoWidth={width}
                windowHeight={height}
                tag={{
                  ...tag,
                  x: actualPosition?.relX ?? 0,
                  y: actualPosition?.relY ?? 0,
                }}
                onMove={({ relX, relY }) => {
                  const updatedPositions = positions.current[
                    activeIndex.current
                  ].filter((position) => position.id !== tag.id);

                  positions.current[activeIndex.current] = [
                    ...updatedPositions,
                    { ...tag, relX, relY },
                  ];
                }}
                onClose={() => {
                  positions.current[activeIndex.current] = positions.current[
                    activeIndex.current
                  ].filter(
                    (position) =>
                      position.relX !== tag.relX && position.relY !== tag.relY
                  );

                  setTags((curr) =>
                    curr.map((item, idx) =>
                      idx === activeIndex.current
                        ? item.filter((data) => data.id !== tag.id)
                        : item
                    )
                  );
                }}
              />
            );
          })}
        <XStack
          position={"absolute"}
          top={15}
          right={15}
          left={15}
          justifyContent="space-between"
        >
          <Button
            onPress={() => navigation.goBack()}
            bg={"rgba(140, 140, 140, 0.3)"}
            icon={<Ionicons size={20} name="arrow-back-outline" />}
            borderRadius="$true"
            pressStyle={{
              bg: "darkgray",
            }}
          />
          <YStack space>
            <Button
              onPress={() =>
                navigation.navigate("Preview", {
                  photos,
                  tags: positions.current,
                })
              }
              bg={"rgba(140, 140, 140, 0.3)"}
              icon={<Ionicons size={20} name="arrow-forward-outline" />}
              borderRadius="$true"
              pressStyle={{
                bg: "darkgray",
              }}
            />
            <Button
              onPress={() => setOpen(true)}
              bg={"rgba(140, 140, 140, 0.3)"}
              icon={<Ionicons size={20} name="pricetag-outline" />}
              borderRadius="$true"
              pressStyle={{
                bg: "darkgray",
              }}
            />
          </YStack>
        </XStack>
        <View position="absolute" right={15} bottom={15}>
          <Button
            onPress={saveMedia}
            bg={"rgba(140, 140, 140, 0.3)"}
            icon={<Ionicons size={20} name="download-outline" />}
            borderRadius="$true"
            pressStyle={{
              bg: "darkgray",
            }}
          />
        </View>
        <BrandSheet
          open={open}
          onOpenChange={() => setOpen(false)}
          onSelect={onSelect}
        />
      </View>
    </SafeAreaView>
  );
}
