import FastImage from "react-native-fast-image";

interface RoundedImageProps {
  uri: string;
  offset: number;
}

export default function RoundedImage({ uri, offset = 0 }: RoundedImageProps) {
  return (
    <FastImage
      resizeMode="cover"
      source={{ uri }}
      style={{
        height: 180,
        width: 60,
        borderRadius: 100,
        marginTop: offset,
      }}
    />
  );
}
