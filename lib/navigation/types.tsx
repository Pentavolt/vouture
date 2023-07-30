import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import type { StackScreenProps } from "@react-navigation/stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Post, Tag, User } from "../../generated/gql/graphql";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList>;
  Intro: NavigatorScreenParams<IntroStackParamList>;
  Create: NavigatorScreenParams<CameraStackParamList>;
  Preferences: NavigatorScreenParams<PreferencesStackParamList>;
};

export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  User: NavigatorScreenParams<UserStackParamList>;
  Media: undefined;
};

export type IntroStackParamList = {
  Front: undefined;
  Login: undefined;
  Register: undefined;
};

export type CameraStackParamList = {
  Camera: undefined;
  Labeling: { photo: string };
  Preview: {
    photo: string;
    tags: Omit<Tag, "id" | "post" | "postId" | "createdAt">[];
  };
};

export type HomeStackParamList = {
  Feed: NavigatorScreenParams<FeedTopTabParamList>;
  Profile: { user: User };
  Details: { post: Post };
};

export type UserStackParamList = {
  Profile: { user: User };
  Details: { post: Post };
};

export type PreferencesStackParamList = {
  Settings: undefined;
  ProfileSettings: undefined;
  Username: undefined;
  Biography: undefined;
  Location: undefined;
  Privacy: undefined;
  Blocklist: undefined;
};

export type FeedTopTabParamList = {
  Discover: undefined;
  Following: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type IntroStackScreenProps<T extends keyof IntroStackParamList> =
  CompositeScreenProps<
    StackScreenProps<IntroStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type CameraStackScreenProps<T extends keyof CameraStackParamList> =
  CompositeScreenProps<
    StackScreenProps<CameraStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  CompositeScreenProps<
    StackScreenProps<HomeStackParamList, T>,
    CompositeScreenProps<
      BottomTabScreenProps<RootTabParamList, "Home">,
      RootStackScreenProps<keyof RootStackParamList>
    >
  >;

export type UserStackScreenProps<T extends keyof UserStackParamList> =
  CompositeScreenProps<
    StackScreenProps<UserStackParamList, T>,
    CompositeScreenProps<
      BottomTabScreenProps<RootTabParamList, "User">,
      RootStackScreenProps<keyof RootStackParamList>
    >
  >;

export type PreferencesStackScreenProps<
  T extends keyof PreferencesStackParamList
> = CompositeScreenProps<
  StackScreenProps<PreferencesStackParamList, T>,
  CompositeScreenProps<
    StackScreenProps<UserStackParamList>,
    CompositeScreenProps<
      BottomTabScreenProps<RootTabParamList, "User">,
      RootStackScreenProps<keyof RootStackParamList>
    >
  >
>;

export type RootTabScreenProps<T extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type FeedTopTabScreenProps<T extends keyof FeedTopTabParamList> =
  CompositeScreenProps<
    MaterialTopTabScreenProps<FeedTopTabParamList, T>,
    HomeStackScreenProps<"Feed">
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
