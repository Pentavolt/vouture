import { Button, XStack } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { Comment, Like } from "../../generated/gql/graphql";
import { useAuth } from "../../lib/hooks";

interface ActionPanelProps {
  likes: Partial<Like>[];
  comments: Comment[];
  onLikePress: () => void;
  onCommentPress: () => void;
  onSavePress: () => void;
}

export default function ActionPanel({
  comments,
  likes,
  onCommentPress,
  onLikePress,
  onSavePress,
}: ActionPanelProps) {
  const { user } = useAuth();
  const isLiked = likes.some((like) => like.userId === user?.id);
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
        {likes.length.toString()}
      </Button>
      <Button
        backgroundColor={"$backgroundTransparent"}
        icon={<Ionicons color="white" size={25} name="chatbubble-outline" />}
        onPress={onCommentPress}
      >
        {comments.length.toString()}
      </Button>
      <Button
        backgroundColor={"$backgroundTransparent"}
        onPress={onSavePress}
        icon={
          <Ionicons color="white" size={25} name="file-tray-full-outline" />
        }
      />
    </XStack>
  );
}
