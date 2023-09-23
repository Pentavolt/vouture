import { Ionicons } from "@expo/vector-icons";
import { useCallback } from "react";
import { useQuery } from "@apollo/client";
import {
  CollectedPost,
  CollectedPostsDocument,
  SortOrder,
} from "../generated/gql/graphql";
import { ListRenderItemInfo } from "@shopify/flash-list";
import PostPreview from "./post/PostPreview";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
  HomeStackParamList,
  UserStackParamList,
} from "../lib/navigation/types";
import { Tabs } from "react-native-collapsible-tab-view";
import Loading from "./Loading";
import { Paragraph, YStack } from "tamagui";

interface SavedPostsTabProps {
  userId: number;
  isBlocked: boolean;
  isPrivate: boolean;
}

export default function SavedPostsTab({
  userId,
  isBlocked,
  isPrivate,
}: SavedPostsTabProps) {
  const navigation =
    useNavigation<NavigationProp<UserStackParamList | HomeStackParamList>>();

  const { data, loading, fetchMore, refetch } = useQuery(
    CollectedPostsDocument,
    {
      variables: {
        orderBy: { createdAt: SortOrder["Desc"] },
        take: 20,
        where: {
          userId: { equals: userId },
          post: { is: { isDeleted: { equals: false } } },
        },
      },
    }
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<CollectedPost>) => (
      <PostPreview
        post={item.post}
        onNavigate={() =>
          navigation.navigate("Details", { postId: item.post.id })
        }
      />
    ),
    []
  );

  if (!data || loading) return <Loading />;
  return (
    <Tabs.FlashList
      ListEmptyComponent={
        isBlocked || isPrivate ? (
          <YStack
            space
            paddingVertical={"$16"} // Not ideal, but necessary since FlashList does not support flexGrow: 1 in contentContainerStyle.
            paddingHorizontal={"$7"}
            alignItems="center"
            justifyContent="center"
          >
            <Ionicons name={isBlocked ? "eye-off" : "lock-closed"} size={40} />
            <Paragraph
              fontFamily={"$span"}
              color={"$gray7Dark"}
              textAlign="center"
            >
              {isBlocked
                ? "You are not allowed to view this user's posts."
                : "This profile is private. Only followers can see their posts."}
            </Paragraph>
          </YStack>
        ) : undefined
      }
      numColumns={3}
      data={data.collectedPosts as CollectedPost[]}
      renderItem={renderItem}
      estimatedItemSize={200}
      onRefresh={refetch}
      refreshing={loading}
      keyExtractor={(_, idx) => idx.toString()}
      onEndReachedThreshold={0.5}
      onEndReached={() => {
        if (!data.collectedPosts[data.collectedPosts.length - 1]) return;
        if (data.collectedPosts.length % 20 !== 0) return;
        fetchMore({
          variables: {
            skip: 1,
            cursor: {
              id: data.collectedPosts[data.collectedPosts.length - 1].id,
            },
          },
          updateQuery: (previousQueryResult, { fetchMoreResult }) => {
            return {
              collectedPosts: [
                ...previousQueryResult.collectedPosts,
                ...fetchMoreResult.collectedPosts,
              ],
            };
          },
        });
      }}
    />
  );
}
