import { LinkingOptions } from "@react-navigation/native";
import { RootStackParamList } from "./types";

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [
    /* your linking prefixes */
  ],
  config: {
    screens: {
      Root: { screens: { Media: { screens: {} } } },
      Intro: { screens: { Login: {}, Register: {} } },
    },
    /* configuration for matching screens with paths */
  },
};
