import { Avatar, H2, Paragraph, XGroup, XStack, YStack, Text } from "tamagui";
import { User } from "../generated/gql/graphql";
import Badge from "./Badge";

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
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
    </YStack>
  );
}
