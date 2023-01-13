import { HeaderTextItem } from '@/components/header-text-item';
import { NetworkItems } from '@/components/network-items';
import { Box, BoxProps, Icon } from '@/ui/components';
import { useColorMode } from '@chakra-ui/react';
import React, { memo, useCallback, useState } from 'react';
import { TbChevronDown } from 'react-icons/tb';

const Dropdown: React.FC<BoxProps & { show?: boolean; onItemClick?: () => void }> = memo(
  ({ onItemClick }) => {
    return (
      <Box top="100%" pt="16px" right={0} position="absolute">
        <Box
          borderWidth="1px"
          overflow="hidden"
          boxShadow="mid"
          minWidth="342px"
          bg={`bg.${useColorMode().colorMode}`}
          borderRadius="8px"
          pt="8px"
        >
          <NetworkItems onItemClick={onItemClick} />
        </Box>
      </Box>
    );
  }
);

export const NetworkSwitcherItem: React.FC<BoxProps> = memo(props => {
  const [isHovered, setIsHovered] = useState(false);
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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        Network
        <Icon as={TbChevronDown} size="14px" ml="8px" />
        {isHovered && <Dropdown onItemClick={handleRemoveHover} />}
      </HeaderTextItem>
    </>
  );
});
