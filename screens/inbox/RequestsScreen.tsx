import { Ionicons } from "@expo/vector-icons";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { useCallback } from "react";
import UserListItem from "../../components/UserListItem";
import { NetworkStatus, useMutation, useQuery } from "@apollo/client";
import {
  CreateFollowDocument,
  DeleteOneFollowRequestDocument,
  FollowRequest,
  FollowRequestsDocument,
  GetUserDocument,
} from "../../generated/gql/graphql";
import { useAuth } from "../../lib/hooks";
import { Paragraph, View, XStack, YStack } from "tamagui";
import { TouchableOpacity } from "react-native";
import Loading from "../../components/Loading";

export default function RequestsScreen() {
  const [approve] = useMutation(CreateFollowDocument);
  const [remove] = useMutation(DeleteOneFollowRequestDocument);
  const { user } = useAuth();
  const { data, loading, refetch, networkStatus } = useQuery(
    FollowRequestsDocument,
    {
      variables: { where: { targetId: { equals: user?.id } } },
      fetchPolicy: "cache-and-network",
    }
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<FollowRequest>) => (
      <UserListItem
        user={item.requester}
        onPress={() => null}
        subtitle={
          `Requested on ` + `${new Date(item.createdAt).toLocaleDateString()}`
        }
      >
        <XStack space="$2.5">
          <TouchableOpacity
            onPress={() =>
              approve({
                variables: {
                  data: {
                    follower: { connect: { id: item.requesterId } },
                    following: { connect: { id: item.targetId } },
                  },
                },
                onCompleted: () => {
                  remove({
                    variables: { where: { id: item.id } },
                    update: (cache) => {
                      cache.updateQuery(
                        {
                          query: FollowRequestsDocument,
                          variables: {
                            where: { targetId: { equals: user?.id } },
                          },
                        },
                        (cached) => {
                          if (!cached) return undefined;
                          return {
                            followRequests: cached.followRequests.filter(
                              (request) => request.id !== item.id
                            ),
                          };
                        }
                      );

                      cache.updateQuery(
                        {
                          query: GetUserDocument,
                          variables: {
                            where: { id: user?.id },
                          },
                        },
                        (cached) => {
                          if (!cached?.user) return undefined;
                          return {
                            user: {
                              ...cached.user,
                              incomingRequests:
                                cached.user.incomingRequests.filter(
                                  (request) => request.id !== item.id
                                ),
                            },
                          };
                        }
                      );
                    },
                  });
                },
              })
            }
            style={{
              backgroundColor: "green",
              padding: 10,
              borderRadius: 100,
            }}
          >
            <Ionicons name="checkmark" size={15} color={"white"} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              remove({
                variables: { where: { id: item.id } },
                update: (cache) => {
                  cache.updateQuery(
                    {
                      query: FollowRequestsDocument,
                      variables: { where: { targetId: { equals: user?.id } } },
                    },
                    (cached) => {
                      if (!cached) return undefined;
                      return {
                        followRequests: cached.followRequests.filter(
                          (request) => request.id !== item.id
                        ),
                      };
                    }
                  );

                  cache.updateQuery(
                    {
                      query: GetUserDocument,
                      variables: {
                        where: { id: user?.id },
                      },
                    },
                    (cached) => {
                      if (!cached?.user) return undefined;
                      return {
                        user: {
                          ...cached.user,
                          incomingRequests: cached.user.incomingRequests.filter(
                            (request) => request.id !== item.id
                          ),
                        },
                      };
                    }
                  );
                },
              })
            }
            style={{ backgroundColor: "red", padding: 10, borderRadius: 100 }}
          >
            <Ionicons name="close" size={15} color={"white"} />
          </TouchableOpacity>
        </XStack>
      </UserListItem>
    ),
    []
  );

  if (loading || !data?.followRequests) return <Loading />;
  if (!data.followRequests.length) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <YStack
          space
          paddingVertical={"$12"} // Not ideal, but necessary since FlashList does not support flexGrow: 1 in contentContainerStyle.
          paddingHorizontal={"$7"}
          alignItems="center"
          justifyContent="center"
        >
          <Ionicons name="checkmark" size={40} />
          <Paragraph
            fontFamily={"$span"}
            color={"$gray7Dark"}
            textAlign="center"
          >
            You have no follow requests at the moment.
          </Paragraph>
        </YStack>
      </View>
    );
  }

  return (
    <YStack space padding="$3" flex={1} backgroundColor={"white"}>
      <FlashList
        onRefresh={refetch}
        refreshing={networkStatus === NetworkStatus.refetch}
        renderItem={renderItem}
        data={data.followRequests as FollowRequest[]}
        estimatedItemSize={60}
        keyExtractor={(_, idx) => idx.toString()}
      />
    </YStack>
  );
}
