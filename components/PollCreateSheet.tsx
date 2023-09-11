import { Keyboard, Platform } from "react-native";
import { Button, Heading, Input, Paragraph, Sheet, YStack } from "tamagui";
import { useEffect, useState } from "react";
import { useBottomSheetBack } from "../lib/hooks";

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
    if (Platform.OS === "ios") {
      Keyboard.addListener("keyboardWillShow", () => setSnapIndex(1));
      Keyboard.addListener("keyboardWillHide", () => setSnapIndex(0));
    } else {
      Keyboard.addListener("keyboardDidShow", () => setSnapIndex(1));
      Keyboard.addListener("keyboardDidHide", () => setSnapIndex(0));
    }

    return () => {
      Keyboard.removeAllListeners("keyboardWillShow");
      Keyboard.removeAllListeners("keyboardWillHide");
      Keyboard.removeAllListeners("keyboardDidShow");
      Keyboard.removeAllListeners("keyboardDidHide");
    };
  }, []);

  return (
    <Sheet
      modal
      open={open}
      dismissOnSnapToBottom
      dismissOnOverlayPress
      snapPoints={[35, 75]}
      position={snapIndex}
      onOpenChange={() => {
        Keyboard.dismiss();
        onClose(title);
      }}
    >
      <Sheet.Overlay />
      <Sheet.Handle backgroundColor={"white"} />
      <Sheet.Frame backgroundColor={"white"} zIndex={999}>
        <YStack space height={"100%"} padding="$3" flexGrow={1}>
          <Heading color={"black"}>Create Poll</Heading>
          <Paragraph color={"black"}>
            Polls are a great way for you to get a second opinion on e.g. what
            shirt to wear. Write a poll question and users will be able to vote
            on the photos that you have posted.
          </Paragraph>
          <YStack space flexGrow={1}>
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
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
