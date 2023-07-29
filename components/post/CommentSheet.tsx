import { Ionicons } from "@expo/vector-icons";
import {
  Button,
  Input,
  Separator,
  Sheet,
  Spinner,
  XStack,
  YStack,
} from "tamagui";
import { Comment, User } from "../../generated/gql/graphql";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useRef, useState } from "react";
import CommentItem from "./CommentItem";
import { useAuth } from "../../lib/hooks";

interface CommentSheetProps {
  comments: Comment[];
  open: boolean;
  onClose: () => void;
  onComment: (text: string) => Promise<void>;
}

export default function CommentSheet({
  comments,
  open,
  onClose,
  onComment,
}: CommentSheetProps) {
  const ref = useRef<FlashList<Comment>>(null);
  const { user } = useAuth();
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
      <Sheet.Overlay opacity={0} />
      <Sheet.Frame flex={1}>
        <YStack space padding="$3" flex={1}>
          <FlashList<Comment>
            ref={ref}
            data={comments}
            estimatedItemSize={100}
            renderItem={renderItem}
            keyExtractor={(comment) => comment.id.toString()}
          />
          <Separator />
          <XStack space>
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
                if (comments.length) {
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
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
