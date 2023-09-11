import { ImageBackground, TouchableOpacity } from "react-native";
import { Button, H1, Paragraph, Text, View, YStack } from "tamagui";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

export default function FrontScreen() {
  const { navigate } = useNavigation();
  return (
    <ImageBackground
      resizeMode="cover"
      style={{ flex: 1 }}
      source={{
        uri: "https://ci.xiaohongshu.com/1000g0082mg3ifv4jm0005njngs208eqc88s5k3o?imageView2/2/w/format/png",
      }}
    >
      <LinearGradient
        colors={["#34343400", "#000000"]}
        style={{ flex: 1 }}
        start={[0.5, 0.4]}
        end={[0.5, 0.65]}
      >
        <View space position="absolute" width={"100%"} bottom={0} left={0}>
          <YStack space paddingHorizontal="$8" paddingVertical="$6">
            <YStack space paddingVertical="$4">
              <H1 fontSize={40} textAlign="center" fontWeight={"800"}>
                Your Fashion Journal
              </H1>
              <Paragraph fontWeight={"100"} textAlign="center">
                Start your fashion diary and get inspired by looks from all over
                the world
              </Paragraph>
            </YStack>
            <Button
              onPress={() => navigate("Intro", { screen: "Register" })}
              backgroundColor={"#BBDB8D"}
              borderRadius={100}
              color={"#15191E"}
            >
              Get Started
            </Button>
            <TouchableOpacity
              onPress={() => navigate("Intro", { screen: "Login" })}
            >
              <Text textAlign="center" fontFamily={"$body"}>
                Already have an account? <Text color={"#BBDB8D"}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          </YStack>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}
