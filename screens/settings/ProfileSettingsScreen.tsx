import { Ionicons } from "@expo/vector-icons";
import {
  Avatar,
  ListItem,
  ScrollView,
  Spinner,
  Text,
  View,
  YGroup,
  YStack,
} from "tamagui";
import { useMutation, useQuery } from "@apollo/client";
import {
  GetUserDocument,
  MeDocument,
  SendVerificationCodeDocument,
  UpdateMeDocument,
  UploadDocument,
} from "../../generated/gql/graphql";
import { MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker";
import { ReactNativeFile } from "apollo-upload-client";
import { PreferencesStackScreenProps } from "../../lib/navigation/types";
import Loading from "../../components/Loading";

export default function ProfileSettingsScreen({
  navigation,
}: PreferencesStackScreenProps<"ProfileSettings">) {
  const [upload] = useMutation(UploadDocument);
  const [updateMe] = useMutation(UpdateMeDocument);
  const [verify] = useMutation(SendVerificationCodeDocument);
  const { data, loading } = useQuery(MeDocument, {
    fetchPolicy: "network-only",
  });

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

  if (!data?.me) return <Loading />;

  // TODO: Add Formik here.
  return (
    <ScrollView
      space
      flex={1}
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
        <YGroup alignSelf="center" size="$4">
          <YGroup.Item>
            <ListItem
              hoverTheme
              pressTheme
              themeInverse
              iconAfter={<Ionicons name="chevron-forward" size={18} />}
              fontSize={16}
              fontFamily={"$span"}
              onPress={() => navigation.navigate("Username")}
            >
              Username
            </ListItem>
          </YGroup.Item>
          <YGroup.Item>
            <ListItem
              hoverTheme
              themeInverse
              pressTheme
              iconAfter={
                data.me.isEmailVerified ? (
                  <Ionicons name="chevron-forward" size={18} />
                ) : (
                  <Text fontFamily={"$body"} color="red">
                    Verify
                  </Text>
                )
              }
              fontSize={16}
              fontFamily={"$span"}
              onPress={() => {
                if (data.me.isEmailVerified) return;
                verify({ variables: { userId: data?.me.id } });
                navigation.navigate("Verification");
              }}
            >
              Email
            </ListItem>
          </YGroup.Item>
          <YGroup.Item>
            <ListItem
              hoverTheme
              pressTheme
              themeInverse
              fontSize={16}
              fontFamily={"$span"}
              iconAfter={<Ionicons name="chevron-forward" size={18} />}
              onPress={() => navigation.navigate("Biography")}
            >
              Biography
            </ListItem>
          </YGroup.Item>
          <YGroup.Item>
            <ListItem
              hoverTheme
              pressTheme
              themeInverse
              fontSize={16}
              fontFamily={"$span"}
              iconAfter={<Ionicons name="chevron-forward" size={18} />}
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
