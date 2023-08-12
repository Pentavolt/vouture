import { useMutation } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { Button, ListItem, YGroup, YStack } from "tamagui";
import { CreateOneReportDocument } from "../generated/gql/graphql";
import { useAuth } from "../lib/hooks";
import { RootStackScreenProps } from "../lib/navigation/types";
import { useToastController } from "@tamagui/toast";
import Toaster from "../components/Toaster";
import { useFocusEffect } from "@react-navigation/native";

const CATEGORIES = [
  "Harassment or Bullying",
  "Hate Speech or Discrimination",
  "Violence or Graphic Content",
  "Misinformation or Fake News",
  "Self-Harm or Suicide",
  "Spam or Scams",
  "Copyright Infringement",
  "Impersonation",
  "Privacy Violation",
  "Other",
];

export default function ReportScreen({
  route,
  navigation,
}: RootStackScreenProps<"Report">) {
  const [selectedIdx, setSelectedIdx] = useState<number>();
  const [mutate] = useMutation(CreateOneReportDocument);
  const { user } = useAuth();
  const toast = useToastController();

  useFocusEffect(
    useCallback(() => {
      return () => toast.hide();
    }, [])
  );

  const handleSubmit = () => {
    if (selectedIdx === undefined || selectedIdx === null) return;
    mutate({
      variables: {
        data: {
          reason: CATEGORIES[selectedIdx],
          post: { connect: { id: route.params.postId } },
          user: { connect: { id: user?.id } },
        },
      },
      onCompleted: () => {
        setTimeout(() => navigation.goBack(), 1000);
        toast.show("Report Submitted", {
          message: "You have successfully reported this post.",
          duration: 3000,
        });
      },
    });
  };

  return (
    <>
      <Toaster iconName="checkmark" backgroundColor={"$green4Light"} />
      <YStack
        space
        justifyContent="space-between"
        flex={1}
        width={"100%"}
        padding="$3"
      >
        <YGroup>
          {CATEGORIES.map((category, idx) => (
            <YGroup.Item key={idx}>
              <ListItem
                backgroundColor={
                  selectedIdx === idx ? "#E2676F" : "$backgroundTransparent"
                }
                fontSize={16}
                themeInverse
                fontFamily={"$span"}
                onPress={() => {
                  if (selectedIdx === idx) return setSelectedIdx(undefined);
                  return setSelectedIdx(idx);
                }}
                iconAfter={
                  <Ionicons
                    name={idx === selectedIdx ? "checkbox" : "checkbox-outline"}
                  />
                }
              >
                {category}
              </ListItem>
            </YGroup.Item>
          ))}
        </YGroup>
        <Button
          disabled={selectedIdx === undefined || selectedIdx === null}
          backgroundColor={
            selectedIdx === undefined || selectedIdx === null
              ? "$gray8Light"
              : "#E2676F"
          }
          marginBottom="$3"
          onPress={handleSubmit}
        >
          Submit
        </Button>
      </YStack>
    </>
  );
}
