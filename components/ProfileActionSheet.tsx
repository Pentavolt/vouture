import { Sheet, XStack } from "tamagui";
import {
  CreateOneBlocklistDocument,
  DeleteOneBlocklistDocument,
  GetUserDocument,
  User,
} from "../generated/gql/graphql";
import { useMutation } from "@apollo/client";
import ActionButton from "./ActionButton";
import { useNavigation } from "@react-navigation/native";

interface ProfileActionSheetProps {
  open: boolean;
  currentUser: User;
  viewedUser: User;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileActionSheet({
  open,
  viewedUser,
  currentUser,
  onOpenChange,
}: ProfileActionSheetProps) {
  const [block] = useMutation(CreateOneBlocklistDocument);
  const [unblock] = useMutation(DeleteOneBlocklistDocument);
  const navigation = useNavigation();

  const handleBlock = () => {
    block({
      variables: {
        data: {
          blocked: { connect: { id: viewedUser?.id } },
          blocker: { connect: { id: currentUser.id } },
        },
      },
      update: (cache, { data: content }) => {
        cache.updateQuery(
          {
            query: GetUserDocument,
            variables: { where: { id: viewedUser.id } },
          },
          (data) => {
            if (!data?.user || !content?.createOneBlocklist) {
              return undefined;
            }

            return {
              user: {
                ...data.user,
                blocker: [...data.user.blocker, content.createOneBlocklist],
                blocked: [...data.user.blocked, content.createOneBlocklist],
              },
            };
          }
        );
      },
    });
  };

  const handleUnblock = () => {
    unblock({
      variables: {
        where: {
          block: {
            blockedId: viewedUser.id,
            blockerId: currentUser.id,
          },
        },
      },
      update: (cache) => {
        cache.updateQuery(
          {
            query: GetUserDocument,
            variables: { where: { id: viewedUser.id } },
          },
          (data) => {
            if (!data?.user) return undefined;
            return {
              user: {
                ...data.user,
                blocker: data.user.blocker.filter(
                  (block) =>
                    block.blockedId !== viewedUser.id &&
                    block.blockerId !== currentUser.id
                ),
                blocked: data.user.blocked.filter(
                  (block) =>
                    block.blockedId !== viewedUser.id &&
                    block.blockerId !== currentUser.id
                ),
              },
            };
          }
        );
      },
    });
  };

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[35]}
      dismissOnSnapToBottom
      forceRemoveScrollEnabled={open}
    >
      <Sheet.Overlay />
      <Sheet.Handle backgroundColor={"white"} />
      <Sheet.Frame backgroundColor={"white"} padding="$3">
        <XStack space>
          {!viewedUser.blocked.some(
            (block) => block.blockerId === currentUser.id
          ) && (
            <ActionButton
              text="Block"
              iconName="eye-off"
              onPress={handleBlock}
            />
          )}
          {viewedUser.blocked.some(
            (block) => block.blockerId === currentUser.id
          ) && (
            <ActionButton
              onPress={handleUnblock}
              text="Unblock"
              iconName="eye"
            />
          )}
          <ActionButton
            text="Report"
            iconName="flag"
            onPress={() => {
              onOpenChange(false);
              navigation.navigate("Report", { userId: viewedUser.id });
            }}
          />
        </XStack>
      </Sheet.Frame>
    </Sheet>
  );
}
