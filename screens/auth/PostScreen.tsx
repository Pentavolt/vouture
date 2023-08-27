import * as NavigationBar from "expo-navigation-bar";
import PostItem from "../../components/post/PostItem";
import { Platform, RefreshControl, useWindowDimensions } from "react-native";
import { useCallback, useEffect } from "react";
import { FlashList } from "@shopify/flash-list";
import { View } from "tamagui";
import { NetworkStatus, useQuery } from "@apollo/client";
import { Post, PostsDocument, SortOrder } from "../../generated/gql/graphql";
import { HomeStackScreenProps } from "../../lib/navigation/types";
import Loading from "../../components/Loading";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function PostScreen({
  route,
  navigation,
}: HomeStackScreenProps<"Details">) {
  // TODO: Consider making this a similar posts feed.
  const { height } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const { data, loading, fetchMore, refetch, networkStatus } = useQuery(
    PostsDocument,
    {
      fetchPolicy: "network-only",
      variables: {
        take: 20,
        cursor: { id: route.params.postId },
        where: { isDeleted: { equals: false } },
        orderBy: [{ createdAt: SortOrder["Desc"] }, { id: SortOrder["Desc"] }],
      },
    }
  );

  useEffect(() => {
    if (Platform.OS === "ios") return;
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

  if (loading) return <Loading />;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <View flexGrow={1}>
        <FlashList<Post>
          estimatedItemSize={height - top - bottom}
          data={data?.posts as Post[]}
          decelerationRate="fast"
          disableIntervalMomentum={true}
          removeClippedSubviews={true}
          snapToInterval={height - top - bottom}
          snapToAlignment="start"
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={(_, idx) => idx.toString()}
          onEndReachedThreshold={5}
          onEndReached={async () => {
            if (!data?.posts[data?.posts.length - 1]) return;
            await fetchMore({
              variables: {
                cursor: { id: data?.posts[data?.posts.length - 1]?.id },
                skip: 1,
              },
              updateQuery: (previousQueryResult, { fetchMoreResult }) => {
                return {
                  posts: [
                    ...previousQueryResult.posts,
                    ...fetchMoreResult.posts,
                  ],
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
    </SafeAreaView>
  );
}
