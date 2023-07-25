import { useAuth } from "../../lib/hooks";
import { UserStackScreenProps } from "../../lib/navigation/types";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@apollo/client";
import {
  GetUserDocument,
  Post,
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
  const { data, refetch, loading } = useQuery(GetUserDocument, {
    variables: {
      where: { id: route.params ? route.params.user.id : user?.id },
      orderBy: { createdAt: SortOrder["Desc"] },
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
      data={data?.user?.posts as Post[]}
      estimatedItemSize={200}
    />
  );
}
