import * as Yup from "yup";
import {
  Button,
  Heading,
  Input,
  Paragraph,
  Spinner,
  Text,
  View,
  YStack,
} from "tamagui";
import { useMutation } from "@apollo/client";
import { UpdateMeDocument } from "../../generated/gql/graphql";
import { Formik } from "formik";

export default function UsernameScreen() {
  const [update] = useMutation(UpdateMeDocument);
  const schema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required.")
      .min(3, "A username needs to be at least 3 characters long."),
  });

  return (
    <YStack flex={1} padding={"$3"} space backgroundColor={"white"}>
      <YStack space="$3">
        <Heading color={"black"}>Username</Heading>
        <Paragraph color={"black"}>
          Your username will be used by others when searching for your profile -
          it doesn't need to be unique.
        </Paragraph>
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          validationSchema={schema}
          initialValues={{ username: "" }}
          onSubmit={async ({ username }) => {
            await update({
              variables: { data: { username: { set: username } } },
            });
          }}
        >
          {({
            handleChange,
            handleBlur,
            submitForm,
            isSubmitting,
            errors,
            values,
          }) => (
            <>
              <View>
                <Input
                  marginTop="$3"
                  placeholder="New username"
                  backgroundColor={"$gray3Light"}
                  borderColor={"$gray3Light"}
                  focusStyle={{ borderColor: "$gray3Light" }}
                  color={"black"}
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  value={values.username}
                />
                {"username" in errors && (
                  <Text paddingTop={"$1"} color={"$red10Light"}>
                    {errors.username}
                  </Text>
                )}
              </View>
              <Button
                icon={isSubmitting ? <Spinner /> : null}
                disabled={isSubmitting}
                marginTop="$3"
                onPress={submitForm}
                backgroundColor={"#BBDB8D"}
                color={"#15191E"}
                pressStyle={{
                  backgroundColor: "#CFEBA5",
                  borderColor: "#CFEBA5",
                }}
              >
                Save
              </Button>
            </>
          )}
        </Formik>
      </YStack>
    </YStack>
  );
}
