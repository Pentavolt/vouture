import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../lib/hooks";
import {
  Button,
  Form,
  H1,
  Heading,
  Input,
  ScrollView,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Formik } from "formik";
import RoundedImage from "../../components/RoundedImage";

const IMAGES = [
  "https://ci.xiaohongshu.com/1000g0082qddt7oiju0005njngs208eqc1mikm3g?imageView2/2/w/format/png",
  "https://ci.xiaohongshu.com/1000g0082qddt7oiju0005njngs208eqc1mikm3g?imageView2/2/w/format/png",
  "https://ci.xiaohongshu.com/1000g0082qddt7oiju0005njngs208eqc1mikm3g?imageView2/2/w/format/png",
];

export default function RegisterScreen() {
  const { navigate } = useNavigation();
  const { register } = useAuth();
  const schema = Yup.object().shape({
    username: Yup.string().required("Username is required."),
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
          <H1 color="black">Create account</H1>
          <Heading pb={"$6"} fontFamily={"$body"} color={"black"}>
            The fashion of the world - at your fingertips.
          </Heading>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            validationSchema={schema}
            initialValues={{ email: "", username: "", password: "" }}
            onSubmit={async ({ email, username, password }) =>
              await register(email, username, password)
            }
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
                        <Text paddingTop={"$1"} color={"$red10Light"}>
                          {errors.email}
                        </Text>
                      )}
                    </View>
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
                    <View>
                      <Input
                        id="registerPassword"
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
                    onPress={() => navigate("Intro", { screen: "Login" })}
                  >
                    <Text fontFamily={"$body"} color={"black"}>
                      Already have an account?{" "}
                      <Text color={"#FE9F10"} fontWeight={"400"}>
                        Sign in
                      </Text>
                    </Text>
                  </TouchableOpacity>
                  <Button
                    marginTop="$3"
                    onPress={submitForm}
                    backgroundColor={"#FE9F10"}
                  >
                    Sign up
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
