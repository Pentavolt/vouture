import { Ionicons } from "@expo/vector-icons";
import { Separator, TamaguiElement, Text, XStack, YStack } from "tamagui";
import SearchBar from "../../components/SearchBar";
import { SearchStackScreenProps } from "../../lib/navigation/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { useLazyQuery } from "@apollo/client";
import {
  QueryMode,
  SortOrder,
  User,
  UsersDocument,
} from "../../generated/gql/graphql";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function QueryScreen({
  navigation,
}: SearchStackScreenProps<"Query">) {
  const ref = useRef<TamaguiElement>(null);
  const [text, setText] = useState<string>("");
  const [search, { data }] = useLazyQuery(UsersDocument);

  useEffect(() => {
    const remove = navigation.addListener("focus", () => ref.current?.focus());
    return remove;
  }, [navigation]);

  useEffect(() => {
    if (!text.length) return;
    const timer = setTimeout(
      () =>
        search({
          variables: {
            orderBy: { username: SortOrder["Asc"] },
            where: {
              username: { startsWith: text, mode: QueryMode["Insensitive"] },
            },
          },
        }),
      500
    );

    return () => clearTimeout(timer);
  }, [text]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<User>) => (
      <TouchableOpacity
        onPress={() => {
          setText(item.username);
          return navigation.navigate("Results", {
            params: { query: item.username },
            screen: "Users",
          });
        }}
      >
        <XStack
          space="$2.5"
          width={"100%"}
          alignItems="center"
          paddingVertical="$2"
        >
          <Ionicons name="search" size={20} color={"black"} />
          <Text fontSize={16} fontFamily={"$span"} color={"black"}>
            {item.username}
          </Text>
        </XStack>
      </TouchableOpacity>
    ),
    []
  );

  return (
    <YStack flex={1} padding="$3" backgroundColor={"white"} width={"100%"}>
      <XStack space="$2" alignItems="center" marginBottom="$4">
        <Ionicons
          name="chevron-back"
          color={"black"}
          size={20}
          onPress={() => navigation.goBack()}
        />
        <SearchBar
          ref={ref}
          text={text}
          autoFocus={true}
          onFocus={() => null}
          onChangeText={setText}
          onSubmit={() =>
            navigation.navigate("Results", {
              params: { query: text },
              screen: "Users",
            })
          }
        />
      </XStack>
      <FlashList
        data={data?.users as User[]}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={renderItem}
        estimatedItemSize={100}
        keyboardShouldPersistTaps={"handled"}
        ItemSeparatorComponent={() => <Separator borderColor={"$gray3Light"} />}
      />
    </YStack>
  );
}
