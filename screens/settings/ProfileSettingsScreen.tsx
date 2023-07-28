import { Ionicons } from "@expo/vector-icons";
import {
  Avatar,
  ListItem,
  ScrollView,
  Spinner,
  View,
  YGroup,
  YStack,
} from "tamagui";
import { useMutation, useQuery } from "@apollo/client";
import {
  GetUserDocument,
  MeDocument,
  UpdateMeDocument,
  UploadDocument,
} from "../../generated/gql/graphql";
import { MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker";
import { ReactNativeFile } from "apollo-upload-client";
import { PreferencesStackScreenProps } from "../../lib/navigation/types";

export default function ProfileSettingsScreen({
  navigation,
}: PreferencesStackScreenProps<"ProfileSettings">) {
  const { data, loading } = useQuery(MeDocument);
  const [upload] = useMutation(UploadDocument);
  const [updateMe] = useMutation(UpdateMeDocument);

  const openGallery = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled) return;
    const file = new ReactNativeFile({
      name: "avatar.jpeg",
      uri: result.assets[0].uri,
      type: "image/jpeg",
    });

    const urls = await upload({
      variables: { images: [file] },
      fetchPolicy: "network-only",
    });

    if (!urls.data || !urls.data.upload.length) {
      return console.error("No upload data?");
    }

    updateMe({
      variables: { data: { image: { set: urls.data.upload[0] } } },
      update: (cache, { data: content }) => {
        if (!content?.updateMe) return;
        cache.updateQuery(
          {
            query: GetUserDocument,
            variables: { where: { id: content.updateMe.id } },
          },
          (data) => {
            if (!data?.user) return undefined;
            return {
              user: { ...data.user, image: urls.data?.upload[0] as string },
            };
          }
        );
      },
    });
  };

  // TODO: Add Formik here.
  return (
    <ScrollView
      space
      flex={1}
      backgroundColor={"white"}
      paddingVertical="$8"
      contentContainerStyle={{ alignItems: "center" }}
    >
      {loading ? (
        <Spinner />
      ) : (
        <Avatar circular size={"$8"} onPress={openGallery}>
          <View
            flex={1}
            justifyContent="center"
            alignItems="center"
            width={"100%"}
            backgroundColor={"rgba(0, 0, 0, 0.3)"}
            zIndex={99}
          >
            <Ionicons name="add" size={28} color={"white"} />
          </View>
          <Avatar.Image source={{ uri: data?.me?.image }} />
          <Avatar.Fallback backgroundColor={"#FE9F10"} />
        </Avatar>
      )}
      <YStack padding={"$3"} space>
        <YGroup alignSelf="center" bordered size="$4">
          <YGroup.Item>
            <ListItem
              hoverTheme
              pressTheme
              iconAfter={<Ionicons name="chevron-forward" />}
              fontSize={15}
              title="Username"
              subTitle={data?.me.username}
              onPress={() => navigation.navigate("Username")}
            />
          </YGroup.Item>
          <YGroup.Item>
            <ListItem
              hoverTheme
              pressTheme
              fontSize={15}
              iconAfter={<Ionicons name="chevron-forward" />}
              onPress={() => navigation.navigate("Biography")}
            >
              Biography
            </ListItem>
          </YGroup.Item>
          <YGroup.Item>
            <ListItem
              hoverTheme
              pressTheme
              fontSize={15}
              iconAfter={<Ionicons name="chevron-forward" />}
              onPress={() => navigation.navigate("Location")}
            >
              Location
            </ListItem>
          </YGroup.Item>
        </YGroup>
      </YStack>
    </ScrollView>
  );
}
