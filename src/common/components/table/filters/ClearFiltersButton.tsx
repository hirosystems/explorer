import { Button } from '@/ui/Button';
import { Text } from '@/ui/Text';
import { Flex, Icon } from '@chakra-ui/react';
import { X } from '@phosphor-icons/react';

export function ClearFiltersButton({
  clearAllFiltersHandler,
}: {
  clearAllFiltersHandler: () => void;
}) {
  return (
    <Button
      borderRadius="redesign.lg"
      py={1}
      px={3}
      onClick={clearAllFiltersHandler}
      variant="redesignTertiary"
      size="small"
      boxSizing="border-box"
      alignItems="center"
      h="full"
    >
      <Flex gap={1.5} alignItems={'center'}>
        <Text textStyle="text-medium-sm" color="textSecondary">
          Clear all filters
        </Text>
        <Icon h={3} w={3} color="iconSecondary">
          <X />
        </Icon>
      </Flex>
    </Button>
  );
}
