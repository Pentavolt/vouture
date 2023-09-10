import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { Button, Form, H2, Paragraph, Text, View, YStack } from "tamagui";
import { useRegister } from "../../lib/context";
import { useState } from "react";
import DatePicker from "react-native-date-picker";
import { RegisterStackScreenProps } from "../../lib/navigation/types";
import dayjs from "dayjs";

export default function BirthdayScreen({
  navigation,
}: RegisterStackScreenProps<"Birthday">) {
  const { update } = useRegister();
  const [date, setDate] = useState<Date>(new Date());
  const [show, setShow] = useState<boolean>(false);
  const headerHeight = useHeaderHeight();

  const handleSubmit = () => {
    const age = dayjs(new Date(Date.now())).diff(date, "years");
    if (age < 13) return; // TODO: Add persistent blocking.
    update({ birthday: date });
    navigation.navigate("Email");
  };

  return (
    <KeyboardAvoidingView
      style={{ flexGrow: 1, backgroundColor: "white" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={
        Platform.OS === "ios"
          ? headerHeight
          : headerHeight + (StatusBar.currentHeight ?? 0)
      }
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <YStack space flex={1} paddingHorizontal="$4" pb={"$4"}>
          <YStack space="$2.5">
            <H2 color="black">When is your birthday?</H2>
            <Paragraph color={"black"}>
              We're only asking this information to make sure you're old enough
              to use the app.
            </Paragraph>
          </YStack>
          <Form
            onSubmit={() => null}
            minWidth={300}
            flexGrow={1}
            justifyContent="space-between"
          >
            <YStack space>
              <DatePicker
                modal
                date={date}
                mode="date"
                open={show}
                onConfirm={(date) => {
                  update({ birthday: date });
                  setDate(date);
                  setShow(false);
                }}
                onCancel={() => setShow(false)}
              />
              <View space>
                <View
                  paddingHorizontal="$3"
                  paddingVertical="$4"
                  backgroundColor={"$gray3Light"}
                  width={"100%"}
                  borderRadius={"$3"}
                >
                  <Text
                    onPress={() => setShow(true)}
                    color={"black"}
                    fontSize={16}
                    fontFamily={"$span"}
                  >
                    {date.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                      day: "numeric",
                    })}
                  </Text>
                </View>
              </View>
              <Button
                onPress={handleSubmit}
                backgroundColor={"#BBDB8D"}
                color={"#15191E"}
                fontFamily={"$body"}
                pressStyle={{
                  backgroundColor: "#CFEBA5",
                  borderColor: "#CFEBA5",
                }}
              >
                Next
              </Button>
            </YStack>
          </Form>
        </YStack>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
