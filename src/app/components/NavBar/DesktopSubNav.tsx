import { Box } from '@/ui/Box';
import { Stack } from '@/ui/Stack';
import { Flex } from '@/ui/Flex';
import React from 'react';
import { NavItem } from './types';

export const DesktopSubNav = ({
  label,
  href,
  onClick,
  hasDivider,
}: NavItem & { hasDivider: boolean }) => {
  const as = onClick ? 'button' : href ? 'a' : 'div';
  return (
    <Flex alignItems={'center'} borderBottomWidth={hasDivider ? '1px' : '0px'}>
      <Box
        as={as}
        {...(as === 'button' ? { onClick } : { href })}
        role={'group'}
        display={'block'}
        rounded={'md'}
        color={`midnight`}
        width={'100%'}
        padding={'0 20px'}
      >
        <Stack direction={'row'} align={'center'}>
          <Box width={'100%'}>{label}</Box>
        </Stack>
      </Box>
    </Flex>
  );
};
