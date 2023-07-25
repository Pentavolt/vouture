import { Pressable } from "react-native";
import { View } from "tamagui";
import FastImage from "react-native-fast-image";
import { Post } from "../../generated/gql/graphql";

interface PostPreviewProps {
  post: Post;
  onNavigate: () => void;
}

export default function PostPreview({ post, onNavigate }: PostPreviewProps) {
  return (
    <View height={200}>
      <Pressable onPress={onNavigate}>
        <FastImage
          source={{ uri: post.attachments[0].url }}
          style={{ width: "100%", aspectRatio: 3 / 5 }}
          resizeMode="cover"
        />
      </Pressable>
    </View>
  );
}
