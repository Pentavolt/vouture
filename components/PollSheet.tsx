import {
  Button,
  H2,
  Heading,
  Paragraph,
  Sheet,
  View,
  XStack,
  YStack,
} from "tamagui";
import {
  Attachment,
  CreateOneVoteDocument,
  Post,
  PostDocument,
  VotesDocument,
} from "../generated/gql/graphql";
import FastImage from "react-native-fast-image";
import { useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useMutation, useQuery } from "@apollo/client";
import Loading from "./Loading";
import { useAuth } from "../lib/hooks";

interface PollSheetProps {
  post: Post;
  open: boolean;
  onClose: () => void;
}

export default function PollSheet({ onClose, open, post }: PollSheetProps) {
  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hasVoted, setHasVoted] = useState<boolean>();
  const [disabled, setDisabled] = useState<boolean>(false);
  const [mutate] = useMutation(CreateOneVoteDocument);
  const { data, refetch, loading } = useQuery(VotesDocument, {
    variables: { where: { pollId: { equals: post.poll!.id } } },
    onCompleted: ({ votes }) => {
      setHasVoted(votes.some((vote) => vote.userId === user?.id));
      const selected = votes.find((vote) => vote.userId === user?.id);
      if (selected) {
        setActiveIndex(
          post.attachments.findIndex(
            (attachment) => attachment.id === selected.attachmentId
          )
        );
      }
    },
  });

  const handleVote = () => {
    setDisabled(true);
    const selected = post.attachments[activeIndex];
    mutate({
      variables: {
        data: {
          attachment: { connect: { id: selected.id } },
          poll: { connect: { id: post.poll?.id } },
          user: { connect: { id: user?.id } },
        },
      },
      onCompleted: () => refetch().then(() => setHasVoted(true)),
      onError: () => setDisabled(false),
      update: (cache, { data }) => {
        if (!data) return;
        cache.updateQuery(
          { query: PostDocument, variables: { where: { id: post.id } } },
          (cached) => {
            if (!cached?.post) return undefined;
            return {
              post: {
                ...cached.post,
                attachments: cached.post.attachments.map((attachment) =>
                  attachment.id === selected.id && attachment._count
                    ? {
                        ...attachment,
                        _count: {
                          ...attachment._count,
                          votes: (attachment._count?.votes ?? 0) + 1,
                        },
                      }
                    : attachment
                ),
              },
            };
          }
        );
      },
    });
  };

  const renderItem = ({ item, index }: ListRenderItemInfo<Attachment>) => (
    <TouchableOpacity
      onPress={() => (hasVoted ? console.log(index) : setActiveIndex(index))}
    >
      <FastImage
        source={{ uri: item.url }}
        resizeMode="cover"
        style={{
          height: 200,
          width: 100,
          borderRadius: 8,
        }}
      >
        <View
          height={"100%"}
          justifyContent="center"
          alignItems="center"
          backgroundColor={
            index === activeIndex
              ? "rgba(187, 219, 141, 0.4)"
              : "rgba(0, 0, 0, 0.4)"
          }
        >
          {hasVoted && (
            <H2>
              {((item._count?.votes ?? 0) / (data!.votes.length ?? 0)) * 100}%
            </H2>
          )}
        </View>
      </FastImage>
    </TouchableOpacity>
  );

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onClose}
      dismissOnSnapToBottom
      dismissOnOverlayPress
      snapPoints={Platform.OS === "ios" ? [50] : [45]}
    >
      <Sheet.Overlay />
      <Sheet.Handle backgroundColor={"white"} />
      <Sheet.Frame
        borderRadius={"$true"}
        flex={1}
        backgroundColor={"$background"}
      >
        {!data?.votes || loading ? (
          <Loading />
        ) : (
          <YStack padding="$3" space>
            <YStack space="$2">
              <Paragraph
                textTransform="uppercase"
                fontSize={12}
                color={"$gray7Light"}
              >
                A poll from {post.user.username}
              </Paragraph>
              <Heading>{post.poll?.name}</Heading>
            </YStack>
            <XStack>
              <FlatList
                contentContainerStyle={{ columnGap: 13 }}
                data={post.attachments}
                renderItem={renderItem}
                horizontal
                keyExtractor={(attachment) => attachment.id.toString()}
                showsHorizontalScrollIndicator={false}
              />
            </XStack>
            {!hasVoted && (
              <Button
                disabled={disabled}
                backgroundColor={"#FE9F10"}
                onPress={handleVote}
              >
                Vote
              </Button>
            )}
          </YStack>
        )}
      </Sheet.Frame>
    </Sheet>
  );
}
