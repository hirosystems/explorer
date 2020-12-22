// @ts-nocheck
import React from 'react';
import { RecentlyViewedListItem } from '@components/recently-viewed';
import { Box, color, Flex, Transition } from '@stacks/ui';
import { border } from '@common/utils';
import { useRecentItems, useSearch, useSearchResults } from '@common/hooks/use-search';
import { Caption, Text } from '@components/typography';
import { AlertTriangleIcon } from '@components/icons/alert-triangle';
import { IconButton } from '@components/icon-button';
import CloseIcon from 'mdi-react/CloseIcon';
import { Pending } from '@components/status';

const Loading: React.FC = React.memo(() => (
  <Flex p="loose" alignItems="center">
    <Pending size="14px" />
    <Caption ml="tight">Searching...</Caption>
  </Flex>
));

const Results = React.memo(() => {
  const { result } = useSearchResults();
  const { clearError, hideImmediately } = useSearch();
  const { items, handleUpsertItem, clearRecentItems } = useRecentItems();

  const recentItems =
    Object.values(items)?.sort(
      (a, b) => -(a as any).viewedDate.localeCompare((b as any).viewedDate)
    ) || [];

  const isSearching = result.state === 'loading';
  const searchResults = result.state === 'hasValue' && result.contents?.type === 'search';
  const results = searchResults && 'data' in result.contents ? result?.contents?.data : recentItems;

  const handleItemClick = (option: any) => {
    hideImmediately();
    handleUpsertItem(option);
  };

  if (result.contents && 'error' in result.contents && 'message' in result.contents.error)
    return (
      <Flex alignItems="center" px="base" py="base">
        <AlertTriangleIcon color={color('feedback-error')} />
        <Text fontSize="14px" color={color('text-body')} mx="base">
          {result.contents.error.message}
        </Text>
        <IconButton flexShrink={0} icon={CloseIcon} dark onClick={() => clearError()} />
      </Flex>
    );
  return (
    <>
      <Flex
        alignItems="center"
        px="base"
        py="tight"
        borderBottom={border()}
        justifyContent="space-between"
      >
        <Caption pr="base">{searchResults ? 'Search results' : 'Recently viewed'}</Caption>
        {isSearching && <Loading />}
        {!isSearching && !searchResults ? (
          <Caption
            _hover={{ cursor: 'pointer', color: color('text-title') }}
            onClick={clearRecentItems}
          >
            Clear recent
          </Caption>
        ) : null}
        {!isSearching && searchResults ? (
          <Caption _hover={{ cursor: 'pointer', color: color('text-title') }} onClick={clearError}>
            Clear results
          </Caption>
        ) : null}
      </Flex>
      <Box id="search-results" maxHeight="3230px" overflow="auto">
        {results.map(option => (
          <RecentlyViewedListItem onClick={() => handleItemClick(option)} option={option} />
        ))}
      </Box>
    </>
  );
});

const SearchResultsCard = React.memo(() => {
  const { resultsShowing } = useSearch();
  const { isLoading } = useSearchResults();
  if (typeof document !== 'undefined') {
    return (
      <Transition
        in={!!(isLoading || resultsShowing)}
        styles={{
          init: {
            opacity: 0,
            transform: 'translateY(5px) scale(1)',
          },
          entered: {
            opacity: 1,
            transform: 'scale(1)',
          },
          exiting: {
            opacity: 0,
            transform: 'translateY(10px) scale(0.99)',
          },
        }}
      >
        {styles => (
          <Box
            top="100%"
            position="absolute"
            width="100%"
            pr="base"
            pt="base"
            zIndex={99}
            willChange="opacity, transform"
            style={styles}
          >
            <Flex
              filter="drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.08)) drop-shadow(0px 64px 72px rgba(0, 0, 0, 0.04)) drop-shadow(0px 24px 48px rgba(0, 0, 0, 0.1))"
              overflow="hidden"
              width="100%"
              flexDirection="column"
              bg={color('bg')}
              border={border()}
              borderRadius="12px"
            >
              {isLoading ? <Loading show /> : <Results />}
            </Flex>
          </Box>
        )}
      </Transition>
    );
  }
  return null;
});

export default SearchResultsCard;
