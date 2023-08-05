import { useCallback } from "react";
import { View, YStack } from "tamagui";
import { Text } from "tamagui";
import { ResultsTopTabScreenProps } from "../../lib/navigation/types";
import { useQuery } from "@apollo/client";
import {
  Brand,
  BrandsDocument,
  QueryMode,
  SortOrder,
} from "../../generated/gql/graphql";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { TouchableOpacity } from "react-native";

export default function BrandResultsScreen({
  route,
  navigation,
}: ResultsTopTabScreenProps<"Brands">) {
  const { data, loading } = useQuery(BrandsDocument, {
    variables: {
      orderBy: { name: SortOrder["Asc"] },
      where: {
        name: {
          startsWith: route.params?.query,
          mode: QueryMode["Insensitive"],
        },
      },
    },
  });

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<Brand>) => (
      <TouchableOpacity
        onPress={() => navigation.navigate("Brand", { brandName: item.name })}
        style={{
          paddingVertical: 10,
          paddingHorizontal: 13,
          backgroundColor: "white",
          borderTopLeftRadius: index === 0 ? 5 : 0,
          borderTopRightRadius: index === 0 ? 5 : 0,
          borderBottomLeftRadius: index === data!.brands.length - 1 ? 5 : 0,
          borderBottomRightRadius: index === data!.brands.length - 1 ? 5 : 0,
        }}
      >
        <Text fontSize={15} fontFamily={"$span"} color={"black"}>
          {item.name}
        </Text>
      </TouchableOpacity>
    ),
    [loading]
  );

  return (
    <YStack flex={1}>
      <FlashList
        data={data?.brands as Brand[]}
        contentContainerStyle={{ padding: 13 }}
        renderItem={renderItem}
        keyExtractor={(_, idx) => idx.toString()}
        estimatedItemSize={100}
        decelerationRate="normal"
        disableIntervalMomentum={true}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View flex={1}>
            <Text fontFamily={"$body"} color={"black"}>
              No brands matching the search query were found.
            </Text>
          </View>
        }
      />
    </YStack>
  );
}
