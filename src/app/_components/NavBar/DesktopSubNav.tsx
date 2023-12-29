import { LightMode } from '@chakra-ui/react';
import React from 'react';

import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { Link } from '../../../ui/Link';
import { NavItem } from './types';

export const DesktopSubNav = ({ label, href, onClick }: NavItem) => {
  return (
    <LightMode>
      <Flex
        alignItems={'center'}
        borderBottom="1px"
        _last={{
          borderBottom: 'none',
        }}
      >
        {href ? (
          <Link href={href} display="block" rounded="md" color="black" width="full" px={5}>
            {label}
          </Link>
        ) : (
          <Box
            as={'button'}
            onClick={onClick}
            role="group"
            display="block"
            rounded="md"
            color="black"
            width="full"
            px={5}
            textAlign={'left'}
          >
            {label}
          </Box>
        )}
      </Flex>
    </LightMode>
  );
};
