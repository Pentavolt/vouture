import { Avatar, Text, XStack, YStack } from "tamagui";
import {
  Comment,
  PostDocument,
  UpdateOneCommentDocument,
  User,
} from "../../generated/gql/graphql";
import { memo, useRef } from "react";
import { getTimeAgo } from "../../lib/time";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { Animated } from "react-native";
import { useMutation } from "@apollo/client";

interface CommentItemProps {
  user: User;
  comment: Comment;
}

function CommentItem({ user, comment }: CommentItemProps) {
  const ref = useRef<Swipeable>(null);
  const [mutate] = useMutation(UpdateOneCommentDocument);

  const onPress = async () => {
    mutate({
      variables: {
        data: { isHidden: { set: true } },
        where: { id: comment.id },
      },
      update: (cache) => {
        cache.updateQuery(
          { query: PostDocument, variables: { where: { id: comment.postId } } },
          (data) => {
            if (!data?.post) return undefined;
            return {
              post: {
                ...data.post,
                comments: data.post.comments.filter(
                  (curr) => curr.id !== comment.id
                ),
              },
            };
          }
        );

        // Clear hidden comments.
        // TODO: Might be better to evict().
        cache.gc();
      },
    });
  };

  return (
    <Swipeable
      ref={ref}
      overshootRight={user?.id === comment.post.userId}
      renderRightActions={(_, dragX) => {
        if (user?.id !== comment.post.userId) return null;
        const scale = dragX.interpolate({
          inputRange: [-80, 0],
          outputRange: [1, 0],
          extrapolate: "clamp",
        });

        return (
          <RectButton
            onPress={onPress}
            style={{
              alignItems: "center",
              flexDirection: "row",
              backgroundColor: "#dd2c00",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <Animated.View
              style={{
                transform: [{ scale }],
                marginHorizontal: 10,
              }}
            >
              <Text fontSize={16} fontFamily={"$heading"}>
                Hide
              </Text>
            </Animated.View>
          </RectButton>
        );
      }}
    >
      <XStack
        space
        paddingBottom={"$3"}
        alignItems="center"
        backgroundColor={"$background"}
      >
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
    </Swipeable>
  );
}

export default memo(CommentItem);
