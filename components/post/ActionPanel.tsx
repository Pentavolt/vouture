import { Button, XStack } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { CollectedPost, Comment, Like } from "../../generated/gql/graphql";
import { useAuth } from "../../lib/hooks";

interface ActionPanelProps {
  post: {
    likes: Partial<Like>[];
    comments: Comment[];
    collects: CollectedPost[];
  };

  onLikePress: () => void;
  onCommentPress: () => void;
  onSavePress: () => void;
}

export default function ActionPanel({
  post,
  onCommentPress,
  onLikePress,
  onSavePress,
}: ActionPanelProps) {
  const { user } = useAuth();
  const isLiked = post.likes.some((like) => like.userId === user?.id);
  const isCollected = post.collects.some(
    (collect) => collect.userId === user?.id
  );

  return (
    <XStack
      space
      backgroundColor={"black"}
      height={60}
      paddingHorizontal={"$3"}
      justifyContent="space-between"
      alignItems="center"
    >
      <Button
        backgroundColor={"$backgroundTransparent"}
        onPress={onLikePress}
        icon={
          <Ionicons
            size={25}
            color={isLiked ? "#ef4444" : "white"}
            name={isLiked ? "heart" : "heart-outline"}
          />
        }
      >
        {post.likes.length.toString()}
      </Button>
      <Button
        backgroundColor={"$backgroundTransparent"}
        icon={<Ionicons color="white" size={25} name="chatbubble-outline" />}
        onPress={onCommentPress}
      >
        {post.comments.length.toString()}
      </Button>
      <Button
        backgroundColor={"$backgroundTransparent"}
        onPress={onSavePress}
        icon={
          <Ionicons
            size={25}
            color={isCollected ? "#FE9F10" : "white"}
            name={isCollected ? "bookmark" : "bookmark-outline"}
          />
        }
      >
        {post.collects.length.toString()}
      </Button>
    </XStack>
  );
}
