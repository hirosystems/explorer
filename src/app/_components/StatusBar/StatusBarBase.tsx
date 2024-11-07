import { Box, BoxProps, Flex, Icon } from '@chakra-ui/react';
import { Info, Warning } from '@phosphor-icons/react';
import { ReactNode, forwardRef } from 'react';
import { IncidentImpact } from 'statuspage.io';

import { PAGE_MAX_WIDTH } from '../../../common/constants/constants';
import { getColor } from './utils';

export const StatusBarBase = forwardRef<
  HTMLDivElement,
  { impact: IncidentImpact; content: ReactNode } & Omit<BoxProps, 'content'>
>(({ content, impact, ...boxProps }, ref) => {
  const icon =
    !impact || impact === IncidentImpact.None ? (
      <Icon color={getColor(impact)}>
        <Info />
      </Icon>
    ) : (
      <Icon color={getColor(impact)}>
        <Warning />
      </Icon>
    );
  return (
    <Box ref={ref} borderTop={'1px solid'} borderColor={'statusPage.border'} py={3} {...boxProps}>
      <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
        <Flex
          maxWidth={PAGE_MAX_WIDTH}
          padding={'0 32px'}
          alignItems={'center'}
          justifyContent={'center'}
          gap={1.5}
          color={'statusPage.text'}
          fontWeight={'medium'}
        >
          {icon}
          {content}
        </Flex>
      </Box>
    </Box>
  );
});
