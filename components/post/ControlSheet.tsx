import { Sheet, XStack } from "tamagui";
import ActionButton from "../ActionButton";
import { Post, UpdateOnePostDocument } from "../../generated/gql/graphql";
import { useMutation } from "@apollo/client";
import { useAuth } from "../../lib/hooks";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
  HomeStackParamList,
  UserStackParamList,
} from "../../lib/navigation/types";

interface ControlSheetProps {
  post: Post;
  open: boolean;
  onOpenChange: () => void;
}

export default function ControlSheet({
  post,
  onOpenChange,
  open,
}: ControlSheetProps) {
  const { user } = useAuth();
  const [remove] = useMutation(UpdateOnePostDocument);
  const navigation =
    useNavigation<NavigationProp<HomeStackParamList | UserStackParamList>>();

  const handleRemove = () => {
    remove({
      variables: { where: { id: post.id }, data: { isDeleted: { set: true } } },
      update: (cache) => {
        const normalizedId = cache.identify({
          id: post.id,
          __typename: "Post",
        });

        cache.evict({ id: normalizedId });
        cache.gc();
        onOpenChange();
        setTimeout(() => navigation.goBack(), 1000);
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} snapPoints={[35]}>
      <Sheet.Overlay />
      <Sheet.Handle />
      <Sheet.Frame backgroundColor={"white"} padding="$3">
        <XStack space>
          <ActionButton iconName="flag" onPress={() => null} text="Report" />
          {user?.id === post.user.id && (
            <ActionButton
              iconName="trash"
              onPress={handleRemove}
              text="Delete"
            />
          )}
        </XStack>
      </Sheet.Frame>
    </Sheet>
  );
}
