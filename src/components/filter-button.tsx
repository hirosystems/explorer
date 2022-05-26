import { Box, color } from '@stacks/ui';
import React, { memo } from 'react';
import { CaptionAction } from '@components/caption-action';
import { IconFilter } from '@tabler/icons';
import { FilterPanel } from '@components/filter-panel';
import { useFilterState } from '@common/hooks/use-filter-state';
import { TxFilterTypes } from '@features/transactions-filter/transactions-filter-slice';

export const FilterButton = memo(() => {
  const { toggleFilterVisibility } = useFilterState(TxFilterTypes.TransactionsPageTxFilter);
  return (
    <Box position="relative" zIndex={99999999}>
      <CaptionAction
        position="relative"
        zIndex={999}
        onClick={toggleFilterVisibility}
        label="Filters"
        icon={IconFilter}
        data-test="filter-button"
      />
      <Box pointerEvents="none" top={0} right="-32px" position="absolute" size="500px">
        <FilterPanel
          bg={color('bg')}
          filterKey={TxFilterTypes.TransactionsPageTxFilter}
          showBorder
          pointerEvents="all"
        />
      </Box>
    </Box>
  );
});
