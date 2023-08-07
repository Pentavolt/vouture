import { Ionicons } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
import { Button, Heading, Sheet, View, YStack } from "tamagui";
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

export default function LabelScreen({
  route,
  navigation,
}: CameraStackScreenProps<"Labeling">) {
  const { photo } = route.params;
  const { height, width } = useWindowDimensions();
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

  if (loading) return <Loading />;
  return (
    <>
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
        <FastImage style={{ flex: 1 }} source={{ uri: photo }} />
        <YStack space position={"absolute"} top={15} right={15}>
          <Button
            onPress={() =>
              navigation.navigate("Preview", { photo, tags: positions.current })
            }
            bg={"rgba(140, 140, 140, 0.3)"}
            icon={<Ionicons name="arrow-forward" />}
            borderRadius="$true"
            pressStyle={{
              bg: "darkgray",
            }}
          />
          <Button
            onPress={() => setOpen(true)}
            bg={"rgba(140, 140, 140, 0.3)"}
            icon={<Ionicons name="add-outline" />}
            borderRadius="$true"
            pressStyle={{
              bg: "darkgray",
            }}
          />
        </YStack>
        <Button
          onPress={() => navigation.goBack()}
          position="absolute"
          top={15}
          left={15}
          bg={"rgba(140, 140, 140, 0.3)"}
          icon={<Ionicons name="arrow-back" />}
          borderRadius="$true"
          pressStyle={{
            bg: "darkgray",
          }}
        />
      </View>
    </>
  );
}
