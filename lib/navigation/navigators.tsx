import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { Platform } from "react-native";
import {
  CameraStackParamList,
  HomeStackParamList,
  IntroStackParamList,
  RootTabParamList,
  PreferencesStackParamList,
  UserStackParamList,
  UserStackScreenProps,
  RootTabScreenProps,
  FeedTopTabParamList,
  InboxStackParamList,
  SearchStackParamList,
  ResultsTopTabParamList,
  SearchStackScreenProps,
  ResultsTopTabScreenProps,
} from "./types";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import LoginScreen from "../../screens/intro/LoginScreen";
import FrontScreen from "../../screens/intro/FrontScreen";
import RegisterScreen from "../../screens/intro/RegisterScreen";
import FollowingScreen from "../../screens/feed/FollowingScreen";
import CameraScreen from "../../screens/media/CameraScreen";
import PreviewScreen from "../../screens/media/PreviewScreen";
import ProfileScreen from "../../screens/auth/ProfileScreen";
import PostScreen from "../../screens/auth/PostScreen";
import LabelScreen from "../../screens/media/LabelScreen";
import SettingsScreen from "../../screens/settings/SettingsScreen";
import EmptyScreen from "../../screens/EmptyScreen";
import ProfileSettingsScreen from "../../screens/settings/ProfileSettingsScreen";
import UsernameScreen from "../../screens/settings/UsernameScreen";
import BiographyScreen from "../../screens/settings/BiographyScreen";
import LocationScreen from "../../screens/settings/LocationScreen";
import DiscoverScreen from "../../screens/feed/DiscoverScreen";
import PrivacyScreen from "../../screens/settings/PrivacyScreen";
import BlockedUsersScreen from "../../screens/settings/BlockedUsersScreen";
import NotificationsScreen from "../../screens/inbox/NotificationsScreen";
import RequestsScreen from "../../screens/inbox/RequestsScreen";
import ExploreScreen from "../../screens/search/ExploreScreen";
import UserResultsScreen from "../../screens/search/UserResultsScreen";
import QueryScreen from "../../screens/search/QueryScreen";
import BrandResultsScreen from "../../screens/search/BrandResultsScreen";
import { Button, XStack, YStack } from "tamagui";
import PostResultsScreen from "../../screens/search/PostResultsScreen";
import BrandScreen from "../../screens/search/BrandScreen";
import VerificationScreen from "../../screens/settings/VerificationScreen";

const BottomTab = createBottomTabNavigator<RootTabParamList>();

export function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "black",
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === "ios" ? 80 : 54,
          borderTopWidth: 0,
          padding: 0,
          zIndex: 50,
        },
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={({ route }) => ({
          tabBarStyle: {
            display:
              getFocusedRouteNameFromRoute(route) === "Details"
                ? "none"
                : "flex",
          },
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        })}
      />
      <BottomTab.Screen
        name="Search"
        component={SearchStackNavigator}
        options={({ route }) => ({
          tabBarStyle: {
            display:
              getFocusedRouteNameFromRoute(route) === "Details"
                ? "none"
                : "flex",
          },
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "search" : "search-outline"}
              color={color}
            />
          ),
        })}
      />
      <BottomTab.Screen
        name="Media"
        component={EmptyScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "add-circle" : "add-circle-outline"}
              color={color}
            />
          ),
        }}
        listeners={({ navigation }: RootTabScreenProps<"Media">) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("Create", { screen: "Camera" });
          },
        })}
      />
      <BottomTab.Screen
        name="Inbox"
        component={InboxStackNavigator}
        options={({ route }) => ({
          tabBarStyle: {
            display:
              getFocusedRouteNameFromRoute(route) === "Details"
                ? "none"
                : "flex",
          },
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "file-tray" : "file-tray-outline"}
              color={color}
            />
          ),
        })}
      />
      <BottomTab.Screen
        name="User"
        component={UserStackNavigator}
        options={({ route }) => ({
          tabBarStyle: {
            display:
              getFocusedRouteNameFromRoute(route) === "Details"
                ? "none"
                : "flex",
          },
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person-circle" : "person-circle-outline"}
              color={color}
            />
          ),
        })}
      />
    </BottomTab.Navigator>
  );
}

const IntroStack = createStackNavigator<IntroStackParamList>();

