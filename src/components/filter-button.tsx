import { IconFilter } from '@tabler/icons';
import React, { memo } from 'react';

import { Box, color } from '@stacks/ui';

import { useFilterState } from '@common/hooks/use-filter-state';

import { CaptionAction } from '@components/caption-action';
import { FilterPanel } from '@components/filter-panel';

export const FilterButton = memo(() => {
  const { toggleFilterVisibility } = useFilterState();
  return (
    <Box position="relative" zIndex={98}>
      <CaptionAction
        position="relative"
        zIndex={999}
        onClick={toggleFilterVisibility}
        label="Filters"
        icon={IconFilter}
        data-test="filter-button"
      />
      <Box pointerEvents="none" top={0} right="-32px" position="absolute" size="500px">
        <FilterPanel bg={color('bg')} showBorder pointerEvents="all" />
      </Box>
    </Box>
  );
});
