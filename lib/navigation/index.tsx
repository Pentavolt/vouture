import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { ColorSchemeName } from "react-native";
import { useAuth } from "../hooks";
import { linking } from "./linking";
import {
  BottomTabNavigator,
  CameraStackNavigator,
  IntroStackNavigator,
  PreferencesStackNavigator,
} from "./navigators";
import type { RootStackParamList } from "./types";
import ReportScreen from "../../screens/ReportScreen";

export function NavigationProvider({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={linking}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  // NOTE: https://github.com/react-navigation/react-navigation/issues/10802
  const { user } = useAuth();
  return (
    <Stack.Navigator>
      {!user ? (
        <>
          <Stack.Screen
            name="Intro"
            component={IntroStackNavigator}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Root"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Create"
            component={CameraStackNavigator}
            options={{
              headerShown: false,
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
            }}
          />
          <Stack.Screen
            name="Preferences"
            component={PreferencesStackNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Report" component={ReportScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
