import { Box, useColorModeValue } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { IconType } from 'react-icons';
import { BsChevronDown } from 'react-icons/bs';

import { Button } from '../../ui/Button';
import { Icon } from '../../ui/Icon';
import { Menu } from '../../ui/Menu';
import { MenuButton } from '../../ui/MenuButton';
import { MenuItem } from '../../ui/MenuItem';
import { MenuList } from '../../ui/MenuList';

interface MenuItem {
  onClick: () => void;
  label: string;
}

interface FilterMenuProps {
  filterLabel: string | (() => string);
  menuItems: MenuItem[];
  leftIcon?: IconType;
}

export function FilterMenu({ filterLabel, menuItems, leftIcon }: FilterMenuProps) {
  const bg = useColorModeValue('white', 'black');
  const hoverBg = useColorModeValue('slate.150', 'slate.900');
  const borderColor = useColorModeValue('slate.300', 'slate.900');
  const filterTitleColor = useColorModeValue('slate.700', 'slate.600');
  const textColor = useColorModeValue('slate.900', 'slate.50');

  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, [setIsHovered]);
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, [setIsHovered]);
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, [setIsFocused]);
  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, [setIsFocused]);
  const isHoveredOrFocused = isHovered || isFocused;

  const filterLabelValue = typeof filterLabel === 'function' ? filterLabel?.() : filterLabel;

  return (
      <Menu>
        {({ isOpen }) => (
          <>
            <MenuButton
              as={Button}
              rightIcon={<Icon as={BsChevronDown} size={3} color={textColor} />}
              leftIcon={leftIcon ? <Icon as={leftIcon} size={4} color={filterTitleColor} /> : null}
              fontSize={'sm'}
              bg={bg}
              fontWeight={'semibold'}
              border={'1px'}
              borderColor={borderColor}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              _hover={{ color: textColor, backgroundColor: hoverBg }}
              _active={{ color: textColor, backgroundColor: hoverBg }}
              _focus={{ color: textColor, backgroundColor: hoverBg }}
            >
              <Box
                display="inline"
                fontWeight="normal"
                color={isHoveredOrFocused || isOpen ? textColor : filterTitleColor}
              >
                Show:{' '}
              </Box>
              <Box display="inline" fontWeight="normal" color={textColor}>
                {filterLabelValue}
              </Box>
            </MenuButton>
            <MenuList fontSize={'sm'} padding="8px">
              {menuItems.map(({ label, onClick }) => (
                <MenuItem color={textColor} onClick={onClick}>
                  {label}
                </MenuItem>
              ))}
            </MenuList>
          </>
        )}
      </Menu>
  );
}
