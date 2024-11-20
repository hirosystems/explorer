'use client';

// TODO: v3 upgrade. this might be broken
import { Checkbox, CheckboxRootProps, useCheckboxGroup } from '@chakra-ui/react';
import { ArrowBendDownRight, FunnelSimple } from '@phosphor-icons/react';
import { ReactNode, memo, useCallback, useState } from 'react';

import { Button } from '../../ui/Button';
import { useGlobalContext } from '../../common/context/useGlobalContext';
import { useColorModeValue } from '../../components/ui/color-mode';
import { HStack } from '../../ui/HStack';
import { Icon } from '../../ui/Icon';
import { Menu } from '../../ui/Menu';
import { MenuButton } from '../../ui/MenuButton';
import { MenuItem } from '../../ui/MenuItem';
import { MenuList } from '../../ui/MenuList';
import { Text } from '../../ui/Text';
import ClarityIcon from '../../ui/icons/ClarityIcon';
import CubeSparkleIcon from '../../ui/icons/CubeSparkleIcon';
import DiagonalArrowsIcon from '../../ui/icons/DiagonalArrowsIcon';
import FunctionXIcon from '../../ui/icons/FunctionX';
import { useFilterAndSortState } from './useFilterAndSortState';

function FilterItem({
  label,
  icon,
  value,
  selectedFilters,
  checkboxProps,
}: {
  label: string;
  icon: ReactNode;
  value: string;
  selectedFilters: (string | number)[];
  checkboxProps: CheckboxRootProps;
}) {
  return (
    <MenuItem
      bg={'surface'}
      _hover={{ bg: 'none' }}
      _active={{ bg: 'none' }}
      _focus={{ bg: 'none' }}
      value={value}
    >
      <HStack
        gap={2}
        as="label"
        width={'full'}
        px={4}
        py={3}
        _hover={{ bg: useColorModeValue('slate.100', 'slate.800') }}
        rounded={'lg'}
      >
        {icon}
        <Text fontSize={'sm'}>{label}</Text>
        <Checkbox.Root
          // TODO: v3 upgrade. this might be broken
          ml={'auto'}
          checked={selectedFilters.includes(value)}
          {...checkboxProps}
          variant="outline"
        />
      </HStack>
    </MenuItem>
  );
}

export const FilterButton = memo(() => {
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

  const borderColor = useColorModeValue('slate.300', 'slate.900');

  const { setActiveFilters } = useFilterAndSortState();

  const { value: selectedFilters, getItemProps } = useCheckboxGroup({
    // TODO: v3 upgrade. this might be broken
    defaultValue: [],
    onValueChange: (value: string[]) => {
      setActiveFilters(value);
    },
  });

  const activeNetworkUrl = useGlobalContext().activeNetworkKey;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const onMenuSelect = useCallback(() => {
    setIsMenuOpen(false);
  }, [setIsMenuOpen]);

  return (
    <Menu positioning={{ placement: 'bottom-end' }} closeOnSelect={false} onSelect={onMenuSelect}>
      <MenuButton
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        leftIcon={
          <Icon size={4} color={isHoveredOrFocused || isMenuOpen ? 'text' : 'textSubdued'}>
            <FunnelSimple />
          </Icon>
        }
        bg="surface"
        color="textSubdued"
        border={'1px'}
        borderColor={borderColor}
        fontWeight={'semibold'}
        fontSize={'sm'}
        _hover={{ color: 'text', backgroundColor: 'borderPrimary' }}
        _active={{ color: 'text', backgroundColor: 'borderPrimary' }}
        _focus={{ color: 'text', backgroundColor: 'borderPrimary' }}
        flexShrink={0}
      >
        Filters {selectedFilters.length > 0 && `(${selectedFilters.length})`}
      </MenuButton>
      <MenuList bg={'surface'}>
        <FilterItem
          label={'Coinbase'}
          icon={
            <Icon color={'text'}>
              <CubeSparkleIcon />
            </Icon>
          }
          value={'coinbase'}
          selectedFilters={selectedFilters}
          checkboxProps={getItemProps({ value: 'coinbase' })}
        />
        {/*<FilterItem*/}
        {/*  label={'Burn'}*/}
        {/*  icon={<Icon as={Fire} color={'text'} />}*/}
        {/*  value={'burn'}*/}
        {/*  selectedFilters={selectedFilters}*/}
        {/*  checkboxProps={getItemProps({ value: 'burn' })}*/}
        {/*/>*/}
        <FilterItem
          label={'Contract deploy'}
          icon={
            <Icon color={'text'}>
              <ClarityIcon />
            </Icon>
          }
          value={'smart_contract'}
          selectedFilters={selectedFilters}
          checkboxProps={getItemProps({ value: 'smart_contract' })}
        />
        <FilterItem
          label={'Function call'}
          icon={
            <Icon color={'text'}>
              <FunctionXIcon />
            </Icon>
          }
          value={'contract_call'}
          selectedFilters={selectedFilters}
          checkboxProps={getItemProps({ value: 'contract_call' })}
        />
        {/*<FilterItem*/}
        {/*  label={'Mint'}*/}
        {/*  icon={<Icon as={CoinSparkleIcon} color={'text'} />}*/}
        {/*  value={'mint'}*/}
        {/*  selectedFilters={selectedFilters}*/}
        {/*  checkboxProps={getItemProps({ value: 'mint' })}*/}
        {/*/>*/}
        {activeNetworkUrl.indexOf('naka') !== -1 ? (
          <FilterItem
            label={'Tenure change'}
            icon={
              <Icon color={'text'}>
                <ArrowBendDownRight />
              </Icon>
            }
            value={'tenure_change'}
            selectedFilters={selectedFilters}
            checkboxProps={getItemProps({ value: 'tenure_change' })}
          />
        ) : null}
        {/*<FilterItem*/}
        {/*  label={'Tenure extension'}*/}
        {/*  icon={<Icon as={ArrowBendDoubleUpLeft} color={'text'} transform={'rotate(180deg)'} />}*/}
        {/*  value={'tenureExtension'}*/}
        {/*  selectedFilters={selectedFilters}*/}
        {/*  checkboxProps={getItemProps({ value: 'tenureExtension' })}*/}
        {/*/>*/}
        <FilterItem
          label={'Token transfer'}
          icon={
            <Icon color={'text'}>
              <DiagonalArrowsIcon />
            </Icon>
          }
          value={'token_transfer'}
          selectedFilters={selectedFilters}
          checkboxProps={getItemProps({ value: 'token_transfer' })}
        />
      </MenuList>
    </Menu>
  );
});
