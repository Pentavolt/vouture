import * as Yup from "yup";
import {
  Button,
  Heading,
  Paragraph,
  Spinner,
  Text,
  TextArea,
  View,
  YStack,
} from "tamagui";
import { useMutation, useQuery } from "@apollo/client";
import { MeDocument, UpdateMeDocument } from "../../generated/gql/graphql";
import { Formik } from "formik";

export default function BiographyScreen() {
  const [update] = useMutation(UpdateMeDocument);
  const { data } = useQuery(MeDocument);
  const schema = Yup.object().shape({
    biography: Yup.string().max(
      300,
      "A biography can only be 300 characters long."
    ),
  });

  return (
    <YStack flex={1} padding={"$3"} space backgroundColor={"white"}>
      <YStack space="$3">
        <Heading color={"black"}>Biography</Heading>
        <Paragraph color={"black"}>
          Let people know who you are and make it easier for friends to find
          you.
        </Paragraph>
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          validationSchema={schema}
          initialValues={{ biography: data?.me.biography ?? "" }}
          onSubmit={async ({ biography }) => {
            await update({
              variables: { data: { biography: { set: biography } } },
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
                <TextArea
                  marginTop="$3"
                  placeholder="I am..."
                  backgroundColor={"$gray3Light"}
                  borderColor={"$gray3Light"}
                  focusStyle={{ borderColor: "$gray3Light" }}
                  color={"black"}
                  onChangeText={handleChange("biography")}
                  onBlur={handleBlur("biography")}
                  value={values.biography}
                  textAlignVertical="top"
                  minHeight={100}
                  maxLength={300}
                />
                {"biography" in errors && (
                  <Text paddingTop={"$1"} color={"$red10Light"}>
                    {errors.biography}
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
