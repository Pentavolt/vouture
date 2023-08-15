import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
import { Button, Heading, Sheet, View, XStack, YStack } from "tamagui";
import { CameraStackScreenProps } from "../../lib/navigation/types";
import { useRef, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  Brand,
  BrandsDocument,
  SortOrder,
  Tag,
} from "../../generated/gql/graphql";
import { useQuery } from "@apollo/client";
import FastImage from "react-native-fast-image";
import ClothingLabel from "../../components/post/ClothingLabel";
import { useBottomSheetBack } from "../../lib/hooks";
import Loading from "../../components/Loading";
import { useToastController } from "@tamagui/toast";
import Toaster from "../../components/Toaster";

export default function LabelScreen({
  route,
  navigation,
}: CameraStackScreenProps<"Labeling">) {
  const toast = useToastController();
  const { photo } = route.params;
  const { height, width } = useWindowDimensions();
  const [permission, requestPermission] = MediaLibrary.usePermissions();
  const { data, loading } = useQuery(BrandsDocument, {
    variables: { orderBy: { name: SortOrder["Asc"] } },
  });

  const positions = useRef<Omit<Tag, "id" | "post" | "postId" | "createdAt">[]>(
    []
  );

  const [open, setOpen] = useState<boolean>(false);
  const [tags, setTags] = useState<
    Omit<Tag, "id" | "post" | "postId" | "createdAt">[]
  >([]);

  useBottomSheetBack(open, () => setOpen(false));
  const onSelect = (brand: Brand) => {
    setOpen(false);
    const x = Math.random() * width * 0.5;
    const y = Math.random() * height * 0.5;
    setTags((curr) => [
      ...curr,
      {
        brand,
        brandId: brand.id,
        x,
        y,
      },
    ]);
  };

  const renderItem = ({ item }: { item: Brand }) => (
    <TouchableOpacity style={{ height: 50 }} onPress={() => onSelect(item)}>
      <Heading color={"black"}>{item.name}</Heading>
    </TouchableOpacity>
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

    if (!photo) return;
    await MediaLibrary.saveToLibraryAsync(photo);
    return toast?.show("Photo saved", {
      message: "Your image has successfully been saved.",
    });
  };

  if (loading) return <Loading />;
  return (
    <>
      <Toaster backgroundColor={"$green4Light"} iconName="download-outline" />
      <Sheet
        open={open}
        onOpenChange={setOpen}
        snapPoints={[85]}
        dismissOnSnapToBottom
        forceRemoveScrollEnabled={open}
      >
        <Sheet.Overlay />
        <Sheet.Handle backgroundColor={"white"} />
        <Sheet.Frame backgroundColor={"white"}>
          <FlashList<Brand>
            contentContainerStyle={{ padding: 15 }}
            data={data?.brands as Brand[]}
            estimatedItemSize={50}
            renderItem={renderItem}
            keyExtractor={(_, idx) => idx.toString()}
          />
        </Sheet.Frame>
      </Sheet>
      <View flex={1}>
        {tags.map((tag, idx) => (
          <ClothingLabel
            key={idx}
            tag={tag}
            onMove={({ x, y }) => {
              positions.current = [
                { ...tag, x, y },
                ...positions.current.filter(
                  (position) => position.x !== x && position.y !== y
                ),
              ];
            }}
            onClose={() => {
              positions.current = positions.current.filter(
                (position) => position.x !== tag.x && position.y !== tag.y
              );

              setTags((curr) =>
                curr.filter((item) => item.x !== tag.x && item.y !== tag.y)
              );
            }}
          />
        ))}
        <FastImage
          style={{ flex: 1, backgroundColor: "black" }}
          resizeMode="contain"
          source={{ uri: photo }}
        />
        <XStack
          position={"absolute"}
          top={15}
          right={15}
          left={15}
          bottom={15}
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
          <YStack space justifyContent="space-between">
            <YStack space>
              <Button
                onPress={() =>
                  navigation.navigate("Preview", {
                    photo,
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
            <Button
              onPress={saveMedia}
              bg={"rgba(140, 140, 140, 0.3)"}
              icon={<Ionicons size={20} name="download-outline" />}
              borderRadius="$true"
              pressStyle={{
                bg: "darkgray",
              }}
            />
          </YStack>
        </XStack>
      </View>
    </>
  );
}
