import { useWindowDimensions } from "react-native";
import { ReactNode, useRef } from "react";
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from "react-native-gesture-handler";

interface PostGestureViewProps {
  children: ReactNode;
  onSingleTap: () => void;
  onDoubleTap: () => void;
}

export default function PostGestureView({
  children,
  onSingleTap,
  onDoubleTap,
}: PostGestureViewProps) {
  const ref = useRef(null); // Required for waiting on double tap gestures.
  const { height } = useWindowDimensions();
  return (
    <GestureHandlerRootView style={{ height: height - 60 }}>
      <TapGestureHandler
        onActivated={onSingleTap}
        numberOfTaps={1}
        waitFor={ref}
      >
        <TapGestureHandler ref={ref} onActivated={onDoubleTap} numberOfTaps={2}>
          {children}
        </TapGestureHandler>
      </TapGestureHandler>
    </GestureHandlerRootView>
  );
}
