import { ReactNode } from 'react';

import { Circle } from '../../../common/components/Circle';
import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';

// TODO: move to common
export function LineAndNode({
  rowHeight = 14,
  width = 6,
  icon,
}: {
  rowHeight: number;
  width: number;
  icon?: ReactNode;
}) {
  return (
    <Flex height={rowHeight} width={width} alignItems="center" position="relative">
      {icon ? (
        <Flex
          justifyContent="center"
          alignItems="center"
          height="calc(100% + 1px)"
          top={0}
          width="full"
          position="absolute"
          zIndex={0}
          bg="surface"
        >
          <Circle size={4.5} bg="brand" border="none">
            {icon}
          </Circle>
          <Box
            position="absolute" // the little bit of line needed to connect the icon to the other lines with nodes
            bottom={0}
            height="20%"
            width="1px"
            bg="borderPrimary"
            border="1px solid var(---stacks-colors-borderPrimary)"
          />
        </Flex>
      ) : (
        <Flex
          justifyContent="center"
          height="calc(100% + 1px)"
          width="full"
          position="absolute"
          zIndex={0}
          top={0}
          bottom={0}
          bg="surface"
        >
          <Box
            height="full" // the line
            width="1px"
            bg="borderPrimary"
            border="1px solid var(---stacks-colors-borderPrimary)"
          />
          <Box
            position="absolute" // the node
            width={2}
            height={2}
            borderRadius="50%"
            bg="borderPrimary"
            transform="translateY(-50%)"
            top="50%"
          />
        </Flex>
      )}
    </Flex>
  );
}
