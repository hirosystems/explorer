import { useColorModeValue } from '@chakra-ui/react';
import { Info, Warning } from '@phosphor-icons/react';
import { ReactNode, forwardRef } from 'react';
import { IncidentImpact } from 'statuspage.io';

import { PAGE_MAX_WIDTH } from '../../../common/constants/constants';
import { Box, BoxProps } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { useColorMode } from '../../../ui/hooks/useColorMode';
import { getColor } from './utils';

export const StatusBarBase = forwardRef<
  HTMLDivElement,
  { impact: IncidentImpact; content: ReactNode } & Omit<BoxProps, 'content'>
>(({ content, impact, ...boxProps }, ref) => {
  const colorMode = useColorMode().colorMode;
  const textColor = useColorModeValue('slate.50', 'slate.900');
  const borderColor = useColorModeValue('slate.850', 'slate.250');
  const icon =
    !impact || impact === IncidentImpact.None ? (
      <Icon as={Info} color={getColor(impact, colorMode)} />
    ) : (
      <Icon as={Warning} color={getColor(impact, colorMode)} />
    );
  return (
    <Box ref={ref} borderTop={`1px`} borderColor={borderColor} py={3} {...boxProps}>
      <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
        <Flex
          maxWidth={PAGE_MAX_WIDTH}
          padding={'0 32px'}
          alignItems={'center'}
          justifyContent={'center'}
          gap={1.5}
          color={textColor}
          fontWeight={'medium'}
        >
          {icon}
          {content}
        </Flex>
      </Box>
    </Box>
  );
});
