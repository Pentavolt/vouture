import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@apollo/client";
import {
  AlertDialog,
  Button,
  Heading,
  ListItem,
  ScrollView,
  Switch,
  Text,
  XStack,
  YGroup,
  YStack,
} from "tamagui";
import { MeDocument, UpdateMeDocument } from "../../generated/gql/graphql";
import { useState } from "react";
import { PreferencesStackScreenProps } from "../../lib/navigation/types";
import Loading from "../../components/Loading";
import { useAuth } from "../../lib/hooks";

export default function PrivacyScreen({
  navigation,
}: PreferencesStackScreenProps<"Privacy">) {
  const [checked, setChecked] = useState<boolean>(false);
  const [updateMe] = useMutation(UpdateMeDocument);
  const { logout } = useAuth();
  const { loading } = useQuery(MeDocument, {
    onCompleted: ({ me }) => setChecked(me.isPrivate),
  });

  const onCheck = (value: boolean) => {
    updateMe({ variables: { data: { isPrivate: { set: value } } } });
    setChecked(value);
  };

  const handleDelete = () => {
    updateMe({
      variables: { data: { isDeleted: { set: true } } },
      onCompleted: () => logout(),
    });
  };

  if (loading) return <Loading />;
  return (
    <ScrollView space flex={1} contentContainerStyle={{ alignItems: "center" }}>
      <YStack flex={1} padding={"$3"} space>
        <Heading color={"black"}>Your Privacy</Heading>
        <YGroup alignSelf="center" size="$4">
          <YGroup.Item>
            <ListItem
              themeInverse
              fontSize={16}
              fontWeight={"$span"}
              iconAfter={
                <Switch
                  size={"$3"}
                  checked={checked}
                  backgroundColor={checked ? "#FE9F10" : "$gray6Dark"}
                  onCheckedChange={onCheck}
                >
                  <Switch.Thumb animation="bouncy" />
                </Switch>
              }
            >
              <YStack flex={1}>
                <Text color="black" fontFamily={"$span"} fontSize={16}>
                  Private Profile
                </Text>
                <Text color="$gray11Light" fontFamily={"$span"} fontSize={16}>
                  By making your profile private, only your followers will be
                  able to view your posts.
                </Text>
              </YStack>
            </ListItem>
          </YGroup.Item>
        </YGroup>
        <YGroup>
          <YGroup.Item>
            <ListItem
              themeInverse
              pressTheme
              fontSize={16}
              fontFamily={"$span"}
              iconAfter={<Ionicons size={18} name="chevron-forward" />}
              onPress={() => navigation.navigate("Blocklist")}
            >
              Blocked Users
            </ListItem>
          </YGroup.Item>
          <YGroup.Item>
            <AlertDialog>
              <AlertDialog.Trigger asChild>
                <ListItem
                  themeInverse
                  borderBottomLeftRadius={8}
                  borderBottomRightRadius={8}
                  pressTheme
                  fontSize={16}
                  fontFamily={"$span"}
                  iconAfter={<Ionicons size={18} name="chevron-forward" />}
                >
                  Delete Account
                </ListItem>
              </AlertDialog.Trigger>
              <AlertDialog.Portal>
                <AlertDialog.Overlay
                  key="overlay"
                  animation="quick"
                  opacity={0.5}
                  enterStyle={{ opacity: 0 }}
                  exitStyle={{ opacity: 0 }}
                />
                <AlertDialog.Content
                  bordered
                  backgroundColor={"white"}
                  borderColor={"white"}
                  elevate
                  key="content"
                  animation={[
                    "quick",
                    {
                      opacity: {
                        overshootClamping: true,
                      },
                    },
                  ]}
                  enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                  exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                  x={0}
                  scale={1}
                  opacity={1}
                  y={0}
                >
                  <YStack space>
                    <AlertDialog.Title color={"black"}>
                      Account Deletion Request
                    </AlertDialog.Title>
                    <AlertDialog.Description color={"$gray7Dark"} fontSize={16}>
                      By pressing proceed, you will schedule your account for
                      deletion. If you login at any point during these 30 days,
                      your account will be restored. Account deletion may take
                      up to 30 days.
                    </AlertDialog.Description>
                    <XStack space="$3">
                      <AlertDialog.Cancel asChild>
                        <Button backgroundColor={"#FE9F10"}>Cancel</Button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action asChild onPress={handleDelete}>
                        <Button>Proceed</Button>
                      </AlertDialog.Action>
                    </XStack>
                  </YStack>
                </AlertDialog.Content>
              </AlertDialog.Portal>
            </AlertDialog>
          </YGroup.Item>
        </YGroup>
      </YStack>
    </ScrollView>
  );
}
