import { TouchableOpacity } from "react-native";
import { Heading, Sheet } from "tamagui";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { Brand, BrandsDocument, SortOrder } from "../generated/gql/graphql";
import { useQuery } from "@apollo/client";
import Loading from "./Loading";

interface BrandSheetProps {
  open: boolean;
  onOpenChange: () => void;
  onSelect: (brand: Brand) => void;
}

export default function BrandSheet({
  onOpenChange,
  onSelect,
  open,
}: BrandSheetProps) {
  const { data, loading } = useQuery(BrandsDocument, {
    variables: { orderBy: { name: SortOrder["Asc"] } },
  });

  const renderItem = ({ item }: ListRenderItemInfo<Brand>) => (
    <TouchableOpacity style={{ height: 50 }} onPress={() => onSelect(item)}>
      <Heading color={"black"}>{item.name}</Heading>
    </TouchableOpacity>
  );

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[85]}
      dismissOnSnapToBottom
      forceRemoveScrollEnabled={open}
    >
      <Sheet.Overlay />
      <Sheet.Handle backgroundColor={"white"} />
      <Sheet.Frame backgroundColor={"white"}>
        {loading ? (
          <Loading />
        ) : (
          <FlashList<Brand>
            contentContainerStyle={{ padding: 15 }}
            data={data?.brands as Brand[]}
            estimatedItemSize={50}
            renderItem={renderItem}
            keyExtractor={(_, idx) => idx.toString()}
          />
        )}
      </Sheet.Frame>
    </Sheet>
  );
}
