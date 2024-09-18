import { Plus } from '@phosphor-icons/react';

import { Flex } from '../../ui/Flex';
import { Icon } from '../../ui/Icon';
import { Stack } from '../../ui/Stack';
import { Text } from '../../ui/Text';

export function FAQ() {
  return (
    <Stack gap={1}>
      <Flex
        justifyContent="space-between"
        p={3}
        bg="white"
        border="1px solid var(--stacks-colors-sand-200)"
        borderRadius="full"
      >
        <Text>What is Stacking</Text>
        <Icon as={Plus} size={4} />
      </Flex>
      <Flex
        justifyContent="space-between"
        p={3}
        bg="white"
        border="1px solid var(--stacks-colors-sand-200)"
        borderRadius="full"
      >
        <Text>How to start Stacking</Text>
        <Icon as={Plus} size={4} />
      </Flex>
      <Flex
        justifyContent="space-between"
        p={3}
        bg="white"
        border="1px solid var(--stacks-colors-sand-200)"
        borderRadius="full"
      >
        <Text>What is a pool and how to pool</Text>
        <Icon as={Plus} size={4} />
      </Flex>
    </Stack>
  );
}
