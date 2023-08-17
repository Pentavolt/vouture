import { NetworkStatus, useQuery } from "@apollo/client";
import {
  Notification,
  NotificationsDocument,
  SortOrder,
} from "../generated/gql/graphql";
import { useAuth } from "../lib/hooks";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { View } from "tamagui";
import { useState } from "react";
import Loading from "./Loading";
import NotificationItem from "./NotificationItem";

export default function Notifications() {
  const [page, setPage] = useState<number>(1);
  const { user } = useAuth();
  const { data, loading, refetch, networkStatus, fetchMore } = useQuery(
    NotificationsDocument,
    {
      variables: {
        where: { receiverId: { equals: user?.id } },
        take: 20,
        orderBy: { createdAt: SortOrder["Desc"] },
      },
    }
  );

  const renderItem = ({ item, index }: ListRenderItemInfo<Notification>) => (
    <NotificationItem index={index} notification={item} />
  );

  if (loading || !data?.notifications) return <Loading />;
  return (
    <View minHeight={200} margin="$3">
      <FlashList<Notification>
        data={data?.notifications as Notification[]}
        estimatedItemSize={70}
        renderItem={renderItem}
        keyExtractor={(_, idx) => idx.toString()}
        onRefresh={refetch}
        refreshing={networkStatus === NetworkStatus.refetch}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          fetchMore({
            variables: { skip: 20 * page },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              setPage((curr) => curr + 1);
              return {
                notifications: [
                  ...previousResult.notifications,
                  ...fetchMoreResult.notifications,
                ],
              };
            },
          });
        }}
      />
    </View>
  );
}
