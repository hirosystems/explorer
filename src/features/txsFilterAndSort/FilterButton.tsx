'use client';

import { useCheckboxGroup, useColorModeValue } from '@chakra-ui/react';
import { ArrowBendDownRight, FunnelSimple } from '@phosphor-icons/react';
import { ReactNode, memo, useCallback, useState } from 'react';

import { Button } from '../../ui/Button';
import { Checkbox, CheckboxProps } from '../../ui/Checkbox';
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
  checkboxProps: CheckboxProps;
}) {
  return (
    <MenuItem
      bg={'surface'}
      _hover={{ bg: 'none' }}
      _active={{ bg: 'none' }}
      _focus={{ bg: 'none' }}
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
        <Checkbox
          ml={'auto'}
          isChecked={selectedFilters.includes(value)}
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

  const { value: selectedFilters, getCheckboxProps } = useCheckboxGroup({
    defaultValue: [],
    onChange: (value: string[]) => {
      setActiveFilters(value);
    },
  });

  return (
    <Menu placement={'bottom-end'} closeOnSelect={false}>
      {({ isOpen }) => (
        <>
          <MenuButton
            as={Button}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            leftIcon={
              <Icon
                size={4}
                as={FunnelSimple}
                color={isHoveredOrFocused || isOpen ? 'text' : 'textSubdued'}
              />
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
              icon={<Icon as={CubeSparkleIcon} color={'text'} />}
              value={'coinbase'}
              selectedFilters={selectedFilters}
              checkboxProps={getCheckboxProps({ value: 'coinbase' })}
            />
            {/*<FilterItem*/}
            {/*  label={'Burn'}*/}
            {/*  icon={<Icon as={Fire} color={'text'} />}*/}
            {/*  value={'burn'}*/}
            {/*  selectedFilters={selectedFilters}*/}
            {/*  checkboxProps={getCheckboxProps({ value: 'burn' })}*/}
            {/*/>*/}
            <FilterItem
              label={'Contract deploy'}
              icon={<Icon as={ClarityIcon} color={'text'} />}
              value={'smart_contract'}
              selectedFilters={selectedFilters}
              checkboxProps={getCheckboxProps({ value: 'smart_contract' })}
            />
            <FilterItem
              label={'Function call'}
              icon={<Icon as={FunctionXIcon} color={'text'} />}
              value={'contract_call'}
              selectedFilters={selectedFilters}
              checkboxProps={getCheckboxProps({ value: 'contract_call' })}
            />
            {/*<FilterItem*/}
            {/*  label={'Mint'}*/}
            {/*  icon={<Icon as={CoinSparkleIcon} color={'text'} />}*/}
            {/*  value={'mint'}*/}
            {/*  selectedFilters={selectedFilters}*/}
            {/*  checkboxProps={getCheckboxProps({ value: 'mint' })}*/}
            {/*/>*/}
            <FilterItem
              label={'Tenure change'}
              icon={<Icon as={ArrowBendDownRight} color={'text'} />}
              value={'tenure_change'}
              selectedFilters={selectedFilters}
              checkboxProps={getCheckboxProps({ value: 'tenure_change' })}
            />
            {/*<FilterItem*/}
            {/*  label={'Tenure extension'}*/}
            {/*  icon={<Icon as={ArrowBendDoubleUpLeft} color={'text'} transform={'rotate(180deg)'} />}*/}
            {/*  value={'tenureExtension'}*/}
            {/*  selectedFilters={selectedFilters}*/}
            {/*  checkboxProps={getCheckboxProps({ value: 'tenureExtension' })}*/}
            {/*/>*/}
            <FilterItem
              label={'Token transfer'}
              icon={<Icon as={DiagonalArrowsIcon} color={'text'} />}
              value={'token_transfer'}
              selectedFilters={selectedFilters}
              checkboxProps={getCheckboxProps({ value: 'token_transfer' })}
            />
          </MenuList>
        </>
      )}
    </Menu>
  );
});
