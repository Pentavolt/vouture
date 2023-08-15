import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useAuth, useBottomSheetBack } from "../../lib/hooks";
import { CameraStackScreenProps } from "../../lib/navigation/types";
import {
  Button,
  Heading,
  Input,
  ListItem,
  Separator,
  Sheet,
  Spinner,
  Switch,
  TextArea,
  View,
  XStack,
  YGroup,
  YStack,
} from "tamagui";
import { CommonActions } from "@react-navigation/native";
import { useMutation, useQuery } from "@apollo/client";
import {
  CreatePostDocument,
  QueryMode,
  Topic,
  TopicsDocument,
  UploadDocument,
} from "../../generated/gql/graphql";
import { ReactNativeFile } from "apollo-upload-client";
import FastImage from "react-native-fast-image";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Keyboard, Pressable } from "react-native";
import { useDebouncedCallback } from "use-debounce";

export default function PreviewScreen({
  navigation,
  route,
}: CameraStackScreenProps<"Preview">) {
  const [post] = useMutation(CreatePostDocument);
  const [upload] = useMutation(UploadDocument);
  const [caption, setCaption] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [topicNames, setTopicNames] = useState<string[]>([]);
  const [checked, setChecked] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const { data, refetch } = useQuery(TopicsDocument);
  const { user } = useAuth();
  const { photo, tags } = route.params;

  useBottomSheetBack(open, () => setOpen(false));
  const debounce = useDebouncedCallback(
    (value: string) =>
      refetch({
        where: {
          name: { startsWith: value, mode: QueryMode["Insensitive"] },
        },
      }),
    1000
  );

  const onPress = async () => {
    if (!photo) return;
    setUploading(true);
    const file = new ReactNativeFile({
      name: "post.jpeg",
      uri: photo,
      type: "image/jpeg",
    });

    const urls = await upload({
      variables: { images: [file] },
      fetchPolicy: "network-only",
    });

    if (!urls.data) return console.error("No upload data?");
    post({
      variables: {
        data: {
          topics: {
            create: topicNames.map((topicName) => ({
              topic: {
                connectOrCreate: {
                  create: { name: topicName.toLowerCase() },
                  where: { name: topicName.toLowerCase() },
                },
              },
            })),
          },
          isCommentable: checked,
          content: caption.length ? caption : undefined,
          attachments: { create: urls.data.upload.map((url) => ({ url })) },
          user: { connect: { id: user?.id } },
          tags: {
            createMany: {
              data: tags.map((tag) => ({
                brandId: tag.brandId,
                x: tag.x,
                y: tag.y,
              })),
            },
          },
        },
      },
      onCompleted: () => {
        setCaption("");
        setUploading(false);
        navigation.dispatch(
          CommonActions.reset({ routes: [{ name: "Root" }] })
        );
      },
    });
  };

  const renderItem = ({ item }: ListRenderItemInfo<Topic>) => (
    <TouchableOpacity
      style={{ height: 50 }}
      onPress={() => {
        setTopicNames((curr) =>
          curr.length >= 10 ? curr : [item.name, ...curr]
        );
      }}
    >
      <Heading color={"black"}>{item.name}</Heading>
    </TouchableOpacity>
  );

  return (
    <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      <YStack
        flex={1}
        space="$9"
        paddingVertical="$5"
        justifyContent="space-between"
        paddingHorizontal="$3"
      >
        <YStack space>
          <XStack>
            <FastImage
              source={{ uri: photo }}
              resizeMode="cover"
              style={{
                aspectRatio: 9 / 16,
                width: 100,
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
              }}
            />
            <TextArea
              flexGrow={1}
              fontFamily={"$span"}
              borderRadius={0}
              borderTopRightRadius={5}
              borderBottomRightRadius={5}
              maxLength={200}
              minHeight={100}
              backgroundColor={"white"}
              textAlignVertical="top"
              color={"black"}
              borderColor={"white"}
              focusStyle={{ borderColor: "white" }}
              onChangeText={(text) => setCaption(text)}
              value={caption}
              placeholder="Add a caption..."
            />
          </XStack>
          <YGroup>
            <YGroup.Item>
              <ListItem
                themeInverse
                pressTheme
                fontSize={15}
                fontFamily={"$span"}
                icon={
                  <Ionicons size={18} color={"#5D5D5D"} name="file-tray-full" />
                }
                iconAfter={<Ionicons size={18} name="chevron-forward" />}
                onPress={() => setOpen(true)}
              >
                Tags
              </ListItem>
            </YGroup.Item>
            <YGroup.Item>
              <ListItem
                pressTheme
                themeInverse
                fontSize={15}
                fontFamily={"$span"}
                icon={<Ionicons size={18} color={"#5D5D5D"} name="location" />}
                iconAfter={<Ionicons size={18} name="chevron-forward" />}
              >
                Location
              </ListItem>
            </YGroup.Item>
          </YGroup>
          <YGroup>
            <YGroup.Item>
              <ListItem
                themeInverse
                title={"Allow comments"}
                icon={<Ionicons size={18} color={"#5D5D5D"} name="chatbox" />}
                subTitle={"Allow other users to comment on this post."}
                iconAfter={
                  <Switch
                    size={"$3"}
                    checked={checked}
                    backgroundColor={checked ? "#FE9F10" : "$gray6Dark"}
                    onCheckedChange={() => setChecked((curr) => !curr)}
                  >
                    <Switch.Thumb animation="bouncy" />
                  </Switch>
                }
              />
            </YGroup.Item>
          </YGroup>
        </YStack>
        <Button
          disabled={uploading}
          backgroundColor={"#FE9F10"}
          icon={uploading ? <Spinner /> : <Ionicons name="send" />}
          onPress={onPress}
        >
          Post
        </Button>
      </YStack>
      <Sheet
        modal
        open={open}
        dismissOnSnapToBottom
        dismissOnOverlayPress
        snapPoints={[90]}
        onOpenChange={() => {
          Keyboard.dismiss();
          setOpen(false);
        }}
      >
        <Sheet.Overlay />
        <Sheet.Handle backgroundColor={"white"} />
        <Sheet.Frame flex={1} backgroundColor={"white"}>
          <YStack space padding="$3" flex={1}>
            <Input
              onChangeText={debounce}
              backgroundColor={"$gray3Light"}
              borderColor={"$gray3Light"}
              focusStyle={{ borderColor: "$gray3Light" }}
              color={"black"}
            />
            <XStack space="$1" flexWrap="wrap">
              {topicNames.map((topicName, idx) => (
                <Button
                  marginBottom={"$1"}
                  key={idx}
                  size={"$2"}
                  onPress={() =>
                    setTopicNames((curr) =>
                      curr.filter((_, index) => index !== idx)
                    )
                  }
                  iconAfter={
                    <Ionicons size={10} name="close" color={"white"} />
                  }
                  color={"black"}
                  textProps={{
                    color: "white",
                    numberOfLines: 1,
                  }}
                >
                  {topicName}
                </Button>
              ))}
            </XStack>
            <Separator borderWidth={1.5} borderColor={"$gray3Light"} />
            <View flexGrow={1} minHeight={200}>
              <FlashList<Topic>
                data={data?.topics as Topic[]}
                estimatedItemSize={50}
                renderItem={renderItem}
                keyExtractor={(_, idx) => idx.toString()}
              />
            </View>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </Pressable>
  );
}
