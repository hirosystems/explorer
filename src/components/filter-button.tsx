'use client';

import { FilterPanel } from '@/components/filter-panel';
import { Box, Icon } from '@/ui/components';
import React, { memo } from 'react';
import { FiFilter } from 'react-icons/fi';
import { useColorMode } from '@chakra-ui/react';

import { useFilterState } from '../app/common/hooks/use-filter-state';

export const FilterButton = memo(() => {
  const { toggleFilterVisibility } = useFilterState();
  const colorMode = useColorMode().colorMode;

  return (
    <Box position="relative" marginLeft={'auto'} marginRight={'16px'} alignSelf={'center'}>
      <Box
        as="button"
        alignItems="center"
        color={`textCaption.${colorMode}`}
        display="flex"
        fontSize="12px"
        _hover={{ cursor: 'pointer', color: 'textTitle' }}
        data-test="filter-button"
        onClick={toggleFilterVisibility}
      >
        <Icon as={FiFilter} mr="4px" color="currentColor" size="13px" strokeWidth={1.5} />
        Filters
      </Box>
      <Box pointerEvents="none" top={0} right="-32px" position="absolute" size="500px">
        <FilterPanel />
      </Box>
    </Box>
  );
});