export function IntroStackNavigator() {
  return (
    <IntroStack.Navigator
      screenOptions={{ headerTitleStyle: { fontFamily: "Satoshi Bold" } }}
    >
      <IntroStack.Screen
        name="Front"
        component={FrontScreen}
        options={{ headerShown: false }}
      />
      <IntroStack.Screen name="Login" component={LoginScreen} />
      <IntroStack.Screen name="Register" component={RegisterScreen} />
    </IntroStack.Navigator>
  );
}

const CameraStack = createStackNavigator<CameraStackParamList>();

export function CameraStackNavigator() {
  return (
    <CameraStack.Navigator
      screenOptions={{ headerTitleStyle: { fontFamily: "Satoshi Bold" } }}
    >
      <CameraStack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
      <CameraStack.Screen name="Preview" component={PreviewScreen} />
      <CameraStack.Screen
        name="Labeling"
        component={LabelScreen}
        options={{ headerShown: false, presentation: "modal" }}
      />
    </CameraStack.Navigator>
  );
}

const HomeStack = createStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{ headerTitleStyle: { fontFamily: "Satoshi Bold" } }}
    >
      <HomeStack.Screen
        name="Feed"
        component={FeedTopTabNavigator}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Details"
        component={PostScreen}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTintColor: "white",
        }}
      />
      <HomeStack.Screen name="Profile" component={ProfileScreen} />
    </HomeStack.Navigator>
  );
}

const UserStack = createStackNavigator<UserStackParamList>();

export function UserStackNavigator() {
  return (
    <UserStack.Navigator
      screenOptions={{ headerTitleStyle: { fontFamily: "Satoshi Bold" } }}
    >
      <UserStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }: UserStackScreenProps<"Profile">) => ({
          headerRight: () => (
            <Ionicons
              size={26}
              style={{ marginHorizontal: 12 }}
              name="menu-outline"
              color={"black"}
              onPress={() =>
                navigation.navigate("Preferences", { screen: "Settings" })
              }
            />
          ),
        })}
      />
      <UserStack.Screen
        name="Details"
        component={PostScreen}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTintColor: "white",
        }}
      />
    </UserStack.Navigator>
  );
}

const PreferencesStack = createStackNavigator<PreferencesStackParamList>();

export function PreferencesStackNavigator() {
  return (
    <PreferencesStack.Navigator
      screenOptions={{ headerTitleStyle: { fontFamily: "Satoshi Bold" } }}
    >
      <PreferencesStack.Screen name="Settings" component={SettingsScreen} />
      <PreferencesStack.Screen
        name="ProfileSettings"
        component={ProfileSettingsScreen}
        options={{ headerTitle: "Edit Profile" }}
      />
      <PreferencesStack.Group screenOptions={{ presentation: "modal" }}>
        <PreferencesStack.Screen
          name="Username"
          component={UsernameScreen}
          options={{ headerTitle: "Edit Username" }}
        />
        <PreferencesStack.Screen
          name="Biography"
          component={BiographyScreen}
          options={{ headerTitle: "Edit Biography" }}
        />
        <PreferencesStack.Screen
          name="Location"
          component={LocationScreen}
          options={{ headerTitle: "Edit Location" }}
        />
        <PreferencesStack.Screen
          name="Verification"
          component={VerificationScreen}
        />
      </PreferencesStack.Group>
      <PreferencesStack.Group>
        <PreferencesStack.Screen name="Privacy" component={PrivacyScreen} />
        <PreferencesStack.Screen
          name="Blocklist"
          component={BlockedUsersScreen}
        />
      </PreferencesStack.Group>
    </PreferencesStack.Navigator>
  );
}

const FeedTopTab = createMaterialTopTabNavigator<FeedTopTabParamList>();

export function FeedTopTabNavigator() {
  return (
    <FeedTopTab.Navigator
      screenOptions={{
        tabBarGap: 20,
        tabBarIndicatorStyle: {
          backgroundColor: "black",
          marginHorizontal: 13, // Needs to match the paddingHorizontal of tabBarStyle.
        },
        tabBarPressColor: "transparent",
        tabBarItemStyle: {
          width: "auto",
          paddingHorizontal: 0,
        },
        tabBarLabelStyle: {
          textTransform: "capitalize",
          fontFamily: "Satoshi Bold",
          marginHorizontal: 0,
          fontSize: 16,
        },
        tabBarStyle: {
          elevation: 0,
          paddingHorizontal: 13,
        },
      }}
    >
      <FeedTopTab.Screen component={DiscoverScreen} name="Discover" />
      <FeedTopTab.Screen component={FollowingScreen} name="Following" />
    </FeedTopTab.Navigator>
  );
}

