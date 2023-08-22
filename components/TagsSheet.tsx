import { Ionicons } from "@expo/vector-icons";
import { Keyboard, TouchableOpacity } from "react-native";
import {
  Button,
  Heading,
  Input,
  Separator,
  Sheet,
  View,
  XStack,
  YStack,
} from "tamagui";
import { QueryMode, Topic, TopicsDocument } from "../generated/gql/graphql";
import { useDebouncedCallback } from "use-debounce";
import { useQuery } from "@apollo/client";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { useState } from "react";
import { useBottomSheetBack } from "../lib/hooks";

interface TagsSheetProps {
  open: boolean;
  onClose: (topicNames: string[]) => void;
}

export default function TagsSheet({ open, onClose }: TagsSheetProps) {
  const { data, refetch } = useQuery(TopicsDocument);
  const [topicNames, setTopicNames] = useState<string[]>([]);

  useBottomSheetBack(open, () => onClose(topicNames));
  const debounce = useDebouncedCallback(
    (value: string) =>
      refetch({
        where: {
          name: { startsWith: value, mode: QueryMode["Insensitive"] },
        },
      }),
    1000
  );

  const renderItem = ({ item }: ListRenderItemInfo<Topic>) => (
    <TouchableOpacity
      style={{ height: 50 }}
      onPress={() => {
        setTopicNames((curr) =>
          curr.length >= 10 ? curr : [item.name, ...curr]
        );
      }}
    >
      <Heading color={"black"}>{item.name}</Heading>
    </TouchableOpacity>
  );

  return (
    <Sheet
      modal
      open={open}
      dismissOnSnapToBottom
      dismissOnOverlayPress
      snapPoints={[90]}
      onOpenChange={() => {
        Keyboard.dismiss();
        onClose(topicNames);
      }}
    >
      <Sheet.Overlay />
      <Sheet.Handle backgroundColor={"white"} />
      <Sheet.Frame flex={1} backgroundColor={"white"}>
        <YStack space padding="$3" flex={1}>
          <Input
            placeholder="Streetwear"
            onChangeText={debounce}
            backgroundColor={"$gray3Light"}
            borderColor={"$gray3Light"}
            focusStyle={{ borderColor: "$gray3Light" }}
            color={"black"}
          />
          <XStack space="$1" flexWrap="wrap">
            {topicNames.map((topicName, idx) => (
              <Button
                marginBottom={"$1"}
                key={idx}
                size={"$2"}
                onPress={() =>
                  setTopicNames((curr) =>
                    curr.filter((_, index) => index !== idx)
                  )
                }
                iconAfter={<Ionicons size={10} name="close" color={"white"} />}
                color={"black"}
                textProps={{
                  color: "white",
                  numberOfLines: 1,
                }}
              >
                {topicName}
              </Button>
            ))}
          </XStack>
          <Separator borderWidth={1.5} borderColor={"$gray3Light"} />
          <View flexGrow={1} minHeight={200}>
            <FlashList<Topic>
              data={data?.topics as Topic[]}
              estimatedItemSize={50}
              renderItem={renderItem}
              keyExtractor={(_, idx) => idx.toString()}
            />
          </View>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
