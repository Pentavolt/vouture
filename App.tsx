import { useFonts } from "expo-font";
import { TamaguiProvider } from "tamagui";
import config from "./tamagui.config";
import { NavigationProvider } from "./lib/navigation";
import { AuthProvider } from "./lib/hooks";
import { Suspense } from "react";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import { ApolloProvider } from "@apollo/client";
import { client } from "./lib/apollo";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  const [loaded] = useFonts({
    Satoshi: require("./lib/fonts/satoshi/Satoshi-Regular.otf"),
    "Satoshi Bold": require("./lib/fonts/satoshi/Satoshi-Bold.otf"),
    "Satoshi Medium": require("./lib/fonts/satoshi/Satoshi-Medium.otf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ApolloProvider client={client}>
        <TamaguiProvider config={config}>
          <AuthProvider>
            <Suspense>
              <ToastProvider>
                <NavigationProvider colorScheme={"light"} />
                <ToastViewport />
              </ToastProvider>
            </Suspense>
          </AuthProvider>
        </TamaguiProvider>
      </ApolloProvider>
    </GestureHandlerRootView>
  );
}
