import { Avatar, Text, View, XStack, YStack } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { Post } from "../generated/gql/graphql";
import FastImage from "react-native-fast-image";
import { Pressable } from "react-native";

interface FeedItemProps {
  post: Post;
  column: number;
  onPress: () => void;
}

export default function FeedItem({ post, column, onPress }: FeedItemProps) {
  return (
    <Pressable onPress={onPress} style={{ flex: 1 / 2, borderRadius: 5 }}>
      <YStack
        flex={1}
        marginLeft={8}
        marginRight={column === 1 ? 8 : 0}
        marginTop={8}
        backgroundColor={"white"}
        borderRadius={5}
      >
        <FastImage
          source={{ uri: post.attachments[0].url }}
          style={{
            width: "100%",
            aspectRatio: 3 / 4,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
          }}
          resizeMode="cover"
        />
        <View padding={10} space>
          {post.content?.length && (
            <Text
              fontFamily={"$body"}
              numberOfLines={2}
              lineHeight={20}
              color={"black"}
            >
              {post.content}
            </Text>
          )}
          <XStack justifyContent="space-between">
            <XStack space="$2" alignItems="center">
              <Avatar circular size={"$1"}>
                <Avatar.Image source={{ uri: post.user.image }} />
                <Avatar.Fallback backgroundColor="$blue10" />
              </Avatar>
              <Text fontFamily={"$span"} fontSize={"$2"} color={"black"}>
                {post.user.username}
              </Text>
            </XStack>
            <XStack space="$1" alignItems="center">
              <Ionicons name="heart" />
              <Text color={"black"}>{post._count?.likes}</Text>
            </XStack>
          </XStack>
        </View>
      </YStack>
    </Pressable>
  );
}
