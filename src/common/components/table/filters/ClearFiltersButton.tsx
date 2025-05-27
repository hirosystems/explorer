import { Button } from '@/ui/Button';
import { Text } from '@/ui/Text';
import { Flex, Icon } from '@chakra-ui/react';
import { X } from '@phosphor-icons/react';

import {
  areAnySearchParamsFiltersActive,
  useSearchParamsFilters,
  useSearchParamsWithoutFilters,
} from './search-param-filter-utils';

function useClearSearchParamFiltersHandler() {
  const paramsWithoutFilters = useSearchParamsWithoutFilters();
  return () => {
    window.history.replaceState(null, '', `?${paramsWithoutFilters.toString()}`);
  };
}

function useClearFilters() {
  const clearSearchParamFilters = useClearSearchParamFiltersHandler();
  return () => {
    clearSearchParamFilters();
  };
}
export function ClearFiltersButton() {
  const searchParamFilters = useSearchParamsFilters();
  const clearFilters = useClearFilters();

  if (!areAnySearchParamsFiltersActive(searchParamFilters)) {
    return null;
  }

  return (
    <Button
      borderRadius="redesign.lg"
      py={1}
      px={3}
      onClick={clearFilters}
      variant="redesignTertiary"
      size="small"
      boxSizing="border-box"
      alignItems="center"
      h="full"
    >
      <Flex gap={1.5} alignItems={'center'}>
        <Text textStyle="text-medium-sm" color="textSecondary">
          Clear all filters
        </Text>
        <Icon h={3} w={3} color="iconSecondary">
          <X />
        </Icon>
      </Flex>
    </Button>
  );
}
