import {
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  KeyboardAvoidingViewProps,
} from "react-native";
import { ReactNode } from "react";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { ScrollView } from "tamagui";

interface KeyboardAwareScrollViewProps {
  children: ReactNode;
}

// Implementation from https://github.com/wix-incubator/react-native-keyboard-aware-scrollview/issues/60.

export default function KeyboardAwareScrollView({
  children,
}: KeyboardAwareScrollViewProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {children}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
