import { Ionicons } from "@expo/vector-icons";
import { Button, Heading, YStack } from "tamagui";
import { SearchStackScreenProps } from "../../lib/navigation/types";

export default function ExploreScreen({
  navigation,
}: SearchStackScreenProps<"Explore">) {
  return (
    <YStack space flex={1} padding="$3" backgroundColor={"white"}>
      <Button
        paddingHorizontal={"$3"}
        onPress={() => navigation.navigate("Query")}
        backgroundColor={"$gray3Light"}
        pressStyle={{ backgroundColor: "$gray3Light" }}
        justifyContent="flex-start"
        icon={<Ionicons name="search" color={"black"} size={20} />}
      />
      <Heading color={"black"}>Popular brands</Heading>
    </YStack>
  );
}
