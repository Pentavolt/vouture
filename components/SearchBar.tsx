import { Ionicons } from "@expo/vector-icons";
import { forwardRef } from "react";
import { NativeSyntheticEvent, TextInputFocusEventData } from "react-native";
import { Input, TamaguiElement, XStack } from "tamagui";

interface SearchBarProps {
  text: string;
  autoFocus?: boolean;
  onChangeText: (text: string) => void;
  onFocus: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onSubmit: () => void;
}

const SearchBar = forwardRef<TamaguiElement, SearchBarProps>(
  ({ text, autoFocus = false, onChangeText, onFocus, onSubmit }, ref) => {
    return (
      <XStack
        backgroundColor={"$gray3Light"}
        borderRadius={"$3"}
        alignItems="center"
        flex={1}
      >
        <Ionicons
          style={{ paddingHorizontal: 13 }}
          name="search"
          color={"black"}
          size={20}
        />
        <Input
          ref={ref}
          value={text}
          autoFocus={autoFocus}
          onChangeText={onChangeText}
          onFocus={onFocus}
          borderWidth={0}
          borderRadius={"$3"}
          backgroundColor={"$gray3Light"}
          padding={0}
          color={"black"}
          onSubmitEditing={onSubmit}
          flex={1}
        />
        {!!text.length && (
          <Ionicons
            style={{ paddingHorizontal: 13 }}
            name="close"
            color={"black"}
            size={20}
            onPress={() => onChangeText("")}
          />
        )}
      </XStack>
    );
  }
);

export default SearchBar;
