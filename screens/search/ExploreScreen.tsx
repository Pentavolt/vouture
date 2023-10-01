import { Ionicons } from "@expo/vector-icons";
import { Button, Heading, Text, View, XStack, YStack } from "tamagui";
import { SearchStackScreenProps } from "../../lib/navigation/types";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { Brand, BrandsDocument, SortOrder } from "../../generated/gql/graphql";
import { useQuery } from "@apollo/client";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExploreScreen({
  navigation,
}: SearchStackScreenProps<"Explore">) {
  const { data } = useQuery(BrandsDocument, {
    variables: {
      orderBy: { tags: { _count: SortOrder["Desc"] } },
      take: 10,
    },
  });

  const getItemColor = (index: number) => {
    if (index === 0) return "$red8Light";
    if (index === 1) return "$orange7Light";
    if (index === 2) return "$yellow6Light";
    else return "$gray3Light";
  };

  const renderItem = ({ item, index }: ListRenderItemInfo<Brand>) => (
    <XStack
      space="$2.5"
      height={60}
      width={"100%"}
      alignItems="center"
      paddingHorizontal="$2"
      onPress={() => navigation.navigate("Brand", { brandName: item.name })}
    >
      <View
        backgroundColor={getItemColor(index)}
        height={30}
        width={30}
        borderRadius={8}
        justifyContent="center"
        alignItems="center"
      >
        <Text fontSize={16} fontFamily={"$span"} color={"black"}>
          {index + 1}
        </Text>
      </View>
      <Text fontFamily={"$span"} fontSize={18} color={"black"}>
        {item.name}
      </Text>
    </XStack>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["top"]}>
      <YStack space flex={1} padding="$3" backgroundColor={"white"}>
        <Button
          paddingHorizontal={"$3"}
          onPress={() => navigation.navigate("Query")}
          backgroundColor={"$gray3Light"}
          pressStyle={{
            backgroundColor: "$gray3Light",
            borderColor: "$gray3Light",
          }}
          justifyContent="flex-start"
          icon={<Ionicons name="search" color={"black"} size={20} />}
        />
        {/* <LinearGradient
          colors={["hsl(360, 100%, 96.8%)", "#FFF"]}
          style={{ flexGrow: 1, borderRadius: 8 }}
          end={{ x: 1, y: 0.5 }}
        > */}
        <FlashList<Brand>
          renderItem={renderItem}
          ListHeaderComponent={
            <Heading color={"black"} paddingBottom="$3">
              Popular Brands
            </Heading>
          }
          showsVerticalScrollIndicator={false}
          data={data?.brands as Brand[]}
          estimatedItemSize={30}
        />
        {/* </LinearGradient> */}
      </YStack>
    </SafeAreaView>
  );
}
