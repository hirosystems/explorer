import { Box, useColorModeValue } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { useCallback, useMemo } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { GoSortDesc } from 'react-icons/go';

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
import { useColorMode } from '../../ui/hooks/useColorMode';
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

export function SortMenu() {
  const { setActiveSort, setActiveOrder, activeSort, activeOrder } = useFilterAndSortState();
  console.log({ activeSort, activeOrder });

  const bg = useColorModeValue('white', 'black');
  const color = useColorModeValue('slate.700', 'slate.400');
  const blackColor = useColorModeValue('slate.900', 'slate.900');
  const borderColor = useColorModeValue('slate.300', 'slate.900');
  const { colorMode } = useColorMode();
  console.log({ colorMode });

  const filterLabel = useCallback(
    () => getSortOptionLabel(activeSort, activeOrder),
    [activeSort, activeOrder]
  );

  const menuItems = useMemo(
    () =>
      Object.keys(GetMempoolTransactionListOrderByEnum).flatMap(sort =>
        Object.keys(GetMempoolTransactionListOrderEnum)
          .reverse()
          .map(order => ({
            onClick: () => {
              console.log('calling setActiveSort and setActiveOrder', { sort, order });
              setActiveSort(sort as GetMempoolTransactionListOrderByEnum);
              setActiveOrder(order as GetMempoolTransactionListOrderEnum);
            },
            label: getSortOptionLabel(
              sort as GetMempoolTransactionListOrderByEnum,
              order as GetMempoolTransactionListOrderEnum
            ),
          }))
      ),
    [setActiveSort, setActiveOrder]
  );

  // return <FilterMenu filterLabel={filterLabel} menuItems={menuItems} leftIcon={GoSortDesc} />;

  return (
    <StyledContainer>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<Icon as={BsChevronDown} size={3} color={blackColor} />}
          leftIcon={<Icon as={GoSortDesc} size={4} />}
          fontSize={'sm'}
          bg={bg}
          color={color}
          fontWeight={'semibold'}
          border={'1px'}
          borderColor={borderColor}
        >
          <Box display="inline" fontWeight="normal">
            Sort by:{' '}
          </Box>
          <Box display="inline" fontWeight="normal" color={color}>
            {getSortOptionLabel(activeSort, activeOrder)}
          </Box>
        </MenuButton>
        <MenuList fontSize={'sm'} color={color} padding="8px">
          {Object.keys(GetMempoolTransactionListOrderByEnum).map(sort =>
            Object.keys(GetMempoolTransactionListOrderEnum)
              .reverse()
              .map(order => (
                <MenuItem
                  color={colorMode === 'light' ? blackColor : color}
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
    </StyledContainer>
  );
}
