import { useMutation, useQuery } from "@apollo/client";
import {
  Heading,
  ListItem,
  ScrollView,
  Spinner,
  Switch,
  YGroup,
  YStack,
} from "tamagui";
import { MeDocument, UpdateMeDocument } from "../../generated/gql/graphql";
import { useState } from "react";
import { View } from "tamagui";

export default function PrivacyScreen() {
  const [checked, setChecked] = useState<boolean>(false);
  const [updateMe] = useMutation(UpdateMeDocument);
  const { loading } = useQuery(MeDocument, {
    onCompleted: ({ me }) => setChecked(me.isPrivate),
  });

  const onCheck = (value: boolean) => {
    updateMe({ variables: { data: { isPrivate: { set: value } } } });
    setChecked(value);
  };

  if (loading) {
    return (
      <View flex={1} alignItems="center" justifyContent="center">
        <Spinner />
      </View>
    );
  }

  return (
    <ScrollView
      space
      flex={1}
      backgroundColor={"white"}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <YStack flex={1} padding={"$3"} space>
        <Heading color={"black"}>Your Privacy</Heading>
        <YGroup alignSelf="center" bordered size="$4">
          <YGroup.Item>
            <ListItem
              hoverTheme
              fontSize={15}
              title="Private Profile"
              subTitle="By making your profile private, only your followers will be able to view your posts."
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
            />
          </YGroup.Item>
        </YGroup>
      </YStack>
    </ScrollView>
  );
}
