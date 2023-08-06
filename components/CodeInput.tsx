import { useEffect, useRef } from "react";
import { Input, TamaguiElement, XStack, YStack } from "tamagui";

interface CodeInputProps {
  code: string[];
  maximumLength: number;
  onCodeChange: (code: string, index: number) => void;
}

export default function CodeInput({
  code,
  onCodeChange,
  maximumLength,
}: CodeInputProps) {
  const refs = useRef<Array<TamaguiElement | null>>([]);

  useEffect(() => {
    if (code.length === 0) refs.current[0]?.focus();
  }, [code]);

  const handleKeyPress = (index: number, key: string) => {
    if (key === "Backspace") {
      if (index > 0 && !code[index]) {
        onCodeChange("", index);
        onCodeChange("", index - 1);
        refs.current[index - 1]?.focus();
      }
    }
  };

  const renderInputs = () => {
    return new Array(maximumLength).fill(0).map((_, idx) => {
      const value = code[idx] || "";
      return (
        <Input
          key={idx}
          autoFocus={idx === 0}
          ref={(element) => (refs.current[idx] = element)}
          value={value.toString()}
          backgroundColor={"$gray3Light"}
          borderColor={"$gray3Light"}
          color={"black"}
          fontFamily={"$span"}
          focusStyle={{ borderColor: "$gray3Light" }}
          flex={1}
          textAlign="center"
          maxLength={1}
          returnKeyType="done"
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          onKeyPress={(e) => handleKeyPress(idx, e.nativeEvent.key)}
          onChangeText={(text) => {
            onCodeChange(text, idx);
            if (text.length === 1) refs.current[idx + 1]?.focus();
          }}
        />
      );
    });
  };

  return <XStack space="$2">{renderInputs()}</XStack>;
}
