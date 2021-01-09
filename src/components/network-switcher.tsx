import React from 'react';
import { HeaderTextItem } from '@components/header-text-item';
import { Box, BoxProps, Fade, color } from '@stacks/ui';
import { IconChevronDown } from '@tabler/icons';
import { useHover } from 'web-api-hooks';
import { NetworkItems } from '@components/network-items';
import { border } from '@common/utils';

const Dropdown: React.FC<BoxProps & { show?: boolean }> = React.memo(({ show, ...props }) => {
  return (
    <Fade in={show}>
      {styles => (
        <Box top="100%" pt="base" right={0} position="absolute" style={styles}>
          <Box
            border={border()}
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
  );
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
        as="span"
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
