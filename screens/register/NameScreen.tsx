import * as Yup from "yup";
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
  Form,
  H2,
  Input,
  Label,
  Paragraph,
  Text,
  View,
  YStack,
} from "tamagui";
import { useRegister } from "../../lib/context";
import { useAuth } from "../../lib/hooks";

export default function NameScreen() {
  const { data, update } = useRegister();
  const { register } = useAuth();
  const headerHeight = useHeaderHeight();
  const schema = Yup.object().shape({
    username: Yup.string()
      .min(2, "Usernames need to be at least 2 characters.")
      .required("Username is required."),
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
            <H2 color="black">What should we call you?</H2>
            <Paragraph color={"black"}>
              Don't worry, this can be changed later.
            </Paragraph>
          </YStack>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            validationSchema={schema}
            initialValues={{ username: "" }}
            onSubmit={async ({ username }) => {
              update({ username });
              if (data && data.email && data.password && data.birthday) {
                register(data.email, username, data.password);
              }
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
                  <View>
                    <Input
                      id="registerUsername"
                      placeholder="Username"
                      textContentType="username"
                      onBlur={handleBlur("username")}
                      onChangeText={handleChange("username")}
                      value={values.username}
                      keyboardType="default"
                      backgroundColor={"$gray3Light"}
                      borderColor={"$gray3Light"}
                      focusStyle={{ borderColor: "$gray3Light" }}
                      color={"black"}
                    />
                    {"username" in errors && (
                      <Text paddingTop={"$1"} color={"$red10Light"}>
                        {errors.username}
                      </Text>
                    )}
                  </View>
                </YStack>
                <YStack space="$3">
                  <Label
                    color={"#55667b"}
                    pressStyle={{ color: "#55667b" }}
                    lineHeight={20}
                  >
                    By registering an account, you acknowledge that you have
                    read and agree to our Terms of Service and Privacy Policy.
                  </Label>
                  <Button
                    onPress={submitForm}
                    backgroundColor={"#BBDB8D"}
                    color={"#15191E"}
                    fontFamily={"$span"}
                    pressStyle={{
                      backgroundColor: "#CFEBA5",
                      borderColor: "#CFEBA5",
                    }}
                  >
                    Register
                  </Button>
                </YStack>
              </Form>
            )}
          </Formik>
        </YStack>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
