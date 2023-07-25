import { RefreshControl } from "react-native";
import { useScrollToTop } from "@react-navigation/native";
import { useCallback, useEffect, useRef } from "react";
import {
  MasonryFlashList,
  MasonryListRenderItemInfo,
} from "@shopify/flash-list";
import { View, YStack } from "tamagui";
import { NetworkStatus, useQuery } from "@apollo/client";
import { FeedDocument, Post } from "../../generated/gql/graphql";
import { HomeStackScreenProps } from "../../lib/navigation/types";
import FeedItem from "../../components/FeedItem";

export default function FeedScreen({
  navigation,
}: HomeStackScreenProps<"Feed">) {
  const ref = useRef(null);
  const { data, fetchMore, refetch, networkStatus } = useQuery(FeedDocument, {
    variables: { count: 20 },
    notifyOnNetworkStatusChange: true,
  });

  useScrollToTop(ref);
  // useFocusEffect(
  //   useCallback(() => {
  //     // Refetch feed when screen is in focus.
  //     refetch();
  //   }, [])
  // );

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
        data={data?.feed.posts as Post[]}
        decelerationRate="normal"
        disableIntervalMomentum={true}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(_, idx) => idx.toString()}
        onEndReachedThreshold={1}
        onEndReached={async () => {
          await fetchMore({
            variables: { cursor: data?.feed.cursor, skip: 1 },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEntries = fetchMoreResult.feed.posts;
              return {
                feed: {
                  cursor: fetchMoreResult.feed.cursor,
                  posts: [...previousResult.feed.posts, ...newEntries],
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
