'use client';

import { Flex, Text } from '@chakra-ui/react';
import { ArrowBendDownRight, FunnelSimple } from '@phosphor-icons/react';
import { ReactNode, memo, useCallback, useMemo, useState } from 'react';

import { useGlobalContext } from '../../common/context/useGlobalContext';
import { Checkbox } from '../../components/ui/checkbox';
import { useColorModeValue } from '../../components/ui/color-mode';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '../../components/ui/menu';
import { Button } from '../../ui/Button';
import { HStack } from '../../ui/HStack';
import { Icon } from '../../ui/Icon';
import ClarityIcon from '../../ui/icons/ClarityIcon';
import CubeSparkleIcon from '../../ui/icons/CubeSparkleIcon';
import DiagonalArrowsIcon from '../../ui/icons/DiagonalArrowsIcon';
import FunctionXIcon from '../../ui/icons/FunctionX';
import { useFilterAndSortState } from './useFilterAndSortState';

function FilterItem({
  label,
  icon,
  value,
  isSelected,
  onSelect,
}: {
  label: string;
  icon: ReactNode;
  value: string;
  isSelected: boolean;
  onSelect: () => void;
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
        <Checkbox ml={'auto'} checked={isSelected} onCheckedChange={onSelect} />
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

  // const { value: selectedFilters, getItemProps } = useCheckboxGroup({
  //   // TODO: v3 upgrade. this might be broken
  //   defaultValue: [],
  //   onValueChange: (value: string[]) => {
  //     setActiveFilters(value);
  //   },
  // });
  const [isCoinbaseFilterSelected, setIsCoinbaseFilterSelected] = useState(false);
  const [isContractDeployFilterSelected, setIsContractDeployFilterSelected] = useState(false);
  const [isContractCallFilterSelected, setIsContractCallFilterSelected] = useState(false);
  const [isTenureChangeFilterSelected, setIsTenureChangeFilterSelected] = useState(false);
  const [isTokenTransferFilterSelected, setIsTokenTransferFilterSelected] = useState(false);
  const numSelectedFilters = useMemo(() => {
    return [
      isCoinbaseFilterSelected,
      isContractDeployFilterSelected,
      isContractCallFilterSelected,
      isTenureChangeFilterSelected,
      isTokenTransferFilterSelected,
    ].filter(Boolean).length;
  }, [
    isCoinbaseFilterSelected,
    isContractDeployFilterSelected,
    isContractCallFilterSelected,
    isTenureChangeFilterSelected,
    isTokenTransferFilterSelected,
  ]);

  const activeNetworkUrl = useGlobalContext().activeNetworkKey;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const onMenuSelect = useCallback(() => {
    setIsMenuOpen(false);
  }, [setIsMenuOpen]);

  return (
    <MenuRoot
      positioning={{ placement: 'bottom-end' }}
      closeOnSelect={false}
      onSelect={onMenuSelect}
    >
      <MenuTrigger
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        bg="surface"
        color="textSubdued"
        border="normal"
        borderColor={borderColor}
        fontWeight={'semibold'}
        fontSize={'sm'}
        _hover={{ color: 'text', backgroundColor: 'borderPrimary' }}
        _active={{ color: 'text', backgroundColor: 'borderPrimary' }}
        _focus={{ color: 'text', backgroundColor: 'borderPrimary' }}
        flexShrink={0}
      >
        <Flex gap={1}>
          <Icon size={4} color={isHoveredOrFocused || isMenuOpen ? 'text' : 'textSubdued'}>
            <FunnelSimple />
          </Icon>
          <Text>Filters {numSelectedFilters > 0 && `(${numSelectedFilters})`}</Text>
        </Flex>
      </MenuTrigger>
      <MenuContent bg={'surface'}>
        <FilterItem
          label={'Coinbase'}
          icon={
            <Icon color={'text'}>
              <CubeSparkleIcon />
            </Icon>
          }
          value={'coinbase'}
          isSelected={isCoinbaseFilterSelected}
          onSelect={() => setIsCoinbaseFilterSelected(!isCoinbaseFilterSelected)}
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
          isSelected={isContractDeployFilterSelected}
          onSelect={() => setIsContractDeployFilterSelected(!isContractDeployFilterSelected)}
        />
        <FilterItem
          label={'Function call'}
          icon={
            <Icon color={'text'}>
              <FunctionXIcon />
            </Icon>
          }
          value={'contract_call'}
          isSelected={isContractCallFilterSelected}
          onSelect={() => setIsContractCallFilterSelected(!isContractCallFilterSelected)}
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
            isSelected={isTenureChangeFilterSelected}
            onSelect={() => setIsTenureChangeFilterSelected(!isTenureChangeFilterSelected)}
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
          isSelected={isTokenTransferFilterSelected}
          onSelect={() => setIsTokenTransferFilterSelected(!isTokenTransferFilterSelected)}
        />
      </MenuContent>
    </MenuRoot>
  );
});
