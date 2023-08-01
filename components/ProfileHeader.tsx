import { Ionicons } from "@expo/vector-icons";
import {
  Avatar,
  H2,
  Paragraph,
  XGroup,
  XStack,
  YStack,
  Text,
  Button,
} from "tamagui";
import {
  CreateFollowDocument,
  CreateOneFollowRequestDocument,
  DeleteFollowDocument,
  DeleteOneFollowRequestDocument,
  GetUserDocument,
  User,
} from "../generated/gql/graphql";
import Badge from "./Badge";
import { useAuth } from "../lib/hooks";
import { useMutation } from "@apollo/client";

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const { user: me } = useAuth();
  const [follow] = useMutation(CreateFollowDocument);
  const [unfollow] = useMutation(DeleteFollowDocument);
  const [request] = useMutation(CreateOneFollowRequestDocument);
  const [unrequest] = useMutation(DeleteOneFollowRequestDocument);
  const isFollowing = user.followers.some(
    (follow) => follow.followerId === me?.id
  );

  const hasRequested = user.incomingRequests.some(
    (request) => request.requesterId === me?.id
  );

  const getButtonText = () => {
    if (isFollowing) return "Unfollow";
    if (hasRequested) return "Requested";
    if (user.isPrivate) return "Request";
    else return "Follow";
  };

  const onPress = async () => {
    if (!me) return;
    if (hasRequested) {
      return unrequest({
        errorPolicy: "ignore", // Poor workaround, should either use subscriptions or try to refetch the query.
        variables: {
          where: { block: { requesterId: me.id, targetId: user.id } },
        },
        update: (cache) => {
          cache.updateQuery(
            { query: GetUserDocument, variables: { where: { id: user.id } } },
            (data) => {
              if (!data?.user) return undefined;
              return {
                user: {
                  ...data.user,
                  incomingRequests: data.user.incomingRequests.filter(
                    (request) => request.requesterId !== me.id
                  ),
                },
              };
            }
          );
        },
      });
    }

    if (!isFollowing && user.isPrivate) {
      return request({
        variables: {
          data: {
            requester: { connect: { id: me.id } },
            target: { connect: { id: user.id } },
          },
        },
        update: (cache, { data }) => {
          cache.updateQuery(
            { query: GetUserDocument, variables: { where: { id: user.id } } },
            (cached) => {
              if (!cached?.user || !data) return undefined;
              return {
                user: {
                  ...cached.user,
                  incomingRequests: [
                    ...cached.user.incomingRequests,
                    data.createOneFollowRequest,
                  ],
                },
              };
            }
          );
        },
      });
    }

    if (isFollowing) {
      unfollow({
        variables: {
          where: {
            follow: {
              followerId: me.id,
              followingId: user.id,
            },
          },
        },
        update(cache) {
          // Remove follow from the target user.
          cache.updateQuery(
            { query: GetUserDocument, variables: { where: { id: user.id } } },
            (data) => {
              if (!data?.user) return undefined;
              return {
                user: {
                  ...data.user,
                  followers: data.user.followers.filter(
                    (follow) => follow.followerId !== me.id
                  ),
                },
              };
            }
          );

          // Remove following from current user.
          cache.updateQuery(
            { query: GetUserDocument, variables: { where: { id: me.id } } },
            (data) => {
              if (!data?.user) return undefined;
              return {
                user: {
                  ...data.user,
                  following: data.user.following.filter(
                    (follow) => follow.followingId !== user.id
                  ),
                },
              };
            }
          );
        },
      });
    } else {
      follow({
        variables: {
          data: {
            follower: { connect: { id: me.id } },
            following: { connect: { id: user.id } },
          },
        },
        update(cache, { data: mutation }) {
          if (!mutation) return;
          // Add follower to target user.
          cache.updateQuery(
            { query: GetUserDocument, variables: { where: { id: user.id } } },
            (data) => {
              if (!data?.user) return undefined;
              return {
                user: {
                  ...data.user,
                  followers: [...data.user.followers, mutation.createOneFollow],
                },
              };
            }
          );

          // Add follow to current user.
          cache.updateQuery(
            { query: GetUserDocument, variables: { where: { id: me.id } } },
            (data) => {
              if (!data?.user) return undefined;
              return {
                user: {
                  ...data.user,
                  following: [...data.user.following, mutation.createOneFollow],
                },
              };
            }
          );
        },
      });
    }
  };

  return (
    <YStack
      space
      backgroundColor={"white"}
      justifyContent="center"
      alignItems="center"
      paddingVertical="$5"
      paddingHorizontal={"$7"}
    >
      <Avatar circular size={"$8"}>
        <Avatar.Image source={{ uri: user.image }} />
        <Avatar.Fallback bc={"red"} />
      </Avatar>
      <YStack space={"$2"}>
        <H2 textAlign="center" color={"black"}>
          {user.username}
        </H2>
        {!!user.badges.length && (
          <XStack space={"$2"} flexWrap="wrap">
            {user.badges.map(({ badge }, idx) => (
              <Badge
                key={idx}
                name={badge.name}
                backgroundColor={"$gray2Light"}
              />
            ))}
          </XStack>
        )}
      </YStack>
      {!!user.biography?.length && (
        <Paragraph color={"black"}>{user.biography}</Paragraph>
      )}
      <XGroup
        space={"$7"}
        backgroundColor={"$gray2Light"}
        width={"100%"}
        justifyContent="center"
        padded
      >
        <XGroup.Item>
          <YStack>
            <Text textAlign="center" fontFamily={"$heading"} color="black">
              {user.posts.length}
            </Text>
            <Text fontFamily={"$body"} color="$gray9Dark">
              Outfits
            </Text>
          </YStack>
        </XGroup.Item>
        <XGroup.Item>
          <YStack>
            <Text textAlign="center" fontFamily={"$heading"} color="black">
              {user.followers.length}
            </Text>
            <Text fontFamily={"$body"} color="$gray9Dark">
              Followers
            </Text>
          </YStack>
        </XGroup.Item>
        <XGroup.Item>
          <YStack>
            <Text textAlign="center" fontFamily={"$heading"} color="black">
              {user.following.length}
            </Text>
            <Text fontFamily={"$body"} color="$gray9Dark">
              Following
            </Text>
          </YStack>
        </XGroup.Item>
      </XGroup>
      {user.id !== me?.id && (
        <Button
          onPress={onPress}
          width={"100%"}
          icon={
            <Ionicons name={isFollowing ? "person-remove" : "person-add"} />
          }
        >
          {getButtonText()}
        </Button>
      )}
    </YStack>
  );
}
