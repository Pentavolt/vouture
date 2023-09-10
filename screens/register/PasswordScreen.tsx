import * as Yup from "yup";
import { Ionicons } from "@expo/vector-icons";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { Formik } from "formik";
import {
  Button,
  Checkbox,
  Form,
  H2,
  Input,
  Label,
  Paragraph,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";
import { RegisterStackScreenProps } from "../../lib/navigation/types";
import { useRegister } from "../../lib/context";
import { useState } from "react";

export default function PasswordScreen({
  navigation,
}: RegisterStackScreenProps<"Password">) {
  const { update } = useRegister();
  const [checked, setChecked] = useState<boolean>(false);
  const headerHeight = useHeaderHeight();
  const schema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Your password needs to be at least 8 characters in length.")
      .required("Password is required."),
  });

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
            <H2 color="black">Password</H2>
            <Paragraph color={"black"}>
              Choose a secure, hard-to-guess password that includes at least 8
              letters or numbers.
            </Paragraph>
          </YStack>

          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            validationSchema={schema}
            initialValues={{ password: "" }}
            onSubmit={async ({ password }) => {
              update({ password });
              navigation.navigate("Name");
            }}
          >
            {({ handleChange, handleBlur, submitForm, errors, values }) => (
              <Form
                onSubmit={submitForm}
                minWidth={300}
                flexGrow={1}
                justifyContent="space-between"
              >
                <YStack space>
                  <View space>
                    <Input
                      id="registerPassword"
                      placeholder="Password"
                      secureTextEntry={!checked}
                      textContentType="password"
                      onBlur={handleBlur("password")}
                      onChangeText={handleChange("password")}
                      value={values.password}
                      keyboardType="default"
                      backgroundColor={"$gray3Light"}
                      borderColor={"$gray3Light"}
                      focusStyle={{ borderColor: "$gray3Light" }}
                      color={"black"}
                    />
                    {"password" in errors && (
                      <Text paddingTop={"$1"} color={"$red10Light"}>
                        {errors.password}
                      </Text>
                    )}
                    <XStack alignItems="center" space="$2">
                      <Checkbox
                        id="checkbox"
                        size={"$5"}
                        checked={checked}
                        onCheckedChange={(checked) =>
                          typeof checked.valueOf() === "string"
                            ? null
                            : setChecked(checked.valueOf() as boolean)
                        }
                        backgroundColor={"$gray3Light"}
                        borderColor={"$gray3Light"}
                        pressStyle={{
                          backgroundColor: "$gray3Light",
                          borderColor: "$gray3Light",
                        }}
                      >
                        <Checkbox.Indicator>
                          <Ionicons
                            name="checkmark"
                            size={18}
                            color={"#15191E"}
                          />
                        </Checkbox.Indicator>
                      </Checkbox>
                      <Label htmlFor="checkbox" color={"black"}>
                        Show password
                      </Label>
                    </XStack>
                  </View>
                  <Button
                    onPress={submitForm}
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
                {/* <YStack paddingTop="$3">
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Intro", { screen: "Login" })
                    }
                  >
                    <Text
                      textAlign="center"
                      fontFamily={"$body"}
                      color={"#15191E"}
                    >
                      Already have an account?
                    </Text>
                  </TouchableOpacity>
                </YStack> */}
              </Form>
            )}
          </Formik>
        </YStack>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
