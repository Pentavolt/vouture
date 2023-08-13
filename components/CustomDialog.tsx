import { View, Text } from "react-native";
import React from "react";
import { AlertDialog, Button, XStack, YStack } from "tamagui";

export default function CustomDialog() {
  return (
    <AlertDialog>
      <AlertDialog.Trigger asChild></AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          bordered
          backgroundColor={"white"}
          borderColor={"white"}
          elevate
          key="content"
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
        >
          <YStack space>
            <AlertDialog.Title color={"black"}>
              Account Deletion Request
            </AlertDialog.Title>
            <AlertDialog.Description color={"$gray7Dark"}>
              By pressing proceed, you will schedule your account for deletion.
              Account deletion may take up to 30 days.
            </AlertDialog.Description>
            <XStack space="$3">
              <AlertDialog.Cancel asChild>
                <Button backgroundColor={"#FE9F10"}>Cancel</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button>Accept</Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
