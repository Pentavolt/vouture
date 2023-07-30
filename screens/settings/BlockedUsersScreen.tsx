import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@apollo/client";
import {
  Blocklist,
  BlocklistsDocument,
  DeleteOneBlocklistDocument,
} from "../../generated/gql/graphql";
import {
  Avatar,
  ListItem,
  Paragraph,
  Spinner,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { useCallback } from "react";
import { useAuth } from "../../lib/hooks";

export default function BlockedUsersScreen() {
  const { user } = useAuth();
  const [unblock] = useMutation(DeleteOneBlocklistDocument);
  const { data, loading } = useQuery(BlocklistsDocument, {
    variables: { where: { blockerId: { equals: user?.id } } },
  });

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Blocklist>) => (
      <ListItem
        pressTheme
        borderRadius={"$3"}
        flex={1}
        backgroundColor={"$background"}
        onPress={() =>
          unblock({
            variables: { where: { id: item.id } },
            update: (cache) => {
              // TODO: Update cache and remove the block.
            },
          })
        }
      >
        <XStack alignItems="center" space>
          <Avatar circular size={"$4"}>
            <Avatar.Image source={{ uri: item.blocked.image }} />
            <Avatar.Fallback backgroundColor={"red"} />
          </Avatar>
          <YStack flexGrow={1}>
            <Text>{item.blocked.username}</Text>
            <Paragraph color={"$gray7Light"}>
              {"Blocked on " + new Date(item.createdAt).toLocaleDateString()}
            </Paragraph>
          </YStack>
          <Ionicons size={15} color={"white"} name="close" />
        </XStack>
      </ListItem>
    ),
    []
  );

  if (loading || !data?.blocklists) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Spinner />
      </View>
    );
  }

  if (!data.blocklists.length) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <YStack alignItems="center" space>
          <Ionicons name="shield-checkmark" size={40} />
          <Text fontFamily={"$heading"} color={"black"}>
            You do not have any users blocked.
          </Text>
        </YStack>
      </View>
    );
  }

  return (
    <YStack space padding="$3" flex={1} backgroundColor={"white"}>
      <FlashList
        data={data.blocklists as Blocklist[]}
        renderItem={renderItem}
        estimatedItemSize={60}
      />
    </YStack>
  );
}
