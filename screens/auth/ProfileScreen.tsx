import { useAuth } from "../../lib/hooks";
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
import { Text } from "tamagui";
import PostPreview from "../../components/post/PostPreview";
import ProfileHeader from "../../components/ProfileHeader";

// TODO: The props should be HomeStackScreenProps as well.

export default function ProfileScreen({
  navigation,
  route,
}: UserStackScreenProps<"Profile">) {
  const { user } = useAuth();
  const currentUser = route.params ? route.params.user.id : user?.id;

  const { data, refetch } = useQuery(GetUserDocument, {
    variables: { where: { id: currentUser } },
  });

  const {
    data: content,
    loading,
    fetchMore,
  } = useQuery(PostsDocument, {
    variables: {
      where: { userId: { equals: currentUser } },
      orderBy: { createdAt: SortOrder["Desc"] },
      take: 20,
    },
  });

  const renderItem = ({ item }: { item: Post }) => (
    <PostPreview
      post={item}
      onNavigate={() => navigation.push("Details", { post: item })}
    />
  );

  if (loading || !data?.user) return <Text>Loading...</Text>;
  return (
    // TODO: Try design with space between images.
    <FlashList<Post>
      ListHeaderComponent={<ProfileHeader user={data.user as User} />}
      renderItem={renderItem}
      onRefresh={refetch}
      refreshing={loading}
      numColumns={3}
      keyExtractor={(_, idx) => idx.toString()}
      data={content?.posts as Post[]}
      estimatedItemSize={200}
      onEndReachedThreshold={0.5}
      onEndReached={async () => {
        const lastItemId = content?.posts[content.posts.length - 1].id;
        await fetchMore({
          variables: { cursor: { id: lastItemId }, skip: 1 },
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
