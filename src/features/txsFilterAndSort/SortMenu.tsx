import { FilterMenu } from '@/common/components/FilterMenu';
import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { useCallback, useMemo } from 'react';
import { GoSortDesc } from 'react-icons/go';

import {
  GetMempoolTransactionListOrderByEnum,
  GetMempoolTransactionListOrderEnum,
} from '@stacks/blockchain-api-client';

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

  return <FilterMenu filterLabel={filterLabel} menuItems={menuItems} leftIcon={GoSortDesc} />;
}
