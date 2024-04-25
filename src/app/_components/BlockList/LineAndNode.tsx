import { ReactNode } from 'react';

import { Circle } from '../../../common/components/Circle';
import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';

export function LineAndNode({
  rowHeight = 14,
  width = 6,
  icon,
  isLast,
}: {
  rowHeight: number;
  width: number;
  icon?: ReactNode;
  isLast?: boolean;
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
          <Box // the little bit of line needed to connect the icon to the other lines with nodes
            position="absolute"
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
          <Box // the line
            position={'relative'}
            top={0}
            height={isLast ? '50%' : 'full'} // if it's the last line, only draw half of it
            width="1px"
            bg="borderPrimary"
            border="1px solid var(---stacks-colors-borderPrimary)"
          />
          <Box // the node
            position="absolute"
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
