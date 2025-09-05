import { RowCopyButton } from '@/app/txid/[txId]/redesign/tx-summary/SummaryItem';
import { Badge, DefaultBadgeLabel } from '@/ui/Badge';
import { Text } from '@/ui/Text';
import { Flex } from '@chakra-ui/react';

export function NameCellRenderer(value: string) {
  return (
    <Badge variant="solid" type="tag" _groupHover={{ bg: 'surfaceTertiary' }}>
      <DefaultBadgeLabel label={value} textStyle="text-mono-xs" />
    </Badge>
  );
}

export function ValueCellRenderer(value: string) {
  return (
    <Flex gap={2} alignItems="center" w="full">
      <Text
        textStyle="text-regular-sm"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        title={value}
      >
        {value}
      </Text>
      <RowCopyButton value={value} ariaLabel={`copy value`} />
    </Flex>
  );
}

export function TypeCellRenderer(value: string) {
  return (
    <Text textStyle="text-regular-sm" whiteSpace="nowrap">
      {value}
    </Text>
  );
}
