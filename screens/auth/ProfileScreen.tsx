import { Ionicons } from "@expo/vector-icons";
import {
  MaterialTabBar,
  MaterialTabItem,
  Tabs,
} from "react-native-collapsible-tab-view";
import { useAuth, useBottomSheetBack } from "../../lib/hooks";
import {
  HomeStackScreenProps,
  UserStackScreenProps,
} from "../../lib/navigation/types";
import { useQuery } from "@apollo/client";
import { GetUserDocument, User } from "../../generated/gql/graphql";
import { View } from "tamagui";
import ProfileHeader from "../../components/ProfileHeader";
import { useCallback, useEffect, useState } from "react";
import ProfileActionSheet from "../../components/ProfileActionSheet";
import Loading from "../../components/Loading";
import SavedPostsTab from "../../components/SavedPostsTab";
import PostsTab from "../../components/PostsTab";

export default function ProfileScreen({
  navigation,
  route,
}: UserStackScreenProps<"Profile"> | HomeStackScreenProps<"Profile">) {
  const [open, setOpen] = useState<boolean>(false);
  const { user } = useAuth();
  useBottomSheetBack(open, () => setOpen(false));

  const { data, loading } = useQuery(GetUserDocument, {
    variables: {
      where: { id: route.params ? route.params.user.id : user?.id },
    },
  });

  useEffect(() => {
    if (!data?.user || !user) return;
    if (user.id !== data.user.id) {
      navigation.setOptions({
        headerRight: () => (
          <Ionicons
            size={26}
            style={{ marginHorizontal: 12 }}
            name="ellipsis-horizontal"
            color={"black"}
            onPress={() => setOpen(true)}
          />
        ),
      });
    }
  }, [loading]);

  const renderHeader = useCallback(
    () => <ProfileHeader user={data?.user as User} />,
    [data]
  );

  if (loading || !data?.user) return <Loading />;

  const isBlocked =
    data.user.blocked.some((block) => block.blockerId === user?.id) ||
    data.user.blocker.some((block) => block.blockedId === user?.id);

  const isPrivate =
    data.user.id !== user?.id &&
    data.user.isPrivate &&
    !data.user.followers.some((follow) => follow.followerId === user?.id);

  return (
    <View flex={1}>
      <ProfileActionSheet
        open={open}
        onOpenChange={setOpen}
        currentUser={user as User}
        viewedUser={data.user as User}
      />
      <Tabs.Container
        renderHeader={renderHeader}
        headerContainerStyle={{ elevation: 0, shadowRadius: 0 }}
        renderTabBar={(props) => (
          <MaterialTabBar
            {...props}
            indicatorStyle={{ backgroundColor: "black" }}
            labelStyle={{
              fontFamily: "Satoshi Medium",
              textTransform: "capitalize",
              fontSize: 15,
            }}
            TabItemComponent={(props) => (
              <MaterialTabItem {...props} pressColor="transparent" />
            )}
          />
        )}
      >
        <Tabs.Tab name="Posts">
          <PostsTab
            userId={data.user.id}
            isBlocked={isBlocked}
            isPrivate={isPrivate}
          />
        </Tabs.Tab>
        <Tabs.Tab name="Saved">
          <SavedPostsTab
            userId={data.user.id}
            isBlocked={isBlocked}
            isPrivate={isPrivate}
          />
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  );
}
