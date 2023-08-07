import { Heading, Text, YStack } from "tamagui";
import { useMutation } from "@apollo/client";
import { UpdateMeDocument } from "../../generated/gql/graphql";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { COUNTRIES } from "../../lib/constants";
import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { PreferencesStackScreenProps } from "../../lib/navigation/types";
import Loading from "../../components/Loading";

export default function LocationScreen({
  navigation,
}: PreferencesStackScreenProps<"Location">) {
  const [update] = useMutation(UpdateMeDocument);
  const [mounted, setMounted] = useState<boolean>(false);

  const onTouch = (country: string) => {
    // TODO: Add location to user model.
  };

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<(typeof COUNTRIES)[0]>) => (
      <TouchableOpacity
        onPress={() => onTouch(item.name)}
        style={{
          padding: 10,
          backgroundColor: "rgb(243, 243, 243)",
          ...(index === 0
            ? { borderTopLeftRadius: 10, borderTopEndRadius: 10 }
            : undefined),
          ...(index === COUNTRIES.length - 1
            ? { borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }
            : undefined),
        }}
      >
        <Text color={"black"}>{item.name}</Text>
      </TouchableOpacity>
    ),
    []
  );

  useEffect(() => {
    // TODO: Add reverse geocoding later on.
    const unsubscribe = navigation.addListener("transitionEnd", () => {
      setMounted(true);
    });

    return unsubscribe;
  }, []);

  if (!mounted) return <Loading />;
  return (
    <YStack space padding="$3" flex={1} backgroundColor={"white"}>
      <Heading color={"black"}>Location</Heading>
      <FlashList
        data={COUNTRIES}
        estimatedItemSize={40}
        renderItem={renderItem}
      />
    </YStack>
  );
}
