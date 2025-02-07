import { Text } from '@/ui/Text';
import { Flex } from '@chakra-ui/react';

export const FilterTriggerText = ({
  prefix,
  value,
  open,
}: {
  prefix: string;
  value: string;
  open: boolean;
}) => {
  return (
    <Flex gap={1} aria-live="polite" aria-atomic="true">
      <Text
        textStyle="text-medium-sm"
        color={open ? 'textPrimary' : 'textSecondary'}
        _groupHover={{ color: 'textPrimary' }}
      >
        {prefix}
      </Text>
      {value && (
        <Text textStyle="text-medium-sm" color="textPrimary">
          {value}
        </Text>
      )}
    </Flex>
  );
};