const InboxStack = createStackNavigator<InboxStackParamList>();

export function InboxStackNavigator() {
  return (
    <InboxStack.Navigator
      screenOptions={{ headerTitleStyle: { fontFamily: "Satoshi Bold" } }}
    >
      <InboxStack.Screen name="Notifications" component={NotificationsScreen} />
      <InboxStack.Screen name="Requests" component={RequestsScreen} />
      <InboxStack.Screen
        name="Details"
        component={PostScreen}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTintColor: "white",
        }}
      />
    </InboxStack.Navigator>
  );
}

const SearchStack = createStackNavigator<SearchStackParamList>();

export function SearchStackNavigator() {
  return (
    <SearchStack.Navigator
      screenOptions={{ headerTitleStyle: { fontFamily: "Satoshi Bold" } }}
    >
      <SearchStack.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ headerShown: false }}
      />
      <SearchStack.Screen
        name="Query"
        component={QueryScreen}
        options={{ headerShown: false, animationEnabled: false }}
      />
      <SearchStack.Screen name="Profile" component={ProfileScreen} />
      <SearchStack.Screen
        name="Details"
        component={PostScreen}
        options={{ headerShown: false }}
      />
      <SearchStack.Screen
        name="Brand"
        component={BrandScreen}
        options={({ route }) => ({ headerTitle: route.params.brandName })}
      />
      <SearchStack.Screen
        name="Results"
        component={ResultsTopTabNavigator}
        options={({ route, navigation }) => ({
          header: () => (
            <YStack space padding="$3" backgroundColor={"white"}>
              <XStack space="$2" alignItems="center">
                <Ionicons
                  name="chevron-back"
                  color={"black"}
                  size={20}
                  onPress={() => navigation.goBack()}
                />
                <Button
                  flex={1}
                  paddingHorizontal={"$3"}
                  onPress={() => navigation.goBack()}
                  backgroundColor={"$gray3Light"}
                  pressStyle={{ backgroundColor: "$gray3Light" }}
                  justifyContent="flex-start"
                  icon={<Ionicons name="search" color={"black"} size={20} />}
                  color={"black"}
                >
                  {route.params?.params?.query}
                </Button>
              </XStack>
            </YStack>
          ),
        })}
      />
    </SearchStack.Navigator>
  );
}

const ResultsTopTab = createMaterialTopTabNavigator<ResultsTopTabParamList>();

export function ResultsTopTabNavigator({
  route,
}: SearchStackScreenProps<"Results">) {
  return (
    <ResultsTopTab.Navigator
      screenOptions={{
        tabBarGap: 20,
        tabBarIndicatorStyle: {
          backgroundColor: "black",
          marginHorizontal: 13, // Needs to match the paddingHorizontal of tabBarStyle.
        },
        tabBarPressColor: "transparent",
        tabBarItemStyle: {
          width: "auto",
          paddingHorizontal: 0,
        },
        tabBarLabelStyle: {
          textTransform: "capitalize",
          fontFamily: "Satoshi Bold",
          marginHorizontal: 0,
          fontSize: 16,
        },
        tabBarStyle: {
          elevation: 0,
          paddingHorizontal: 13,
        },
      }}
    >
      <ResultsTopTab.Screen name="Users">
        {(props: ResultsTopTabScreenProps<"Users">) => (
          <UserResultsScreen
            {...props}
            route={{
              ...props.route,
              params: { query: route.params.params?.query ?? "" },
            }}
          />
        )}
      </ResultsTopTab.Screen>
      <ResultsTopTab.Screen name="Posts">
        {(props: ResultsTopTabScreenProps<"Posts">) => (
          <PostResultsScreen
            {...props}
            route={{
              ...props.route,
              params: { query: route.params.params?.query ?? "" },
            }}
          />
        )}
      </ResultsTopTab.Screen>
      <ResultsTopTab.Screen name="Brands">
        {(props: ResultsTopTabScreenProps<"Brands">) => (
          <BrandResultsScreen
            {...props}
            route={{
              ...props.route,
              params: { query: route.params.params?.query ?? "" },
            }}
          />
        )}
      </ResultsTopTab.Screen>
    </ResultsTopTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  onPress?: () => void;
}) {
  return <Ionicons size={26} style={{ marginBottom: -3 }} {...props} />;
}
