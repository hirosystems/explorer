import {
  CopyButtonRedesign,
  DEFAULT_BUTTON_STYLING,
  DEFAULT_ICON_STYLING,
} from '@/common/components/CopyButton';
import { Badge, DefaultBadgeLabel } from '@/ui/Badge';
import { Text } from '@/ui/Text';
import { Flex } from '@chakra-ui/react';

export function NameCellRenderer(value: string) {
  return (
    <Badge variant="solid">
      <DefaultBadgeLabel label={value} />
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
      <CopyButtonRedesign
        initialValue={value}
        iconProps={{
          ...DEFAULT_ICON_STYLING,
          height: 3.5,
          width: 3.5,
        }}
        buttonProps={{
          ...DEFAULT_BUTTON_STYLING,
          p: 1.5,
        }}
      />
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
