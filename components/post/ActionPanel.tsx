import { Button, XStack } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import {
  Attachment,
  CollectedPost,
  Comment,
  Like,
  Maybe,
  Poll,
  User,
} from "../../generated/gql/graphql";
import { useAuth } from "../../lib/hooks";

interface ActionPanelProps {
  post: {
    id: number;
    user: User;
    likes: Partial<Like>[];
    comments: Comment[];
    saves: CollectedPost[];
    poll?: Maybe<Poll>;
    attachments: Attachment[];
  };

  onLikePress: () => void;
  onCommentPress: () => void;
  onSavePress: () => void;
  onSharePress: () => void;
  onPollPress: () => void;
}

export default function ActionPanel({
  post,
  onCommentPress,
  onLikePress,
  onSavePress,
  onSharePress,
  onPollPress,
}: ActionPanelProps) {
  const { user } = useAuth();

  const isLiked = post.likes.some((like) => like.userId === user?.id);
  const isSaved = post.saves.some((save) => save.userId === user?.id);

  return (
    <XStack
      width={"100%"}
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
      {!post.poll && (
        <Button
          backgroundColor={"$backgroundTransparent"}
          onPress={onSavePress}
          icon={
            <Ionicons
              size={25}
              color={isSaved ? "#FE9F10" : "white"}
              name={isSaved ? "bookmark" : "bookmark-outline"}
            />
          }
        >
          {post.saves.length.toString()}
        </Button>
      )}
      {post.poll && (
        <Button
          backgroundColor={"$backgroundTransparent"}
          onPress={onPollPress}
          icon={
            <Ionicons size={25} color={"#BBDB8D"} name={"compass-outline"} />
          }
        />
      )}
      <Button
        backgroundColor={"$backgroundTransparent"}
        onPress={onSharePress}
        icon={<Ionicons size={25} name={"share-outline"} />}
      />
    </XStack>
  );
}
