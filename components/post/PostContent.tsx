import React, { useState } from "react";
import { Avatar, Paragraph, Text, View, XStack, YStack } from "tamagui";
import { Post } from "../../generated/gql/graphql";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getTimeAgo } from "../../lib/time";

interface PostContent {
  post: Post;
  onNavigate: () => void;
}

export default function PostContent({ post, onNavigate }: PostContent) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [canExpand, setCanExpand] = useState<boolean>(false);
  return (
    <XStack
      space="$3"
      alignItems={!!post.content ? "flex-start" : "center"}
      position="absolute"
      bottom={60}
      paddingHorizontal={"$3"}
      paddingVertical={"$2"}
    >
      <TouchableOpacity onPress={onNavigate}>
        <Avatar circular>
          <Avatar.Image source={{ uri: post.user.image }} />
          <Avatar.Fallback backgroundColor={"blue"} />
        </Avatar>
      </TouchableOpacity>
      <YStack space="$1" flex={1} flexGrow={1}>
        <TouchableOpacity onPress={onNavigate}>
          <Text color="$gray7Light">{post.user.username}</Text>
        </TouchableOpacity>
        {!!post.content && (
          <Paragraph
            lineHeight={20}
            onTextLayout={(e) => setCanExpand(e.nativeEvent.lines.length > 2)}
            onPress={() => (canExpand ? setIsExpanded((curr) => !curr) : null)}
            color={"white"}
            numberOfLines={isExpanded ? 10 : 2}
          >
            {post.content}
          </Paragraph>
        )}
        {post.createdAt === post.updatedAt ? (
          <Text fontSize={12} color={"$gray9Light"}>
            {getTimeAgo(post.createdAt)}
          </Text>
        ) : (
          <Text fontSize={12} color={"$gray9Light"}>
            Edited {getTimeAgo(post.updatedAt)}
          </Text>
        )}
      </YStack>
    </XStack>
  );
}
