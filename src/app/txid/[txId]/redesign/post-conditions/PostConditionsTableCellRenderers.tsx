import { getIsSBTC } from '@/app/tokens/utils';
import { Badge } from '@/ui/Badge';
import { Text } from '@/ui/Text';

export interface AmountAssetCellRendererProps {
  amount: string;
  asset: string;
  assetType: 'stx' | 'fungible' | 'non_fungible';
}

export function AmountAssetCellRenderer({
  amount,
  asset,
  assetType,
}: AmountAssetCellRendererProps) {
  const isSBTC = getIsSBTC(asset);
  if (assetType === 'non_fungible') {
    return (
      <Badge variant="subtle" content="label">
        {asset}
      </Badge>
    );
  }
  return (
    <Text textStyle="text-regular-sm">
      {amount} {asset}
    </Text>
  );
}
