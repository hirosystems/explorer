// @ts-nocheck
import React from 'react';
import { RecentlyViewedListItem } from '@components/recently-viewed';
import { Box, Flex, color, Fade } from '@stacks/ui';
import { border } from '@common/utils';
import { useSearchResults, useRecentItems, useSearch } from '@common/hooks/use-search';
import { Caption, Text } from '@components/typography';
import { AlertTriangleIcon } from '@components/icons/alert-triangle';
import { IconButton } from '@components/icon-button';
import CloseIcon from 'mdi-react/CloseIcon';
import { Pending } from '@components/status';

const Loading: React.FC = React.memo(() => {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 250);
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  return show ? (
    <Flex alignItems="center">
      <Pending size="14px" />
      <Caption ml="tight">Searching...</Caption>
    </Flex>
  ) : null;
});

const Results = React.memo(() => {
  const { result } = useSearchResults();
  const { clearError, hideImmediately } = useSearch();
  const { items, handleUpsertItem } = useRecentItems();

  const recentItems =
    Object.values(items)?.sort(
      (a, b) => -(a as any).viewedDate.localeCompare((b as any).viewedDate)
    ) || [];

  const isSearching = result.state === 'loading';
  const searchResults = result.state === 'hasValue' && result.contents?.type === 'search';
  const results = searchResults && 'data' in result.contents ? result?.contents?.data : recentItems;
  const hasError = 'error' in result.contents;

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
      </Flex>
      <Box id="search-results" maxHeight="324px" overflow="auto">
        {results.map(option => (
          <RecentlyViewedListItem onClick={() => handleItemClick(option)} option={option} />
        ))}
      </Box>
    </>
  );
});

const SearchResultsCard = React.memo(() => {
  const { resultsShowing } = useSearch();
  if (typeof document !== 'undefined') {
    return (
      <Fade in={resultsShowing}>
        {styles => (
          <Box
            top="100%"
            position="absolute"
            width="100%"
            pr="base"
            pt="base"
            zIndex={99}
            willChange="transparency"
            style={styles}
          >
            <Flex
              boxShadow="high"
              overflow="hidden"
              width="100%"
              flexDirection="column"
              bg="white"
              border={border()}
              borderRadius="12px"
            >
              <React.Suspense fallback={<Loading />}>
                <Results />
              </React.Suspense>
            </Flex>
          </Box>
        )}
      </Fade>
    );
  }
  return null;
});

export default SearchResultsCard;
