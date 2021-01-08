import React from 'react';
import { HeaderTextItem } from '@components/header-text-item';
import { Box, BoxProps, Fade, color } from '@stacks/ui';
import { IconChevronDown } from '@tabler/icons';
import { useHover } from 'web-api-hooks';
import { useNetwork } from '@common/hooks/use-network';

import { NetworkItems } from '@components/network-items';

const Dropdown: React.FC<BoxProps & { show?: boolean }> = React.memo(({ show, ...props }) => {
  const { list } = useNetwork();
  const showing = list && list?.length && show;

  return list && list?.length ? (
    <Fade in={!!showing}>
      {styles => (
        <Box top="100%" pt="base" right={0} position="absolute" style={styles}>
          <Box
            overflow="hidden"
            boxShadow="mid"
            minWidth="342px"
            bg={color('bg')}
            borderRadius="8px"
            pt="tight"
          >
            <NetworkItems />
          </Box>
        </Box>
      )}
    </Fade>
  ) : null;
});

export const NetworkSwitcherItem: React.FC<BoxProps> = props => {
  const [isHovered, bind] = useHover();

  return (
    <>
      <HeaderTextItem
        textDecoration="none !important"
        display="flex"
        alignItems="center"
        position="relative"
        _hover={{
          cursor: 'pointer',
        }}
        {...bind}
        {...props}
      >
        Network
        <Box as={IconChevronDown} size="14px" ml="tight" />
        <Dropdown show={isHovered} />
      </HeaderTextItem>
    </>
  );
};
