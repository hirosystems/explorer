import { IconChevronDown } from '@tabler/icons';
import React, { memo, useCallback, useState } from 'react';

import { Box, BoxProps, Fade, color } from '@stacks/ui';

import { useControlledHover } from '@common/hooks/use-controlled-hover';
import { border } from '@common/utils';

import { HeaderTextItem } from '@components/header-text-item';
import { NetworkItems } from '@components/network-items';

const Dropdown: React.FC<BoxProps & { show?: boolean; onItemClick?: () => void }> = memo(
  ({ show, onItemClick }) => {
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
              <NetworkItems onItemClick={onItemClick} />
            </Box>
          </Box>
        )}
      </Fade>
    );
  }
);

export const NetworkSwitcherItem: React.FC<BoxProps> = memo(props => {
  const [isHovered, setIsHovered] = useState(false);
  const bind = useControlledHover(setIsHovered);

  const handleRemoveHover = useCallback(() => setIsHovered(false), [setIsHovered]);

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
        <Dropdown onItemClick={handleRemoveHover} show={isHovered} />
      </HeaderTextItem>
    </>
  );
});
