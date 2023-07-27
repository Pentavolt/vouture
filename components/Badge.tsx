import { StackProps, Text, View } from "tamagui";

interface BadgeProps extends StackProps {
  name: string;
}

export default function Badge({ name, ...props }: BadgeProps) {
  return (
    <View {...props} borderRadius={5} paddingHorizontal={8} paddingVertical={4}>
      <Text fontFamily={"$heading"} color={"$gray9Dark"} fontSize={10}>
        {name}
      </Text>
    </View>
  );
}
