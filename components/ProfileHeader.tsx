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
  DeleteFollowDocument,
  GetUserDocument,
  User,
} from "../generated/gql/graphql";
import Badge from "./Badge";
import { useAuth } from "../lib/hooks";
import { useMutation } from "@apollo/client";
import { useRef } from "react";

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const { user: me } = useAuth();
  const [follow] = useMutation(CreateFollowDocument);
  const [unfollow] = useMutation(DeleteFollowDocument);
  const isFollowing = useRef(
    user.followers.some((follow) => follow.followerId === me?.id)
  );

  const onPress = () => {
    if (!me) return;
    if (isFollowing.current) {
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

      isFollowing.current = false;
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

      isFollowing.current = true;
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
            <Ionicons
              name={isFollowing.current ? "person-remove" : "person-add"}
            />
          }
        >
          {isFollowing.current ? "Unfollow" : "Follow"}
        </Button>
      )}
    </YStack>
  );
}
