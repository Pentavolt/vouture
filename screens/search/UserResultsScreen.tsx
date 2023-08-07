import { useCallback } from "react";
import { Avatar, Paragraph, View, XStack, YStack } from "tamagui";
import { Text } from "tamagui";
import { ResultsTopTabScreenProps } from "../../lib/navigation/types";
import { useQuery } from "@apollo/client";
import { QueryMode, User, UsersDocument } from "../../generated/gql/graphql";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { TouchableOpacity } from "react-native-gesture-handler";
import Loading from "../../components/Loading";

export default function UserResultsScreen({
  navigation,
  route,
}: ResultsTopTabScreenProps<"Users">) {
  const { data, loading } = useQuery(UsersDocument, {
    variables: {
      where: {
        username: {
          startsWith: route.params.query,
          mode: QueryMode["Insensitive"],
        },
      },
    },
  });

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<User>) => {
      return (
        <TouchableOpacity
          onPress={() => navigation.push("Profile", { user: item })}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 13,
            backgroundColor: "white",
            borderTopLeftRadius: index === 0 ? 5 : 0,
            borderTopRightRadius: index === 0 ? 5 : 0,
            borderBottomLeftRadius: index === data!.users.length - 1 ? 5 : 0,
            borderBottomRightRadius: index === data!.users.length - 1 ? 5 : 0,
          }}
        >
          <XStack alignItems="center" space="$2">
            <Avatar circular size={"$4"}>
              <Avatar.Image source={{ uri: item.image }} />
              <Avatar.Fallback backgroundColor={"red"} />
            </Avatar>
            <YStack>
              <Text fontFamily={"$span"} color={"black"}>
                {item.username}
              </Text>
              <Paragraph numberOfLines={1} color={"$gray7Dark"}>
                {item.posts.length} posts • {item.followers.length} followers
              </Paragraph>
            </YStack>
          </XStack>
        </TouchableOpacity>
      );
    },
    [loading]
  );

  if (loading) return <Loading />;
  return (
    <YStack
      space
      padding="$3"
      flex={1}
      minHeight={400}
      backgroundColor={"$gray3Light"}
    >
      <FlashList
        data={data?.users as User[]}
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
              No users matching the search query were found.
            </Text>
          </View>
        }
      />
    </YStack>
  );
}
