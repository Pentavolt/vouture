import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useAuth } from "../../lib/hooks";
import { CameraStackScreenProps } from "../../lib/navigation/types";
import {
  Button,
  ListItem,
  Spinner,
  Switch,
  TextArea,
  XStack,
  YGroup,
  YStack,
} from "tamagui";
import { CommonActions } from "@react-navigation/native";
import { useMutation } from "@apollo/client";
import {
  CreatePostDocument,
  UploadDocument,
} from "../../generated/gql/graphql";
import { ReactNativeFile } from "apollo-upload-client";
import FastImage from "react-native-fast-image";
import { Keyboard, Pressable } from "react-native";
import TagsSheet from "../../components/TagsSheet";
import PollCreateSheet from "../../components/PollCreateSheet";

export default function PreviewScreen({
  navigation,
  route,
}: CameraStackScreenProps<"Preview">) {
  const [post] = useMutation(CreatePostDocument);
  const [upload] = useMutation(UploadDocument);
  const [caption, setCaption] = useState<string>("");
  const [pollTitle, setPollTitle] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [topicNames, setTopicNames] = useState<string[]>([]);
  const [checked, setChecked] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [pollIsOpen, setPollIsOpen] = useState<boolean>(false);
  const { user } = useAuth();
  const { photos, tags } = route.params;

  const onPress = async () => {
    if (!photos) return;
    setUploading(true);
    const files = photos.map(
      (photo) =>
        new ReactNativeFile({
          name: "post.jpeg",
          type: "image/jpeg",
          uri: photo.uri,
        })
    );

    const urls = await upload({
      variables: { images: files },
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
          user: { connect: { id: user?.id } },
          poll: pollTitle.length ? { create: { name: pollTitle } } : undefined,
          attachments: {
            create: urls.data.upload.map((url, idx) => ({
              url,
              height: photos[idx].height,
              width: photos[idx].width,
              tags: {
                createMany: {
                  data: tags[idx].map((tag) => ({
                    brandId: tag.brandId,
                    x: tag.relX,
                    y: tag.relY,
                  })),
                },
              },
            })),
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
              source={{ uri: photos[0].uri }}
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
            {photos.length >= 2 && (
              <YGroup.Item>
                <ListItem
                  pressTheme
                  themeInverse
                  fontSize={15}
                  fontFamily={"$span"}
                  icon={
                    <Ionicons size={18} color={"#5D5D5D"} name="stats-chart" />
                  }
                  iconAfter={
                    pollTitle.length ? (
                      <Ionicons size={18} name="checkmark-sharp" />
                    ) : (
                      <Ionicons size={18} name="chevron-forward" />
                    )
                  }
                  onPress={() => setPollIsOpen(true)}
                >
                  Poll
                </ListItem>
              </YGroup.Item>
            )}
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
                    backgroundColor={checked ? "#BBDB8D" : "$gray6Dark"}
                    onCheckedChange={() => setChecked((curr) => !curr)}
                  >
                    <Switch.Thumb backgroundColor={"white"} animation="quick" />
                  </Switch>
                }
              />
            </YGroup.Item>
          </YGroup>
        </YStack>
        <Button
          disabled={uploading}
          backgroundColor={"#BBDB8D"}
          color={"#15191E"}
          icon={uploading ? <Spinner /> : null}
          onPress={onPress}
          pressStyle={{
            backgroundColor: "#CFEBA5",
            borderColor: "#CFEBA5",
          }}
        >
          Post
        </Button>
      </YStack>
      <TagsSheet
        open={open}
        onClose={(topics) => {
          setTopicNames(topics);
          setOpen(false);
        }}
      />

      <PollCreateSheet
        open={pollIsOpen}
        onClose={(text) => {
          setPollTitle(text);
          setPollIsOpen(false);
        }}
      />
    </Pressable>
  );
}
