import { useCallback } from "react";
import { Heading, Spinner, View, YStack } from "tamagui";
import { ResultsTopTabScreenProps } from "../../lib/navigation/types";
import { useQuery } from "@apollo/client";
import {
  Post,
  PostsDocument,
  QueryMode,
  SortOrder,
} from "../../generated/gql/graphql";
import {
  MasonryFlashList,
  MasonryListRenderItemInfo,
} from "@shopify/flash-list";
import FeedItem from "../../components/FeedItem";

export default function PostResultsScreen({
  navigation,
  route,
}: ResultsTopTabScreenProps<"Posts">) {
  const { data, loading, fetchMore } = useQuery(PostsDocument, {
    variables: {
      take: 20,
      orderBy: { likes: { _count: SortOrder["Desc"] } },
      where: {
        content: {
          contains: route.params.query,
          mode: QueryMode["Insensitive"],
        },
      },
    },
  });

  const renderItem = useCallback(
    ({ item, columnIndex }: MasonryListRenderItemInfo<Post>) => (
      <FeedItem
        column={columnIndex}
        post={item}
        onPress={() => navigation.push("Details", { post: item })}
      />
    ),
    []
  );

  if (loading) {
    return (
      <View flex={1} backgroundColor={"white"}>
        <Spinner />
      </View>
    );
  }

  return (
    <YStack space flex={1} minHeight={400}>
      <MasonryFlashList
        contentContainerStyle={{ paddingTop: 5, paddingBottom: 13 }} // FeedItem has marginTop of 8, total vertical offset should be 13.
        numColumns={2}
        data={data?.posts as Post[]}
        renderItem={renderItem}
        keyExtractor={(_, idx) => idx.toString()}
        estimatedItemSize={200}
        decelerationRate="normal"
        disableIntervalMomentum={true}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        onEndReached={async () => {
          if (!data?.posts.length) return;
          if (data.posts.length % 20 !== 0) return;
          console.log("MORE");
          await fetchMore({
            variables: { skip: data?.posts.length },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEntries = fetchMoreResult.posts;
              return { posts: [...previousResult.posts, ...newEntries] };
            },
          });
        }}
      />
    </YStack>
  );
}
