import { useColorModeValue } from '@chakra-ui/react';
import { ReactNode, isValidElement } from 'react';
import { IconType } from 'react-icons';
import { BsChevronDown } from 'react-icons/bs';

import { Box } from '../../ui/Box';
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
  menuItems: MenuItem[] | ReactNode[];
  leftIcon?: IconType;
}

function isMenuItemArray(items: any[]): items is { label: string; onClick: () => void }[] {
  return items.every(item => typeof item.label === 'string' && typeof item.onClick === 'function');
}

function isReactNodeArray(items: any[]): items is React.ReactNode[] {
  return items.every(isValidElement);
}

export function FilterMenu({ filterLabel, menuItems, leftIcon }: FilterMenuProps) {
  const borderColor = useColorModeValue('slate.300', 'slate.900');
  const filterLabelValue = typeof filterLabel === 'function' ? filterLabel?.() : filterLabel;

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            as={Button}
            rightIcon={<Icon as={BsChevronDown} size={3} color="text" />}
            leftIcon={
              leftIcon ? (
                <Icon as={leftIcon} size={4} color={isOpen ? 'text' : 'secondaryText'} />
              ) : null
            }
            fontSize={'sm'}
            bg="bg"
            fontWeight={'semibold'}
            border={'1px'}
            borderColor={borderColor}
            _hover={{ color: 'text', backgroundColor: 'border' }}
            _active={{ color: 'text', backgroundColor: 'border' }}
            _focus={{ color: 'text', backgroundColor: 'border' }}
          >
            <Box display="inline" fontWeight="normal" color={isOpen ? 'text' : 'secondaryText'}>
              Show:{' '}
            </Box>
            <Box display="inline" fontWeight="normal" color={'text'}>
              {filterLabelValue}
            </Box>
          </MenuButton>
          <MenuList fontSize={'sm'} padding="8px">
            {isMenuItemArray(menuItems)
              ? menuItems.map(({ label, onClick }) => (
                  <MenuItem color={'text'} onClick={onClick}>
                    {label}
                  </MenuItem>
                ))
              : isReactNodeArray(menuItems)
                ? menuItems
                : null}
          </MenuList>
        </>
      )}
    </Menu>
  );
}
