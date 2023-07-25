import { Avatar, Text, XStack, YStack } from "tamagui";
import { Comment } from "../../generated/gql/graphql";
import { memo } from "react";
import { getTimeAgo } from "../../lib/time";

interface CommentItemProps {
  comment: Comment;
}

function CommentItem({ comment }: CommentItemProps) {
  return (
    <XStack space paddingBottom={"$3"}>
      <Avatar size={"$3"} circular>
        <Avatar.Image source={{ uri: comment.author.image }} />
      </Avatar>
      <YStack space="$1" flex={1} flexGrow={1}>
        <Text color={"$gray7Light"}>{comment.author.username}</Text>
        <Text color={"white"}>{comment.content}</Text>
        <Text fontSize={12} color={"$gray9Light"}>
          {getTimeAgo(comment.createdAt)}
        </Text>
      </YStack>
    </XStack>
  );
}

export default memo(CommentItem);
