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
  Paragraph,
  Text,
  View,
  YStack,
} from "tamagui";
import { RegisterStackScreenProps } from "../../lib/navigation/types";
import { useRegister } from "../../lib/context";
import { client } from "../../lib/apollo";
import { GetUserDocument } from "../../generated/gql/graphql";

export default function EmailScreen({
  navigation,
}: RegisterStackScreenProps<"Email">) {
  const { update } = useRegister();
  const headerHeight = useHeaderHeight();
  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email.")
      .required("Email is required.")
      .test(
        "dupicate",
        "An account with this email already exists.",
        (value) => {
          return new Promise((resolve) =>
            client
              .query({
                query: GetUserDocument,
                variables: { where: { email: value.toLowerCase() } },
              })
              .then(({ data }) => resolve(!data.user))
          );
        }
      ),
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
            <H2 color="black">What's your email?</H2>
            <Paragraph color={"black"}>
              Your email will not be displayed on your profile.
            </Paragraph>
          </YStack>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            validationSchema={schema}
            initialValues={{ email: "" }}
            onSubmit={async ({ email }) => {
              update({ email: email.toLowerCase() });
              navigation.navigate("Password");
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
                      id="registerEmailAddress"
                      placeholder="Email"
                      textContentType="emailAddress"
                      onBlur={handleBlur("email")}
                      onChangeText={handleChange("email")}
                      value={values.email}
                      keyboardType="email-address"
                      backgroundColor={"$gray3Light"}
                      borderColor={"$gray3Light"}
                      focusStyle={{ borderColor: "$gray3Light" }}
                      color={"black"}
                    />
                    {"email" in errors && (
                      <Text
                        fontFamily={"$body"}
                        paddingTop={"$1"}
                        color={"$red10Light"}
                      >
                        {errors.email}
                      </Text>
                    )}
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
              </Form>
            )}
          </Formik>
        </YStack>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
