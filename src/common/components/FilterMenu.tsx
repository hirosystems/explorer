import { Box, useColorModeValue } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { useCallback, useState } from 'react';
import { IconType } from 'react-icons';
import { BsChevronDown } from 'react-icons/bs';
import { PiCurrencyDollar } from 'react-icons/pi';

import { Button } from '../../ui/Button';
import { Icon } from '../../ui/Icon';
import { Menu } from '../../ui/Menu';
import { MenuButton } from '../../ui/MenuButton';
import { MenuItem } from '../../ui/MenuItem';
import { MenuList } from '../../ui/MenuList';

const StyledContainer = styled(Box)`
  .menu-button {
    :hover {
      background: none;
    }
  }

  .menu-list {
    font-size: 16px;
  }

  .menu-item {
    background-color: 'orange !important';

    &:active {
      background-color: 'orange !important';
    }
    :active {
      background-color: 'orange !important';
    }
  }

  .additional-info {
    margin-left: 12px;
    margin-top: 4px;
  }
`;

interface MenuItem {
  onClick: () => void;
  label: string;
}

interface FilterMenuProps {
  filterLabel: string | (() => string);
  menuItems: MenuItem[];
  leftIcon: IconType;
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
    <StyledContainer>
      <Menu>
        {({ isOpen }) => (
          <>
            <MenuButton
              as={Button}
              rightIcon={<Icon as={BsChevronDown} size={3} color={textColor} />}
              leftIcon={<Icon as={leftIcon} size={4} color={filterTitleColor} />}
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
    </StyledContainer>
  );
}
