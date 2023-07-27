import { useFonts } from "expo-font";
import { TamaguiProvider } from "tamagui";
import config from "./tamagui.config";
import { NavigationProvider } from "./lib/navigation";
import { AuthProvider } from "./lib/hooks";
import { Suspense } from "react";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import { ApolloProvider } from "@apollo/client";
import { client } from "./lib/apollo";

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
    <TamaguiProvider config={config}>
      <ApolloProvider client={client}>
        <AuthProvider>
          <Suspense>
            <ToastProvider>
              <NavigationProvider colorScheme={"light"} />
              <ToastViewport />
            </ToastProvider>
          </Suspense>
        </AuthProvider>
      </ApolloProvider>
    </TamaguiProvider>
  );
}
