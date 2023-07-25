import { Input, Text, View, YStack } from "tamagui";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { NativeSyntheticEvent, TextInputKeyPressEventData } from "react-native";

interface TopicInputProps {
  onChange: (name: string) => void;
  onAdd: (name: string) => void;
  onRemove: () => void;
}

export default function TopicInput({
  onAdd,
  onRemove,
  onChange,
}: TopicInputProps) {
  const [text, setText] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const debounce = useDebouncedCallback(onChange, 1000);

  const onKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    // Counter is needed because onKeyPress does not fire before onChangeText.
    if (text.length === 0 && count !== 1) setCount((curr) => curr + 1);
    else if (text.length !== 0) setCount(0);

    if (e.nativeEvent.key === "Backspace" && count === 1) {
      onRemove();
      setText("");
    }

    if (e.nativeEvent.key === " ") {
      if (!text.trim().length) return;
      onAdd(
        text
          .trim()
          .replaceAll(/[^a-zA-Z0-9]/g, "")
          .toLowerCase()
      );
      setText("");
      setCount(1);
    }
  };

  return (
    <YStack flex={1} minWidth={"10%"}>
      <Input
        placeholder="Add topics..."
        paddingHorizontal={"$1"}
        color={"black"}
        borderWidth={0}
        backgroundColor={"$backgroundTransparent"}
        autoComplete="off"
        autoCorrect={false}
        autoCapitalize="none"
        value={text}
        maxLength={25}
        onKeyPress={onKeyPress}
        onChangeText={(value) => {
          // Flicker on value change is a known issue.
          // https://github.com/facebook/react-native/issues/23578
          if (value === text) return;
          setText(value);
          debounce(value);
        }}
      />
    </YStack>
  );
}
