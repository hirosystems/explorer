import { useColorModeValue } from '@/components/ui/color-mode';
import { CaretDown, Icon as IconType } from '@phosphor-icons/react';
import { ReactNode, isValidElement, useCallback, useState } from 'react';

import { Box } from '../../ui/Box';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuOnSelect = useCallback(() => {
    setIsMenuOpen(false);
  }, []);
  return (
    <Menu onSelect={menuOnSelect}>
      <MenuButton
        fontSize={'sm'}
        bg="surface"
        fontWeight={'semibold'}
        border={'1px'}
        borderColor={borderColor}
        _hover={{ color: 'text', backgroundColor: 'borderPrimary' }}
        _active={{ color: 'text', backgroundColor: 'borderPrimary' }}
        _focus={{ color: 'text', backgroundColor: 'borderPrimary' }}
        flexShrink={0}
      >
        {leftIcon ? ( // TODO: v3 upgrade. this might be broken. left and right icons
          <Icon as={leftIcon} size={4} color={isMenuOpen ? 'text' : 'textSubdued'} />
        ) : null}
        <Box display="inline" fontWeight="normal" color={isMenuOpen ? 'text' : 'textSubdued'}>
          Show:{' '}
        </Box>
        <Box display="inline" fontWeight="normal" color={'text'}>
          {filterLabelValue}
        </Box>
        <Icon as={CaretDown} size={3} color="text" />
      </MenuButton>
      <MenuList fontSize={'sm'} padding="8px">
        {isMenuItemArray(menuItems)
          ? menuItems.map(({ label, onClick }) => (
              <MenuItem color={'text'} onClick={onClick} key={label} value={label}>
                {label}
              </MenuItem>
            ))
          : isReactNodeArray(menuItems)
            ? menuItems
            : null}
      </MenuList>
    </Menu>
  );
}
