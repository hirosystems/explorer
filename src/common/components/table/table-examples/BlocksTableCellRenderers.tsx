import { Text } from '@/ui/Text';
import StxIcon from '@/ui/icons/StxIcon';
import { Flex, Icon } from '@chakra-ui/react';

import { BlockLink } from '../../ExplorerLinks';

export const StacksBlockIntervalCellRenderer = ({
  start,
  end,
  startHash,
  endHash,
}: {
  start: string;
  end: string;
  startHash: string;
  endHash: string;
}) => {
  return (
    <Flex gap={1.5} py={1} px={1.5} borderRadius='sm' bg='surfacePrimary'>
      <Flex alignItems="center" gap={1.5}>
      <Flex alignItems="center" justifyContent="center" h={4} w={4} bg="iconTertiary">
          <Icon h={3} w={3}>
            <StxIcon />
          </Icon>
        </Flex>
        <BlockLink hash={start}>
          <Text fontSize="sm" fontWeight="medium" color="textPrimary" fontFamily="mono">
            #{start}
          </Text>
        </BlockLink>
      </Flex>
      <Flex alignItems="center" gap={1.5}>
        <Flex alignItems="center" justifyContent="center" h={4} w={4} bg="iconTertiary">
          <Icon h={3} w={3}>
            <StxIcon />
          </Icon>
        </Flex>
        <BlockLink hash={end}>
          <Text fontSize="sm" fontWeight="medium" color="textPrimary" fontFamily="mono">
            #{end}
          </Text>
        </BlockLink>
      </Flex>
    </Flex>
  );
};
