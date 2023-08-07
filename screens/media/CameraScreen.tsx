import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Platform, Pressable, useWindowDimensions } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { Camera, CameraType, FlashMode } from "expo-camera";
import { useAuth, useIsForeground } from "../../lib/hooks";
import { Button, Image, Text, View, XStack, YStack } from "tamagui";
import { Toast, useToastController, useToastState } from "@tamagui/toast";
import { CameraStackScreenProps } from "../../lib/navigation/types";
import Loading from "../../components/Loading";

export default function CameraScreen({
  navigation,
}: CameraStackScreenProps<"Camera">) {
  const camera = useRef<Camera>(null);
  const [photo, setPhoto] = useState<string>();
  const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode.off);
  const [type, setType] = useState<CameraType>(CameraType.back);
  const [ratio, setRatio] = useState<string>("4:3");
  const [calculated, setCalculated] = useState<boolean>(false);
  const [remainder, setRemainder] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);
  const [cameraPermission, requestCamera] = Camera.useCameraPermissions();
  const [libraryPermission, requestLibrary] = MediaLibrary.usePermissions();
  const { height, width } = useWindowDimensions();

  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const toast = useToastController();
  const currentToast = useToastState();
  const { user } = useAuth();

  useEffect(() => {
    setPhoto(undefined);
    const unsubscribe = navigation.addListener("transitionEnd", (e) => {
      setMounted(true);
    });
    (async () => {
      if (!cameraPermission) await requestCamera();
    })();

    return unsubscribe;
  }, []);

  const onSnap = useCallback(async () => {
    if (!camera.current || !calculated) return;
    const { uri } = await camera.current.takePictureAsync();
    setPhoto(uri);
    camera.current.pausePreview();
  }, []);

  const saveMedia = async () => {
    if (!libraryPermission) await requestLibrary();
    if (!libraryPermission?.granted) {
      return toast?.show("Unable to save", {
        native: false,
        message:
          "To save images, please grant access to the media library in system settings.",
      });
    }

    if (!photo) return;
    await MediaLibrary.saveToLibraryAsync(photo);
    return toast?.show("Photo saved", {
      message: "Your image has successfully been saved.",
    });
  };

  const cancelPreview = async () => {
    setPhoto(undefined);
    camera.current?.resumePreview();
  };

  const onCameraReady = async () => {
    if (Platform.OS === "ios") return;
    if (!camera.current) return;
    if (calculated) return;
    const ratios = await camera.current.getSupportedRatiosAsync();
    // Calculate the width/height of each of the supported camera ratios
    // These width/height are measured in landscape mode
    // Find the ratio that is closest to the screen ratio without going over
    const screenRatio = height / width;
    const distances = [];
    let calculations: { [key: string]: number } = {};
    let desiredRatio: string | null = null;
    for (const ratio of ratios) {
      const parts = ratio.split(":");
      const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
      calculations[ratio] = realRatio;
      const distance = screenRatio - realRatio;
      if (distance >= 0) distances.push(distance);
      if (desiredRatio === null) desiredRatio = ratio;
      if (distance === Math.min(...distances) && distance >= 0) {
        desiredRatio = ratio;
      }
    }

    setRatio(desiredRatio as string);
    setCalculated(true);
    setRemainder(
      Math.floor((height - calculations[desiredRatio as string] * width) / 2)
    );

    // navigation.setOptions({
    //   headerShown: true,
    //   headerStyle: {
    //     height: Math.floor(
    //       (height - calculations[desiredRatio as string] * width) / 4
    //     ),
    //   },
    // });

    setLoading(false);
  };

  const pickImage = async () => {
    // TODO: Add pausePreview
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      camera.current?.pausePreview();
    }
  };

  if (!cameraPermission?.granted) {
    return (
      <View
        flex={1}
        backgroundColor={"black"}
        justifyContent="center"
        alignItems="center"
      >
        <Text color={"rgba(140, 140, 140, 0.3)"}>
          You need to grant permissions.
        </Text>
      </View>
    );
  }

  // TODO: Customize toast design and center toast.
  return (
    <View flex={1} backgroundColor="white">
      {currentToast && (
        <Toast
          key={currentToast.id}
          duration={currentToast.duration}
          enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
          exitStyle={{ opacity: 0, scale: 1, y: -20 }}
          y={0}
          opacity={1}
          scale={1}
          animation={"bouncy"}
          viewportName={currentToast.viewportName}
        >
          <YStack>
            <Toast.Title>{currentToast.title}</Toast.Title>
            {!!currentToast.message && (
              <Toast.Description>{currentToast.message}</Toast.Description>
            )}
          </YStack>
        </Toast>
      )}
      {loading && <Loading />}
      {photo && (
        <>
          <Image flex={1} source={{ uri: photo }} />
          <XStack
            space={"$4"}
            position={"absolute"}
            justifyContent="space-between"
            top={15}
            right={15}
            left={15}
          >
            <Button
              onPress={cancelPreview}
              bg={"rgba(140, 140, 140, 0.3)"}
              icon={<Ionicons name="close" />}
              borderRadius="$true"
              pressStyle={{
                bg: "darkgray",
              }}
            />
            <YStack space={"$4"}>
              <Button
                onPress={() => navigation.navigate("Labeling", { photo })}
                disabled={loading}
                bg={"rgba(140, 140, 140, 0.3)"}
                icon={<Ionicons name="arrow-forward" />}
                borderRadius="$true"
                pressStyle={{
                  bg: "darkgray",
                }}
              />
              <Button
                onPress={saveMedia}
                bg={"rgba(140, 140, 140, 0.3)"}
                icon={<Ionicons name="save" />}
                pressStyle={{
                  bg: "darkgray",
                }}
              />
            </YStack>
          </XStack>
        </>
      )}
      {mounted && !photo && (
        <View>
          <Camera
            ref={camera}
            flashMode={flashMode}
            type={type}
            style={{
              height: height - remainder,
              display: loading ? "none" : "flex",
            }}
            onCameraReady={onCameraReady}
            ratio={ratio}
          >
            <YStack space={"$5"} position={"absolute"} top={15} right={15}>
              <Button
                onPress={() =>
                  setType((curr) =>
                    curr === CameraType.back
                      ? CameraType.front
                      : CameraType.back
                  )
                }
                bg={"rgba(140, 140, 140, 0.3)"}
                icon={<Ionicons name="camera-reverse" />}
                borderRadius="$true"
                pressStyle={{
                  bg: "darkgray",
                }}
              />
              <Button
                bg={"rgba(140, 140, 140, 0.3)"}
                onPress={() =>
                  setFlashMode((curr) =>
                    curr === FlashMode.off ? FlashMode.on : FlashMode.off
                  )
                }
                icon={
                  <Ionicons
                    name={flashMode === FlashMode.on ? "flash-off" : "flash"}
                  />
                }
                borderRadius="$true"
                pressStyle={{
                  bg: "darkgray",
                }}
              />
              <Button
                onPress={pickImage}
                bg={"rgba(140, 140, 140, 0.3)"}
                icon={<Ionicons name="images" />}
                borderRadius="$true"
                pressStyle={{
                  bg: "darkgray",
                }}
              />
            </YStack>
            <Pressable
              disabled={isSubmitting}
              onPress={onSnap}
              style={{
                alignSelf: "center",
                position: "absolute",
                bottom: 20,
                borderRadius: 100,
                borderColor: "white",
                borderWidth: 5,
                height: 78,
                width: 78,
              }}
            />
          </Camera>
        </View>
      )}
    </View>
  );
}
