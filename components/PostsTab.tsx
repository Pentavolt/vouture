import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "react-native-collapsible-tab-view";
import { Post, PostsDocument, SortOrder } from "../generated/gql/graphql";
import { Paragraph, YStack } from "tamagui";
import { useQuery } from "@apollo/client";
import { useCallback } from "react";
import PostPreview from "./post/PostPreview";
import { ListRenderItemInfo } from "@shopify/flash-list";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
  HomeStackParamList,
  UserStackParamList,
} from "../lib/navigation/types";

interface PostsTabProps {
  userId: number;
  isBlocked: boolean;
  isPrivate: boolean;
  onRefresh: () => void;
}

export default function PostsTab({
  userId,
  isBlocked,
  isPrivate,
  onRefresh,
}: PostsTabProps) {
  const navigation =
    useNavigation<NavigationProp<UserStackParamList | HomeStackParamList>>();

  const { data, loading, fetchMore, refetch } = useQuery(PostsDocument, {
    variables: {
      where: { userId: { equals: userId }, isDeleted: { equals: false } },
      orderBy: { createdAt: SortOrder["Desc"] },
      take: 20,
    },
  });

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Post>) => (
      <PostPreview
        post={item}
        onNavigate={() => navigation.navigate("Details", { postId: item.id })}
      />
    ),
    []
  );

  return (
    <Tabs.FlashList<Post>
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
      renderItem={renderItem}
      onRefresh={() => {
        refetch();
        onRefresh();
      }}
      refreshing={loading}
      numColumns={3}
      keyExtractor={(_, idx) => idx.toString()}
      data={isBlocked || isPrivate ? [] : (data?.posts as Post[])}
      estimatedItemSize={200}
      onEndReachedThreshold={0.5}
      onEndReached={async () => {
        if (isBlocked || isPrivate) return;
        const lastItemId = data?.posts[data.posts.length - 1]?.id;
        await fetchMore({
          variables: {
            ...(lastItemId ? { cursor: { id: lastItemId }, skip: 1 } : {}),
          },
          updateQuery: (previousQueryResult, { fetchMoreResult }) => {
            return {
              posts: [...previousQueryResult.posts, ...fetchMoreResult.posts],
            };
          },
        });
      }}
    />
  );
}
