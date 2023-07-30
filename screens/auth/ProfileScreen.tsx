import { Ionicons } from "@expo/vector-icons";
import { useAuth, useBottomSheetBack } from "../../lib/hooks";
import { UserStackScreenProps } from "../../lib/navigation/types";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@apollo/client";
import {
  GetUserDocument,
  Post,
  PostsDocument,
  SortOrder,
  User,
} from "../../generated/gql/graphql";
import { Paragraph, Text, View, YStack } from "tamagui";
import PostPreview from "../../components/post/PostPreview";
import ProfileHeader from "../../components/ProfileHeader";
import { useEffect, useState } from "react";
import ProfileActionSheet from "../../components/ProfileActionSheet";

// TODO: The props should be HomeStackScreenProps as well.

export default function ProfileScreen({
  navigation,
  route,
}: UserStackScreenProps<"Profile">) {
  const [open, setOpen] = useState<boolean>(false);
  const { user } = useAuth();
  const currentUserId = route.params ? route.params.user.id : user?.id;

  useBottomSheetBack(open, () => setOpen(false));
  const {
    data,
    loading: userLoading,
    refetch,
  } = useQuery(GetUserDocument, {
    variables: { where: { id: currentUserId } },
  });

  const {
    data: content,
    loading: postsLoading,
    fetchMore,
  } = useQuery(PostsDocument, {
    variables: {
      where: { userId: { equals: currentUserId } },
      orderBy: { createdAt: SortOrder["Desc"] },
      take: 20,
    },
  });

  useEffect(() => {
    if (!data?.user || !user) return;
    if (user.id !== data.user.id) {
      navigation.setOptions({
        headerRight: () => (
          <Ionicons
            size={26}
            style={{ marginHorizontal: 12 }}
            name="ellipsis-horizontal"
            color={"black"}
            onPress={() => setOpen(true)}
          />
        ),
      });
    }
  }, [userLoading]);

  const renderItem = ({ item }: { item: Post }) => (
    <PostPreview
      post={item}
      onNavigate={() => navigation.push("Details", { post: item })}
    />
  );

  if (postsLoading || userLoading || !data?.user) {
    return <Text>Loading...</Text>;
  }

  const isBlocked =
    data.user.blocked.some((block) => block.blockerId === user?.id) ||
    data.user.blocker.some((block) => block.blockedId === user?.id);

  const isPrivate =
    data.user.id !== user?.id &&
    data.user.isPrivate &&
    !data.user.followers.some((follow) => follow.followerId === user?.id);

  return (
    <View flex={1}>
      <ProfileActionSheet
        open={open}
        onOpenChange={setOpen}
        currentUser={user as User}
        viewedUser={data.user as User}
      />
      <FlashList<Post>
        ListHeaderComponent={<ProfileHeader user={data.user as User} />}
        renderItem={renderItem}
        onRefresh={refetch}
        refreshing={postsLoading}
        numColumns={3}
        keyExtractor={(_, idx) => idx.toString()}
        data={isBlocked || isPrivate ? [] : (content?.posts as Post[])}
        estimatedItemSize={200}
        onEndReachedThreshold={0.5}
        onEndReached={async () => {
          if (isBlocked || isPrivate) return;
          const lastItemId = content?.posts[content.posts.length - 1]?.id;
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
      {(isBlocked || isPrivate) && (
        <YStack
          flex={1}
          space
          paddingHorizontal={"$7"}
          flexGrow={1}
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
      )}
    </View>
  );
}
