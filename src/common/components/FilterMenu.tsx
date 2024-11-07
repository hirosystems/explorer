import { Box, Flex, Icon } from '@chakra-ui/react';
import { CaretDown } from '@phosphor-icons/react';
import { ReactNode, isValidElement, useCallback, useState } from 'react';

import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '../../components/ui/menu';

interface MenuItem {
  onClick: () => void;
  label: string;
}

interface FilterMenuProps {
  filterLabel: string | (() => string);
  menuItems: MenuItem[] | ReactNode[];
  leftIcon?: ReactNode;
}

function isMenuItemArray(items: any[]): items is { label: string; onClick: () => void }[] {
  return items.every(item => typeof item.label === 'string' && typeof item.onClick === 'function');
}

function isReactNodeArray(items: any[]): items is React.ReactNode[] {
  return items.every(isValidElement);
}

export function FilterMenu({ filterLabel, menuItems, leftIcon }: FilterMenuProps) {
  const filterLabelValue = typeof filterLabel === 'function' ? filterLabel?.() : filterLabel;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuOnSelect = useCallback(() => {
    setIsMenuOpen(false);
  }, []);
  return (
    <MenuRoot onSelect={menuOnSelect}>
      <MenuTrigger
        fontSize={'sm'}
        bg="surface"
        fontWeight={'semibold'}
        border="normal"
        borderColor={'filterMenu.borderColor'}
        _hover={{ color: 'text', backgroundColor: 'borderPrimary' }}
        _active={{ color: 'text', backgroundColor: 'borderPrimary' }}
        _focus={{ color: 'text', backgroundColor: 'borderPrimary' }}
        flexShrink={0}
      >
        <Flex gap={1} alignItems="center">
          {leftIcon ? (
            <Icon h={4} w={4} color={isMenuOpen ? 'text' : 'textSubdued'}>
              {leftIcon}
            </Icon>
          ) : null}
          <Box display="inline" fontWeight="normal" color={isMenuOpen ? 'text' : 'textSubdued'}>
            Show:{' '}
          </Box>
          <Box display="inline" fontWeight="normal" color={'text'}>
            {filterLabelValue}
          </Box>
          <Icon h={3} w={3} color="text">
            <CaretDown />
          </Icon>
        </Flex>
      </MenuTrigger>
      <MenuContent fontSize={'sm'} padding="8px">
        {isMenuItemArray(menuItems)
          ? menuItems.map(({ label, onClick }) => (
              <MenuItem color={'text'} onClick={onClick} key={label} value={label}>
                {label}
              </MenuItem>
            ))
          : isReactNodeArray(menuItems)
            ? menuItems
            : null}
      </MenuContent>
    </MenuRoot>
  );
}
