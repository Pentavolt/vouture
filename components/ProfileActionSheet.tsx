import { Sheet, XStack } from "tamagui";
import {
  CreateOneBlocklistDocument,
  DeleteOneBlocklistDocument,
  GetUserDocument,
  User,
} from "../generated/gql/graphql";
import { useMutation } from "@apollo/client";
import ActionButton from "./ActionButton";

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
        <XStack>
          {!viewedUser.blocked.some(
            (block) => block.blockerId === currentUser.id
          ) && (
            <ActionButton
              text="Block"
              iconName="eye-off"
              onPress={() =>
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
                            blocker: [
                              ...data.user.blocker,
                              content.createOneBlocklist,
                            ],
                            blocked: [
                              ...data.user.blocked,
                              content.createOneBlocklist,
                            ],
                          },
                        };
                      }
                    );
                  },
                })
              }
            />
          )}
          {viewedUser.blocked.some(
            (block) => block.blockerId === currentUser.id
          ) && (
            <ActionButton
              onPress={() =>
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
                    cache.writeQuery({
                      query: GetUserDocument,
                      variables: { where: { id: viewedUser.id } },
                      data: {
                        user: {
                          ...viewedUser,
                          blocker: viewedUser.blocked.filter(
                            (block) =>
                              block.blockedId !== viewedUser.id &&
                              block.blockerId !== currentUser.id
                          ),
                          blocked: viewedUser.blocked.filter(
                            (block) =>
                              block.blockedId !== viewedUser.id &&
                              block.blockerId !== currentUser.id
                          ),
                        },
                      },
                    });
                  },
                })
              }
              text="Unblock"
              iconName="eye"
            />
          )}
        </XStack>
      </Sheet.Frame>
    </Sheet>
  );
}
