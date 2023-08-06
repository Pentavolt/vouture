import { useState } from "react";
import CodeInput from "../../components/CodeInput";
import { IntroStackScreenProps } from "../../lib/navigation/types";
import { useAuth } from "../../lib/hooks";
import { useMutation } from "@apollo/client";
import {
  SendVerificationCodeDocument,
  VerifyDocument,
} from "../../generated/gql/graphql";
import { Button, H1, Paragraph, YStack } from "tamagui";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Text } from "tamagui";

export default function VerificationScreen({
  route,
}: IntroStackScreenProps<"Verification">) {
  const maxLength = 6;
  const { login } = useAuth();
  const [digits, setDigits] = useState<string[]>([]);
  const [lastSentAt, setLastSentAt] = useState<number>(Date.now());
  const [verify] = useMutation(VerifyDocument);
  const [resend] = useMutation(SendVerificationCodeDocument);

  const handleChange = (code: string, index: number) => {
    const copy = [...digits].filter((digit) => digit);
    copy.splice(index, code ? 0 : 1, code);
    setDigits(copy.filter((digit) => digit.length));
  };

  const handleSubmit = async () => {
    if (maxLength !== digits.length) return;
    verify({
      variables: {
        userId: route.params.user.id,
        code: digits.join(""),
      },
      onCompleted: (data) => {
        if (!data.verify) return setDigits([]);
        login(route.params.user.email, route.params.user.password);
      },
    });
  };

  const handleResend = () => {
    if (Date.now() - lastSentAt < 60 * 1000) return;
    resend({
      variables: { userId: route.params.user.id },
      onCompleted: () => {
        setLastSentAt(Date.now());
      },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <YStack
        space
        flex={1}
        padding="$3"
        alignItems="center"
        justifyContent="space-between"
        backgroundColor={"white"}
      >
        <YStack width={"100%"} space>
          <H1 color={"black"}>Verification Code Sent</H1>
          <Paragraph fontSize={16} color={"black"}>
            A verification code has been sent to{" "}
            <Text color={"#FE9F10"}>{route.params.user.email}</Text>.
          </Paragraph>
          <KeyboardAvoidingView
            style={{ paddingVertical: 30 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <CodeInput
              maximumLength={maxLength}
              code={digits}
              onCodeChange={handleChange}
            />
          </KeyboardAvoidingView>
        </YStack>
        <YStack width={"100%"} space paddingVertical="$2">
          <Button width={"100%"} onPress={async () => await handleSubmit()}>
            Verify
          </Button>
          <TouchableOpacity onPress={handleResend}>
            <Text fontFamily={"$body"} color={"black"}>
              Didn't receive code?{" "}
              <Text fontFamily={"$span"} color={"#FE9F10"}>
                Resend
              </Text>
            </Text>
          </TouchableOpacity>
        </YStack>
      </YStack>
    </TouchableWithoutFeedback>
  );
}
