import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@apollo/client";
import {
  Blocklist,
  BlocklistsDocument,
  DeleteOneBlocklistDocument,
} from "../../generated/gql/graphql";
import { Text, View, YStack } from "tamagui";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { useCallback } from "react";
import { useAuth } from "../../lib/hooks";
import UserListItem from "../../components/UserListItem";
import Loading from "../../components/Loading";

export default function BlockedUsersScreen() {
  const { user } = useAuth();
  const [unblock] = useMutation(DeleteOneBlocklistDocument);
  const { data, loading } = useQuery(BlocklistsDocument, {
    variables: { where: { blockerId: { equals: user?.id } } },
  });

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Blocklist>) => (
      <UserListItem
        pressTheme
        user={item.blocked}
        subtitle={"Blocked on " + new Date(item.createdAt).toLocaleDateString()}
        onPress={() =>
          unblock({
            variables: { where: { id: item.id } },
            // TODO: Update cache and remove the block.
          })
        }
      >
        <Ionicons size={15} color={"white"} name="close" />
      </UserListItem>
    ),
    []
  );

  if (loading || !data?.blocklists) return <Loading />;
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
        keyExtractor={(_, idx) => idx.toString()}
        estimatedItemSize={60}
      />
    </YStack>
  );
}
