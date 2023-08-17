import { useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { Circle, ListItem, ScrollView, Text, YGroup } from "tamagui";
import { GetUserDocument } from "../../generated/gql/graphql";
import { useAuth } from "../../lib/hooks";
import { InboxStackScreenProps } from "../../lib/navigation/types";
import Loading from "../../components/Loading";
import Notifications from "../../components/Notifications";
import { useLayoutEffect } from "react";

export default function NotificationsScreen({
  navigation,
}: InboxStackScreenProps<"Notifications">) {
  const { user } = useAuth();
  const { data, loading } = useQuery(GetUserDocument, {
    variables: { where: { id: user?.id } },
    fetchPolicy: "network-only",
  });

  useLayoutEffect(() => {
    if (!data?.user?.incomingRequests.length) return;
    navigation
      .getParent()
      ?.setOptions({ tabBarBadge: data?.user?.incomingRequests.length });
  }, [data]);

  if (loading || !data?.user) return <Loading />;
  return (
    <ScrollView space flex={1}>
      {data.user.isPrivate && (
        <YGroup marginHorizontal="$3" marginTop="$3">
          <YGroup.Item>
            <ListItem
              pressTheme
              themeInverse
              fontSize={15}
              onPress={() => navigation.navigate("Requests")}
              icon={
                <Circle
                  height={30}
                  width={30}
                  backgroundColor={"#E2676F"}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text padding="$1" height={"auto"}>
                    {data.user.incomingRequests.length > 10
                      ? "10+"
                      : data.user.incomingRequests.length}
                  </Text>
                </Circle>
              }
              iconAfter={<Ionicons name="chevron-forward" size={15} />}
            >
              Follow Requests
            </ListItem>
          </YGroup.Item>
        </YGroup>
      )}
      <Notifications />
    </ScrollView>
  );
}
