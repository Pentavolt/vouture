import { Heading, Spinner, Text, View, YStack } from "tamagui";
import { SearchStackScreenProps } from "../../lib/navigation/types";
import { useCallback } from "react";
import {
  MasonryFlashList,
  MasonryListRenderItemInfo,
} from "@shopify/flash-list";
import { useQuery } from "@apollo/client";
import {
  Post,
  PostsDocument,
  QueryMode,
  SortOrder,
} from "../../generated/gql/graphql";
import FeedItem from "../../components/FeedItem";

export default function BrandScreen({
  navigation,
  route,
}: SearchStackScreenProps<"Brand">) {
  const { data, loading, fetchMore } = useQuery(PostsDocument, {
    variables: {
      take: 20,
      orderBy: { likes: { _count: SortOrder["Desc"] } },
      where: {
        tags: {
          some: {
            brand: {
              is: {
                name: {
                  equals: route.params.brandName,
                  mode: QueryMode["Insensitive"],
                },
              },
            },
          },
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
    <YStack flex={1} width={"100%"}>
      <MasonryFlashList
        contentContainerStyle={{ paddingTop: 5, paddingBottom: 13 }} // FeedItem has marginTop of 8, total vertical offset should be 13.
        ListHeaderComponent={
          <YStack
            height={100}
            backgroundColor={"#FE9F10"}
            padding="$3"
            margin={8}
            borderRadius={5}
          >
            <Heading>{route.params.brandName}</Heading>
          </YStack>
        }
        ListEmptyComponent={
          <View flex={1} padding="$3">
            <Text fontFamily={"$body"} color={"black"}>
              No posts with this brand were found.
            </Text>
          </View>
        }
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
