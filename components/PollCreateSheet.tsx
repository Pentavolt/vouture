import { Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import {
  Button,
  Heading,
  Input,
  Paragraph,
  Sheet,
  View,
  YStack,
} from "tamagui";
import { useEffect, useState } from "react";
import { useBottomSheetBack } from "../lib/hooks";
import { onChange } from "react-native-reanimated";

interface PollCreateSheetProps {
  open: boolean;
  onClose: (title: string) => void;
}

export default function PollCreateSheet({
  open,
  onClose,
}: PollCreateSheetProps) {
  const [title, setTitle] = useState<string>("");
  const [snapIndex, setSnapIndex] = useState<number>(0);

  useBottomSheetBack(open, () => onClose(title));
  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () => setSnapIndex(1));
    Keyboard.addListener("keyboardDidHide", () => setSnapIndex(0));
    return () => {
      Keyboard.removeAllListeners("keyboardDidShow");
      Keyboard.removeAllListeners("keyboardDidHide");
    };
  }, []);

  return (
    <Sheet
      modal={false}
      open={open}
      dismissOnSnapToBottom
      dismissOnOverlayPress
      snapPoints={[35, 80]}
      position={snapIndex}
      onOpenChange={() => {
        Keyboard.dismiss();
        onClose(title);
      }}
    >
      <Sheet.Overlay />
      <Sheet.Handle backgroundColor={"white"} />
      <Sheet.Frame backgroundColor={"white"}>
        <YStack space height={"100%"} padding="$3" flexGrow={1}>
          <Heading color={"black"}>Create Poll</Heading>
          <Paragraph color={"black"}>
            Polls are a great way for you to get a second opinion on e.g. what
            shirt to wear. Write a poll question and users will be able to vote
            on the photos that you have posted.
          </Paragraph>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <YStack space>
              <Input
                placeholder="Add a poll question..."
                onChangeText={setTitle}
                backgroundColor={"$gray3Light"}
                borderColor={"$gray3Light"}
                focusStyle={{ borderColor: "$gray3Light" }}
                color={"black"}
              />
              <Button
                onPress={() => {
                  Keyboard.dismiss();
                  setTimeout(() => onClose(title), 500);
                }}
              >
                Create Poll
              </Button>
            </YStack>
          </KeyboardAvoidingView>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
