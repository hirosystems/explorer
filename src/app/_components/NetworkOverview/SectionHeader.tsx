import { Text } from '@/ui/Text';
import { HStack } from '@chakra-ui/react';

export function SectionHeader() {
  return (
    <HStack align="center" justify={'space-between'}>
      <HStack gap={4}>
        <Text whiteSpace={'nowrap'} textStyle="heading-md" color="textPrimary">
          Network Overview
        </Text>
      </HStack>
    </HStack>
  );
}
