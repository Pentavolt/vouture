import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useAuth } from "../../lib/hooks";
import {
  Button,
  Form,
  Heading,
  Input,
  View,
  XStack,
  YStack,
  Text,
  H1,
  ScrollView,
} from "tamagui";
import RoundedImage from "../../components/RoundedImage";

const IMAGES = [
  "https://ci.xiaohongshu.com/1000g0082qddt7oiju0005njngs208eqc1mikm3g?imageView2/2/w/format/png",
  "https://ci.xiaohongshu.com/1000g0082qddt7oiju0005njngs208eqc1mikm3g?imageView2/2/w/format/png",
  "https://ci.xiaohongshu.com/1000g0082qddt7oiju0005njngs208eqc1mikm3g?imageView2/2/w/format/png",
];

export default function LoginScreen() {
  const { navigate } = useNavigation();
  const { login } = useAuth();
  const schema = Yup.object().shape({
    email: Yup.string().email("Invalid email.").required("Email is required."),
    password: Yup.string().required("Password is required."),
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
        flex={1}
        backgroundColor={"white"}
        px="$2"
        pb="$4"
      >
        <XStack space="$2" paddingVertical="$5">
          {IMAGES.map((image, idx) => (
            <RoundedImage key={idx} offset={30 * idx} uri={image} />
          ))}
        </XStack>
        <YStack flex={1}>
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
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
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
                </KeyboardAvoidingView>
                <YStack paddingTop="$3">
                  <TouchableOpacity
                    onPress={() => navigate("Intro", { screen: "Register" })}
                  >
                    <Text fontFamily={"$body"} color={"black"}>
                      Not a member?{" "}
                      <Text color={"#FE9F10"} fontWeight={"400"}>
                        Create an account
                      </Text>
                    </Text>
                  </TouchableOpacity>
                  <Button
                    marginTop="$3"
                    onPress={submitForm}
                    backgroundColor={"#FE9F10"}
                  >
                    Sign in
                  </Button>
                </YStack>
              </Form>
            )}
          </Formik>
        </YStack>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
