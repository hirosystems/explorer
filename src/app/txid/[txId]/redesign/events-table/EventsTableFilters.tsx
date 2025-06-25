import { Text } from '@/ui/Text';
import { Flex } from '@chakra-ui/react';

export const EventsTableFilters = () => {
  return (
    <Flex flexWrap={'wrap'} gap={4}>
      <Flex display={{ base: 'none', md: 'flex' }} gap={3} alignItems={'center'} h="full">
        <Text textStyle="text-regular-sm" color="textSecondary">
          Filter:
        </Text>
        <Flex gap={3} h={7}></Flex>
      </Flex>
    </Flex>
  );
};
