import { useColorModeValue } from '@chakra-ui/react';
import { sort } from 'next/dist/build/webpack/loaders/css-loader/src/utils';
import * as React from 'react';
import { BsChevronDown } from 'react-icons/bs';

import {
  GetMempoolTransactionListOrderByEnum,
  GetMempoolTransactionListOrderEnum,
} from '@stacks/blockchain-api-client';

import { Button } from '../../ui/Button';
import { Icon } from '../../ui/Icon';
import { Menu } from '../../ui/Menu';
import { MenuButton } from '../../ui/MenuButton';
import { MenuItem } from '../../ui/MenuItem';
import { MenuList } from '../../ui/MenuList';
import { useFilterAndSortState } from './useFilterAndSortState';

function getSortOptionLabel(
  sort: GetMempoolTransactionListOrderByEnum,
  order: GetMempoolTransactionListOrderEnum
) {
  switch (sort) {
    case GetMempoolTransactionListOrderByEnum.age:
      return order === GetMempoolTransactionListOrderEnum.asc ? 'Oldest first' : 'Newest first';
    case GetMempoolTransactionListOrderByEnum.size:
      return order === GetMempoolTransactionListOrderEnum.asc
        ? 'Smallest size first'
        : 'Biggest size first';
    case GetMempoolTransactionListOrderByEnum.fee:
      return order === GetMempoolTransactionListOrderEnum.asc
        ? 'Lowest fee first'
        : 'Highest fee first';
  }
}

export function SortMenu() {
  const { setActiveSort, setActiveOrder, activeSort, activeOrder } = useFilterAndSortState();
  const bg = useColorModeValue('white', 'black');
  const color = useColorModeValue('slate.700', 'slate.400');
  const borderColor = useColorModeValue('slate.300', 'slate.900');

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<Icon as={BsChevronDown} size={3} />}
        fontSize={'sm'}
        bg={bg}
        color={color}
        fontWeight={'semibold'}
        border={'1px'}
        borderColor={borderColor}
      >
        {getSortOptionLabel(activeSort, activeOrder)}
      </MenuButton>
      <MenuList fontSize={'sm'} color={color}>
        {Object.keys(GetMempoolTransactionListOrderByEnum).map(sort =>
          Object.keys(GetMempoolTransactionListOrderEnum)
            .reverse()
            .map(order => (
              <MenuItem
                onClick={() => {
                  setActiveSort(sort as GetMempoolTransactionListOrderByEnum);
                  setActiveOrder(order as GetMempoolTransactionListOrderEnum);
                }}
              >
                {getSortOptionLabel(
                  sort as GetMempoolTransactionListOrderByEnum,
                  order as GetMempoolTransactionListOrderEnum
                )}
              </MenuItem>
            ))
        )}
      </MenuList>
    </Menu>
  );
}
