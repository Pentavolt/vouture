import * as NavigationBar from "expo-navigation-bar";
import PostItem from "../../components/post/PostItem";
import { RefreshControl, useWindowDimensions } from "react-native";
import { useScrollToTop } from "@react-navigation/native";
import { useCallback, useEffect, useRef } from "react";
import { FlashList } from "@shopify/flash-list";
import { Spinner, View } from "tamagui";
import { NetworkStatus, useQuery } from "@apollo/client";
import { Post, PostsDocument, SortOrder } from "../../generated/gql/graphql";
import { HomeStackScreenProps } from "../../lib/navigation/types";

export default function PostScreen({
  route,
  navigation,
}: HomeStackScreenProps<"Details">) {
  // TODO: Consider making this a similar posts feed.
  const ref = useRef(null);
  const { height } = useWindowDimensions();
  const { data, fetchMore, refetch, networkStatus } = useQuery(PostsDocument, {
    fetchPolicy: "network-only",
    variables: {
      take: 20,
      cursor: { id: route.params.post.id },
      orderBy: [{ createdAt: SortOrder["Desc"] }, { id: SortOrder["Desc"] }],
    },
  });

  useScrollToTop(ref);
  useEffect(() => {
    (async () => NavigationBar.setBackgroundColorAsync("black"))();
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <PostItem
        post={item}
        onNavigate={() => navigation.navigate("Profile", { user: item.user })}
      />
    ),
    []
  );

  if (!data) {
    return <Spinner size="large" />;
  }

  return (
    <View flex={1}>
      <FlashList<Post>
        ref={ref}
        estimatedItemSize={height}
        data={data?.posts as Post[]}
        decelerationRate="normal"
        disableIntervalMomentum={true}
        removeClippedSubviews={true}
        snapToInterval={height}
        snapToAlignment="start"
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(_, idx) => idx.toString()}
        onEndReachedThreshold={5}
        onEndReached={async () => {
          await fetchMore({
            variables: {
              cursor: { id: data?.posts[data?.posts.length - 1].id },
              skip: 1,
            },
            updateQuery: (previousQueryResult, { fetchMoreResult }) => {
              return {
                posts: [...previousQueryResult.posts, ...fetchMoreResult.posts],
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
    </View>
  );
}
