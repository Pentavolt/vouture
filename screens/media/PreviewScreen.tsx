import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { useAuth } from "../../lib/hooks";
import { CameraStackScreenProps } from "../../lib/navigation/types";
import {
  Button,
  ListItem,
  Separator,
  Spinner,
  Text,
  TextArea,
  View,
  XStack,
  YGroup,
  YStack,
} from "tamagui";
import { CommonActions } from "@react-navigation/native";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  CreatePostDocument,
  Topic,
  TopicsDocument,
  UploadDocument,
} from "../../generated/gql/graphql";
import { ReactNativeFile } from "apollo-upload-client";
import FastImage from "react-native-fast-image";
import KeyboardAwareScrollView from "../../components/post/KeyboardAwareScrollView";
import TopicInput from "../../components/post/TopicInput";
import { FlashList } from "@shopify/flash-list";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function PreviewScreen({
  navigation,
  route,
}: CameraStackScreenProps<"Preview">) {
  const [post] = useMutation(CreatePostDocument);
  const [upload] = useMutation(UploadDocument);
  const [fetch, { data }] = useLazyQuery(TopicsDocument);
  const [caption, setCaption] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [topicNames, setTopicNames] = useState<string[]>([]);
  const { user } = useAuth();
  const { photo, tags } = route.params;

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

  // const renderItem = useCallback(
  //   ({ item }: { item: Topic }) => (
  //     <TouchableOpacity
  //       style={{
  //         paddingHorizontal: 10,
  //         backgroundColor: "red",
  //         height: 40,
  //         justifyContent: "center",
  //       }}
  //       onPress={() => setTopicNames((curr) => [...curr, item.name])}
  //     >
  //       <Text color={"black"}>#{item.name}</Text>
  //     </TouchableOpacity>
  //   ),
  //   []
  // );

  // TODO: Implement autocomplete

  return (
    <KeyboardAwareScrollView>
      <YStack space padding="$5">
        <FastImage
          source={{ uri: photo }}
          resizeMode="cover"
          style={{
            height: 300,
            width: "100%",
            alignSelf: "center",
            borderRadius: 10,
          }}
        />
        <TextArea
          maxLength={200}
          minHeight={100}
          backgroundColor={"$gray12"}
          textAlignVertical="top"
          color={"black"}
          borderColor={"$gray12"}
          focusStyle={{ borderColor: "$gray12" }}
          onChangeText={(text) => setCaption(text)}
          value={caption}
          placeholder="Write a caption..."
        />
        <XStack
          space="$1"
          paddingVertical="$2"
          paddingHorizontal="$3"
          borderRadius={10}
          flexWrap="wrap"
          backgroundColor={"$gray12"}
          borderColor={"$gray12"}
          alignItems="center"
          borderWidth={1}
        >
          {topicNames.map((topicName, idx) => (
            <Button
              marginBottom={"$2"}
              key={idx}
              size={"$2"}
              onPress={() =>
                setTopicNames((curr) =>
                  curr.filter((_, index) => index !== idx)
                )
              }
              icon={<Ionicons name="close" color={"white"} />}
              color={"black"}
              textProps={{
                color: "white",
                numberOfLines: 1,
              }}
            >
              {topicName}
            </Button>
          ))}
          <TopicInput
            onAdd={(name) => setTopicNames((curr) => [...curr, name])}
            onRemove={() =>
              setTopicNames((curr) =>
                curr.filter((_, idx) => idx !== topicNames.length - 1)
              )
            }
            onChange={async (value) => {
              await fetch({
                variables: { where: { name: { startsWith: value } } },
              });
            }}
          />
        </XStack>
        {/* {!!data?.topics.length && (
          <View minHeight={20}>
            <FlashList<Topic>
              data={data?.topics as Topic[]}
              renderItem={renderItem}
              estimatedItemSize={20}
            />
          </View>
        )} */}
        <YGroup separator={<Separator />}>
          <YGroup.Item>
            <ListItem
              hoverTheme
              pressTheme
              title="Location"
              subTitle="Add a location"
              icon={<Ionicons name="location" />}
              iconAfter={<Ionicons name="chevron-forward" />}
            />
          </YGroup.Item>
          <YGroup.Item>
            <ListItem
              hoverTheme
              pressTheme
              title="Outfit Category"
              subTitle="Categorize your outfit"
              icon={<Ionicons name="book" />}
              iconAfter={<Ionicons name="chevron-forward" />}
              onPress={() => null}
            />
          </YGroup.Item>
        </YGroup>
        <Button
          disabled={uploading}
          backgroundColor={"$orange7Light"}
          icon={uploading ? <Spinner /> : <Ionicons name="send" />}
          onPress={onPress}
        >
          Post
        </Button>
      </YStack>
    </KeyboardAwareScrollView>
  );
}
