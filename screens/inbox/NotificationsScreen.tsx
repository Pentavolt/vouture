import { NetworkStatus, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { Circle, ListItem, Spinner, Text, View, YGroup, YStack } from "tamagui";
import { GetUserDocument } from "../../generated/gql/graphql";
import { useAuth } from "../../lib/hooks";
import { InboxStackScreenProps } from "../../lib/navigation/types";
import { FlashList } from "@shopify/flash-list";

export default function NotificationsScreen({
  navigation,
}: InboxStackScreenProps<"Notifications">) {
  const { user } = useAuth();
  const { data, loading, refetch, networkStatus } = useQuery(GetUserDocument, {
    variables: { where: { id: user?.id } },
    fetchPolicy: "network-only",
  });

  if (loading || !data?.user) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Spinner />
      </View>
    );
  }

  return (
    <YStack space padding="$3" flex={1} backgroundColor={"white"}>
      <FlashList
        renderItem={() => null}
        estimatedItemSize={100}
        onRefresh={refetch}
        refreshing={networkStatus === NetworkStatus.refetch}
        data={[]}
        ListHeaderComponent={
          data.user.isPrivate ? (
            <YGroup>
              <YGroup.Item>
                <ListItem
                  pressTheme
                  fontSize={15}
                  onPress={() => navigation.navigate("Requests")}
                  icon={
                    <Circle
                      height={30}
                      width={30}
                      backgroundColor={"$red10Light"}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text padding="$1" height={"auto"}>
                        {data.user.incomingRequests.length > 10
                          ? "10+"
                          : data?.user?.incomingRequests.length}
                      </Text>
                    </Circle>
                  }
                  iconAfter={<Ionicons name="chevron-forward" size={15} />}
                >
                  Follow Requests
                </ListItem>
              </YGroup.Item>
            </YGroup>
          ) : undefined
        }
      />
    </YStack>
  );
}
