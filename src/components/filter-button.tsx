'use client';

import { FilterPanel } from '@/components/filter-panel';
import { Box, Icon } from '@/ui/components';
import { Caption } from '@/ui/typography';
import React, { memo } from 'react';
import { FiFilter } from 'react-icons/fi';

import { useFilterState } from '../app/common/hooks/use-filter-state';

export const FilterButton = memo(() => {
  const { toggleFilterVisibility } = useFilterState();
  return (
    <Box position="relative" marginLeft={'16px'} alignSelf={'center'}>
      <Caption
        display="flex"
        alignItems="center"
        _hover={{ cursor: 'pointer', color: 'textTitle' }}
        data-test="filter-button"
        position="relative"
        zIndex={999}
        onClick={toggleFilterVisibility}
      >
        <Icon as={FiFilter} mr="4px" color="currentColor" size="13px" strokeWidth={1.5} />
        Filters
      </Caption>
      <Box pointerEvents="none" top={0} right="-32px" position="absolute" size="500px">
        <FilterPanel />
      </Box>
    </Box>
  );
});
