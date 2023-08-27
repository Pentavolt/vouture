import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useRef, useState } from "react";
import {
  Button,
  Input,
  Separator,
  Sheet,
  Spinner,
  Text,
  XStack,
  YStack,
} from "tamagui";
import { Comment, Post, User } from "../../generated/gql/graphql";
import { useAuth } from "../../lib/hooks";
import CommentItem from "./CommentItem";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CommentSheetProps {
  post: Post;
  open: boolean;
  onClose: () => void;
  onComment: (text: string) => Promise<void>;
}

export default function CommentSheet({
  post,
  open,
  onClose,
  onComment,
}: CommentSheetProps) {
  const ref = useRef<FlashList<Comment>>(null);
  const { user } = useAuth();
  const { bottom } = useSafeAreaInsets();
  const [text, setText] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);

  const renderItem = useCallback(
    ({ item }: { item: Comment }) => (
      <CommentItem user={user as User} comment={item} />
    ),
    []
  );

  return (
    <Sheet
      modal
      open={open}
      snapPoints={[90]}
      dismissOnSnapToBottom
      onOpenChange={onClose}
    >
      <Sheet.Handle />
      <Sheet.Overlay />
      <Sheet.Frame flex={1}>
        <YStack space padding="$3" flex={1}>
          <FlashList<Comment>
            ref={ref}
            data={post.comments}
            renderScrollComponent={ScrollView}
            estimatedItemSize={100}
            renderItem={renderItem}
            keyExtractor={(comment) => comment.id.toString()}
          />
          <Separator />
          <KeyboardAvoidingView
            contentContainerStyle={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={
              Platform.OS === "ios" ? bottom + 44 * 2 : undefined
            }
          >
            {post.isCommentable ? (
              <XStack space flexGrow={1}>
                <Input
                  size="$4"
                  borderWidth={2}
                  flex={2}
                  value={text}
                  onChangeText={(value) => setText(value)}
                />
                <Button
                  disabled={text.length ? false : true} // TODO: Add disabled button style
                  icon={disabled ? <Spinner /> : <Ionicons name="send" />} // Note: This causes a slight change in width.
                  onPress={async () => {
                    if (disabled) return;
                    setDisabled(true);
                    setText("");
                    // Awaiting this is slow but necessary for scrollToEnd() to work.
                    await onComment(text);
                    if (post.comments.length) {
                      // Not a great solution, but works for now.
                      setTimeout(
                        () => ref.current?.scrollToEnd({ animated: true }),
                        100
                      );
                    }

                    setDisabled(false);
                  }}
                >
                  Post
                </Button>
              </XStack>
            ) : (
              <Text textAlign="center">Comments have been disabled.</Text>
            )}
          </KeyboardAvoidingView>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
