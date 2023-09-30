import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import { Formik } from "formik";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useAuth } from "../../lib/hooks";
import { Button, Form, Heading, Input, View, YStack, Text, H1 } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";

const IMAGES = [
  "https://ci.xiaohongshu.com/1000g0082qddt7oiju0005njngs208eqc1mikm3g?imageView2/2/w/format/png",
  "https://ci.xiaohongshu.com/1000g0082qddt7oiju0005njngs208eqc1mikm3g?imageView2/2/w/format/png",
  "https://ci.xiaohongshu.com/1000g0082qddt7oiju0005njngs208eqc1mikm3g?imageView2/2/w/format/png",
];

export default function LoginScreen() {
  const headerHeight = useHeaderHeight();
  const { navigate } = useNavigation();
  const { login } = useAuth();
  const schema = Yup.object().shape({
    email: Yup.string().email("Invalid email.").required("Email is required."),
    password: Yup.string().required("Password is required."),
  });

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white" }}
      edges={["bottom"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flexGrow: 1, backgroundColor: "white" }}
        contentContainerStyle={{ flex: 1 }}
        keyboardVerticalOffset={
          Platform.OS === "ios"
            ? headerHeight
            : headerHeight + (StatusBar.currentHeight ?? 0)
        }
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <YStack flex={1} px="$4" pb={"$4"}>
            <H1 color="black">Welcome back!</H1>
            <Heading pb={"$6"} fontFamily={"$body"} color={"black"}>
              Let's get you signed in.
            </Heading>
            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              validationSchema={schema}
              initialValues={{ email: "", password: "" }}
              onSubmit={({ email, password }) => login(email, password)}
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
                        id="emailAddress"
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
                        <Text paddingTop={"$1"} color={"$red10Light"}>
                          {errors.email}
                        </Text>
                      )}
                    </View>
                    <View>
                      <Input
                        id="password"
                        secureTextEntry={false}
                        placeholder="Password"
                        textContentType="password"
                        keyboardType="default"
                        onBlur={handleBlur("password")}
                        onChangeText={handleChange("password")}
                        value={values.password}
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
                    </View>
                  </YStack>
                  <YStack>
                    <TouchableOpacity
                      onPress={() => navigate("Intro", { screen: "Register" })}
                    >
                      <Text fontFamily={"$body"} color={"black"}>
                        Not a member?{" "}
                        <Text color={"#BBDB8D"} fontWeight={"400"}>
                          Create an account
                        </Text>
                      </Text>
                    </TouchableOpacity>
                    <Button
                      marginTop="$3"
                      onPress={submitForm}
                      backgroundColor={"#BBDB8D"}
                    >
                      Sign in
                    </Button>
                  </YStack>
                </Form>
              )}
            </Formik>
          </YStack>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
