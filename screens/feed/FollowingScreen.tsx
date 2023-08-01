import { RefreshControl } from "react-native";
import { useScrollToTop } from "@react-navigation/native";
import { useCallback, useRef } from "react";
import {
  MasonryFlashList,
  MasonryListRenderItemInfo,
} from "@shopify/flash-list";
import { View, YStack } from "tamagui";
import { NetworkStatus, useQuery } from "@apollo/client";
import { FamiliarDocument, Post } from "../../generated/gql/graphql";
import { FeedTopTabScreenProps } from "../../lib/navigation/types";
import FeedItem from "../../components/FeedItem";

export default function FollowingScreen({
  navigation,
}: FeedTopTabScreenProps<"Following">) {
  const ref = useRef(null);
  const { data, fetchMore, refetch, networkStatus } = useQuery(
    FamiliarDocument,
    {
      variables: { count: 20 },
      notifyOnNetworkStatusChange: true,
    }
  );

  useScrollToTop(ref);
  const renderItem = useCallback(
    ({ item, columnIndex }: MasonryListRenderItemInfo<Post>) => (
      <FeedItem
        post={item}
        column={columnIndex}
        onPress={() =>
          navigation.push("Details", {
            post: item,
          })
        }
      />
    ),
    []
  );

  if (!data) {
    return (
      <MasonryFlashList
        numColumns={2}
        estimatedItemSize={200}
        data={Array(6)}
        refreshControl={
          <RefreshControl
            tintColor={"white"}
            refreshing={networkStatus === NetworkStatus.refetch}
            onRefresh={refetch}
          />
        }
        renderItem={() => (
          <YStack flex={1} margin={4}>
            <View height={200} backgroundColor={"$gray11Light"} />
            <View height={50} padding={10} space>
              <View height={10} backgroundColor={"$gray11Light"} />
            </View>
          </YStack>
        )}
      />
    );
  }

  return (
    <YStack flex={1} backgroundColor={"$gray2Light"}>
      <MasonryFlashList<Post>
        ref={ref}
        numColumns={2}
        estimatedItemSize={200}
        data={data?.familiar.posts as Post[]}
        decelerationRate="normal"
        disableIntervalMomentum={true}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(_, idx) => idx.toString()}
        onEndReachedThreshold={1}
        onEndReached={async () => {
          await fetchMore({
            variables: { cursor: data?.familiar.cursor, skip: 1 },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEntries = fetchMoreResult.familiar.posts;
              return {
                familiar: {
                  cursor: fetchMoreResult.familiar.cursor,
                  posts: [...previousResult.familiar.posts, ...newEntries],
                },
              };
            },
          });
        }}
        refreshControl={
          <RefreshControl
            tintColor={"white"}
            refreshing={networkStatus === NetworkStatus.refetch}
            onRefresh={refetch}
          />
        }
      />
    </YStack>
  );
}
