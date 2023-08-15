import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, View, XStack, YStack } from "tamagui";
import { useToastController } from "@tamagui/toast";
import { CameraStackScreenProps } from "../../lib/navigation/types";
import Loading from "../../components/Loading";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import { useIsFocused } from "@react-navigation/native";

export default function CameraScreen({
  navigation,
}: CameraStackScreenProps<"Camera">) {
  const camera = useRef<Camera>(null);
  const toast = useToastController();
  const devices = useCameraDevices();
  const isFocused = useIsFocused();
  const [flashMode, setFlashMode] = useState<"on" | "off">("off");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [cameraPosition, setCameraPosition] = useState<"front" | "back">(
    "back"
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("transitionEnd", () => {
      setMounted(true);
    });

    (async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      if (cameraPermission === "not-determined") {
        await Camera.requestCameraPermission();
      }
    })();

    return () => {
      unsubscribe();
      toast.hide();
    };
  }, []);

  const takePicture = useCallback(async () => {
    try {
      setIsSubmitting(true);
      if (!camera.current) throw new Error("Camera ref does not exist!");
      const image = await camera.current.takePhoto({ flash: flashMode });
      navigation.navigate("Labeling", { photo: `file://${image.path}` });
    } catch (error) {
      console.error("Failed to take photo!", error);
    }

    setIsSubmitting(false);
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      navigation.navigate("Labeling", { photo: result.assets[0].uri });
    }
  };

  if (!devices[cameraPosition] || !mounted) return <Loading />;
  return (
    <View flex={1} backgroundColor="white">
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={devices[cameraPosition]!}
        isActive={isFocused}
        photo={true}
        enableZoomGesture
      />

      <XStack
        justifyContent="space-between"
        position={"absolute"}
        top={15}
        right={15}
        left={15}
      >
        <Button
          onPress={() => navigation.goBack()}
          bg={"rgba(140, 140, 140, 0.3)"}
          icon={<Ionicons size={20} name="close" />}
          borderRadius="$true"
          pressStyle={{
            bg: "darkgray",
          }}
        />
        <YStack space="$3">
          <Button
            onPress={() =>
              setCameraPosition((curr) => (curr === "back" ? "front" : "back"))
            }
            bg={"rgba(140, 140, 140, 0.3)"}
            icon={<Ionicons size={20} name="camera-reverse-outline" />}
            borderRadius="$true"
            pressStyle={{
              bg: "darkgray",
            }}
          />
          <Button
            bg={"rgba(140, 140, 140, 0.3)"}
            onPress={() =>
              setFlashMode((curr) => (curr === "off" ? "on" : "off"))
            }
            icon={
              <Ionicons
                size={20}
                name={
                  flashMode === "on" ? "flash-off-outline" : "flash-outline"
                }
              />
            }
            borderRadius="$true"
            pressStyle={{
              bg: "darkgray",
            }}
          />
          <Button
            bg={"rgba(140, 140, 140, 0.3)"}
            onPress={pickImage}
            icon={<Ionicons size={20} name={"image-outline"} />}
            borderRadius="$true"
            pressStyle={{
              bg: "darkgray",
            }}
          />
        </YStack>
      </XStack>
      <Pressable
        disabled={isSubmitting}
        onPress={takePicture}
        style={{
          position: "absolute",
          bottom: 40,
          alignSelf: "center",
          borderRadius: 100,
          borderColor: "white",
          borderWidth: 5,
          height: 78,
          width: 78,
        }}
      />
    </View>
  );
}
