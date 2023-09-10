import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import type { StackScreenProps } from "@react-navigation/stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Brand, User } from "../../generated/gql/graphql";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList>;
  Intro: NavigatorScreenParams<IntroStackParamList>;
  Create: NavigatorScreenParams<CameraStackParamList>;
  Preferences: NavigatorScreenParams<PreferencesStackParamList>;
  Report: { postId: number } | { userId: number };
};

export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Search: NavigatorScreenParams<SearchStackParamList>;
  User: NavigatorScreenParams<UserStackParamList>;
  Inbox: NavigatorScreenParams<InboxStackParamList>;
  Media: undefined;
};

export type IntroStackParamList = {
  Front: undefined;
  Login: undefined;
  Register: undefined;
};

export type RegisterStackParamList = {
  Email: undefined;
  Name: undefined;
  Password: undefined;
  Birthday: undefined;
};

export type CameraStackParamList = {
  Camera: undefined;
  Labeling: { photos: Array<{ uri: string; height: number; width: number }> };
  Preview: {
    photos: Array<{ uri: string; height: number; width: number }>;
    tags: Array<
      Array<{
        id: string;
        brand: Brand;
        brandId: number;
        relX: number;
        relY: number;
      }>
    >;
  };
};

export type HomeStackParamList = {
  Feed: NavigatorScreenParams<FeedTopTabParamList>;
  Profile: { user: User };
  Details: { postId: number };
};

export type UserStackParamList = {
  Profile: { user: User };
  Details: { postId: number };
};

export type PreferencesStackParamList = {
  Settings: undefined;
  ProfileSettings: undefined;
  Username: undefined;
  Biography: undefined;
  Location: undefined;
  Privacy: undefined;
  Blocklist: undefined;
  Verification: undefined;
};

export type SearchStackParamList = {
  Explore: undefined;
  Results: NavigatorScreenParams<ResultsTopTabParamList>;
  Query: undefined;
  Profile: { user: User };
  Details: { postId: number };
  Brand: { brandName: string };
};

export type InboxStackParamList = {
  Notifications: undefined;
  Requests: undefined;
  Details: { postId: number };
};

export type FeedTopTabParamList = {
  Discover: undefined;
  Following: undefined;
};

export type ResultsTopTabParamList = {
  Users: { query: string };
  Posts: { query: string };
  Brands: { query: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type IntroStackScreenProps<T extends keyof IntroStackParamList> =
  CompositeScreenProps<
    StackScreenProps<IntroStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type RegisterStackScreenProps<T extends keyof RegisterStackParamList> =
  CompositeScreenProps<
    StackScreenProps<RegisterStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type CameraStackScreenProps<T extends keyof CameraStackParamList> =
  CompositeScreenProps<
    CompositeScreenProps<
      StackScreenProps<CameraStackParamList, T>,
      IntroStackScreenProps<"Register">
    >,
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

export type InboxStackScreenProps<T extends keyof InboxStackParamList> =
  CompositeScreenProps<
    StackScreenProps<InboxStackParamList, T>,
    CompositeScreenProps<
      BottomTabScreenProps<RootTabParamList, "Inbox">,
      RootStackScreenProps<keyof RootStackParamList>
    >
  >;

export type SearchStackScreenProps<T extends keyof SearchStackParamList> =
  CompositeScreenProps<
    StackScreenProps<SearchStackParamList, T>,
    CompositeScreenProps<
      BottomTabScreenProps<RootTabParamList, "Search">,
      RootStackScreenProps<keyof RootStackParamList>
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

export type ResultsTopTabScreenProps<T extends keyof ResultsTopTabParamList> =
  CompositeScreenProps<
    MaterialTopTabScreenProps<ResultsTopTabParamList, T>,
    SearchStackScreenProps<"Results">
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
